# 🎯 开始使用 - 签证面试模拟系统

欢迎！这是一个完整的签证面试模拟系统，已经为你搭建完成。

## 📋 系统概述

这是一个基于题库驱动的签证面试模拟平台，支持：

✅ 多签证类型（F1、H1B、B1/B2、J1、L1）  
✅ 语音问答（TTS播放 + 录音回答 + ASR转写）  
✅ 智能评分（内容、语言、表现、风险四维度）  
✅ 详细报告（优缺点分析 + 改进建议）  
✅ 题库管理（管理员可增删改查）  
✅ 双角色系统（学员 + 管理员）

## 🚀 快速启动（3步）

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 配置数据库

创建 `.env` 文件（复制 `env.example`）：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/visa_interview?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

> 💡 生成密钥: `openssl rand -base64 32`

### 步骤 3: 初始化并启动

```bash
# 生成 Prisma 客户端
npm run db:generate

# 创建数据库表
npm run db:push

# 填充测试数据（包含题目和账户）
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 🎉

## 👤 测试账户

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 学员 | student@example.com | student123 |
| 管理员 | admin@example.com | admin123 |

## 📁 项目结构

```
签证面试/
├── app/                          # Next.js 应用目录
│   ├── (auth)/                  # 认证页面（登录、注册）
│   ├── (student)/               # 学员端页面
│   │   ├── dashboard/          # 学员仪表盘
│   │   ├── interview/          # 面试相关
│   │   └── reports/            # 报告查看
│   ├── (admin)/                # 管理员后台
│   │   └── admin/              # 题库管理、成绩查看
│   ├── api/                    # API 路由
│   │   ├── auth/              # 认证接口
│   │   ├── questions/         # 题库接口
│   │   ├── interview/         # 面试接口
│   │   ├── speech/            # 语音服务
│   │   └── reports/           # 报告接口
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 首页
├── components/                 # React 组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Navbar.tsx
├── lib/                        # 工具库
│   ├── prisma.ts              # Prisma 客户端
│   ├── auth.ts                # NextAuth 配置
│   ├── speech.ts              # 语音服务
│   ├── scoring.ts             # 评分系统
│   └── utils.ts               # 工具函数
├── prisma/                     # 数据库
│   ├── schema.prisma          # 数据模型
│   └── seed.ts                # 种子数据
├── scripts/                    # 脚本
│   └── setup.sh               # 安装脚本
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript 配置
├── tailwind.config.ts         # Tailwind 配置
├── next.config.js             # Next.js 配置
├── Dockerfile                 # Docker 配置
├── docker-compose.yml         # Docker Compose
├── README.md                  # 项目说明
├── QUICKSTART.md              # 快速开始
├── DEPLOYMENT.md              # 部署指南
└── CONTRIBUTING.md            # 贡献指南
```

## 🎮 功能演示

### 学员端功能

1. **注册/登录** → 使用测试账户或注册新账户
2. **选择签证类型** → F1、H1B、B1/B2 等
3. **选择口音** → 美式、英式、印度、澳洲等
4. **开始面试** → 系统播放问题，学员录音回答
5. **查看报告** → 查看评分、反馈和改进建议

### 管理员后台

1. **题库管理** → 查看、添加、编辑、删除题目
2. **成绩查看** → 查看所有学员的面试记录
3. **数据统计** → 查看系统使用统计

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 14 | 全栈框架 |
| React 18 | 前端框架 |
| TypeScript | 类型安全 |
| Prisma | ORM |
| PostgreSQL | 数据库 |
| NextAuth.js | 认证 |
| TailwindCSS | 样式 |
| Azure Speech | 语音服务（可选）|
| OpenAI GPT-4 | AI评分（可选）|

## 🔧 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 数据库
npm run db:generate      # 生成 Prisma 客户端
npm run db:push          # 推送数据库架构
npm run db:migrate       # 创建迁移
npm run db:studio        # 打开 Prisma Studio
npm run db:seed          # 填充种子数据

# 其他
npm run lint             # 代码检查
```

## 🐳 Docker 部署

```bash
# 一键启动（包括数据库）
docker-compose up -d

# 初始化数据库
docker exec -it visa_interview_app npx prisma db push
docker exec -it visa_interview_app npx prisma db seed

# 停止服务
docker-compose down
```

## 📚 文档导航

- [完整文档](./README.md) - 详细功能说明
- [快速开始](./QUICKSTART.md) - 3种快速启动方式
- [部署指南](./DEPLOYMENT.md) - 生产环境部署
- [贡献指南](./CONTRIBUTING.md) - 如何参与开发

## ⚙️ 可选配置

### Azure Speech Services (推荐)

在生产环境中，建议配置 Azure Speech Services 以获得更好的语音体验：

```env
AZURE_SPEECH_KEY="your-azure-key"
AZURE_SPEECH_REGION="eastus"
```

### OpenAI API (推荐)

配置 OpenAI API 以启用智能评分：

```env
OPENAI_API_KEY="sk-..."
```

### AWS S3 (可选)

配置 S3 存储录音文件：

```env
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="visa-interview-recordings"
```

## ❓ 常见问题

### 数据库连接失败？
检查 PostgreSQL 是否运行，`DATABASE_URL` 是否正确

### 录音功能不工作？
- 允许浏览器访问麦克风
- 使用 HTTPS 或 localhost
- 检查浏览器兼容性（Chrome/Edge 推荐）

### 端口冲突？
```bash
PORT=3001 npm run dev
```

### Prisma 错误？
```bash
npm run db:generate
```

## 📞 获取帮助

- 查看文档
- 提交 GitHub Issue
- 查看现有 Issues

## 🎉 开始探索

现在一切就绪！

1. 启动项目: `npm run dev`
2. 打开浏览器: http://localhost:3000
3. 使用测试账户登录
4. 开始你的第一次模拟面试！

祝你使用愉快！🚀
