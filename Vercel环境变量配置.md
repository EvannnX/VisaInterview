# Vercel 环境变量配置清单

## 🎯 快速配置指南

### 第一步：Railway 数据库
1. 访问 https://railway.app/dashboard
2. 点击你的 PostgreSQL 服务
3. 找到 `DATABASE_URL` 并复制

### 第二步：Vercel 环境变量
1. 访问 https://vercel.com/dashboard
2. 点击项目 → Settings → Environment Variables
3. 添加以下变量：

---

## 📋 必需的环境变量

### 1. DATABASE_URL
```
变量名：DATABASE_URL
值：postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:6543/railway
环境：✅ Production  ✅ Preview  ✅ Development
```
**从 Railway 复制！**

---

### 2. NEXTAUTH_SECRET
```
变量名：NEXTAUTH_SECRET
值：aeEo/zBP5e4GZPOfIsgKNBLEQvApVJaXGiGvB/NwlIU=
环境：✅ Production  ✅ Preview  ✅ Development
```
**随机生成的密钥，用于加密会话**

或者自己生成：
```bash
openssl rand -base64 32
```

---

### 3. NEXTAUTH_URL
```
变量名：NEXTAUTH_URL
值：https://your-project-name.vercel.app
环境：✅ Production  ✅ Preview  ✅ Development
```
**替换为你的实际 Vercel 域名**

第一次部署后，Vercel 会分配一个域名，回来更新这个值。

---

### 4. NODE_ENV
```
变量名：NODE_ENV
值：production
环境：✅ Production
```

---

## 🎤 可选的环境变量（语音服务）

### 5. ELEVENLABS_API_KEY
```
变量名：ELEVENLABS_API_KEY
值：sk_1ff152822e10e109788998feb1c30c753e49e6afa49d6ec6
环境：✅ Production  ✅ Preview  ✅ Development
```
**你的 ElevenLabs API Key**

---

## ✅ 配置检查清单

- [ ] 从 Railway 获取 `DATABASE_URL`
- [ ] 在 Vercel 添加 `DATABASE_URL`
- [ ] 在 Vercel 添加 `NEXTAUTH_SECRET`
- [ ] 在 Vercel 添加 `NEXTAUTH_URL`（先用占位符）
- [ ] 在 Vercel 添加 `NODE_ENV`
- [ ] 在 Vercel 添加 `ELEVENLABS_API_KEY`（可选）
- [ ] 保存所有变量
- [ ] 重新部署项目

---

## 🚀 部署后步骤

### 1. 获取 Vercel 域名
部署成功后，访问你的项目，复制域名（例如：`https://visa-interview-abc123.vercel.app`）

### 2. 更新 NEXTAUTH_URL
返回 Vercel Settings → Environment Variables，更新 `NEXTAUTH_URL` 为实际域名

### 3. 再次重新部署
更新环境变量后，需要重新部署才能生效

### 4. 运行数据库迁移
```bash
npx prisma migrate deploy
```

### 5. 初始化数据（添加测试用户和题目）
```bash
npm run db:seed
```

---

## ❓ 常见问题

### Q: Railway 显示构建错误？
**A:** Railway 应该只有 PostgreSQL 数据库服务，不要连接 GitHub 仓库。如果有其他服务，请删除。

### Q: Vercel 部署失败？
**A:** 检查所有环境变量是否配置正确，特别是 `DATABASE_URL`。

### Q: 如何重新部署？
**A:** Vercel Dashboard → Deployments → 最新部署 → "..." 菜单 → Redeploy

---

## 📞 需要帮助？

完成配置后，告诉我结果！我会帮你：
1. 运行数据库迁移
2. 初始化测试数据
3. 测试部署是否成功
