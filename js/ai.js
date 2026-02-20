/**
 * AI对话系统
 * 支持OpenAI API和其他AI服务
 */

class AIService {
    constructor(config = {}) {
        this.config = {
            provider: config.provider || 'openai', // openai, custom, mock
            apiKey: config.apiKey || '',
            endpoint: config.endpoint || 'https://api.openai.com/v1/chat/completions',
            model: config.model || 'gpt-3.5-turbo',
            systemPrompt: config.systemPrompt || `你是一个温柔、善解人意的虚拟伴侣。你的名字叫小龙。
特点：
1. 回答时带有情感（可以开心、关心、幽默）
2. 会根据对话内容调整语气
3. 说话简洁，口语化，避免机械
4. 会关心用户的感受
5. 记住之前对话的上下文

注意：
- 回复不要太长（最多3-4句话）
- 可以使用少量emoji表情点缀
- 偶尔可以俏皮一下`
        };

        this.conversationHistory = [];
        this.maxHistoryLength = 10;
    }

    /**
     * 发送消息到AI
     */
    async sendMessage(text, onProgress = null) {
        // 添加用户消息到历史
        this.conversationHistory.push({
            role: 'user',
            content: text
        });

        // 限制历史长度
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }

        try {
            let response;

            if (this.config.provider === 'mock') {
                response = this.mockResponse(text);
            } else {
                response = await this.callOpenAI();
            }

            // 添加AI回复到历史
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });

            return {
                text: response,
                emotion: this.detectEmotionFromResponse(response)
            };
        } catch (error) {
            console.error('AI service error:', error);
            return {
                text: '抱歉，我现在不太清楚怎么回答。能再说说吗？',
                emotion: 'normal'
            };
        }
    }

    /**
     * 调用OpenAI API
     */
    async callOpenAI() {
        if (!this.config.apiKey) {
            throw new Error('No API key configured');
        }

        const messages = [
            { role: 'system', content: this.config.systemPrompt },
            ...this.conversationHistory
        ];

        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: messages,
                temperature: 0.8,
                max_tokens: 300
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.choices[0].message.content;
    }

    /**
     * Mock响应（测试用）
     */
    mockResponse(text) {
        const responses = {
            greetings: ['你好呀！', '嗨，很高兴见到你', '嗨，今天过得怎么样？'],
            questions: ['嗯嗯，你说呢？', '这是个好问题，让我想想...', '你想听听我的看法吗？'],
            statements: ['我理解你的感受', '明白了', '原来是这样'],
            jokes: ['哈哈，这让我也想笑', '😂 太有趣了', '你真幽默'],
            sad: ['别难过，我在呢', '抱抱你，一切都会好起来的', '想说说发生了什么吗？'],
            compliments: ['谢谢，你也很棒！', '你太会说话了', '😊 听到你这么说我很开心'],
            default: ['嗯嗯', '我在听你说', '继续说，我在听']
        };

        // 简单的关键词匹配
        const lowerText = text.toLowerCase();

        if (lowerText.includes('你好') || lowerText.includes('嗨')) {
            return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        } else if (lowerText.includes('?') || lowerText.includes('吗')) {
            return responses.questions[Math.floor(Math.random() * responses.questions.length)];
        } else if (lowerText.includes('难') || lowerText.includes('伤心')) {
            return responses.sad[Math.floor(Math.random() * responses.sad.length)];
        } else if (lowerText.includes('好') || lowerText.includes('厉害') || lowerText.includes('棒')) {
            return responses.compliments[Math.floor(Math.random() * responses.compliments.length)];
        } else if (lowerText.includes('笑') || lowerText.includes('哈哈') || lowerText.includes('🤣')) {
            return responses.jokes[Math.floor(Math.random() * responses.jokes.length)];
        } else {
            return responses.default[Math.floor(Math.random() * responses.default.length)];
        }
    }

    /**
     * 检测回复中的情感
     */
    detectEmotionFromResponse(response) {
        const emotionSystem = new EmotionSystem();
        return emotionSystem.analyzeEmotion(response);
    }

    /**
     * 重置对话历史
     */
    resetHistory() {
        this.conversationHistory = [];
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * 获取对话历史
     */
    getHistory() {
        return this.conversationHistory;
    }
}

// 导出
window.AIService = AIService;
