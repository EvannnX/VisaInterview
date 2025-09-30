#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎙️ TTS 服务配置向导"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "选择 TTS 服务："
echo "1. ElevenLabs（推荐，免费额度大，声音最自然）"
echo "2. OpenAI TTS（如果你已有 OpenAI API Key）"
echo "3. 跳过（继续使用浏览器 TTS）"
echo ""

read -p "请选择 [1-3]: " choice

case $choice in
  1)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 ElevenLabs 配置"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. 访问：https://elevenlabs.io/"
    echo "2. 点击 Sign Up 注册（免费）"
    echo "3. 登录后，点击右上角头像 → Profile"
    echo "4. 找到 API Key 部分"
    echo "5. 点击 Copy 复制你的 API Key"
    echo ""
    
    read -p "请粘贴你的 ElevenLabs API Key: " api_key
    
    if [ -z "$api_key" ]; then
      echo "❌ API Key 不能为空"
      exit 1
    fi
    
    echo "" >> .env
    echo "# ElevenLabs TTS - High quality natural voices" >> .env
    echo "ELEVENLABS_API_KEY=$api_key" >> .env
    
    echo ""
    echo "✅ ElevenLabs API Key 已配置！"
    ;;
    
  2)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 OpenAI TTS 配置"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    read -p "请粘贴你的 OpenAI API Key: " api_key
    
    if [ -z "$api_key" ]; then
      echo "❌ API Key 不能为空"
      exit 1
    fi
    
    echo "" >> .env
    echo "# OpenAI TTS and Translation" >> .env
    echo "OPENAI_API_KEY=$api_key" >> .env
    
    echo ""
    echo "✅ OpenAI API Key 已配置！"
    ;;
    
  3)
    echo ""
    echo "⚠️  跳过 TTS 配置"
    echo "系统将继续使用浏览器 TTS（声音质量较低）"
    echo ""
    echo "随时可以运行此脚本重新配置"
    exit 0
    ;;
    
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 下一步"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 重启应用："
echo "   按 Ctrl+C 停止当前应用"
echo "   运行：npm run dev"
echo ""
echo "2. 测试语音："
echo "   访问 http://localhost:3000"
echo "   开始新面试 → 播放问题"
echo ""
echo "3. 验证成功："
echo "   - 声音自然流畅"
echo "   - 不同口音明显不同"
echo "   - 没有错误提示"
echo ""
echo "🎉 享受真实的语音体验！"
echo ""
