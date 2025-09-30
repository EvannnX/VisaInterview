import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { questionOrder, answer, transcription } = await req.json();

    // 验证面试是否属于当前用户
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
    });

    if (!interview || interview.userId !== session.user.id) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    if (interview.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: '面试已结束' }, { status: 400 });
    }

    // 更新问题答案
    const interviewQuestion = await prisma.interviewQuestion.updateMany({
      where: {
        interviewId: params.id,
        order: questionOrder,
      },
      data: {
        userAnswer: answer,
        transcription: transcription,
        answeredAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('提交答案失败:', error);
    return NextResponse.json({ error: '提交答案失败' }, { status: 500 });
  }
}

