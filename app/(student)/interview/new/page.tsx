'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Globe, Users, Mic, X, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import toast from 'react-hot-toast';
import { AVAILABLE_VOICES } from '../../../../lib/speech';

export default function NewInterviewPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [interviewMode, setInterviewMode] = useState<'random' | 'custom'>('random');
  const [formData, setFormData] = useState({
    visaType: 'F1_STUDENT',
    accentType: 'en-US-Female',
    totalQuestions: 10,
  });

  // 自定义模式相关状态
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newCustomQuestion, setNewCustomQuestion] = useState('');

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // 获取可用题目（用于自定义模式）
  useEffect(() => {
    if (interviewMode === 'custom') {
      fetchAvailableQuestions();
    }
  }, [interviewMode, formData.visaType]);

  const fetchAvailableQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?visaType=${formData.visaType}&limit=500`);
      const data = await response.json();
      setAvailableQuestions(data.questions || []);
    } catch (error) {
      console.error('获取题目失败:', error);
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const addCustomQuestion = () => {
    if (newCustomQuestion.trim()) {
      setCustomQuestions([...customQuestions, newCustomQuestion.trim()]);
      setNewCustomQuestion('');
    }
  };

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let payload: any = { ...formData };
      
      if (interviewMode === 'custom') {
        if (selectedQuestions.length === 0 && customQuestions.length === 0) {
          throw new Error('请至少选择一道题目或输入自定义题目');
        }
        payload.mode = 'custom';
        payload.selectedQuestionIds = selectedQuestions;
        payload.customQuestions = customQuestions;
        payload.totalQuestions = selectedQuestions.length + customQuestions.length;
      } else {
        payload.mode = 'random';
      }

      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建面试失败');
      }

      toast.success('面试创建成功！');
      router.push(`/interview/${data.interview.id}`);
    } catch (error: any) {
      toast.error(error.message || '创建面试失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">开始新面试</h1>
          <p className="mt-2 text-gray-600">选择签证类型、面试官口音和模式开始模拟面试</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 面试模式选择 */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">面试模式</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setInterviewMode('random');
                    setSelectedQuestions([]);
                    setCustomQuestions([]);
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    interviewMode === 'random'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">🎲 随机抽题</div>
                  <div className="text-sm text-gray-600">系统从题库中随机抽取题目</div>
                </button>
                <button
                  type="button"
                  onClick={() => setInterviewMode('custom')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    interviewMode === 'custom'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">✏️ 自选题目</div>
                  <div className="text-sm text-gray-600">从题库选择或自己输入题目</div>
                </button>
              </div>
            </CardBody>
          </Card>

          {/* 签证类型 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">签证类型</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid md:grid-cols-2 gap-4">
                <VisaTypeOption
                  value="F1_STUDENT"
                  label="F1 学生签证"
                  description="留学生签证面试"
                  selected={formData.visaType === 'F1_STUDENT'}
                  onChange={() => setFormData({ ...formData, visaType: 'F1_STUDENT' })}
                />
                <VisaTypeOption
                  value="H1B_WORK"
                  label="H1B 工作签证"
                  description="专业工作签证面试"
                  selected={formData.visaType === 'H1B_WORK'}
                  onChange={() => setFormData({ ...formData, visaType: 'H1B_WORK' })}
                />
                <VisaTypeOption
                  value="B1B2_TOURIST"
                  label="B1/B2 旅游签证"
                  description="旅游商务签证面试"
                  selected={formData.visaType === 'B1B2_TOURIST'}
                  onChange={() => setFormData({ ...formData, visaType: 'B1B2_TOURIST' })}
                />
                <VisaTypeOption
                  value="J1_EXCHANGE"
                  label="J1 交流签证"
                  description="交流访问签证面试"
                  selected={formData.visaType === 'J1_EXCHANGE'}
                  onChange={() => setFormData({ ...formData, visaType: 'J1_EXCHANGE' })}
                />
              </div>
            </CardBody>
          </Card>

          {/* 面试官口音 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">面试官口音</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(AVAILABLE_VOICES).map(([key, voice]) => (
                  <AccentOption
                    key={key}
                    value={key}
                    label={voice.label}
                    selected={formData.accentType === key}
                    onChange={() => setFormData({ ...formData, accentType: key })}
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          {/* 题目数量 - 仅随机模式 */}
          {interviewMode === 'random' && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">题目数量</h2>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="5"
                    value={formData.totalQuestions}
                    onChange={(e) =>
                      setFormData({ ...formData, totalQuestions: parseInt(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-primary-600 w-16 text-center">
                    {formData.totalQuestions}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  预计用时：{(formData.totalQuestions * 1.5).toFixed(0)} 分钟
                </p>
              </CardBody>
            </Card>
          )}

          {/* 自定义题目选择 */}
          {interviewMode === 'custom' && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">选择或输入题目</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* 从题库选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    📚 从题库选择 ({selectedQuestions.length} 题已选)
                  </label>
                  <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2 bg-white">
                    {availableQuestions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">加载题目中...</p>
                    ) : (
                      availableQuestions.map((q) => (
                        <label
                          key={q.id}
                          className="flex items-start p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(q.id)}
                            onChange={() => toggleQuestionSelection(q.id)}
                            className="mt-1 mr-3 w-4 h-4 text-primary-600"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{q.textEn}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              难度: {q.difficulty === 'EASY' ? '简单' : q.difficulty === 'MEDIUM' ? '中等' : '困难'}
                              {' '} | 主题: {q.topic}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* 自定义输入题目 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ✏️ 自定义题目 ({customQuestions.length} 题)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newCustomQuestion}
                      onChange={(e) => setNewCustomQuestion(e.target.value)}
                      placeholder="输入中文问题，系统会自动翻译成英文..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomQuestion();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addCustomQuestion}
                      variant="outline"
                      disabled={!newCustomQuestion.trim()}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  {customQuestions.length > 0 && (
                    <div className="space-y-2">
                      {customQuestions.map((q, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <span className="text-sm text-gray-900 flex-1">{q}</span>
                          <button
                            type="button"
                            onClick={() => removeCustomQuestion(index)}
                            className="ml-3 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 提示 */}
                <div className={`rounded-lg p-4 ${
                  selectedQuestions.length + customQuestions.length === 0
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className={`text-sm ${
                    selectedQuestions.length + customQuestions.length === 0
                      ? 'text-yellow-800'
                      : 'text-green-800'
                  }`}>
                    <strong>
                      {selectedQuestions.length + customQuestions.length === 0 ? '⚠️ 提示：' : '✅ 已准备：'}
                    </strong>
                    {' '}
                    {selectedQuestions.length + customQuestions.length === 0
                      ? '请至少选择或输入一道题目'
                      : `共 ${selectedQuestions.length + customQuestions.length} 道题目，预计用时 ${((selectedQuestions.length + customQuestions.length) * 1.5).toFixed(0)} 分钟`
                    }
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                (interviewMode === 'custom' &&
                  selectedQuestions.length === 0 &&
                  customQuestions.length === 0)
              }
            >
              {isLoading ? '创建中...' : '开始面试'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 签证类型选项组件
function VisaTypeOption({
  value,
  label,
  description,
  selected,
  onChange,
}: {
  value: string;
  label: string;
  description: string;
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selected
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center">
        <input
          type="radio"
          checked={selected}
          onChange={onChange}
          className="mr-3"
        />
        <div>
          <div className="font-semibold text-gray-900">{label}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
    </div>
  );
}

// 口音选项组件
function AccentOption({
  value,
  label,
  selected,
  onChange,
}: {
  value: string;
  label: string;
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selected
          ? 'border-primary-600 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center">
        <input
          type="radio"
          checked={selected}
          onChange={onChange}
          className="mr-3"
        />
        <div className="font-semibold text-gray-900">{label}</div>
      </div>
    </div>
  );
}