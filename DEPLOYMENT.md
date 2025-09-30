# 部署指南

本文档介绍如何部署签证面试模拟系统。

## 目录

- [本地开发部署](#本地开发部署)
- [Docker 部署](#docker-部署)
- [生产环境部署](#生产环境部署)
- [环境变量配置](#环境变量配置)

---

## 本地开发部署

### 前置要求

- Node.js 18+ 
- PostgreSQL 15+
- npm 或 pnpm

### 步骤

1. **克隆项目**

```bash
cd /Users/evan/Desktop/签证面试
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

复制 `env.example` 为 `.env` 并填写配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/visa_interview?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. **初始化数据库**

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模型
npm run db:push

# 填充种子数据（包含测试账户和题目）
npm run db:seed
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 http://localhost:3000

### 测试账户

- **学员账户**: student@example.com / student123
- **管理员账户**: admin@example.com / admin123

---

## Docker 部署

### 使用 Docker Compose（推荐）

1. **构建并启动所有服务**

```bash
docker-compose up -d
```

这将启动：
- PostgreSQL 数据库（端口 5432）
- Next.js 应用（端口 3000）

2. **初始化数据库**

```bash
# 进入容器
docker exec -it visa_interview_app sh

# 运行数据库迁移
npx prisma db push

# 填充种子数据
npx prisma db seed

# 退出容器
exit
```

3. **查看日志**

```bash
docker-compose logs -f
```

4. **停止服务**

```bash
docker-compose down
```

5. **完全清理（包括数据）**

```bash
docker-compose down -v
```

---

## 生产环境部署

### Vercel 部署（推荐）

1. **准备数据库**

推荐使用：
- [Supabase](https://supabase.com/) - 免费的 PostgreSQL
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Railway](https://railway.app/) - 一键部署数据库

2. **部署到 Vercel**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

3. **配置环境变量**

在 Vercel Dashboard 中添加环境变量：
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY` (可选)
- `AZURE_SPEECH_KEY` (可选)

4. **运行数据库迁移**

在本地连接生产数据库：

```bash
DATABASE_URL="你的生产数据库URL" npx prisma db push
DATABASE_URL="你的生产数据库URL" npx prisma db seed
```

### 其他平台部署

#### Railway

1. 创建新项目
2. 添加 PostgreSQL 数据库
3. 连接 GitHub 仓库
4. Railway 会自动检测 Dockerfile 并构建

#### DigitalOcean App Platform

1. 创建新应用
2. 选择 Docker Hub 或 GitHub
3. 配置环境变量
4. 添加托管数据库

---

## 环境变量配置

### 必需变量

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth 认证
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="生成方式: openssl rand -base64 32"
```

### 可选变量（增强功能）

```env
# OpenAI API（用于智能评分）
OPENAI_API_KEY="sk-..."

# Azure Speech Services（用于 TTS 和 ASR）
AZURE_SPEECH_KEY="your-key"
AZURE_SPEECH_REGION="eastus"

# AWS S3（用于录音文件存储）
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="visa-interview-recordings"
```

---

## 性能优化

### 1. 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_questions_visa_type ON questions(visa_type);
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
```

### 2. CDN 配置

建议使用 CDN 加速静态资源：
- Vercel 自带 CDN
- Cloudflare Pages
- AWS CloudFront

### 3. 缓存策略

在 `next.config.js` 中配置缓存：

```js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  // 启用 SWC 压缩
  swcMinify: true,
};
```

---

## 监控和日志

### Sentry 错误追踪

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 数据库监控

使用 Prisma Pulse 或 pgAdmin 监控数据库性能。

---

## 备份策略

### 数据库备份

```bash
# 导出数据库
pg_dump -U user -d visa_interview > backup.sql

# 恢复数据库
psql -U user -d visa_interview < backup.sql
```

### 自动备份（cron job）

```bash
# 添加到 crontab
0 2 * * * pg_dump -U user visa_interview > /backups/db_$(date +\%Y\%m\%d).sql
```

---

## 常见问题

### Q: 数据库连接失败

A: 检查 `DATABASE_URL` 格式和数据库是否运行

### Q: NextAuth 错误

A: 确保 `NEXTAUTH_SECRET` 已设置且 `NEXTAUTH_URL` 正确

### Q: TTS/ASR 不工作

A: 检查 Azure Speech Services 配置或使用浏览器内置功能

---

## 技术支持

- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- 文档: [查看文档](https://your-docs-site.com)
