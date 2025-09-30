# TTS 故障排查指南

## ❌ 错误信息

```
Failed to generate speech. Using browser TTS as fallback...
```

这个错误说明专业 TTS 服务调用失败，系统已自动降级到浏览器 TTS。

---

## 🔍 原因分析

### 最常见原因：未配置 API Key

系统需要至少配置一个 TTS 服务的 API Key：
- `ELEVENLABS_API_KEY`（推荐）
- `OPENAI_API_KEY`（备选）
- `AZURE_SPEECH_KEY`（企业级）

---

## ✅ 解决方案

### 方案一：配置 ElevenLabs（推荐，1分钟）

#### 1. 注册免费账号

访问：https://elevenlabs.io/
- 点击 "Sign Up"
- 使用邮箱或 Google 账号注册
- 验证邮箱

#### 2. 获取 API Key

1. 登录后，点击右上角头像
2. 选择 "Profile"
3. 在页面中找到 "API Key" 部分
4. 点击 "Copy" 复制 API Key

#### 3. 创建 .env 文件

```bash
# 在项目根目录运行
cd /Users/evan/Desktop/签证面试

# 如果没有 .env 文件，从模板创建
cp env.example .env

# 或者直接创建
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visa_interview"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this

# ElevenLabs TTS (必填!)
ELEVENLABS_API_KEY=your-actual-api-key-here

# OpenAI (可选，用于翻译和备用TTS)
# OPENAI_API_KEY=sk-your-key
EOF
```

#### 4. 替换 API Key

```bash
# 用你的真实 API Key 替换
nano .env

# 找到这一行：
# ELEVENLABS_API_KEY=your-actual-api-key-here

# 改成：
# ELEVENLABS_API_KEY=sk_abc123xyz... (你的真实key)

# 保存：Ctrl+O, 回车, Ctrl+X
```

#### 5. 重启应用

```bash
# 停止当前运行
# 按 Ctrl+C

# 重新启动
npm run dev

# 或者如果用 Docker
docker-compose restart
```

#### 6. 测试

1. 访问 http://localhost:3000
2. 登录并开始新面试
3. 点击 "Play Question"
4. 应该能听到自然的声音，不再有错误提示

---

### 方案二：使用 OpenAI TTS

如果你已经有 OpenAI API Key：

```bash
# 编辑 .env
nano .env

# 添加
OPENAI_API_KEY=sk-your-openai-key-here

# 保存并重启
npm run dev
```

---

### 方案三：使用 Azure Speech

```bash
# 编辑 .env
nano .env

# 添加
AZURE_SPEECH_KEY=your-azure-key
AZURE_SPEECH_REGION=eastus

# 保存并重启
npm run dev
```

---

## 🔧 详细排查步骤

### 步骤 1：检查 .env 文件是否存在

```bash
cd /Users/evan/Desktop/签证面试
ls -la .env
```

**如果显示 "No such file"**：
```bash
# 创建 .env 文件
cp env.example .env
```

### 步骤 2：检查 API Key 是否配置

```bash
cat .env | grep ELEVENLABS
```

**如果没有输出或显示注释（#开头）**：
- 说明未配置或配置被注释
- 需要添加正确的 API Key

### 步骤 3：检查 API Key 格式

ElevenLabs API Key 格式：
```
ELEVENLABS_API_KEY=sk_abc123def456...
```

**常见错误**：
- ❌ 有引号：`ELEVENLABS_API_KEY="sk_abc..."`（不要引号）
- ❌ 有空格：`ELEVENLABS_API_KEY = sk_abc...`（等号两边不要空格）
- ❌ 被注释：`# ELEVENLABS_API_KEY=sk_abc...`（去掉#号）
- ✅ 正确：`ELEVENLABS_API_KEY=sk_abc123...`

### 步骤 4：检查应用是否重启

修改 .env 后必须重启应用：
```bash
# 停止：Ctrl+C
# 启动：
npm run dev
```

### 步骤 5：查看后端日志

启动后查看日志是否有错误：
```bash
# 应该看到类似信息：
# ✓ Ready in 2.3s
# ○ Local: http://localhost:3000
```

如果看到 TTS 相关错误：
```
ElevenLabs API error: 401 Unauthorized
```
- 说明 API Key 无效，需要重新获取

---

## 🎯 快速测试 API Key

创建测试脚本：

