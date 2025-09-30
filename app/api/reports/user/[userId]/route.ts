import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 检查权限
    if (params.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      where: { userId: params.userId },
      include: {
        interview: {
          select: {
            id: true,
            visaType: true,
            startedAt: true,
            completedAt: true,
            totalQuestions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('获取用户报告失败:', error);
    return NextResponse.json({ error: '获取用户报告失败' }, { status: 500 });
  }
}

