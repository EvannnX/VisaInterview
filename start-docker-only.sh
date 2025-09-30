#!/bin/bash

# 只启动 Docker 数据库，应用在本地运行
# 使用方法: ./start-docker-only.sh

set -e

echo "🐳 启动 Docker 数据库"
echo "======================"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装 Docker"
    echo "请先安装 Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 停止旧容器
echo "清理旧容器..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# 启动数据库
echo "启动 PostgreSQL 数据库..."
docker-compose -f docker-compose.simple.yml up -d postgres

# 等待数据库就绪
echo "等待数据库启动..."
for i in {1..30}; do
    if docker exec visa_interview_db pg_isready -U visa_user -d visa_interview &>/dev/null; then
        echo "✓ 数据库已就绪"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ 数据库启动超时"
        docker-compose -f docker-compose.simple.yml logs postgres
        exit 1
    fi
    sleep 1
done

# 更新 .env 文件
echo "更新配置文件..."
cat > .env << 'EOF'
# 数据库配置（Docker）
DATABASE_URL="postgresql://visa_user:visa_password_123@localhost:5432/visa_interview?schema=public"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production-123456789"

# 应用配置
NODE_ENV="development"
EOF

echo ""
echo "✅ 数据库启动成功！"
echo ""
echo "📊 数据库信息:"
echo "   主机: localhost"
echo "   端口: 5432"
echo "   用户: visa_user"
echo "   密码: visa_password_123"
echo "   数据库: visa_interview"
echo ""
echo "🔧 连接字符串:"
echo "   postgresql://visa_user:visa_password_123@localhost:5432/visa_interview"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    echo "请安装 Node.js 18+: https://nodejs.org/"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 初始化数据库
echo "🔧 初始化数据库..."
npm run db:generate
npm run db:push

# 询问是否填充测试数据
read -p "是否填充测试数据（包含测试账户和题目）? (y/n): " seed
if [ "$seed" = "y" ] || [ "$seed" = "Y" ]; then
    echo "📝 填充测试数据..."
    npm run db:seed
fi

echo ""
echo "✅ 一切就绪！"
echo ""
echo "🚀 启动应用:"
echo "   npm run dev"
echo ""
echo "🌐 访问地址:"
echo "   应用: http://localhost:3000"
echo "   pgAdmin: http://localhost:5050 (admin@visa.com / admin123)"
echo ""
echo "📱 测试账户:"
echo "   学员: student@example.com / student123"
echo "   管理员: admin@example.com / admin123"
echo ""
echo "🛑 停止数据库:"
echo "   docker-compose -f docker-compose.simple.yml down"
echo ""

# 询问是否立即启动开发服务器
read -p "是否立即启动开发服务器? (y/n): " start_dev
if [ "$start_dev" = "y" ] || [ "$start_dev" = "Y" ]; then
    echo ""
    echo "🚀 启动开发服务器..."
    echo ""
    npm run dev
fi
