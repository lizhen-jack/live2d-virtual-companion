/**
 * 语音输入/输出模块
 * 使用Web Speech API实现TTS和ASR
 */

class VoiceManager {
    constructor(config = {}) {
        this.config = {
            lang: config.lang || 'zh-CN',
            rate: config.rate || 1.0,
            pitch: config.pitch || 1.0,
            volume: config.volume || 1.0,
            continuous: config.continuous || true,
            interimResults: config.interimResults || true
        };

        this.synthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.isSpeaking = false;

        this.onResult = null; // 语音识别回调
        this.onEnd = null; // 语音识别结束回调

        this.initRecognition();
    }

    /**
     * 初始化语音识别
     */
    initRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('SpeechRecognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = this.config.lang;
        this.recognition.continuous = this.config.continuous;
        this.recognition.interimResults = this.config.interimResults;

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (this.onResult) {
                this.onResult({
                    final: finalTranscript,
                    interim: interimTranscript
                });
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (event.error === 'no-speech') {
                // 没有检测到语音，重新开始
                this.stop();
                setTimeout(() => this.start(), 500);
            }
        };

        this.recognition.onend = () => {
            console.log('Speech recognition ended');

            if (this.isListening) {
                // 如果应该继续监听，自动重启
                setTimeout(() => {
                    if (this.isListening) {
                        this.recognition.start();
                    }
                }, 100);
            } else if (this.onEnd) {
                this.onEnd();
            }
        };
    }

    /**
     * 开始语音识别
     */
    start() {
        if (!this.recognition) {
            console.error('SpeechRecognition not available');
            return false;
        }

        try {
            this.recognition.start();
            this.isListening = true;
            return true;
        } catch (error) {
            console.error('Failed to start recognition:', error);
            return false;
        }
    }

    /**
     * 停止语音识别
     */
    stop() {
        if (this.recognition) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    /**
     * 文字转语音
     */
    speak(text, config = {}) {
        if (!this.synthesis) {
            console.error('SpeechSynthesis not available');
            return;
        }

        // 停止当前语音
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = config.lang || this.config.lang;
        utterance.rate = config.rate || this.config.rate;
        utterance.pitch = config.pitch || this.config.pitch;
        utterance.volume = (config.volume || this.config.volume);

        utterance.onstart = () => {
            this.isSpeaking = true;
            console.log('Starting speech:', text);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            console.log('Speech ended');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
        };

        this.synthesis.speak(utterance);
    }

    /**
     * 停止语音输出
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        if (this.recognition) {
            this.recognition.lang = this.config.lang;
        }
    }

    /**
     * 获取可用语音列表
     */
    getVoices() {
        if (!this.synthesis) return [];

        return this.synthesis.getVoices().map(voice => ({
            name: voice.name,
            lang: voice.lang,
            default: voice.default
        }));
    }

    /**
     * 静音/取消所有语音
     */
    cancel() {
        this.stopSpeaking();
    }
}

// 导出
window.VoiceManager = VoiceManager;
