# 🚀 部署指南：Vercel + Railway

完整部署签证面试系统到云端，实现在线访问。

---

## 📋 部署架构

```
┌─────────────────────────────────────────┐
│          Vercel（应用层）                │
│  - Next.js 应用                          │
│  - API 路由                              │
│  - 前端页面                              │
│  - 免费：100GB 流量/月                   │
└──────────────┬──────────────────────────┘
               │
               ↓ (连接)
┌──────────────────────────────────────────┐
│        Railway（数据库层）                │
│  - PostgreSQL 数据库                      │
│  - 自动备份                               │
│  - 免费：$5 额度/月                       │
└──────────────────────────────────────────┘
```

---

## 🎯 部署步骤总览

1. **Railway**：部署 PostgreSQL 数据库（5分钟）
2. **Vercel**：部署 Next.js 应用（5分钟）
3. **配置**：连接数据库和环境变量（3分钟）
4. **测试**：验证部署成功（2分钟）

**总计：约 15 分钟**

---

## 第一部分：Railway 部署数据库

### 步骤 1：注册 Railway

1. 访问：https://railway.app/
2. 点击 "Start a New Project"
3. 使用 GitHub 账号登录（推荐）

### 步骤 2：创建 PostgreSQL 数据库

1. 点击 "New Project"
2. 选择 "Provision PostgreSQL"
3. 等待创建完成（约 30 秒）

### 步骤 3：获取数据库连接字符串

1. 点击创建的 PostgreSQL 服务
2. 切换到 "Connect" 标签
3. 找到 "Postgres Connection URL"
4. 点击复制按钮

格式类似：
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:6543/railway
```

**⚠️ 保存好这个连接字符串，稍后会用到！**

### 步骤 4：配置数据库（可选但推荐）

在 Railway 项目中：
1. 点击 "Settings"
2. 启用 "Public Networking"（如果需要外部访问）
3. 设置自动备份

---

## 第二部分：Vercel 部署应用

### 步骤 1：准备代码仓库

#### 方法 1：使用 GitHub（推荐）

```bash
# 1. 初始化 Git（如果还没有）
cd /Users/evan/Desktop/签证面试
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit - 签证面试系统"

# 4. 在 GitHub 创建新仓库
# 访问：https://github.com/new
# 仓库名：visa-interview-system
# 设置为 Private（推荐）

# 5. 关联远程仓库
git remote add origin https://github.com/你的用户名/visa-interview-system.git

# 6. 推送代码
git branch -M main
git push -u origin main
```

#### 方法 2：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 步骤 2：连接 Vercel 到 GitHub

1. 访问：https://vercel.com/
2. 使用 GitHub 登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

### 步骤 3：配置环境变量

在 Vercel 项目设置中：

1. 进入 "Settings" → "Environment Variables"
2. 添加以下变量：

```bash
# 数据库连接（从 Railway 复制）
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:6543/railway

# NextAuth 配置
NEXTAUTH_URL=https://你的应用.vercel.app
NEXTAUTH_SECRET=生成一个随机字符串

# ElevenLabs TTS
ELEVENLABS_API_KEY=sk_1ff152822e10e109788998feb1c30c753e49e6afa49d6ec6

# OpenAI（可选，用于翻译）
OPENAI_API_KEY=sk-your-openai-key
```

#### 🔐 生成 NEXTAUTH_SECRET

```bash
# 方法 1：使用 OpenSSL
openssl rand -base64 32

# 方法 2：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3：在线生成
# 访问：https://generate-secret.vercel.app/32
```

### 步骤 4：配置构建设置

在 Vercel 项目设置中：

**Build & Development Settings**：
- Framework Preset: `Next.js`
- Build Command: `npm run vercel-build`
- Output Directory: `.next`
- Install Command: `npm install`

**Root Directory**: `.` (保持默认)

### 步骤 5：部署

1. 点击 "Deploy"
2. 等待构建完成（约 2-5 分钟）
3. 部署成功后会显示 URL

---

## 第三部分：数据库迁移

部署成功后，需要运行数据库迁移：

### 方法 1：使用 Vercel CLI

```bash
# 1. 安装依赖
npm install -g vercel

# 2. 登录
vercel login

# 3. 链接项目
vercel link

# 4. 拉取环境变量
vercel env pull

# 5. 运行迁移
npx prisma migrate deploy

# 6. 运行种子数据（可选）
npx tsx prisma/seed.ts
```

### 方法 2：使用 Railway CLI

```bash
# 1. 安装 Railway CLI
npm i -g @railway/cli

# 2. 登录
railway login

# 3. 连接到项目
railway link

# 4. 运行迁移
railway run npx prisma migrate deploy

# 5. 运行种子数据
railway run npx tsx prisma/seed.ts
```

### 方法 3：手动执行（推荐）

创建一个临时脚本：

```bash
# 在本地运行
DATABASE_URL="你的Railway数据库URL" npx prisma migrate deploy
DATABASE_URL="你的Railway数据库URL" npx tsx prisma/seed.ts
```

---

## 第四部分：验证部署

### 1. 检查应用是否运行

访问你的 Vercel URL：
```
https://你的应用.vercel.app
```

应该看到登录页面。

### 2. 测试登录

使用默认账号：
- 学员：`student@example.com` / `student123`
- 管理员：`admin@example.com` / `admin123`

### 3. 测试语音功能

1. 登录后开始新面试
2. 点击播放问题
3. 验证 ElevenLabs TTS 是否工作

### 4. 检查数据库

在 Railway 中：
1. 进入 PostgreSQL 服务
2. 点击 "Data" 标签
3. 查看表是否创建成功

---

## 🔧 常见问题排查

### 问题 1：构建失败

**错误**：`Error: Command "npm run vercel-build" exited with 1`

**解决**：
1. 检查 `package.json` 中的 scripts
2. 确保 Prisma 配置正确
3. 查看构建日志找到具体错误

### 问题 2：数据库连接失败

**错误**：`Can't reach database server`

