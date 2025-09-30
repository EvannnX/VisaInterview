# 🔧 修复 Vercel 环境变量错误

## ❌ 错误信息
```
Environment Variable "DATABASE_URL" references Secret "database_url", which does not exist.
```

---

## 🔍 原因

Vercel 项目中已经存在一个旧的 `DATABASE_URL` 环境变量，它引用了一个不存在的 Secret。

这通常发生在：
- 之前尝试配置过但失败了
- 或者使用了 Vercel CLI/API 创建了错误的配置

---

## ✅ 解决方法（3分钟）

### 方法 1：删除旧变量，添加新变量（推荐）

#### 步骤 1：删除旧的 DATABASE_URL

1. 在 Vercel 项目中
2. Settings → Environment Variables
3. 找到 `DATABASE_URL` 变量
4. 点击右侧的 **"..."** 或 **垃圾桶图标**
5. 选择 **"Remove"** 或 **"Delete"**
6. 确认删除

#### 步骤 2：重新添加正确的 DATABASE_URL

1. 在同一页面（Environment Variables）
2. 点击 **"Add Variable"** 或输入框
3. 填写：
   ```
   Name: DATABASE_URL
   Value: postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway
   ```
4. **重要**：选择环境
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. 点击 **"Save"** 或 **"Add"**

#### 步骤 3：添加其他变量

继续添加剩余的 4 个变量：

**NEXTAUTH_SECRET**
```
Name: NEXTAUTH_SECRET
Value: aeEo/zBP5e4GZPOfIsgKNBLEQvApVJaXGiGvB/NwlIU=
Environments: Production + Preview + Development
```

**NEXTAUTH_URL**
```
Name: NEXTAUTH_URL
Value: https://temp.vercel.app
Environments: Production + Preview + Development
```

**NODE_ENV**
```
Name: NODE_ENV
Value: production
Environments: Production only
```

**ELEVENLABS_API_KEY** (可选)
```
Name: ELEVENLABS_API_KEY
Value: sk_1ff152822e10e109788998feb1c30c753e49e6afa49d6ec6
Environments: Production + Preview + Development
```

---

### 方法 2：使用 Vercel CLI（如果方法 1 不行）

如果在网页界面无法删除变量：

#### 1. 安装 Vercel CLI（如果还没有）
```bash
npm i -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 链接项目
```bash
cd /Users/evan/Desktop/签证面试
vercel link
```

#### 4. 删除旧变量
```bash
vercel env rm DATABASE_URL production
vercel env rm DATABASE_URL preview
vercel env rm DATABASE_URL development
```

#### 5. 添加新变量
```bash
echo "postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway" | vercel env add DATABASE_URL production
echo "postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway" | vercel env add DATABASE_URL preview
echo "postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway" | vercel env add DATABASE_URL development
```

---

### 方法 3：删除项目重新导入（最后手段）

如果上述方法都不行：

1. 在 Vercel Dashboard
2. 进入项目 Settings
3. 滚动到底部，找到 **"Delete Project"**
4. 删除项目
5. 重新 **"Add New Project"**
6. 选择 GitHub 仓库 `EvannnX/VisaInterview`
7. 配置环境变量（这次不会有冲突）
8. 部署

---

## 💡 关键提示

### 添加环境变量时的注意事项：

1. **直接粘贴值**
   - 不要使用 Secret 引用
   - 直接把完整的数据库连接字符串粘贴到 Value 字段

2. **不要使用这种格式**
   ```
   ❌ ${{ secrets.database_url }}
   ❌ @database_url
   ```

3. **使用这种格式**
   ```
   ✅ postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway
   ```

---

## ✅ 验证配置

配置完成后：

1. 检查所有 5 个变量都已添加
2. 确保每个变量都选择了正确的环境
3. 点击 **"Deployments"** 标签
4. 最新部署 → "..." → **"Redeploy"**

---

## 📞 完成后

告诉我：
- ✅ "变量配置好了，正在重新部署"
- 或者
- ❌ "还是有问题：[错误信息]"

我会继续帮你！
