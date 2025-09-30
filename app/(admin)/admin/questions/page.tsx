'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import { Card, CardHeader, CardBody } from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import toast from 'react-hot-toast';

export default function QuestionsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisaType, setFilterVisaType] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0); // 总题库数量
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchQuestions();
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchQuestions();
    }
  }, [filterVisaType]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterVisaType) params.append('visaType', filterVisaType);
      params.append('limit', '500'); // 获取所有题目

      const response = await fetch(`/api/questions?${params.toString()}`);
      const data = await response.json();
      
      setQuestions(data.questions || []);
      if (data.pagination) {
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      }
      
      // 获取总题库数量（无筛选）
      if (!filterVisaType) {
        setTotalQuestions(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('获取题目失败:', error);
      toast.error('获取题目失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这道题目吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      toast.success('删除成功');
      fetchQuestions();
    } catch (error: any) {
      toast.error(error.message || '删除失败');
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.textEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">题库管理</h1>
            <p className="mt-2 text-gray-600">
              {filterVisaType 
                ? `当前筛选显示 ${questions.length} 道题目 (总题库: ${totalQuestions} 道)`
                : `管理所有签证面试题目，共 ${pagination.total} 道`
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              F1: {questions.filter(q => q.visaType === 'F1_STUDENT').length} 道 · 
              H1B: {questions.filter(q => q.visaType === 'H1B_WORK').length} 道 · 
              B1/B2: {questions.filter(q => q.visaType === 'B1B2_TOURIST').length} 道 · 
              J1: {questions.filter(q => q.visaType === 'J1_EXCHANGE').length} 道 · 
              L1: {questions.filter(q => q.visaType === 'L1_TRANSFER').length} 道
            </p>
          </div>
          <Link href="/admin/questions/new">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              添加题目
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardBody>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索题目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterVisaType}
                onChange={(e) => {
                  setFilterVisaType(e.target.value);
                  fetchQuestions();
                }}
              >
                <option value="">所有签证类型</option>
                <option value="F1_STUDENT">F1 学生签证</option>
                <option value="H1B_WORK">H1B 工作签证</option>
                <option value="B1B2_TOURIST">B1/B2 旅游签证</option>
                <option value="J1_EXCHANGE">J1 交流签证</option>
                <option value="L1_TRANSFER">L1 调动签证</option>
              </select>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      问题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      签证类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      主题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      难度
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-md truncate">{question.textEn}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {question.textZh}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getVisaTypeLabel(question.visaType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTopicLabel(question.topic)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {getDifficultyLabel(question.difficulty)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            question.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {question.isActive ? '启用' : '停用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function getVisaTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    F1_STUDENT: 'F1',
    H1B_WORK: 'H1B',
    B1B2_TOURIST: 'B1/B2',
    J1_EXCHANGE: 'J1',
    L1_TRANSFER: 'L1',
  };
  return labels[type] || type;
}

function getTopicLabel(topic: string): string {
  const labels: Record<string, string> = {
    PERSONAL_INFO: '个人信息',
    STUDY_PLAN: '学习计划',
    FINANCIAL: '财务状况',
    CAREER: '职业规划',
    TIES_TO_HOME: '国内联系',
    PROGRAM_DETAILS: '项目细节',
    IMMIGRATION_INTENT: '移民倾向',
    BACKGROUND: '背景调查',
    OTHER: '其他',
  };
  return labels[topic] || topic;
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    EASY: '简单',
    MEDIUM: '中等',
    HARD: '困难',
  };
  return labels[difficulty] || difficulty;
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    EASY: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-red-100 text-red-800',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
}

