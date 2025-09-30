import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

// 获取单个题目
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
    });

    if (!question) {
      return NextResponse.json({ error: '题目不存在' }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('获取题目失败:', error);
    return NextResponse.json({ error: '获取题目失败' }, { status: 500 });
  }
}

// 更新题目（仅管理员）
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    const body = await req.json();

    const question = await prisma.question.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error('更新题目失败:', error);
    return NextResponse.json({ error: '更新题目失败' }, { status: 500 });
  }
}

// 删除题目（仅管理员）
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除题目失败:', error);
    return NextResponse.json({ error: '删除题目失败' }, { status: 500 });
  }
}

