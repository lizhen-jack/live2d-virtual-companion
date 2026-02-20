/**
 * 主应用程序
 */

class VirtualCompanionApp {
    constructor() {
        this.live2D = new Live2DRenderer('live2d-canvas');
        this.voice = new VoiceManager();
        this.emotion = new EmotionSystem();

        // 使用OpenClaw HTTP Bridge连接
        this.httpBridge = new OpenClawHTTPBridge({
            fallbackURL: 'http://120.48.89.60:8889',  // OpenClaw Bridge服务
            sessionKey: 'agent:main:main',
            useBridge: true
        });

        // 备用AI服务（当Bridge不可用时）
        this.ai = new AIService({ provider: 'mock' });
        this.useBridge = true;

        // 备用AI服务（当OpenClaw不可用时）
        this.ai = new AIService({ provider: 'mock' });
        this.useOpenClaw = true;  // 优先使用OpenClaw

        this.cameraStream = null;
        this.isActive = false;

        this.init();
    }

    /**
     * 初始化
     */
    async init() {
        console.log('Initializing Virtual Companion App...');

        // 初始化Live2D
        await this.live2D.loadModel('');

        // 加载UI元素
        this.messageList = document.getElementById('message-list');
        this.micIndicator = document.getElementById('mic-indicator');
        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');
        this.btnSettings = document.getElementById('btn-settings');
        this.btnCloseSettings = document.getElementById('btn-close-settings');
        this.settingsPanel = document.getElementById('settings-panel');
        this.cameraVideo = document.getElementById('user-camera');

        // 绑定事件
        this.bindEvents();

        // 初始化摄像头
        await this.initCamera();

        console.log('App initialized');
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 开始按钮
        this.btnStart.addEventListener('click', () => this.startConversation());

        // 停止按钮
        this.btnStop.addEventListener('click', () => this.stopConversation());

        // 设置按钮
        this.btnSettings.addEventListener('click', () => {
            this.settingsPanel.style.display = 'block';
        });

        // 关闭设置
        this.btnCloseSettings.addEventListener('click', () => {
            this.settingsPanel.style.display = 'none';
        });

        // 语音识别回调
        this.voice.onResult = (result) => {
            if (result.final) {
                this.handleUserMessage(result.final);
            }
        };

        // 语音识别结束回调
        this.voice.onEnd = () => {
            this.updateMicIndicator(false);
        };

        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.live2D.resize();
        });

        // 初始调整大小
        setTimeout(() => this.live2D.resize(), 100);
    }

    /**
     * 初始化摄像头
     */
    async initCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });

            this.cameraVideo.srcObject = this.cameraStream;
            console.log('Camera initialized');
        } catch (error) {
            console.error('Failed to access camera:', error);
            this.addSystemMessage('无法访问摄像头';
        }
    }

    /**
     * 开始对话
     */
    async startConversation() {
        try {
            // 请求麦克风权限
            if (!this.cameraStream) {
                await this.initCamera();
            }

            // 开始语音识别
            const started = this.voice.start();

            if (started) {
                this.isActive = true;
                this.updateMicIndicator(true);
                this.addSystemMessage('开始对话了，你想聊什么？');

                // 虚拟人物开口
                this.voice.speak('你好呀，我是小龙，很高兴见到你。你想聊点什么呢？
            }
        } catch (error) {
            console.error('Failed to start conversation:', error);
            this.addSystemMessage('无法启动语音识别，请检查麦克风权限');
        }
    }

    /**
     * 停止对话
     */
    stopConversation() {
        this.voice.stop();
        this.isActive = false;
        this.updateMicIndicator(false);
        this.addSystemMessage('对话已停止');
    }

    /**
     * 处理用户消息
     */
    async handleUserMessage(text) {
        // 显示用户消息
        this.addUserMessage(text);

        // 分析情感
        const userEmotion = this.emotion.analyzeEmotion(text);
        console.log('User emotion:', userEmotion);

        // 更新虚拟人物表情
        this.live2D.setEmotion(userEmotion);

        // 生成回复（优先通过OpenClaw连接到服务器上的"我"）
        let response;
        if (this.useOpenClaw) {
            response = await this.sendToOpenClaw(text);
            // 如果OpenClaw连接失败，降级到本地AI
            if (!response.success) {
                console.log('OpenClaw连接失败，使用本地AI');
                response = await this.sendToLocalAI(text);
                this.useOpenClaw = false;  // 切换到本地模式
            }
        } else {
            response = await this.sendToLocalAI(text);
        }

        // 显示回复
        this.addAIMessage(response.text);

        // 语音合成
        this.voice.speak(response.text);

        // 更新虚拟人物表情（基于回复）
        this.live2D.setEmotion(response.emotion);
    }

    /**
     * 发送消息到OpenClaw Bridge（连接服务器）
     */
    async sendToOpenClaw(text) {
        try {
            console.log('Sending to OpenClaw Bridge:', text);

            const response = await this.httpBridge.sendMessage(text);

            if (response.success) {
                return {
                    success: true,
                    text: response.text,
                    emotion: response.emotion || 'normal'
                };
            } else {
                throw new Error(response.error || 'Bridge returned failure');
            }
        } catch (error) {
            console.error('OpenClaw Bridge error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 使用本地AI生成回复
     */
    async sendToLocalAI(text) {
        const response = await this.ai.sendMessage(text);
        return response;
    }

    /**
     * 添加用户消息到界面
     */
    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        this.messageList.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * 添加AI消息到界面
     */
    addAIMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        this.messageList.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * 添加系统消息到界面
     */
    addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        this.messageList.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * 滚动到底部
     */
    scrollToBottom() {
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    /**
     * 更新麦克风指示器
     */
    updateMicIndicator(isListening) {
        const statusSpan = this.micIndicator.querySelector('.status');
        const iconSpan = this.micIndicator.querySelector('.icon');

        if (isListening) {
            this.micIndicator.classList.add('listening');
            statusSpan.textContent = '正在聆听...';
            iconSpan.textContent = '🎤';
        } else {
            this.micIndicator.classList.remove('listening');
            statusSpan.textContent = '未连接';
            iconSpan.textContent = '🔇';
        }
    }

    /**
     * 禁用摄像头
     */
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new VirtualCompanionApp();
    window.app = app; // 导出到全局，方便调试
});
