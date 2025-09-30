import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs TTS
async function elevenLabsTTS(text: string, voiceId: string): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

// OpenAI TTS
async function openAITTS(text: string, voiceId: string): Promise<ArrayBuffer> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1-hd', // 使用高清模型
      input: text,
      voice: voiceId, // alloy, echo, fable, onyx, nova, shimmer
      speed: 1.0,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

// Azure TTS
async function azureTTS(text: string, voiceId: string, language: string): Promise<ArrayBuffer> {
  const apiKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastus';
  
  if (!apiKey) {
    throw new Error('Azure Speech API key not configured');
  }

  const ssml = `
    <speak version='1.0' xml:lang='${language}'>
      <voice name='${voiceId}'>
        ${text}
      </voice>
    </speak>
  `;

  const response = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: ssml,
    }
  );

  if (!response.ok) {
    throw new Error(`Azure API error: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

// 浏览器 TTS（备用方案，质量较低）
async function browserTTS(text: string, language: string): Promise<ArrayBuffer> {
  // 浏览器TTS需要在客户端实现，这里返回一个提示
  throw new Error('Browser TTS should be handled on client side');
}

export async function POST(req: NextRequest) {
  try {
    const { provider, voiceId, text, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    let audioBuffer: ArrayBuffer;

    // 根据不同的提供商调用相应的API
    switch (provider) {
      case 'elevenlabs':
        audioBuffer = await elevenLabsTTS(text, voiceId);
        break;
      
      case 'openai':
        audioBuffer = await openAITTS(text, voiceId);
        break;
      
      case 'azure':
        audioBuffer = await azureTTS(text, voiceId, language || 'en-US');
        break;
      
      case 'browser':
        // 浏览器TTS在客户端处理
        return NextResponse.json(
          { error: 'Browser TTS not supported on server' },
          { status: 400 }
        );
      
      default:
        // 如果没有配置任何API key，尝试使用可用的服务
        if (process.env.ELEVENLABS_API_KEY) {
          audioBuffer = await elevenLabsTTS(text, voiceId);
        } else if (process.env.OPENAI_API_KEY) {
          audioBuffer = await openAITTS(text, voiceId);
        } else if (process.env.AZURE_SPEECH_KEY) {
          audioBuffer = await azureTTS(text, voiceId, language || 'en-US');
        } else {
          return NextResponse.json(
            { error: 'No TTS service configured. Please set ELEVENLABS_API_KEY, OPENAI_API_KEY, or AZURE_SPEECH_KEY' },
            { status: 503 }
          );
        }
    }

    // 返回音频数据
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'TTS generation failed' },
      { status: 500 }
    );
  }
}