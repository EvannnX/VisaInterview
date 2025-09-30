import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { calculateInterviewReport } from '../../lib/scoring';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取面试及所有问题
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!interview || interview.userId !== session.user.id) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    if (interview.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: '面试已结束' }, { status: 400 });
    }

    // 计算每道题的评分（这里使用模拟数据，实际应调用 AI 评分）
    const evaluations = interview.questions.map((iq) => ({
      contentScore: Math.random() * 30 + 60, // 60-90
      languageScore: Math.random() * 30 + 60,
      performanceScore: Math.random() * 30 + 60,
      riskScore: Math.random() * 30 + 60,
      totalScore: Math.random() * 30 + 60,
      feedback: {
        strengths: ['回答完整', '逻辑清晰'],
        weaknesses: ['可以更具体', '语速稍快'],
        suggestions: ['多举例说明', '放慢语速'],
        detailedFeedback: '整体表现良好，继续加油！',
      },
    }));

    // 计算总体报告
    const reportData = calculateInterviewReport(evaluations);

    // 更新面试状态
    await prisma.interview.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        totalScore: reportData.totalScore,
      },
    });

    // 创建报告
    const report = await prisma.report.create({
      data: {
        interviewId: params.id,
        userId: session.user.id,
        totalScore: reportData.totalScore,
        contentScore: reportData.contentScore,
        languageScore: reportData.languageScore,
        performanceScore: reportData.performanceScore,
        riskScore: reportData.riskScore,
        strengths: reportData.strengths,
        weaknesses: reportData.weaknesses,
        suggestions: reportData.suggestions,
        overallFeedback: reportData.overallFeedback,
        totalQuestions: interview.totalQuestions,
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('完成面试失败:', error);
    return NextResponse.json({ error: '完成面试失败' }, { status: 500 });
  }
}

