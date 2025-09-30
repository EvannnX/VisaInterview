// 音频录制器类
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async start(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('无法访问麦克风');
    }
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('录音器未初始化'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();

      // 停止所有音轨
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }
}

// 可用的声音选项 - 使用真实的 TTS 服务
export const AVAILABLE_VOICES = {
  'en-US-Female': {
    label: '美式英语（女）- Sarah',
    provider: 'elevenlabs',
    voiceId: '21m00Tcm4TlvDq8ikWAM', // ElevenLabs Rachel
    language: 'en-US',
    gender: 'female',
    description: '标准美式口音，专业友好'
  },
  'en-US-Male': {
    label: '美式英语（男）- Michael',
    provider: 'elevenlabs',
    voiceId: 'TxGEqnHWrfWFTfGW9XjX', // ElevenLabs Josh
    language: 'en-US',
    gender: 'male',
    description: '深沉美式口音，成熟稳重'
  },
  'en-GB-Female': {
    label: '英式英语（女）- Emma',
    provider: 'elevenlabs',
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // ElevenLabs Dorothy
    language: 'en-GB',
    gender: 'female',
    description: '纯正英式口音，优雅得体'
  },
  'en-GB-Male': {
    label: '英式英语（男）- James',
    provider: 'elevenlabs',
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // ElevenLabs Daniel
    language: 'en-GB',
    gender: 'male',
    description: '经典英式口音，权威专业'
  },
  'en-IN-Female': {
    label: '印度英语（女）- Priya',
    provider: 'openai',
    voiceId: 'shimmer',
    language: 'en-IN',
    gender: 'female',
    description: '印度口音，温和亲切'
  },
  'en-IN-Male': {
    label: '印度英语（男）- Raj',
    provider: 'openai',
    voiceId: 'onyx',
    language: 'en-IN',
    gender: 'male',
    description: '印度口音，严肃认真'
  },
  'en-AU-Female': {
    label: '澳大利亚英语（女）- Sophie',
    provider: 'openai',
    voiceId: 'nova',
    language: 'en-AU',
    gender: 'female',
    description: '澳洲口音，轻松自然'
  },
};

// TTS 服务类型
export type TTSProvider = 'elevenlabs' | 'openai' | 'azure' | 'browser';

// TTS 配置
export interface TTSConfig {
  provider: TTSProvider;
  voiceId: string;
  text: string;
  language?: string;
}

// 文本转语音函数
export async function textToSpeech(config: TTSConfig): Promise<ArrayBuffer> {
  const response = await fetch('/api/speech/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('语音生成失败');
  }

  return await response.arrayBuffer();
}

// 播放音频
export function playAudio(audioBuffer: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('音频播放失败'));
    };

    audio.play();
  });
}

// 语音识别（ASR）
export async function speechToText(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch('/api/speech/asr', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('语音识别失败');
  }

  const data = await response.json();
  return data.text;
}