**解决**：
1. 检查 `DATABASE_URL` 是否正确
2. 确认 Railway 数据库正在运行
3. 检查网络连接
4. 确保在 Railway 中启用了 Public Networking

### 问题 3：环境变量未生效

**错误**：API Key 相关错误

**解决**：
1. 在 Vercel 中检查环境变量
2. 确保变量名正确（无拼写错误）
3. 重新部署应用（环境变量更改需要重新部署）

### 问题 4：TTS 不工作

**错误**：仍然使用浏览器 TTS

**解决**：
1. 检查 Vercel 中是否配置了 `ELEVENLABS_API_KEY`
2. 验证 API Key 是否有效
3. 检查浏览器控制台错误

### 问题 5：Prisma 迁移失败

**错误**：`Migration failed`

**解决**：
```bash
# 重置数据库（警告：会删除所有数据）
DATABASE_URL="你的Railway URL" npx prisma migrate reset

# 重新运行迁移
DATABASE_URL="你的Railway URL" npx prisma migrate deploy
```

---

## 🎨 自定义域名（可选）

### 在 Vercel 中添加域名

1. 进入项目设置
2. 点击 "Domains"
3. 添加你的域名
4. 按照提示配置 DNS

#### DNS 配置示例

**A 记录**：
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 记录**：
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 💰 费用说明

### Vercel 免费套餐

- ✅ 100GB 带宽/月
- ✅ 无限部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 对个人项目完全免费

### Railway 免费套餐

- ✅ $5 免费额度/月
- ✅ 约 500 小时运行时间
- ✅ 自动备份
- ✅ 足够小规模使用

**总结**：对于个人学习和小规模使用，完全免费！

---

## 📊 监控和维护

### Vercel 监控

在 Vercel 项目中查看：
- 部署历史
- 运行日志
- 性能分析
- 错误追踪

### Railway 监控

在 Railway 项目中查看：
- 数据库使用量
- 连接数
- 查询性能
- 自动备份状态

### 定期维护

**每周**：
- 检查应用运行状态
- 查看错误日志

**每月**：
- 检查 Railway 额度使用
- 备份重要数据
- 更新依赖包

---

## 🔐 安全最佳实践

### 1. 环境变量安全

- ✅ 不要在代码中硬编码密钥
- ✅ 使用 Vercel 的环境变量功能
- ✅ 定期轮换 API Keys
- ✅ 使用强随机的 NEXTAUTH_SECRET

### 2. 数据库安全

- ✅ 使用强密码
- ✅ 启用 SSL 连接
- ✅ 定期备份
- ✅ 限制访问 IP（如需要）

### 3. API 安全

- ✅ 使用 NextAuth 保护路由
- ✅ 实施速率限制
- ✅ 验证用户输入
- ✅ 记录可疑活动

---

## 🚀 高级配置

### 1. 自动部署

在 GitHub 中设置：
- 推送到 `main` 分支自动部署到生产环境
- 推送到 `dev` 分支自动部署到预览环境

### 2. 性能优化

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}
```

### 3. 缓存策略

```javascript
// API 路由中
export async function GET(request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

---

## 📱 部署后优化

### 1. 添加分析

```bash
# 安装 Vercel Analytics
npm install @vercel/analytics

# 在 app/layout.tsx 中添加
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. SEO 优化

在 `app/layout.tsx` 中：

```typescript
export const metadata = {
  title: '签证面试模拟系统',
  description: '专业的签证面试训练平台，支持多种口音和真实场景模拟',
  keywords: ['签证面试', 'F1签证', 'B1B2签证', '面试训练'],
};
```

---

## ✅ 部署检查清单

部署前：
- [ ] 代码已提交到 GitHub
- [ ] Railway 数据库已创建
- [ ] 数据库连接字符串已保存
- [ ] ElevenLabs API Key 已准备
- [ ] NEXTAUTH_SECRET 已生成

部署中：
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 数据库迁移已运行

部署后：
- [ ] 应用可以访问
- [ ] 登录功能正常
- [ ] 语音播放正常
- [ ] 数据库读写正常
- [ ] 自定义域名已配置（可选）

---

## 🎉 完成！

现在你的签证面试系统已经上线了！

**你的应用地址**：`https://你的应用.vercel.app`

分享给朋友，随时随地练习签证面试！

---

## 📞 获取帮助

### 官方文档

- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app/
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs

### 社区支持

- Vercel Discord: https://discord.gg/vercel
- Railway Discord: https://discord.gg/railway
- Next.js Discussions: https://github.com/vercel/next.js/discussions

---

**最后更新**: 2025-09-30  
**版本**: Production Deployment Guide v1.0  
**状态**: ✅ Ready for Production
