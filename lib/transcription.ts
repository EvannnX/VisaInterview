import OpenAI from 'openai';

export interface BilingualTranscription {
  en: string;
  zh: string;
  [key: string]: string;
}

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateBilingualTranscription(
  input: Buffer | string,
  mimeType: string
): Promise<BilingualTranscription> {
  if (!openaiClient) {
    return {
      en: 'OpenAI API Key 未配置，无法生成转写。',
      zh: 'OpenAI API Key 未配置，无法生成转写。',
    };
  }

  let englishText: string;

  if (Buffer.isBuffer(input)) {
    const transcription = await openaiClient.audio.transcriptions.create({
      file: new File([input], 'audio.webm', { type: mimeType }),
      model: 'whisper-1',
    });
    englishText = transcription.text?.trim() || '';
  } else {
    englishText = input;
  }

  if (!englishText) {
    englishText = 'Transcription unavailable';
  }

  const translation = await openaiClient.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          '你是专业翻译，请把给定英语回答翻译成自然的中文，保持原义并适合签证面试语境。仅返回译文。',
      },
      {
        role: 'user',
        content: englishText,
      },
    ],
  });

  const chineseText = translation.choices?.[0]?.message?.content?.trim();

  return {
    en: englishText,
    zh: chineseText || '（翻译失败，请稍后重试）',
  };
}

