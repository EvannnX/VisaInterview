import { TranslationServiceClient } from '@google-cloud/translate';

let translationClient: TranslationServiceClient | null = null;
let parentPath: string | null = null;

function initClient() {
  if (translationClient) return translationClient;
  const credentialsJson = process.env.GOOGLE_TRANSLATE_CREDENTIALS;
  if (!credentialsJson) {
    console.warn('GOOGLE_TRANSLATE_CREDENTIALS 未设置，无法使用 Google 翻译');
    return null;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    translationClient = new TranslationServiceClient({ credentials });
    const location = process.env.GOOGLE_TRANSLATE_LOCATION || 'global';
    parentPath = `projects/${credentials.project_id}/locations/${location}`;
    return translationClient;
  } catch (error) {
    console.error('初始化 Google Translation 客户端失败:', error);
    translationClient = null;
    parentPath = null;
    return null;
  }
}

export async function translateTextToEnglish(text: string): Promise<string> {
  if (!text || !text.trim()) {
    return text;
  }

  const client = initClient();
  if (!client || !parentPath) {
    return text;
  }

  try {
    const [response] = await client.translateText({
      parent: parentPath,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: 'en',
    });

    const translated = response.translations?.[0]?.translatedText;
    return translated?.trim() || text;
  } catch (error) {
    console.error('Google Translation API 调用失败:', error);
    return text;
  }
}

