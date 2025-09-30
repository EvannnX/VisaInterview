import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';

const startInterviewSchema = z.object({
  visaType: z.enum(['F1_STUDENT', 'H1B_WORK', 'B1B2_TOURIST', 'J1_EXCHANGE', 'L1_TRANSFER']),
  accentType: z.string().default('en-US-Female'),
  totalQuestions: z.number().min(1).max(50).default(10),
  mode: z.enum(['random', 'custom']).optional(),
  selectedQuestionIds: z.array(z.string()).optional(),
  customQuestions: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const body = await req.json();
    const { visaType, accentType, totalQuestions, mode, selectedQuestionIds, customQuestions } = startInterviewSchema.parse(body);

    let selectedQuestions: any[] = [];
    let finalTotalQuestions = totalQuestions;

    if (mode === 'custom') {
      // 自定义模式
      // 1. 获取选中的题库题目
      if (selectedQuestionIds && selectedQuestionIds.length > 0) {
        const dbQuestions = await prisma.question.findMany({
          where: {
            id: { in: selectedQuestionIds },
            isActive: true,
          },
        });
        selectedQuestions = [...dbQuestions];
      }

      // 2. 处理自定义输入的题目（中文转英文）
      if (customQuestions && customQuestions.length > 0) {
        for (const chineseText of customQuestions) {
          // 调用翻译函数将中文转英文
          const translatedText = await translateToEnglish(chineseText);
          
          // 创建临时题目
          const tempQuestion = await prisma.question.create({
            data: {
              text: translatedText,
              textEn: translatedText,
              textZh: chineseText,
              visaType,
              topic: 'OTHER', // Use OTHER for custom questions
              difficulty: 'MEDIUM',
              followUps: [],
              isActive: true,
              tips: 'Custom question created by user',
            },
          });
          selectedQuestions.push(tempQuestion);
        }
      }

      finalTotalQuestions = selectedQuestions.length;

      if (finalTotalQuestions === 0) {
        return NextResponse.json(
          { error: '请至少选择一道题目' },
          { status: 400 }
        );
      }
    } else {
      // 随机模式
      const allQuestions = await prisma.question.findMany({
        where: {
          visaType,
          isActive: true,
        },
      });

      if (allQuestions.length < totalQuestions) {
        return NextResponse.json(
          { error: `题库中该签证类型的题目不足 ${totalQuestions} 道` },
          { status: 400 }
        );
      }

      // 随机打乱并选择指定数量的题目
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      selectedQuestions = shuffled.slice(0, totalQuestions);
    }

    // 创建面试会话
    const interview = await prisma.interview.create({
      data: {
        userId: session.user.id,
        visaType,
        accentType,
        totalQuestions: finalTotalQuestions,
        status: 'IN_PROGRESS',
        questions: {
          create: selectedQuestions.map((q, index) => ({
            questionId: q.id,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('开始面试失败:', error);
    return NextResponse.json({ error: '开始面试失败' }, { status: 500 });
  }
}

// 翻译函数：将中文转换为英文
async function translateToEnglish(chineseText: string): Promise<string> {
  // 如果环境变量中有 OpenAI API Key，使用 GPT 翻译
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Translate the Chinese question into natural English as it would be asked in a US visa interview. Only return the translated question, nothing else.',
            },
            {
              role: 'user',
              content: chineseText,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
    } catch (error) {
      console.error('OpenAI translation failed:', error);
    }
  }

  // 如果没有配置 OpenAI 或翻译失败，返回带标记的中文
  // 在实际使用中，用户应该配置翻译API
  return `[Please translate to English] ${chineseText}`;
}