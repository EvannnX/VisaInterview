import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        interview: {
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: '报告不存在' }, { status: 404 });
    }

    // 检查权限
    if (report.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('获取报告失败:', error);
    return NextResponse.json({ error: '获取报告失败' }, { status: 500 });
  }
}

