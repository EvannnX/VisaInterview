'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, TrendingUp, Users } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import { Card, CardHeader, CardBody } from '../../../components/Card';
import { formatDate } from '../../../lib/utils';

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalReports: 0,
    averageScore: 0,
    totalUsers: 0,
    recentReports: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">学员成绩统计</h1>
          <p className="mt-2 text-gray-600">查看所有学员的面试成绩和统计数据</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-8 h-8 text-primary-600" />}
            title="总面试次数"
            value={stats.totalReports}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            title="平均得分"
            value={stats.averageScore.toFixed(1)}
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="活跃用户"
            value={stats.totalUsers}
          />
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">最近的面试记录</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">功能开发中...</p>
              <p className="text-sm text-gray-400 mt-2">
                将显示所有学员的最近面试记录
              </p>
            </div>
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