```bash
cat > test-tts.js << 'EOF'
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  console.log('❌ ELEVENLABS_API_KEY 未配置');
  process.exit(1);
}

console.log('✓ API Key 已配置:', apiKey.substring(0, 10) + '...');

fetch('https://api.elevenlabs.io/v1/voices', {
  headers: {
    'xi-api-key': apiKey
  }
})
.then(res => {
  if (res.ok) {
    console.log('✅ API Key 有效！');
  } else {
    console.log('❌ API Key 无效，状态码:', res.status);
  }
})
.catch(err => {
  console.log('❌ 网络错误:', err.message);
});
EOF

# 运行测试
node test-tts.js
```

---

## 📋 检查清单

完成以下检查：

- [ ] .env 文件存在
- [ ] ELEVENLABS_API_KEY 已配置
- [ ] API Key 没有引号
- [ ] API Key 没有被注释（#）
- [ ] 应用已重启
- [ ] 浏览器已刷新
- [ ] 能看到 API Key 在环境变量中

---

## 💡 验证配置成功

### 方法 1：查看浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 切换到 "Console" 标签
3. 点击播放问题
4. 如果配置正确，应该看到：
   - 发送请求到 `/api/speech/tts`
   - 收到音频响应
   - 没有错误信息

### 方法 2：查看网络请求

1. 开发者工具 → Network 标签
2. 点击播放问题
3. 找到 `tts` 请求
4. 检查状态码：
   - ✅ 200：成功
   - ❌ 500：服务器错误（API Key 问题）
   - ❌ 503：未配置服务

### 方法 3：听声音

配置成功后：
- ✅ 声音自然、流畅
- ✅ 不同口音有明显区别
- ✅ 没有 "fallback" 错误提示

配置失败时：
- ❌ 机械的朗读声
- ❌ 所有口音听起来一样
- ❌ 看到错误提示

---

## 🔴 常见错误及解决

### 错误 1：401 Unauthorized

```
ElevenLabs API error: 401 Unauthorized
```

**原因**：API Key 无效或过期

**解决**：
1. 重新登录 ElevenLabs
2. 生成新的 API Key
3. 更新 .env 文件
4. 重启应用

### 错误 2：429 Too Many Requests

```
ElevenLabs API error: 429 Too Many Requests
```

**原因**：超出免费额度（10,000 字符/月）

**解决方案**：
1. 等待下个月额度重置
2. 升级到付费套餐
3. 或者使用 OpenAI TTS 作为备选

### 错误 3：Network Error

```
Failed to fetch
```

**原因**：网络连接问题

**解决**：
1. 检查网络连接
2. 检查防火墙设置
3. 尝试使用 VPN（如果在中国大陆）

### 错误 4：No TTS service configured

```
No TTS service configured
```

**原因**：所有 TTS 服务都未配置

**解决**：
- 必须配置至少一个：
  - ELEVENLABS_API_KEY
  - OPENAI_API_KEY  
  - AZURE_SPEECH_KEY

---

## 🆘 仍然无法解决？

### 使用浏览器 TTS（临时方案）

如果暂时无法配置专业 TTS，系统会自动使用浏览器 TTS：
- ✅ 功能正常可用
- ❌ 声音较机械
- ❌ 口音差异不明显

这是一个**降级方案**，确保系统可用性。

### 获取帮助

1. **查看完整日志**
   ```bash
   npm run dev 2>&1 | tee app.log
   ```

2. **检查后端错误**
   - 浏览器控制台
   - 终端输出
   - 查找 "TTS error" 关键词

3. **参考文档**
   - `语音服务配置指南.md`
   - `env.example`

---

## ✅ 配置成功示例

### 正确的 .env 文件

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visa_interview"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=my-secret-key-12345

# ElevenLabs TTS
ELEVENLABS_API_KEY=sk_abc123def456ghi789jkl012mno345pqr678

# OpenAI (可选)
OPENAI_API_KEY=sk-proj-xyz789...
```

### 成功的输出

启动应用时应该看到：
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

播放问题时应该：
- ✅ 立即播放（1-2秒生成）
- ✅ 声音自然流畅
- ✅ 不同口音明显不同
- ✅ 无错误提示

---

## 🎉 下一步

配置成功后：
1. 测试所有 7 种口音
2. 对比声音差异
3. 享受真实的面试体验

**每种口音都应该有独特的特征！**

---

**最后更新**: 2025-09-30  
**问题**: TTS 服务调用失败  
**解决**: 配置 ElevenLabs API Key
