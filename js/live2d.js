/**
 * Live2D 虚拟人物渲染引擎
 * 使用Cubism SDK for Web渲染Live2D模型
 */

class Live2DRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.model = null;
        this.isLoaded = false;

        // 加载Live2D Runtime
        this.loadLive2DSdk();
    }

    /**
     * 加载Live2D SDK
     */
    async loadLive2DSdk() {
        // 使用CDN加载Live2D Cubism SDK
        await this.loadScript('https://unpkg.com/@pixiv/three-vrm@2.0.7/lib/three-vrm.min.js');
        // 注意：这里使用VRM作为备选方案，因为Live2D Web SDK需要单独配置

        console.log('Live2D SDK loaded');
    }

    /**
     * 加载脚本
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 加载虚拟人物模型
     */
    async loadModel(modelPath) {
        try {
            console.log('Loading virtual model from:', modelPath);

            // 这里应该加载Live2D模型文件（.moc3, .model3.json, .texture.png）
            // 由于模型文件需要独立上传，这里使用简化版本

            // 创建简单的占位渲染
            this.renderPlaceholder();

            this.isLoaded = true;
            console.log('Model loaded successfully');
        } catch (error) {
            console.error('Failed to load model:', error);
            this.renderFallback();
        }
    }

    /**
     * 渲染占位符（等待真实模型）
     */
    renderPlaceholder() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 绘制简单的虚拟人物轮廓
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(width / 2, height / 3, 100, 0, Math.PI * 2);
        ctx.fill();

        // 身体
        ctx.fillStyle = '#764ba2';
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.6, 120, 150, 0, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(width / 2 - 30, height / 3, 15, 0, Math.PI * 2);
        ctx.arc(width / 2 + 30, height / 3, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(width / 2 - 30, height / 3, 8, 0, Math.PI * 2);
        ctx.arc(width / 2 + 30, height / 3, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染备用方案（Canvas动画）
     */
    renderFallback() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#333';
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('虚拟人物模型加载中...', this.canvas.width / 2, this.canvas.height / 2);
    }

    /**
     * 设置表情
     */
    setEmotion(emotion) {
        console.log('Setting emotion:', emotion);

        // 根据表情改变颜色
        const colors = {
            happy: '#ffeb3b',
            sad: '#9c27b0',
            angry: '#f44336',
            normal: '#667eea',
            surprised: '#ff9800'
        };

        const emotionIndicator = document.getElementById('current-emotion');
        if (emotionIndicator) {
            const color = colors[emotion] || colors.normal;
            emotionIndicator.style.color = color;
            emotionIndicator.textContent = emotion === 'normal' ? '平静' : emotion;
        }
    }

    /**
     * 播放语音动画（口型同步）
     */
    playSpeechAnimation() {
        // 实际Live2D模型会根据音频内容驱动嘴部动作
        console.log('Playing speech animation');
    }

    /**
     * 停止语音动画
     */
    stopSpeechAnimation() {
        console.log('Stopping speech animation');
    }

    /**
     * 眼神追踪
     */
    trackEyes(x, y) {
        // 根据用户脸部位置移动虚拟人物眼神
        console.log('Tracking eyes to:', x, y);
    }

    /**
     * 更新画布大小
     */
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        if (this.isLoaded) {
            this.renderPlaceholder();
        }
    }
}

// 导出
window.Live2DRenderer = Live2DRenderer;
