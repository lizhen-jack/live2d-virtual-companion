#!/bin/bash
# 虚拟伴侣Web服务器管理脚本

COMPANION_DIR="/root/.openclaw/workspace/companion-web"
LOG_FILE="$COMPANION_DIR/companion.log"
PID_FILE="$COMPANION_DIR/companion.pid"
PORT=8090

case "$1" in
    start)
        if [ -f $PID_FILE ]; then
            PID=$(cat $PID_FILE)
            if ps -p $PID > /dev/null 2>&1; then
                echo "虚拟伴侣服务器已经在运行中 (PID: $PID)"
                exit 1
            else
                rm -f $PID_FILE
            fi
        fi

        cd $COMPANION_DIR
        nohup python3 start_companion_server.py > $LOG_FILE 2>&1 &
        NEW_PID=$!
        echo $NEW_PID > $PID_FILE

        sleep 2

        if ps -p $NEW_PID > /dev/null 2>&1; then
            echo "✅ 虚拟伴侣服务器启动成功"
            echo "   PID: $NEW_PID"
            echo "   端口: $PORT"
            echo "   访问: http://120.48.89.60:$PORT"
        else
            echo "❌ 启动失败"
            rm -f $PID_FILE
            exit 1
        fi
        ;;

    stop)
        if [ ! -f $PID_FILE ]; then
            echo "虚拟伴侣服务器未运行"
            exit 1
        fi

        PID=$(cat $PID_FILE)
        if ps -p $PID > /dev/null 2>&1; then
            kill $PID
            sleep 1

            if ps -p $PID > /dev/null 2>&1; then
                kill -9 $PID
            fi

            rm -f $PID_FILE
            echo "✅ 虚拟伴侣服务器已停止"
        else
            echo "虚拟伴侣服务器未运行"
            rm -f $PID_FILE
        fi
        ;;

    restart)
        $0 stop
        sleep 2
        $0 start
        ;;

    status)
        if [ ! -f $PID_FILE ]; then
            echo "❌ 虚拟伴侣服务器未运行"
            exit 1
        fi

        PID=$(cat $PID_FILE)
        if ps -p $PID > /dev/null 2>&1; then
            echo "✅ 虚拟伴侣服务器正在运行"
            echo "   PID: $PID"
            echo "   端口: $PORT"
            echo "   访问: http://120.48.89.60:$PORT"
            echo "   日志: tail -f $LOG_FILE"
        else
            echo "❌ 虚拟伴侣服务器未运行"
            rm -f $PID_FILE
            exit 1
        fi
        ;;

    log)
        if [ -f $LOG_FILE ]; then
            tail -f $LOG_FILE
        else
            echo "日志文件不存在"
            exit 1
        fi
        ;;

    *)
        echo "使用方法: $0 {start|stop|restart|status|log}"
        echo ""
        echo "命令说明:"
        echo "  start   - 启动虚拟伴侣服务器"
        echo "  stop    - 停止虚拟伴侣服务器"
        echo "  restart - 重启虚拟伴侣服务器"
        echo "  status  - 查看运行状态"
        echo "  log     - 查看实时日志"
        echo ""
        echo "服务地址: http://120.48.89.60:$PORT"
        exit 1
        ;;
esac
