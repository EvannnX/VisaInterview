'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Users, FileText, TrendingUp, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900">管理员仪表盘</h1>
          <p className="mt-2 text-gray-600">管理题库、查看学员成绩和系统统计</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-8 h-8 text-primary-600" />}
            title="题库总数"
            value="150+"
            description="覆盖多种签证类型"
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-green-600" />}
            title="注册用户"
            value="50+"
            description="活跃学员"
          />
          <StatCard
            icon={<FileText className="w-8 h-8 text-yellow-600" />}
            title="完成面试"
            value="200+"
            description="总面试次数"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
            title="平均分"
            value="75.5"
            description="整体表现良好"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">快速操作</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Link href="/admin/questions">
                <Button className="w-full" variant="outline">
                  <BookOpen className="w-5 h-5 mr-2" />
                  管理题库
                </Button>
              </Link>
              <Link href="/admin/questions/new">
                <Button className="w-full" variant="outline">
                  添加新题目
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button className="w-full" variant="outline">
                  <FileText className="w-5 h-5 mr-2" />
                  查看学员成绩
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">系统信息</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <InfoRow label="系统版本" value="v1.0.0 MVP" />
                <InfoRow label="数据库" value="PostgreSQL" />
                <InfoRow label="TTS 引擎" value="浏览器 TTS / Azure Speech" />
                <InfoRow label="ASR 引擎" value="Azure Speech / Whisper" />
                <InfoRow label="AI 评分" value="OpenAI GPT-4" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-2">
          {icon}
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">{description}</div>
      </CardBody>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

