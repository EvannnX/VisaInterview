#!/bin/bash

# 签证面试模拟系统 - 一键启动脚本
# 使用方法: ./start.sh

set -e

echo "🚀 签证面试模拟系统 - 一键启动"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Docker 是否安装
check_docker() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker 已安装"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Docker 未安装"
        return 1
    fi
}

# 检查 Node.js
check_node() {
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✓${NC} Node.js 已安装 ($(node -v))"
        return 0
    else
        echo -e "${RED}✗${NC} Node.js 未安装"
        return 1
    fi
}

# 检查 npm
check_npm() {
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✓${NC} npm 已安装 ($(npm -v))"
        return 0
    else
        echo -e "${RED}✗${NC} npm 未安装"
        return 1
    fi
}

# 使用 Docker 启动
start_with_docker() {
    echo ""
    echo "📦 使用 Docker 启动（推荐）"
    echo "================================"
    
    # 停止可能存在的旧容器
    echo "清理旧容器..."
    docker-compose down 2>/dev/null || true
    
    # 启动服务
    echo "启动 Docker 容器..."
    docker-compose up -d
    
    # 等待数据库启动
    echo "等待数据库启动..."
    sleep 10
    
    # 检查容器状态
    if docker ps | grep -q visa_interview_db; then
        echo -e "${GREEN}✓${NC} 数据库容器已启动"
    else
        echo -e "${RED}✗${NC} 数据库容器启动失败"
        docker-compose logs
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✓${NC} Docker 服务启动成功！"
    echo ""
    echo "初始化数据库..."
    docker exec visa_interview_db psql -U visa_user -d visa_interview -c "SELECT 1" &>/dev/null || {
        echo "等待数据库完全就绪..."
        sleep 5
    }
    
    echo -e "${GREEN}✓${NC} 所有服务已启动"
    echo ""
    echo "🌐 访问地址: ${GREEN}http://localhost:3000${NC}"
    echo ""
    echo "📱 测试账户:"
    echo "   学员: student@example.com / student123"
    echo "   管理员: admin@example.com / admin123"
    echo ""
    echo "📋 常用命令:"
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
}

# 本地启动（不使用 Docker）
start_locally() {
    echo ""
    echo "💻 本地启动模式"
    echo "================================"
    
    # 检查 node_modules
    if [ ! -d "node_modules" ]; then
        echo "安装依赖..."
        npm install
    else
        echo -e "${GREEN}✓${NC} 依赖已安装"
    fi
    
    # 检查 .env 文件
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠${NC} .env 文件不存在，创建默认配置..."
        cp env.example .env
        echo -e "${YELLOW}⚠${NC} 请编辑 .env 文件配置数据库连接"
        echo ""
        echo "需要配置的内容:"
        echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/visa_interview\""
        echo ""
        read -p "是否已有 PostgreSQL 数据库? (y/n): " has_db
        if [ "$has_db" != "y" ]; then
            echo ""
            echo -e "${RED}请先安装 PostgreSQL 或使用 Docker 模式${NC}"
            echo "推荐: ./start.sh (选择 Docker 模式)"
            exit 1
        fi
    fi
    
    # 生成 Prisma 客户端
    if [ ! -d "node_modules/.prisma" ]; then
        echo "生成 Prisma 客户端..."
        npm run db:generate
    fi
    
    # 检查数据库是否已初始化
    echo "检查数据库..."
    npm run db:push 2>/dev/null || {
        echo "初始化数据库..."
        npm run db:push
    }
    
    # 填充种子数据
    read -p "是否填充测试数据? (y/n): " seed_db
    if [ "$seed_db" = "y" ]; then
        echo "填充测试数据..."
        npm run db:seed
    fi
    
    echo ""
    echo -e "${GREEN}✓${NC} 准备完成，启动开发服务器..."
    echo ""
    echo "🌐 访问地址: ${GREEN}http://localhost:3000${NC}"
    echo ""
    echo "📱 测试账户:"
    echo "   学员: student@example.com / student123"
    echo "   管理员: admin@example.com / admin123"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    
    # 启动开发服务器
    npm run dev
}

# 主流程
main() {
    echo "正在检查环境..."
    echo ""
    
    HAS_DOCKER=false
    HAS_NODE=false
    
    if check_docker; then
        HAS_DOCKER=true
    fi
    
    if check_node && check_npm; then
        HAS_NODE=true
    fi
    
    echo ""
    
    # 根据环境选择启动方式
    if [ "$HAS_DOCKER" = true ]; then
        echo "检测到 Docker，推荐使用 Docker 模式"
        echo ""
        echo "请选择启动方式:"
        echo "  1) Docker 模式（推荐，一键启动所有服务）"
        echo "  2) 本地模式（需要手动配置数据库）"
        echo "  3) 退出"
        echo ""
        read -p "请输入选项 (1-3): " choice
        
        case $choice in
            1)
                start_with_docker
                ;;
            2)
                if [ "$HAS_NODE" = false ]; then
                    echo -e "${RED}错误: 未安装 Node.js，请先安装 Node.js 18+${NC}"
                    exit 1
                fi
                start_locally
                ;;
            3)
                echo "退出"
                exit 0
                ;;
            *)
                echo -e "${RED}无效选项${NC}"
                exit 1
                ;;
        esac
    elif [ "$HAS_NODE" = true ]; then
        echo -e "${YELLOW}未检测到 Docker，将使用本地模式${NC}"
        echo ""
        start_locally
    else
        echo -e "${RED}错误: 未安装 Docker 或 Node.js${NC}"
        echo ""
        echo "请安装以下之一:"
        echo "  1. Docker Desktop (推荐): https://www.docker.com/products/docker-desktop"
        echo "  2. Node.js 18+: https://nodejs.org/"
        echo ""
        exit 1
    fi
}

# 运行主流程
main
