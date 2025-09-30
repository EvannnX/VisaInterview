@echo off
chcp 65001 >nul
echo 🚀 签证面试模拟系统 - 一键启动
echo ================================
echo.

REM 检查 Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未安装 Docker
    echo 请先安装 Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js
    echo 请先安装 Node.js 18+: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ 环境检查通过
echo.

REM 停止旧容器
echo 清理旧容器...
docker-compose -f docker-compose.simple.yml down 2>nul

REM 启动数据库
echo 启动 PostgreSQL 数据库...
docker-compose -f docker-compose.simple.yml up -d postgres

REM 等待数据库启动
echo 等待数据库启动...
timeout /t 10 /nobreak >nul

REM 创建 .env 文件
echo 更新配置文件...
(
echo # 数据库配置
echo DATABASE_URL="postgresql://visa_user:visa_password_123@localhost:5432/visa_interview?schema=public"
echo.
echo # NextAuth 配置
echo NEXTAUTH_URL="http://localhost:3000"
echo NEXTAUTH_SECRET="dev-secret-key-change-in-production"
echo.
echo # 应用配置
echo NODE_ENV="development"
) > .env

REM 安装依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    call npm install
)

REM 初始化数据库
echo 🔧 初始化数据库...
call npm run db:generate
call npm run db:push
call npm run db:seed

echo.
echo ✅ 启动成功！
echo.
echo 🌐 访问地址: http://localhost:3000
echo.
echo 📱 测试账户:
echo    学员: student@example.com / student123
echo    管理员: admin@example.com / admin123
echo.
echo 🚀 正在启动开发服务器...
echo.

REM 启动开发服务器
call npm run dev

pause
