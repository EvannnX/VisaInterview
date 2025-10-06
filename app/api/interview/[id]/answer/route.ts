import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { Prisma } from '@prisma/client';
import { generateBilingualTranscription } from '../../../../../lib/transcription';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const formData = await req.formData();

    const questionOrder = Number(formData.get('questionOrder'));
    const audioFile = formData.get('audio') as File | null;
    const duration = formData.get('duration') ? Number(formData.get('duration')) : null;

    if (!Number.isFinite(questionOrder) || !audioFile) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

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

    const interviewQuestion = await prisma.interviewQuestion.findFirst({
      where: {
        interviewId: params.id,
        order: questionOrder,
      },
    });

    if (!interviewQuestion) {
      return NextResponse.json({ error: '题目不存在' }, { status: 404 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    await prisma.recording.upsert({
      where: { interviewQuestionId: interviewQuestion.id },
      update: {
        data: audioBuffer,
        mimeType: audioFile.type || 'audio/webm',
        durationSeconds: duration ?? undefined,
      },
      create: {
        interviewQuestionId: interviewQuestion.id,
        data: audioBuffer,
        mimeType: audioFile.type || 'audio/webm',
        durationSeconds: duration ?? undefined,
      },
    });

    const transcription = await generateBilingualTranscription(
      audioBuffer,
      audioFile.type || 'audio/webm'
    );

    await prisma.interviewQuestion.update({
      where: { id: interviewQuestion.id },
      data: {
        transcription: transcription as Prisma.JsonValue,
        answeredAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, transcription });
  } catch (error) {
    console.error('提交答案失败:', error);
    return NextResponse.json({ error: '提交答案失败' }, { status: 500 });
  }
}

