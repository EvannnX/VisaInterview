'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import Navbar from '../../../../components/Navbar';
import { Card, CardHeader, CardBody } from '../../../../components/Card';
import Button from '../../../../components/Button';
import { formatDate } from '../../../../lib/utils';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { status } = useSession();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setReport(data.report);
    } catch (error: any) {
      console.error('获取报告失败:', error);
      router.push('/reports');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchReport();
    }
  }, [status, router, fetchReport]);

  if (isLoading || !report) {
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
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">面试报告</h1>
            <p className="mt-2 text-gray-600">
              {getVisaTypeLabel(report.interview.visaType)} ·{' '}
              {formatDate(report.createdAt)}
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出 PDF
          </Button>
        </div>

        {/* 总分卡片 */}
        <Card className="mb-8">
          <CardBody className="text-center py-12">
            <div className="text-6xl font-bold mb-2" style={{ color: getScoreColorHex(report.totalScore) }}>
              {report.totalScore.toFixed(1)}
            </div>
            <div className="text-xl text-gray-600 mb-4">总体得分</div>
            <div className="text-gray-500">
              {report.totalScore >= 80
                ? '优秀！继续保持'
                : report.totalScore >= 60
                ? '良好，还有提升空间'
                : '需要更多练习'}
            </div>
          </CardBody>
        </Card>

        {/* 各维度得分 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <ScoreCard
            title="内容"
            score={report.contentScore}
            weight={40}
            description="回答完整性和一致性"
          />
          <ScoreCard
            title="语言"
            score={report.languageScore}
            weight={30}
            description="语法、词汇和流利度"
          />
          <ScoreCard
            title="表现"
            score={report.performanceScore}
            weight={20}
            description="自信、简洁和逻辑性"
          />
          <ScoreCard
            title="风险"
            score={report.riskScore}
            weight={10}
            description="是否有矛盾或风险"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 优点 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">优点</h2>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {report.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* 需改进之处 */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">需改进之处</h2>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                {report.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <TrendingDown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* 改进建议 */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">改进建议</h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              {report.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary-600 font-semibold flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* 总体评价 */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">总体评价</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 leading-relaxed">{report.overallFeedback}</p>
          </CardBody>
        </Card>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => router.push('/reports')}>
            返回列表
          </Button>
          <Button onClick={() => router.push('/interview/new')}>
            开始新面试
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  title,
  score,
  weight,
  description,
}: {
  title: string;
  score: number;
  weight: number;
  description: string;
}) {
  return (
    <Card>
      <CardBody className="text-center">
        <div className="text-3xl font-bold mb-1" style={{ color: getScoreColorHex(score) }}>
          {score.toFixed(1)}
        </div>
        <div className="text-sm font-semibold text-gray-900 mb-1">
          {title} ({weight}%)
        </div>
        <div className="text-xs text-gray-500">{description}</div>
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

function getScoreColorHex(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#ca8a04';
  return '#dc2626';
}

