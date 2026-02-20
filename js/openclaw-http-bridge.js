/**
 * OpenClaw HTTP API Bridge
 * 通过HTTP调用OpenClaw的sessions_send工具
 */

class OpenClawHTTPBridge {
    constructor(config = {}) {
        this.config = {
            fallbackURL: config.fallbackURL || 'http://120.48.89.60:18789',
            sessionKey: config.sessionKey || 'agent:main:main',
            useBridge: config.useBridge || true  // 是否使用桥接服务
        };
    }

    /**
     * 通过OpenClaw发送消息
     */
    async sendMessage(text) {
        try {
            console.log('Sending message to OpenClaw bridge:', text);

            if (this.config.useBridge) {
                return await this.sendViaBridge(text);
            } else {
                return await this.sendDirect(text);
            }
        } catch (error) {
            console.error('Error sending to OpenClaw:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 通过桥接服务发送（推荐）
     */
    async sendViaBridge(text) {
        try {
            // 注意：这需要在服务器上启动一个HTTP桥接服务
            const response = await fetch(`${this.config.fallbackURL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionKey: this.config.sessionKey,
                    message: text
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                success: true,
                text: data.response || data.message || data.text,
                emotion: data.emotion || 'normal'
            };
        } catch (error) {
            console.error('Bridge error:', error);
            throw error;
        }
    }

    /**
     * 直接发送（可能受CORS限制）
     */
    async sendDirect(text) {
        // OpenClaw可能需要其他认证方式
        console.warn('Direct sending may be blocked by CORS');
        throw new Error('Direct sending not implemented - use bridge');
    }

    /**
     * 测试连接
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.config.fallbackURL}/chat?session=${encodeURIComponent(this.config.sessionKey)}`, {
                method: 'GET',
                mode: 'cors'  // 尝试跨域
            });

            console.log('Connection test - Status:', response.status);
            return {
                success: response.ok,
                status: response.status
            };
        } catch (error) {
            console.error('Connection test failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// 导出
window.OpenClawHTTPBridge = OpenClawHTTPBridge;
