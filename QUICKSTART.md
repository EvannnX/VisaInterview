# 快速开始指南

5分钟快速启动签证面试模拟系统！

## 方式一：自动安装（推荐）

```bash
# 运行安装脚本
./scripts/setup.sh

# 配置数据库（编辑 .env 文件）
# DATABASE_URL="postgresql://user:password@localhost:5432/visa_interview"

# 初始化数据库
npm run db:push
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 方式二：Docker 一键部署

```bash
# 启动所有服务（包括数据库）
docker-compose up -d

# 初始化数据库
docker exec -it visa_interview_app npx prisma db push
docker exec -it visa_interview_app npx prisma db seed

# 查看日志
docker-compose logs -f
```

访问 http://localhost:3000

## 方式三：手动安装

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/visa_interview?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

生成随机密钥：
```bash
openssl rand -base64 32
```

### 3. 数据库设置

确保 PostgreSQL 正在运行，然后：

```bash
# 生成 Prisma 客户端
npm run db:generate

# 创建数据库表
npm run db:push

# 填充测试数据
npm run db:seed
```

### 4. 启动应用

```bash
npm run dev
```

## 测试账户

登录系统使用以下测试账户：

### 学员账户
- 邮箱: `student@example.com`
- 密码: `student123`

### 管理员账户
- 邮箱: `admin@example.com`
- 密码: `admin123`

## 主要功能测试

### 作为学员
1. 登录学员账户
2. 点击"开始新面试"
3. 选择签证类型（如 F1 学生签证）
4. 选择面试官口音（如美式英语）
5. 开始面试
6. 播放问题 → 录音回答 → 下一题
7. 完成面试查看报告

### 作为管理员
1. 登录管理员账户
2. 进入"题库管理"
3. 查看/编辑/删除题目
4. 添加新题目
5. 查看学员成绩

## 常见问题

### Q: 数据库连接失败
A: 确保 PostgreSQL 正在运行，检查 `.env` 中的 `DATABASE_URL` 是否正确

### Q: 端口 3000 已被占用
A: 修改端口：
```bash
PORT=3001 npm run dev
```

### Q: Prisma 错误
A: 重新生成客户端：
```bash
npm run db:generate
```

### Q: 录音功能不工作
A: 
- 检查浏览器权限（需要允许麦克风访问）
- 使用 HTTPS 或 localhost（HTTP 在非本地环境无法访问麦克风）

## 下一步

- 📖 阅读 [README.md](./README.md) 了解完整功能
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 学习生产部署
- 🤝 参考 [CONTRIBUTING.md](./CONTRIBUTING.md) 参与开发

## 获取帮助

- 查看文档
- 提交 GitHub Issue
- 加入讨论区

祝你使用愉快！🎉
