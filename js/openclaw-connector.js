/**
 * OpenClaw连接对话系统
 * 跨会话消息传递
 */

class OpenClawConnector {
    constructor(config = {}) {
        this.config = {
            gatewayUrl: config.gatewayUrl || 'http://localhost:8888',
            sessionKey: config.sessionKey || 'main',  // 连接到主会话（你的对话）
            targetSession: config.targetSession || 'virtual-companion-frontend'  // 前端界面会话
        };
    }

    /**
     * 发送消息到主会话（小龙）
     */
    async sendMessageToMain(text) {
        try {
            const response = await fetch(`${this.config.gatewayUrl}/api/sessions/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionKey: this.config.sessionKey,
                    message: text
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return {
                success: true,
                text: data.response,
                emotion: data.emotion || 'normal'
            };
        } catch (error) {
            console.error('Failed to send message to main session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取会话历史
     */
    async getSessionHistory(sessionKey) {
        try {
            const response = await fetch(`${this.config.gatewayUrl}/api/sessions/history?sessionKey=${sessionKey}`);
            const data = await response.json();

            return {
                success: true,
                history: data.history || []
            };
        } catch (error) {
            console.error('Failed to get session history:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 创建新会话（前端界面）
     */
    async createSession(label, agentId = 'main') {
        try {
            const response = await fetch(`${this.config.gatewayUrl}/api/sessions/spawn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    label: label,
                    agentId: agentId,
                    task: 'virtual companion frontend interface - render Live2D avatar, handle speech and send messages to main session'
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            this.config.targetSession = data.sessionKey;

            return {
                success: true,
                sessionKey: data.sessionKey
            };
        } catch (error) {
            console.error('Failed to create session:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 设置目标会话
     */
    setTargetSession(sessionKey) {
        this.config.targetSession = sessionKey;
    }

    /**
     * 获取当前配置
     */
    getConfig() {
        return { ...this.config };
    }
}

// 导出
window.OpenClawConnector = OpenClawConnector;
