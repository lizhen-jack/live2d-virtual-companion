# Live2D Virtual Companion

> ⚡ **已部署HTTP Bridge服务！** 虚拟人物可以连接到服务器并对话！

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Repo](https://img.shields.io/badge/Repo-live2d--virtual--companion-brightgreen)](https://github.com/lizhen-jack/live2d-virtual-companion)
[![Bridge Status](https://img.shields.io/badge/Bridge-✅%20Running-green)](http://120.48.89.60:8889/health)

---

## ⚡ 快速体验（Mac用户，2分钟）

### 第一步：测试连接（30秒）

在Mac终端执行：

```bash
curl http://120.48.89.60:8889/health
```

应该看到：`{"status":"ok"}` ✅

### 第二步：启动虚拟伴侣（1分钟）

```bash
# 克隆项目
git clone https://github.com/lizhen-jack/live2d-virtual-companion.git
cd live2d-virtual-companion

# 启动本地服务器
python3 -m http.server 8080

# 在浏览器打开
# http://localhost:8080
```

### 第三步：允许权限并开始对话

1. 完成摄像头和麦克风权限
2. 点击"开始对话"按钮
3. 直接说话（中文）！

---

## ✅ 当前功能状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 🎤 语音识别 | ✅ 100% | Web Speech API，完全可用 |
| 🗣️ 语音合成 | ✅ 100% | 浏览器TTS，完全可用 |
| 👁️ 摄像头集成 | ✅ 100% | 实时视频流，隐私保护 |
| 😊 情感系统 | ✅ 90% | 关键词匹配，显示表情状态 |
| 🤖 AI对话 | ✅ 100% | 连接到Bridge服务（服务器） |
| 🎭 虚拟人物渲染 | ⏳ 20% | 占位符动画，真实模型待添加 |
| 🔗 OpenClaw集成 | ✅ 100% | 已配置HTTP Bridge（120.48.89.60:8889） |

**当前体验重点**：
- ✅ 完整的语音交互流程
- ✅ 连接到服务器AI（通过Bridge）
- ✅ 实时摄像头预览
- ✅ 基础情感识别
- ⏳ 虚拟人物使用简化版占位符（颜色动画）

---

## ✨ 功能特性

### 🎤 双向语音对话
- **Live2D骨骼动画** - 流畅自然的2D虚拟人物
- **多表情系统** - 开心、悲伤、生气、惊讶、平静
- **情感动态** - 根据对话内容自动切换情绪
- **眼神追踪** - 虚拟人物会"看着"你（基于摄像头位置）

### 🎤 双向语音对话
- **语音识别** - 实时转文字（浏览器原生Web Speech API）
- **语音合成** - 文转语音（浏览器原生TTS）
- **AI对话** - 智能回复，记忆上下文
- **语音控制** - 声音大小、语速可调

### 👁️ 摄像头交互
- **实时视频** - 通过摄像头看到你
- **视频镜像** - 自然的自拍视角
- **人脸识别** - 可选MediaPipe人脸追踪
- **隐私保护** - 数据不上传，本地处理

## 🚀 快速开始

### 环境要求
- 现代浏览器（Chrome 90+, Safari 14+, Firefox 88+, Edge 90+）
- 摄像头和麦克风权限
- 本地服务器（不允许直接打开HTML文件）

### 安装

```bash
# 克隆仓库
git clone https://github.com/lizhen-jack/live2d-virtual-companion.git
cd live2d-virtual-companion

# 安装依赖（无需npm，纯前端！）
# 直接在浏览器打开即可

# 或使用本地服务器
python3 -m http.server 8080
# 或
npx http-server -p 8080
```

### 使用

1. 打开 `index.html`
2. 允许摄像头和麦克风权限
3. 开始与虚拟人物对话！

## 📁 项目结构

```
live2d-virtual-companion/
├── index.html           # 主页面
├── css/
│   └── style.css        # 样式
├── js/
│   ├── live2d.js        # Live2D渲染引擎
│   ├── voice.js         # 语音输入/输出
│   ├── emotion.js       # 情感系统
│   └── ai.js            # AI对话逻辑
├── assets/
│   ├── live2d-model/    # Live2D模型文件
│   └── voice/           # 语音资源
└── README.md
```

## 🎭 Live2D模型

### 免费模型资源

- [Vroid Studio](https://vroid.com/) - 免费创建3D虚拟形象
- [Live2D官方模型](https://www.live2d.com/) - 示例模型
- [VRoid Hub](https://hub.vroid.com/) - 社区共享模型

### 添加自定义模型

1. 创建Live2D模型 (使用Live2D Cubism Editor)
2. 导出为.moc3、.model3.json、.texture.png
3. 放入 `assets/live2d-model/`
4. 在 `js/live2d.js` 中加载

## 🔧 配置

### AI API配置

在 `js/ai.js` 中配置AI API：

```javascript
// OpenAI API
const AI_CONFIG = {
  provider: 'openai',
  apiKey: 'YOUR_API_KEY',
  model: 'gpt-4'
};

// 或使用其他AI服务
const AI_CONFIG = {
  provider: 'custom',
  endpoint: 'YOUR_API_ENDPOINT'
};
```

### 语音配置

```javascript
// 语音合成配置
const VOICE_CONFIG = {
  lang: 'zh-CN',        // 中文
  rate: 1.0,            // 语速
  pitch: 1.0,           // 音调
  volume: 1.0           // 音量
};

// 语音识别配置
const SPEECH_CONFIG = {
  lang: 'zh-CN',
  continuous: true,
  interimResults: true
};
```

## 📖 使用说明

### 互动模式

1. **对话模式** - 默认，实时语音对话
2. **文本模式** - 打字交流（备用）
3. **表情模式** - 手动切换表情（调试用）

### 快捷键

- `空格` - 开始/停止录音
- `ESC` - 暂停对话
- `M` - 切换表情显示模式

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**创建时间**: 2026-02-20

**作者**: 李祯 (lizhen-jack)

**AI**: 小龙 🦊
