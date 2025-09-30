'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlayCircle, FileText, TrendingUp, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import { formatDate } from '../../../../lib/utils';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReports();
    }
  }, [session]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/reports/user/${session?.user?.id}`);
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('获取报告失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const averageScore =
    reports.length > 0
      ? reports.reduce((sum, r) => sum + r.totalScore, 0) / reports.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            欢迎回来，{session?.user?.name}！
          </h1>
          <p className="mt-2 text-gray-600">准备好开始新的面试练习了吗？</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-8 h-8 text-primary-600" />}
            title="完成面试"
            value={reports.length}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            title="平均分数"
            value={averageScore.toFixed(1)}
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-yellow-600" />}
            title="练习时长"
            value={`${(reports.length * 15).toFixed(0)} 分钟`}
          />
          <StatCard
            icon={<PlayCircle className="w-8 h-8 text-blue-600" />}
            title="本月练习"
            value={reports.filter(r => {
              const date = new Date(r.createdAt);
              const now = new Date();
              return date.getMonth() === now.getMonth();
            }).length}
          />
        </div>

        {/* 快速开始 */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">快速开始</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-4">
                  开始一次新的面试模拟练习，提升你的面试技能
                </p>
              </div>
              <Link href="/interview/new">
                <Button size="lg">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  开始新面试
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* 最近的报告 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">最近的面试报告</h2>
          </CardHeader>
          <CardBody>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">还没有面试记录</p>
                <Link href="/interview/new">
                  <Button className="mt-4">开始第一次面试</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {getVisaTypeLabel(report.interview.visaType)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.createdAt)} · {report.totalQuestions} 道题目
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(report.totalScore)}`}>
                          {report.totalScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">总分</div>
                      </div>
                      <Link href={`/reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center space-x-4">
          <div>{icon}</div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function getVisaTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    F1_STUDENT: 'F1 学生签证',
    H1B_WORK: 'H1B 工作签证',
    B1B2_TOURIST: 'B1/B2 旅游签证',
    J1_EXCHANGE: 'J1 交流签证',
    L1_TRANSFER: 'L1 调动签证',
  };
  return labels[type] || type;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

