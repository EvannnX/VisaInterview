# 签证面试模拟系统

题库驱动的签证面试模拟平台，支持语音问答、自动评分和反馈报告生成。

## 功能特性

- ✅ 多签证类型支持（F1学生签证、H1B工作签证等）
- ✅ 题库管理系统（增删改查、批量导入导出）
- ✅ 多口音语音播放（美式、英式、印度、澳洲等）
- ✅ 语音识别与转写
- ✅ 智能评分系统（内容、语言、表现、风险四个维度）
- ✅ 详细反馈报告（支持PDF导出）
- ✅ 学员和管理员双角色系统
- ✅ 历史成绩追踪与对比

## 技术栈

- **前端**: Next.js 14 + React + TypeScript + TailwindCSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **语音**: Azure Speech Services (TTS + ASR)
- **AI评分**: OpenAI GPT-4
- **部署**: Docker + Docker Compose

## 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置环境变量

复制 \`.env.example\` 为 \`.env\` 并填写配置：

\`\`\`bash
cp .env.example .env
\`\`\`

### 3. 初始化数据库

\`\`\`bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模型
npm run db:push

# 运行种子数据
npm run db:seed
\`\`\`

### 4. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

### 默认账户

**学员账户**:
- 邮箱: student@example.com
- 密码: student123

**管理员账户**:
- 邮箱: admin@example.com
- 密码: admin123

## Docker 部署

\`\`\`bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
\`\`\`

## 项目结构

\`\`\`
├── app/                  # Next.js 应用目录
│   ├── api/             # API 路由
│   ├── (auth)/          # 认证页面
│   ├── (student)/       # 学员端页面
│   └── (admin)/         # 管理员端页面
├── components/          # React 组件
├── lib/                 # 工具库和配置
├── prisma/             # 数据库模型和种子数据
└── public/             # 静态资源
\`\`\`

## API 文档

### 认证相关
- POST \`/api/auth/register\` - 用户注册
- POST \`/api/auth/signin\` - 用户登录

### 题库管理
- GET \`/api/questions\` - 获取题目列表
- POST \`/api/questions\` - 创建题目
- PUT \`/api/questions/:id\` - 更新题目
- DELETE \`/api/questions/:id\` - 删除题目
- POST \`/api/questions/import\` - 批量导入
- GET \`/api/questions/export\` - 批量导出

### 面试相关
- POST \`/api/interview/start\` - 开始面试
- GET \`/api/interview/:id\` - 获取面试详情
- POST \`/api/interview/:id/answer\` - 提交答案
- POST \`/api/interview/:id/complete\` - 完成面试

### 语音相关
- POST \`/api/speech/tts\` - 文本转语音
- POST \`/api/speech/asr\` - 语音转文本

### 报告相关
- GET \`/api/reports/:id\` - 获取报告
- GET \`/api/reports/:id/pdf\` - 导出PDF报告

## 开发里程碑

- [x] MVP 基础架构搭建
- [ ] 完整题库系统（目标：500+题目）
- [ ] 多口音支持完善
- [ ] PDF报告优化
- [ ] 移动端适配
- [ ] 数据分析仪表盘

## 许可证

MIT License

