# 🚀 Vercel 环境变量配置 - 完整步骤

## ✅ Railway 数据库已准备好

```
DATABASE_URL=postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway
```

---

## 📋 Vercel 配置步骤

### 1️⃣ 访问 Vercel 项目设置

1. 打开 https://vercel.com/dashboard
2. 找到你的项目（VisaInterview）
3. 点击项目进入
4. 点击顶部 **"Settings"** 标签
5. 左侧菜单选择 **"Environment Variables"**

---

### 2️⃣ 添加环境变量（复制粘贴）

#### 变量 1: DATABASE_URL ⭐
```
Name: DATABASE_URL
Value: postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway
Environment: ✅ Production  ✅ Preview  ✅ Development
```
**点击 "Add" 保存**

---

#### 变量 2: NEXTAUTH_SECRET ⭐
```
Name: NEXTAUTH_SECRET
Value: aeEo/zBP5e4GZPOfIsgKNBLEQvApVJaXGiGvB/NwlIU=
Environment: ✅ Production  ✅ Preview  ✅ Development
```
**点击 "Add" 保存**

---

#### 变量 3: NEXTAUTH_URL ⭐
```
Name: NEXTAUTH_URL
Value: https://你的项目名.vercel.app
Environment: ✅ Production  ✅ Preview  ✅ Development
```

**⚠️ 重要：**
- 第一次先填占位符：`https://temp.vercel.app`
- 部署成功后，回来更新为实际域名
- 实际域名可以在 Vercel 项目主页看到

**点击 "Add" 保存**

---

#### 变量 4: NODE_ENV ⭐
```
Name: NODE_ENV
Value: production
Environment: ✅ Production only
```
**点击 "Add" 保存**

---

#### 变量 5: ELEVENLABS_API_KEY (可选)
```
Name: ELEVENLABS_API_KEY
Value: sk_1ff152822e10e109788998feb1c30c753e49e6afa49d6ec6
Environment: ✅ Production  ✅ Preview  ✅ Development
```
**点击 "Add" 保存**

---

### 3️⃣ 重新部署

1. 返回项目主页（点击顶部项目名）
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击右侧的 **"..."** 菜单
5. 选择 **"Redeploy"**
6. 确认重新部署

---

### 4️⃣ 等待部署完成（2-3分钟）

部署过程中会：
- ✅ 安装依赖
- ✅ 生成 Prisma Client
- ✅ 构建 Next.js
- ✅ 运行数据库迁移

---

### 5️⃣ 获取实际域名并更新

1. 部署成功后，点击 **"Visit"** 按钮
2. 复制浏览器地址栏的域名（例如：`https://visa-interview-abc123.vercel.app`）
3. 返回 Settings → Environment Variables
4. 找到 `NEXTAUTH_URL`，点击编辑
5. 更新为实际域名
6. 保存后再次 Redeploy

---

### 6️⃣ 初始化数据库（重要！）

部署成功后，需要添加测试用户和题目。

在本地运行：
```bash
# 设置数据库连接
export DATABASE_URL="postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway"

# 运行数据库种子脚本
npx prisma db seed
```

这会创建：
- 管理员账号：admin@example.com / Admin@123
- 学生账号：student@example.com / Student@123
- 221 道面试题目

---

## ✅ 验证部署

### 测试步骤：

1. **访问你的网站**
   - https://你的域名.vercel.app

2. **尝试注册/登录**
   - 使用测试账号登录
   - 或者注册新账号

3. **测试面试功能**
   - 学生端：开始新面试
   - 管理端：查看题库

---

## 🐛 常见问题

### Q: 部署失败？
**A:** 检查环境变量是否全部添加，特别是 DATABASE_URL

### Q: 能访问网站但是报错？
**A:** 可能是数据库迁移没运行，检查 Vercel 部署日志

### Q: 登录失败？
**A:** 确保 NEXTAUTH_URL 已更新为实际域名

### Q: 没有题目？
**A:** 需要运行种子脚本初始化数据

---

## 📞 完成后

告诉我部署结果：
- ✅ 成功：发给我网站链接！
- ❌ 失败：把错误信息发给我

我会帮你解决任何问题！
