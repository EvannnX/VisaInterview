import { NextRequest, NextResponse } from 'next/server';

// 简化版评分 API
// 生产环境应集成 OpenAI GPT-4 进行智能评分

export async function POST(req: NextRequest) {
  try {
    const { question, answer, rubric, sampleAnswer } = await req.json();

    // 模拟评分逻辑（实际应使用 AI）
    const contentScore = Math.random() * 30 + 60; // 60-90
    const languageScore = Math.random() * 30 + 60;
    const performanceScore = Math.random() * 30 + 60;
    const riskScore = Math.random() * 30 + 60;

    const totalScore =
      (contentScore * 0.4) +
      (languageScore * 0.3) +
      (performanceScore * 0.2) +
      (riskScore * 0.1);

    const evaluation = {
      contentScore,
      languageScore,
      performanceScore,
      riskScore,
      totalScore,
      feedback: {
        strengths: [
          '回答完整，涵盖了问题的主要方面',
          '语言表达流畅，语法基本正确',
        ],
        weaknesses: [
          '可以提供更多具体细节',
          '语速稍快，建议放慢',
        ],
        suggestions: [
          '在回答时多使用具体例子',
          '注意语速和停顿',
          '保持眼神交流和自信',
        ],
        detailedFeedback: '整体表现良好，继续保持练习。建议在回答时更加具体，多举实例支持你的观点。',
      },
    };

    // 如果配置了 OpenAI API，可以使用真实的 AI 评分
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "你是一个签证面试评分专家。根据问题、答案和评分标准，给出详细的评分和反馈。"
    //     },
    //     {
    //       role: "user",
    //       content: `问题: ${question}\n答案: ${answer}\n参考答案: ${sampleAnswer}\n评分标准: ${JSON.stringify(rubric)}`
    //     }
    //   ],
    // });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('评分失败:', error);
    return NextResponse.json(
      { error: '评分失败' },
      { status: 500 }
    );
  }
}
