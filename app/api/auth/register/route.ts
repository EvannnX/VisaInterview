import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z.string().min(2, '姓名至少2个字符'),
  password: z.string().min(6, '密码至少6个字符'),
  role: z.enum(['STUDENT', 'ADMIN']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password, role } = registerSchema.parse(body);

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'STUDENT',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('注册失败:', error);
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}

