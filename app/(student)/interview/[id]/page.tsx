'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Mic, Square, Volume2, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import { Card, CardHeader, CardBody } from '../../../components/Card';
import Button from '../../../components/Button';
import toast from 'react-hot-toast';
import { AudioRecorder } from '../../../lib/speech';

interface InterviewData {
  id: string;
  visaType: string;
  accentType: string;
  totalQuestions: number;
  questions: Array<{
    id: string;
    order: number;
    question: {
      textEn: string;
      textZh: string;
      tips: string;
    };
  }>;
}

export default function InterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { status } = useSession();
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchInterview();
    }
  }, [status, params.id]);

  const fetchInterview = async () => {
    try {
      const response = await fetch(`/api/interview/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setInterview(data.interview);
    } catch (error: any) {
      toast.error(error.message || '获取面试失败');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const playQuestion = async () => {
    const currentQuestion = interview?.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setIsPlaying(true);

    try {
      // 使用专业 TTS 服务
      const response = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentQuestion.question.textEn,
          provider: getProvider(interview.accentType),
          voiceId: getVoiceId(interview.accentType),
          language: getLanguage(interview.accentType),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBuffer = await response.arrayBuffer();
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
        toast.error('Failed to play audio');
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
      toast.error('Failed to generate speech. Using browser TTS as fallback...');
      
      // 降级到浏览器 TTS
      try {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question.textEn);
        utterance.lang = 'en-US';
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } catch (fallbackError) {
        setIsPlaying(false);
      }
    }
  };

  const getProvider = (accentType: string): string => {
    if (accentType.includes('US') || accentType.includes('GB')) {
      return 'elevenlabs';
    }
    return 'openai';
  };

  const getVoiceId = (accentType: string): string => {
    const voiceMap: { [key: string]: string } = {
      'en-US-Female': '21m00Tcm4TlvDq8ikWAM',
      'en-US-Male': 'TxGEqnHWrfWFTfGW9XjX',
      'en-GB-Female': 'ThT5KcBeYPX3keUQqHPh',
      'en-GB-Male': 'onwK4e9ZLuTAKqWW03F9',
      'en-IN-Female': 'shimmer',
      'en-IN-Male': 'onyx',
      'en-AU-Female': 'nova',
    };
    return voiceMap[accentType] || voiceMap['en-US-Female'];
  };

  const getLanguage = (accentType: string): string => {
    if (accentType.includes('US')) return 'en-US';
    if (accentType.includes('GB')) return 'en-GB';
    if (accentType.includes('IN')) return 'en-IN';
    if (accentType.includes('AU')) return 'en-AU';
    return 'en-US';
  };

  const startRecording = async () => {
    try {
      await audioRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error: any) {
      toast.error(error.message || 'Cannot start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const audioBlob = await audioRecorder.stop();
      setIsRecording(false);

      // 模拟转写（实际应调用 ASR API）
      const simulatedTranscription = 'This is a simulated transcription. Please configure Azure Speech or OpenAI Whisper for real ASR.';
      
      // 保存答案
      const order = interview!.questions[currentQuestionIndex].order;
      setAnswers(prev => ({ ...prev, [order]: simulatedTranscription }));

      // 提交到服务器
      await fetch(`/api/interview/${params.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionOrder: order,
          answer: simulatedTranscription,
          transcription: simulatedTranscription,
        }),
      });

      toast.success('Recording completed');
    } catch (error: any) {
      toast.error(error.message || 'Recording failed');
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (interview?.totalQuestions || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeInterview = async () => {
    if (Object.keys(answers).length < (interview?.totalQuestions || 0)) {
      if (!confirm('You have unanswered questions. Are you sure you want to end the interview?')) {
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/interview/${params.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Interview completed! Generating report...');
      router.push(`/reports/${data.report.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete interview');
      setIsLoading(false);
    }
  };

  if (isLoading || !interview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {interview.totalQuestions}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 问题卡片 */}
        <Card className="mb-6">
          <CardBody className="text-center py-12">
            <div className="mb-4 text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {interview.totalQuestions}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentQuestion.question.textEn}
            </h2>

            {/* 播放按钮 */}
            <Button
              onClick={playQuestion}
              disabled={isPlaying}
              variant="outline"
              size="lg"
              className="mb-4"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              {isPlaying ? 'Playing...' : 'Play Question'}
            </Button>
          </CardBody>
        </Card>

        {/* 录音控制 */}
        <Card className="mb-6">
          <CardBody className="text-center py-8">
            <div className="flex justify-center mb-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 recording-pulse'
                    : 'bg-primary-600 hover:bg-primary-700'
                } shadow-lg`}
              >
                {isRecording ? (
                  <Square className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </button>
            </div>

            <p className="text-gray-600 text-lg">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording your answer'}
            </p>

            {answers[currentQuestion.order] && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>✓ Answered</strong>
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* 导航按钮 */}
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>

          {currentQuestionIndex === interview.totalQuestions - 1 ? (
            <Button onClick={completeInterview}>
              Complete Interview
            </Button>
          ) : (
            <Button onClick={goToNextQuestion}>
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

