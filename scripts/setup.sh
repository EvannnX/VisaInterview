#!/bin/bash

# 签证面试模拟系统 - 快速安装脚本

echo "🚀 开始安装签证面试模拟系统..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✓ Node.js 版本: $(node -v)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    exit 1
fi

echo "✓ npm 版本: $(npm -v)"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 创建 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp env.example .env
    echo "⚠️  请编辑 .env 文件并填写数据库配置"
fi

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npm run db:generate

echo ""
echo "✅ 安装完成！"
echo ""
echo "下一步："
echo "1. 编辑 .env 文件，配置数据库连接"
echo "2. 运行 'npm run db:push' 初始化数据库"
echo "3. 运行 'npm run db:seed' 填充测试数据"
echo "4. 运行 'npm run dev' 启动开发服务器"
echo ""
echo "测试账户："
echo "  学员: student@example.com / student123"
echo "  管理员: admin@example.com / admin123"
echo ""
