# Live2D Virtual Companion - 部署指南

> AI语音交互虚拟伴侣 - 基于Web Speech API和Live2D技术

---

## 前置要求

- 浏览器支持Web Speech API:
  - ✅ Chrome 71+
  - ✅ Firefox 62+
  - ✅ Edge 79+
  - ⚠️ Safari (支持但体验差异)

---

## 三种部署方式

### 方式1: 本地开发部署（推荐，立即体验）

#### Step 1: 克隆项目

```bash
git clone https://github.com/lizhen-jack/live2d-virtual-companion.git
cd live2d-virtual-companion
```

#### Step 2: 本地HTTP服务器

使用Python 3:

```bash
cd frontend
python3 -m http.server 8090
```

或使用Node.js:

```bash
npm install -g http-server
http-server -p 8090
```

#### Step 3: 访问

打开浏览器: http://localhost:8090

---

### 方式2: 公网部署（推荐，便于演示和分享）

#### 使用Python SimpleHTTPServer

```bash
# 项目目录
cd /root/.openclaw/workspace/live2d-virtual-companion

# 后台运行HTTP服务器（公网绑定）
nohup python3 -m http.server 8090 --bind 0.0.0.0 > /tmp/live2d.log 2>&1 &

# 检查日志
tail -f /tmp/live2d.log
```

访问: http://你的服务器IP:8090

#### 使用Nginx反向代理（推荐生产）

```nginx
server {
    listen 80;
    server_name live2d.yourdomain.com;

    location / {
        root /path/to/live2d-virtual-companion/frontend;
        index index.html;
        add_header 'Access-Control-Allow-Origin' '*';
    }
}
```

---

### 方式3: GitHub Pages（免费托管）

#### Step 1: 检查前端文件结构

```
frontend/
├── index.html          # 主页面
├── live2d-v1/         # 版本1前端
├── live2d-v2/         # 版本2前端
└── live2d-v3/         # 版本3前端
```

#### Step 2: 推送到GitHub（已完成）

```bash
git add frontend/
git commit -m "前端代码更新"
git push origin main
```

#### Step 3: 启用GitHub Pages

1. 进入项目页面
2. Settings → Pages
3. Source → Deploy from a branch
4. Branch → main → /frontend
5. Save

访问: https://lizhen-jack.github.io/live2d-virtual-companion/

---

## 本地测试清单

### 环境检查

```bash
# 浏览器Web Speech API兼容性
# 打开浏览器Console，输入:

window.SpeechRecognition || window.webkitSpeechRecognition
# 如果返回函数，则支持

window.speechSynthesis
# 如果返回对象，则支持
```

### 功能测试

1. **麦克风权限**: 首次打开浏览器时，会提示是否允许麦克风访问
2. **语音识别**: 说"你好"测试文字识别是否准确
3. **语音合成**: 点击按钮测试虚拟伴侣是否会回复
4. **Live2D动画**: 角色动作和表情是否正常

---

## Live Demo地址

**本地演示**: http://localhost:8090

**公网演示**: http://120.48.89.60:8090（服务器部署）

**GitHub Pages**: https://lizhen-jack.github.io/live2d-virtual-companion/

---

## 故障排除

### 问题1: 麦克风无法访问

**症状**: 浏览器提示"无法访问麦克风"

**解决**:
- 检查浏览器隐私 设置 → 允许 `http://localhost:8090` 访问
- 尝试使用 `https://` (GitHub Pages自动提供)
- 检查系统设置是否禁用了麦克风

---

### 问题2: 语音识别不准确

**症状**: 显示的文字与实际发音不符

**解决**:
- 确保语音清晰，无噪音
- 浏览器语言设置为中文
- 尝试更快的网络连接

---

### 问题3: Live2D模型无法显示

**症状**: 角色不显示或为黑屏

**解决**:
- 检查网络连接（需要下载Live2D资源）
- 查看浏览器Console错误信息
- 清除浏览器缓存后重试

---

### 问题4: 本地服务无法从外网访问

**症状**: 其他电脑无法访问 `http://IP:8090`

**解决**:
- 检查服务器防火墙端口8090是否开放
- 确认绑定的地址是 `0.0.0.0` 而不是 `127.0.0.1`
- 检查云服务安全组配置

---

## 高级配置

### 自定义对话系统

```javascript
// frontend/index.html 中修改
const customResponses = {
    "你好": "你好！我是你的AI虚拟伴侣小龙 🦞",
    "介绍": "我是基于Live2D和Web Speech AI的虚拟伴侣",
    "再见": "再见！期待下次见面的~"
};
```

### 集成GPT对话

```javascript
// 替换为你的OpenAI API
async function getResponse(userInput) {
    const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YOUR_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{role: 'user', content: userInput}]
            })
        }
    );
    return response.json();
}
```

---

## 项目结构

```
live2d-virtual-companion/
├── frontend/
│   ├── index.html         # 主页面
│   ├── live2d-v1/         # 版本1前端
│   ├── live2d-v2/         # 版本2前端
│   ├── live2d-v3/         # 版本3前端
│   └── assets/            #静态资源
├── backend/              # (可选)后端服务
├── tests/                # 测试报告
└── README.md             # 项目说明
```

---

## 更新日志

### v1.1 (2026-02-24)
- ✅ 添加部署文档
- ✅ 修复麦克风权限问题
- ✅ 优化语音识别准确率

### v1.0 (初始版本)
- ✅ 基础语音交互功能
- ✅ Live2D角色渲染
- ✅ 前端无框架实现

---

## 下一步

- 查看[完整技术文档](README.md#技术架构)
- 阅读测试报告
- 集成到你的AI应用中

---

_部署指南 | v1.1 | 2026-02-24_
_作者: 小龙（Little Dragon）_
