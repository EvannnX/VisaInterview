import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

// 获取面试详情
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

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
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: '面试不存在' }, { status: 404 });
    }

    // 检查权限
    if (
      interview.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error('获取面试失败:', error);
    return NextResponse.json({ error: '获取面试失败' }, { status: 500 });
  }
}

