import OpenAI from 'openai';

interface BilingualTranscription {
  en: string;
  zh: string;
}

export async function generateBilingualTranscription(
  input: Buffer | string,
  mimeType: string
): Promise<BilingualTranscription> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      en: 'OpenAI API Key 未配置，无法生成转写。',
      zh: 'OpenAI API Key 未配置，无法生成转写。',
    };
  }

  let englishText = '';

  if (Buffer.isBuffer(input)) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.audio.transcriptions.create({
      file: new File([input], 'audio.webm', { type: mimeType }),
      model: 'whisper-1',
      response_format: 'text',
    });
    englishText = response.trim();
  } else {
    englishText = input;
  }

  const translation = await openai.chat.completions.create({
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

  const chineseText = translation.choices[0].message?.content?.trim() || '';

  return {
    en: englishText,
    zh: chineseText || '（翻译失败，请稍后重试）',
  };
}

