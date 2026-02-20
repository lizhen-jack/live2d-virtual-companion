/**
 * 情感系统
 * 根据对话内容和语音语调识别情感
 */

class EmotionSystem {
    constructor() {
        this.currentEmotion = 'normal';
        this.emotionKeywords = {
            happy: [
                '开心', '高兴', '喜欢', '爱', '棒', '好', '优秀', '厉害',
                '不错', '满意', '高兴', '快乐', '幸福', '感谢', '谢谢',
                '哈哈', '嘻嘻', '🤣', '😂', '👍', '🎉', '✨'
            ],
            sad: [
                '难过', '伤心', '可惜', '遗憾', '悲伤', '哭', '眼泪',
                '伤心', '不好', '糟糕', '😭', '😢', '😞', '😔'
            ],
            angry: [
                '生气', '愤怒', '讨厌', '恨', '烦', '烦躁', '火大',
                '滚', '笨', '蠢', '😡', '😠', '🤬'
            ],
            surprised: [
                '哇', '天哪', '真的吗', '惊喜', '惊奇', '什么', '啊',
                '😮', '😲', '🤔', '🙀'
            ]
        };
    }

    /**
     * 根据文本识别情感
     */
    analyzeEmotion(text) {
        const lowerText = text.toLowerCase();

        // 检查每个情感关键词
        for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    return emotion;
                }
            }
        }

        // 默认返回平静
        return 'normal';
    }

    /**
     * 设置当前情感
     */
    setEmotion(emotion) {
        if (this.emotionKeywords[emotion] || emotion === 'normal') {
            this.currentEmotion = emotion;
            console.log('Emotion changed to:', emotion);
            return true;
        }
        return false;
    }

    /**
     * 获取当前情感
     */
    getEmotion() {
        return this.currentEmotion;
    }

    /**
     * 获取情感列表
     */
    getEmotions() {
        return Object.keys(this.emotionKeywords).concat(['normal']);
    }

    /**
     * 归一化情感（将similar情感映射到标准情感）
     */
    normalizeEmotion(emotion) {
        const mapping = {
            'joy': 'happy',
            'joyful': 'happy',
            'delighted': 'happy',
            'pleased': 'happy',
            'grief': 'sad',
            'sorrow': 'sad',
            'upset': 'sad',
            'disappointed': 'sad',
            'rage': 'angry',
            'furious': 'angry',
            'irritated': 'angry',
            'annoyed': 'angry',
            'shock': 'surprised',
            'amazed': 'surprised',
            'astonished': 'surprised',
            'neutral': 'normal',
            'calm': 'normal',
            'peaceful': 'normal'
        };

        return mapping[emotion.toLowerCase()] || emotion;
    }

    /**
     * 从AI回复中提取情感
     */
    extractFromAIResponse(response) {
        // 可以根据AI回复的内容/语气判断情感
        // 这里简单使用关键词匹配
        return this.analyzeEmotion(response);
    }

    /**
     * 缓慢过渡情感
     */
    transitionEmotion(newEmotion, duration = 1000) {
        console.log(`Transitioning emotion from ${this.currentEmotion} to ${newEmotion} in ${duration}ms`);

        // 在真实Live2D模型中，这里会实现平滑过渡动画
        // 目前简单设置
        this.setEmotion(newEmotion);
    }
}

// 导出
window.EmotionSystem = EmotionSystem;
