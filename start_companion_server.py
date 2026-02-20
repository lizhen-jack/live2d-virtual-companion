#!/usr/bin/env python3
"""
虚拟伴侣Web服务器
独立HTTP服务，不依赖OpenClaw
监听端口: 8090
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys

# 设置工作目录
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(SCRIPT_DIR)

class CompanionHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS支持
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # 自定义日志
        print(f"[Companion Web Server] {format % args}")

def main():
    PORT = 8090
    server_address = ('0.0.0.0', PORT)

    httpd = HTTPServer(server_address, CompanionHTTPRequestHandler)

    print(f"""
╔═══════════════════════════════════════════════════════╗
║   虚拟伴侣Web服务器 - 启动成功                        ║
╠═══════════════════════════════════════════════════════╣
║   端口: {PORT}                                        ║
║   地址: http://0.0.0.0:{PORT}                         ║
╠═══════════════════════════════════════════════════════╣
║   本地访问: http://localhost:{PORT}                   ║
║   外部访问: http://120.48.89.60:{PORT}                ║
╠═══════════════════════════════════════════════════════╣
║   🎤 语音识别 + 🗣️ 语音合成                           ║
║   👁️ 摄像头 + 😊 情感识别                            ║
║   🤖 连接到Bridge服务 (120.48.89.60:8889)           ║
╠═══════════════════════════════════════════════════════╣
║   ⚠️ 注意：此服务与OpenClaw完全独立                   ║
║      不会影响现有聊天界面                             ║
╚═══════════════════════════════════════════════════════╝
    """)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Companion Web Server] 服务器已停止")
        httpd.shutdown()

if __name__ == '__main__':
    main()
