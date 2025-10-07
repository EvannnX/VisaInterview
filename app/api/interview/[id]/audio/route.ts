import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionOrder = Number(req.nextUrl.searchParams.get('order'));
    if (!Number.isFinite(questionOrder)) {
      return new NextResponse('Invalid order', { status: 400 });
    }

    const interviewQuestion = await prisma.interviewQuestion.findFirst({
      where: {
        interviewId: params.id,
        order: questionOrder,
      },
      include: {
        recording: true,
      },
    });

    if (!interviewQuestion || !interviewQuestion.recording) {
      return new NextResponse('Recording not found', { status: 404 });
    }

    const audioBytes = Uint8Array.from(interviewQuestion.recording.data);

    return new NextResponse(audioBytes, {
      status: 200,
      headers: {
        'Content-Type': interviewQuestion.recording.mimeType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('获取录音失败:', error);
    return new NextResponse('Failed to fetch recording', { status: 500 });
  }
}

