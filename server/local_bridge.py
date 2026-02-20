#!/usr/bin/env python3
"""
本地Bridge服务器 - 用于Mac本地测试
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# OpenClaw API配置
OPENCLAW_URL = "http://120.48.89.60:18789/api/v1/chat"
SESSION_KEY = "agent:main:main"

@app.route('/')
def index():
    """返回主页面"""
    return send_from_directory('.', 'super-simple-mac.html')

@app.route('/health')
def health():
    """健康检查"""
    return jsonify({"status": "ok"})

@app.route('/api/chat', methods=['POST'])
def chat():
    """接收消息并转发到OpenClaw"""
    try:
        data = request.json
        message = data.get('message', '')

        # 调用OpenClaw API
        payload = {
            "message": message,
            "sessionKey": SESSION_KEY
        }

        response = requests.post(OPENCLAW_URL, json=payload, timeout=10)

        if response.status_code == 200:
            # 解析OpenClaw响应
            result = response.json()
            # 提取AI回复（根据OpenClaw的响应结构调整）
            ai_text = result.get('text', result.get('message', '抱歉，我没有收到回复。'))

            return jsonify({
                "success": True,
                "text": ai_text,
                "emotion": "normal"
            })
        else:
            return jsonify({
                "success": False,
                "error": f"OpenClaw API错误: {response.status_code}"
            })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })

if __name__ == '__main__':
    print("=== 本地Bridge服务器启动 ===")
    print(f"OpenClaw地址: {OPENCLAW_URL}")
    print(f"会话Key: {SESSION_KEY}")
    print("访问: http://localhost:8890")
    print("本地测试页面: http://localhost:8890/mac-test.html")
    app.run(host='0.0.0.0', port=8890, debug=True)
