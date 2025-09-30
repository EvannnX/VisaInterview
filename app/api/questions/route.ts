import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const questionSchema = z.object({
  textEn: z.string().min(1, '问题内容不能为空'),
  textZh: z.string().optional(),
  visaType: z.enum(['F1_STUDENT', 'H1B_WORK', 'B1B2_TOURIST', 'J1_EXCHANGE', 'L1_TRANSFER']),
  topic: z.enum([
    'PERSONAL_INFO',
    'STUDY_PLAN',
    'FINANCIAL',
    'CAREER',
    'TIES_TO_HOME',
    'PROGRAM_DETAILS',
    'IMMIGRATION_INTENT',
    'BACKGROUND',
    'OTHER',
  ]),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  country: z.string().default('USA'),
  followUps: z.array(z.string()).optional(),
  rubric: z.any().optional(),
  sampleAnswer: z.string().optional(),
  tips: z.string().optional(),
  isActive: z.boolean().default(true),
});

// 获取题目列表
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const visaType = searchParams.get('visaType');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { isActive: true };
    if (visaType) where.visaType = visaType;
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取题目失败:', error);
    return NextResponse.json({ error: '获取题目失败' }, { status: 500 });
  }
}

// 创建题目（仅管理员）
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    const body = await req.json();
    const data = questionSchema.parse(body);

    const question = await prisma.question.create({
      data: {
        text: data.textEn,
        ...data,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('创建题目失败:', error);
    return NextResponse.json({ error: '创建题目失败' }, { status: 500 });
  }
}

