#!/bin/bash
# 虚拟伴侣和Bridge服务监控脚本
# 如果服务停止，自动重启

sleep 5

# 检查8090端口（虚拟伴侣Web）
if ! ps aux | grep "python3 start_companion_server.py" | grep -v grep > /dev/null; then
    echo "$(date): 虚拟伴侣服务器停止，正在重启..." >> /root/.openclaw/workspace/companion-web/auto_restart.log
    cd /root/.openclaw/workspace/companion-web
    python3 start_companion_server.py >> /root/.openclaw/workspace/companion-web/companion.log 2>&1 &
    ps aux | grep "python3 start_companion_server.py" | grep -v grep | awk '{print $2}' > /root/.openclaw/workspace/companion-web/companion.pid
    echo "$(date): 虚拟伴侣服务器已重启 (PID: $(cat /root/.openclaw/workspace/companion-web/companion.pid))" >> /root/.openclaw/workspace/companion-web/auto_restart.log
fi

# 检查8889端口（Bridge服务）
if ! ps aux | grep "python3 openclaw_http_bridge.py" | grep -v grep > /dev/null; then
    echo "$(date): Bridge服务停止，正在重启..." >> /root/.openclaw/workspace/bridge_auto_restart.log
    cd /root/.openclaw/workspace
    python3 openclaw_http_bridge.py >> /root/.openclaw/workspace/bridge.log 2>&1 &
    echo "$(date): Bridge服务已重启" >> /root/.openclaw/workspace/bridge_auto_restart.log
fi

echo "$(date): 检查完成" >> /root/.openclaw/workspace/companion-web/auto_restart.log
