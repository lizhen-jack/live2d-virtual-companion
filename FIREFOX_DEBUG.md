# Firefox 语音识别调试

## 问题：Firefox 显示"语音识别不支持"
- 浏览器：Firefox 147
- 语音合成：✅ 支持
- 语音识别：❌ 不支持

## 可能的原因

### 1. Firefox版本或配置问题

某些Firefox版本可能需要手动启用语音识别。

## 解决方案

### 方式1：使用Chrome浏览器（推荐）

Chrome对语音识别支持最好！

**安装Chrome（如果没有）**：
https://www.google.com/chrome/

**访问地址（Chrome需要HTTPS或localhost）**：
http://120.48.89.60:8090/cross-browser.html

**注意**：Chrome必须在**HTTPS**或**localhost**下才能使用麦克风。

### 方式2：本地运行 + Chrome（最佳）⭐⭐⭐⭐⭐

在Mac上本地运行项目，Chrome可以访问localhost的麦克风：

```bash
# 1. 克隆项目（如果还没有）
git clone https://github.com/lizhen-jack/live2d-virtual-companion.git
cd live2d-virtual-companion

# 2. 下载跨浏览器版本
cd companion-web
curl -O http://120.48.89.60:8090/cross-browser.html

# 3. 修改Bridge地址（调用远程服务器）
# 用文本编辑器打开 cross-browser.html
# 找到这一行：http://120.48.89.60:8889/api/chat
# 不需要改，保持原样（调用远程Bridge服务）

# 4. 回到项目根目录，启动本地服务器
cd ..
python3 -m http.server 8890

# 5. Chrome浏览器访问
http://localhost:8890/companion-web/cross-browser.html
```

**架构**：
```
Mac浏览器 (Chrome + localhost:8890)
  → 远程Bridge (120.48.89.60:8889) ✅
  → 远程OpenClaw (120.48.89.60:18789) ✅
```

Chrome允许localhost的麦克风访问，所以这样可以工作！

### 方式3：检查Firefox设置

在Firefox地址栏输入：`about:config`

搜索这些设置（如果存在）：
- `media.webspeech.recognition.enable` → 设置为 `true`
- `media.navigator.permission.disabled` → 设置为 `false`

然后**重启Firefox**并**刷新页面**。

### 方式4：使用文字对话（备选）

继续使用文字对话界面：
```
http://120.48.89.60:18789/chat
```

这也是完整的对话功能，只是没有语音。

---

## 建议

**最推荐：本地运行 + Chrome**

这样：
- ✅ Chrome支持语音识别
- ✅ localhost允许麦克风访问
- ✅ 调用远程AI服务（无需本地GPU）
- ✅ 语音+文字双界面

需要在Mac上执行上面的命令！

---

告诉我你想用哪个方案？我可以帮你详细指导！
