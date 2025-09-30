import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en-US';

    if (!audioFile) {
      return NextResponse.json({ error: '缺少音频文件' }, { status: 400 });
    }

    // 简化版本：返回占位文本
    // 在生产环境中应使用 Azure Speech Services 或 OpenAI Whisper
    if (!process.env.AZURE_SPEECH_KEY) {
      return NextResponse.json({
        text: 'This is a sample transcription. Please configure Azure Speech Services for real ASR.',
      });
    }

    // Azure Speech Services ASR 实现
    // 或者使用 OpenAI Whisper API
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const transcription = await openai.audio.transcriptions.create({
    //   file: audioFile,
    //   model: "whisper-1",
    // });

    return NextResponse.json({
      text: 'Transcribed text will appear here',
    });
  } catch (error) {
    console.error('ASR 失败:', error);
    return NextResponse.json({ error: 'ASR 服务失败' }, { status: 500 });
  }
}

