#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 签证面试系统 - 一键部署脚本"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查必要的工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安装，请先安装"
        echo "   安装方法：$2"
        exit 1
    else
        echo "✅ $1 已安装"
    fi
}

echo "📋 步骤 1/6：检查环境"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command "git" "https://git-scm.com/downloads"
check_command "node" "https://nodejs.org/"
check_command "npm" "跟随 Node.js 安装"
echo ""

echo "📦 步骤 2/6：安装 CLI 工具"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "需要安装 Vercel CLI 和 Railway CLI 吗？(y/n): " install_cli

if [ "$install_cli" = "y" ]; then
    echo "安装 Vercel CLI..."
    npm i -g vercel
    
    echo "安装 Railway CLI..."
    npm i -g @railway/cli
    
    echo "✅ CLI 工具安装完成"
else
    echo "⏭️  跳过 CLI 安装"
fi
echo ""

echo "🗂️  步骤 3/6：初始化 Git 仓库"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git 仓库已初始化"
else
    echo "ℹ️  Git 仓库已存在"
fi
echo ""

echo "📝 步骤 4/6：创建 .gitignore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# 依赖
node_modules/
/.pnp
.pnp.js

# 测试
/coverage

# Next.js
/.next/
/out/

# 生产
/build

# 其他
.DS_Store
*.pem

# 调试
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 本地环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/migrations/
EOF
    echo "✅ .gitignore 已创建"
else
    echo "ℹ️  .gitignore 已存在"
fi
echo ""

echo "💾 步骤 5/6：提交代码"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git add .
git commit -m "Initial commit - 签证面试系统" 2>/dev/null || echo "ℹ️  没有新的更改需要提交"
echo ""

echo "🌐 步骤 6/6：部署选项"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "请选择部署方式："
echo "1. 使用 GitHub + Vercel（推荐）"
echo "2. 使用 Vercel CLI 直接部署"
echo "3. 跳过，我稍后手动部署"
echo ""
read -p "请选择 [1-3]: " deploy_choice

case $deploy_choice in
    1)
        echo ""
        echo "📝 GitHub 部署步骤："
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "1. 访问 https://github.com/new 创建新仓库"
        echo "2. 仓库名：visa-interview-system"
        echo "3. 设置为 Private（推荐）"
        echo "4. 不要初始化 README"
        echo ""
        read -p "按回车继续..."
        echo ""
        read -p "输入你的 GitHub 用户名: " github_user
        read -p "输入仓库名 [visa-interview-system]: " repo_name
        repo_name=${repo_name:-visa-interview-system}
        
        git remote remove origin 2>/dev/null
        git remote add origin "https://github.com/$github_user/$repo_name.git"
        git branch -M main
        
        echo ""
        echo "推送代码到 GitHub..."
        git push -u origin main
        
        echo ""
        echo "✅ 代码已推送到 GitHub！"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎯 下一步："
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "1. 访问 https://vercel.com/new"
        echo "2. 选择你刚创建的仓库"
        echo "3. 配置环境变量（详见 部署指南-Vercel-Railway.md）"
        echo "4. 点击 Deploy"
        echo ""
        ;;
        
    2)
        echo ""
        echo "📦 使用 Vercel CLI 部署..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        vercel
        ;;
        
    3)
        echo ""
        echo "⏭️  跳过部署"
        echo "请查看 部署指南-Vercel-Railway.md 手动部署"
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 部署准备完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📄 详细文档："
echo "   • 部署指南-Vercel-Railway.md"
echo ""
echo "🔑 需要配置的环境变量："
echo "   • DATABASE_URL (从 Railway 获取)"
echo "   • NEXTAUTH_URL (你的 Vercel URL)"
echo "   • NEXTAUTH_SECRET (随机生成)"
echo "   • ELEVENLABS_API_KEY (已有)"
echo ""
echo "🎉 祝部署顺利！"
echo ""
