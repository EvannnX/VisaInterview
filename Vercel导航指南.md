# 🗺️ Vercel 导航指南 - 如何找到环境变量设置

## ⚠️ 常见错误

很多人会在这些页面尝试配置环境变量：
- ❌ Create Deployment（创建部署页面）
- ❌ Deployments 列表
- ❌ 项目主页

**正确的位置：Settings → Environment Variables**

---

## ✅ 正确的导航路径

### 从项目主页开始：

```
项目主页
    ↓
点击顶部 "Settings" 标签
    ↓
左侧菜单 "Environment Variables"
    ↓
在这里管理所有环境变量！
```

---

## 📸 视觉导航

### 1. 项目主页

你会看到：
- 顶部导航栏：**Overview** | **Deployments** | **Analytics** | **Logs** | **Settings**
- 点击 **"Settings"**

### 2. Settings 页面

左侧菜单会显示：
- General
- Domains
- Git
- **Environment Variables** ← 点这个！
- Build & Development Settings
- Functions
- Security
- Integrations
- Team
- Billing

### 3. Environment Variables 页面

这个页面会显示：
- 顶部：输入框用于添加新变量
- 中间：当前所有环境变量列表
- 每个变量右侧：编辑/删除按钮

---

## 🔧 删除旧的 DATABASE_URL

### 在 Environment Variables 页面：

1. **找到 DATABASE_URL**
   - 向下滚动查看所有变量
   - 可能显示为红色或错误状态
   - 可能显示 "references Secret database_url"

2. **删除它**
   - 点击变量右侧的 **"..."** 菜单
   - 或者点击垃圾桶图标 🗑️
   - 选择 **"Remove"** 或 **"Delete"**
   - 确认删除

3. **确认删除成功**
   - DATABASE_URL 应该从列表中消失
   - 如果还在，刷新页面

---

## ➕ 添加新的环境变量

### 在同一页面：

1. **找到添加区域**
   - 页面顶部
   - 可能有两种界面：
     - **方式 A**：直接有输入框（Key、Value、Environment）
     - **方式 B**：有 "Add New" 或 "Add Variable" 按钮

2. **填写变量**
   ```
   Key/Name: DATABASE_URL
   Value: postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway
   ```

3. **选择环境**
   - 勾选：✅ Production
   - 勾选：✅ Preview
   - 勾选：✅ Development

4. **保存**
   - 点击 "Save" 或 "Add" 按钮

---

## 📋 需要添加的 5 个变量

### 1. DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://postgres:TCGaTwstfLkQsVHnBoRbJPqoYeeQoSJA@shortline.proxy.rlwy.net:36230/railway
Env: Production + Preview + Development
```

### 2. NEXTAUTH_SECRET
```
Key: NEXTAUTH_SECRET
Value: aeEo/zBP5e4GZPOfIsgKNBLEQvApVJaXGiGvB/NwlIU=
Env: Production + Preview + Development
```

### 3. NEXTAUTH_URL
```
Key: NEXTAUTH_URL
Value: https://temp.vercel.app
Env: Production + Preview + Development
```

### 4. NODE_ENV
```
Key: NODE_ENV
Value: production
Env: Production only
```

### 5. ELEVENLABS_API_KEY
```
Key: ELEVENLABS_API_KEY
Value: sk_1ff152822e10e109788998feb1c30c753e49e6afa49d6ec6
Env: Production + Preview + Development
```

---

## 🚀 完成后重新部署

### 不要在 Settings 页面停留！

1. **返回项目主页**
   - 点击顶部的项目名称
   - 或者点击左上角的返回按钮

2. **进入 Deployments**
   - 点击顶部的 "Deployments" 标签

3. **触发重新部署**
   - 找到最新的部署（第一行）
   - 点击右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 确认

---

## ❓ 常见问题

### Q: 找不到 Settings 标签？
**A:** 你可能没有项目权限。确保你是项目所有者或有管理员权限。

### Q: Environment Variables 菜单是灰色的？
**A:** 刷新页面，或者退出重新登录 Vercel。

### Q: 删除按钮找不到？
**A:** 鼠标悬停在变量上，右侧会出现操作按钮。或者使用 Vercel CLI。

### Q: 添加后还是显示错误？
**A:** 确保完全删除了旧变量，不只是编辑它。然后刷新页面。

---

## 📞 完成检查清单

在重新部署之前，确认：

- [ ] 已经进入 Settings → Environment Variables 页面
- [ ] 已删除旧的 DATABASE_URL（如果存在）
- [ ] 已添加新的 DATABASE_URL（直接粘贴完整 URL）
- [ ] 已添加 NEXTAUTH_SECRET
- [ ] 已添加 NEXTAUTH_URL
- [ ] 已添加 NODE_ENV
- [ ] 已添加 ELEVENLABS_API_KEY（可选）
- [ ] 每个变量都选择了正确的环境
- [ ] 已保存所有变量

完成后，告诉我，我会指导你重新部署！
