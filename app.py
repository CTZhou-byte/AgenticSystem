from flask import Flask, render_template, send_from_directory, Response, jsonify, request
import os

# 新增：引入 SocketIO 并集成 web-scrcpy 的核心服务逻辑
from flask_socketio import SocketIO, emit
import sys
import queue
import time

# 优雅回退：优先从 web-scrcpy 导入，其次使用 utils.scrcpy
try:
    sys.path.append(os.path.join(os.getcwd(), "web-scrcpy"))
    from scrcpy import Scrcpy
except Exception:
    from utils.scrcpy import Scrcpy

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True, async_mode='eventlet')

# 全局 Scrcpy 状态
scpy_ctx = None
client_sid = None
message_queue = queue.Queue()
video_bit_rate = "1024000"

@app.route("/")
def home():
    # 渲染首页（如果存在），否则提示
    if os.path.exists(os.path.join(app.template_folder, "index.html")):
        return render_template("index.html")
    return "Flask 已启动。访问 /connect 连接手机。"

# 连接手机页面
@app.route("/connect")
def connect_page():
    return render_template("connect.html")

# 新增：通过 Flask 提供 webadb.js 目录用于测试 legacy webadb
@app.route("/webadb")
def webadb_root():
    return send_from_directory(os.path.join(os.getcwd(), "webadb.js"), "test.html")

@app.route("/webadb/<path:filename>")
def webadb_static(filename):
    return send_from_directory(os.path.join(os.getcwd(), "webadb.js"), filename)

# 提供 web-scrcpy 的静态资源（JS/CSS/webfonts）
@app.route("/ws-assets/<path:filename>")
def ws_assets(filename):
    return send_from_directory(os.path.join(os.getcwd(), "web-scrcpy", "static"), filename)

# 视频流：scrcpy + ffmpeg → MJPEG（保留现有）
from utils.adb_utils import screen_stream_generator, run_adb
import subprocess
import re

@app.route("/stream")
def stream_mjpeg():
    return Response(screen_stream_generator(), mimetype='multipart/x-mixed-replace; boundary=frame')

# 简单控制：点击坐标 → adb input tap（保留现有）
@app.route("/api/tap", methods=["POST"])
def api_tap():
    data = request.get_json(force=True)
    x = int(data.get("x", 0))
    y = int(data.get("y", 0))
    output = run_adb(f"input tap {x} {y}")
    return jsonify({"ok": True, "output": output})

# 后端 ADB：执行 shell 命令（保留现有）
@app.route("/api/shell", methods=["POST"]) 
def api_shell():
    data = request.get_json(force=True)
    cmd = data.get("cmd", "")
    if not cmd:
        return jsonify({"ok": False, "output": ""}), 400
    output = run_adb(cmd)
    return jsonify({"ok": True, "output": output})

# 型号（保留现有）
@app.route("/api/model")
def api_model():
    output = run_adb("getprop ro.product.model").strip()
    return jsonify({"ok": True, "model": output})

# 分辨率（保留现有）
@app.route("/api/resolution")
def api_resolution():
    text = run_adb("wm size")
    import re
    m = re.search(r"Physical size:\s*(\d+)x(\d+)", text) or re.search(r"(\d+)x(\d+)", text)
    if m:
        w, h = int(m.group(1)), int(m.group(2))
        return jsonify({"ok": True, "width": w, "height": h, "raw": text})
    return jsonify({"ok": False, "raw": text}), 200

# --- 新增：设备列表与截图接口 ---
@app.route("/api/devices")
def api_devices():
    try:
        out = subprocess.check_output(["adb", "devices"], stderr=subprocess.STDOUT).decode(errors='ignore')
        lines = [l.strip() for l in out.splitlines() if l.strip()]
        devices = []
        for l in lines[1:]:  # skip header 'List of devices attached'
            if "\t" in l:
                serial, state = l.split("\t", 1)
            else:
                parts = l.split()
                if len(parts) >= 2:
                    serial, state = parts[0], parts[1]
                else:
                    serial, state = parts[0], "unknown"
            serial = serial.strip()
            state = state.strip()
            if not serial:
                continue
            model = "-"
            resolution = "-"
            try:
                m_out = subprocess.check_output(["adb", "-s", serial, "shell", "getprop", "ro.product.model"], stderr=subprocess.STDOUT).decode(errors='ignore').strip()
                if m_out:
                    model = m_out
            except Exception:
                pass
            try:
                r_out = subprocess.check_output(["adb", "-s", serial, "shell", "wm", "size"], stderr=subprocess.STDOUT).decode(errors='ignore')
                m = re.search(r"Physical size:\s*(\d+)x(\d+)", r_out) or re.search(r"(\d+)x(\d+)", r_out)
                if m:
                    resolution = f"{int(m.group(1))}x{int(m.group(2))}"
            except Exception:
                pass
            devices.append({"serial": serial, "state": state, "model": model, "resolution": resolution})
        return jsonify({"ok": True, "devices": devices})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/screenshot")
def api_screenshot():
    serial = request.args.get('serial')
    try:
        cmd = ["adb"]
        if serial:
            cmd += ["-s", serial]
        cmd += ["exec-out", "screencap", "-p"]
        img = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        return Response(img, mimetype='image/png')
    except subprocess.CalledProcessError as e:
        return jsonify({"ok": False, "error": e.output.decode(errors='ignore')}), 500
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/device_info")
def api_device_info():
    serial = request.args.get('serial')
    if not serial:
        return jsonify({"ok": False, "error": "missing serial"}), 400

    def adb(cmd_list):
        try:
            out = subprocess.check_output(["adb", "-s", serial, "shell"] + cmd_list, stderr=subprocess.STDOUT)
            return out.decode(errors='ignore')
        except subprocess.CalledProcessError as e:
            return e.output.decode(errors='ignore')
        except Exception as e:
            return str(e)

    def prop(name):
        return adb(["getprop", name]).strip()

    # 基础属性
    info = {
        "serial": serial,
        "serial_prop": prop("ro.serialno") or None,
        "model": prop("ro.product.model") or None,
        "brand": prop("ro.product.brand") or None,
        "manufacturer": prop("ro.product.manufacturer") or None,
        "device": prop("ro.product.device") or None,
        "product": prop("ro.product.product") or None,
        "android": prop("ro.build.version.release") or None,
        "sdk": prop("ro.build.version.sdk") or None,
        "build_id": prop("ro.build.id") or None,
        "incremental": prop("ro.build.version.incremental") or None,
        "security_patch": prop("ro.build.version.security_patch") or None,
        "fingerprint": prop("ro.build.fingerprint") or None,
        "abi_list": (prop("ro.product.cpu.abilist") or prop("ro.product.cpu.abi")) or None,
        "hardware": prop("ro.hardware") or None,
        "platform": prop("ro.board.platform") or None,
    }

    # 分辨率与密度
    wm_size = adb(["wm", "size"]) or ""
    import re
    m = re.search(r"Physical size:\s*(\d+)x(\d+)", wm_size) or re.search(r"(\d+)x(\d+)", wm_size)
    if m:
        info["resolution"] = f"{int(m.group(1))}x{int(m.group(2))}"
    else:
        info["resolution"] = None
    wm_density = adb(["wm", "density"]) or ""
    m2 = re.search(r"Physical density:\s*(\d+)", wm_density) or re.search(r"(\d+)", wm_density)
    info["density"] = int(m2.group(1)) if m2 else None

    # 旋转
    dumpsys_window = adb(["dumpsys", "window"]) or ""
    m3 = re.search(r"SurfaceOrientation:\s*(\d)", dumpsys_window) or re.search(r"mRotation=\s*(\d)", dumpsys_window)
    info["rotation"] = int(m3.group(1)) if m3 else None

    # 电池信息
    batt = adb(["dumpsys", "battery"]) or ""
    def pick(key, default=None):
        mm = re.search(key + r"\s*:?\s*(\S+)", batt)
        return mm.group(1) if mm else default
    try:
        info["battery"] = {
            "level": int(pick(r"level", "-1")),
            "status": pick(r"status") or None,
            "temperature": int(pick(r"temperature", "-1")),
            "health": pick(r"health") or None,
        }
    except Exception:
        info["battery"] = {}

    # 网络
    ip_txt = adb(["ip", "-f", "inet", "addr", "show", "wlan0"]) or ""
    m4 = re.search(r"inet\s+(\d+\.\d+\.\d+\.\d+)", ip_txt)
    if not m4:
        ip_txt = adb(["ip", "-f", "inet", "addr", "show", "rmnet_data0"]) or ip_txt
        m4 = re.search(r"inet\s+(\d+\.\d+\.\d+\.\d+)", ip_txt)
    info["ip"] = m4.group(1) if m4 else None
    mac_txt = adb(["cat", "/sys/class/net/wlan0/address"]) or ""
    info["mac"] = mac_txt.strip() or None

    # 存储（以 /data 为准）
    df_txt = adb(["df", "-h", "/data"]) or ""
    try:
        lines = [l for l in df_txt.splitlines() if l.strip()]
        if len(lines) >= 2:
            parts = re.split(r"\s+", lines[1].strip())
            # Filesystem Size Used Available Use% Mounted on
            info["storage"] = {
                "size": parts[1] if len(parts) > 1 else None,
                "used": parts[2] if len(parts) > 2 else None,
                "avail": parts[3] if len(parts) > 3 else None,
            }
    except Exception:
        info["storage"] = {}

    # 内存
    meminfo = adb(["cat", "/proc/meminfo"]) or ""
    def pick_kb(label):
        mm = re.search(label + r":\s*(\d+)\s*kB", meminfo)
        return int(mm.group(1)) if mm else None
    info["memory"] = {
        "total_kb": pick_kb("MemTotal"),
        "available_kb": pick_kb("MemAvailable"),
    }

    # 开机时长
    uptime = adb(["cat", "/proc/uptime"]) or ""
    try:
        first = float((uptime.split()[0]))
        info["uptime_seconds"] = int(first)
    except Exception:
        info["uptime_seconds"] = None

    return jsonify({"ok": True, **info})

@app.route("/api/open_url", methods=["POST"])
def api_open_url():
    data = request.get_json(force=True) or {}
    serial = data.get('serial')
    url = data.get('url')
    if not serial or not url:
        return jsonify({"ok": False, "error": "missing params"}), 400
    try:
        subprocess.check_output(["adb","-s",serial,"shell","am","start","-a","android.intent.action.VIEW","-d",url], stderr=subprocess.STDOUT)
        return jsonify({"ok": True})
    except subprocess.CalledProcessError as e:
        return jsonify({"ok": False, "error": e.output.decode(errors='ignore')}), 500
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


# ===== Socket.IO 事件：集成 web-scrcpy 服务 =====

def video_send_task():
    global client_sid
    sent_packets = 0
    sent_bytes = 0
    last_log = time.time()
    while client_sid is not None:
        try:
            message = message_queue.get(timeout=0.01)
            # 移除不兼容的 binary 参数；Python Socket.IO 会根据 bytes 自动以二进制发送
            socketio.emit('video_data', message, to=client_sid)
            sent_packets += 1
            sent_bytes += len(message)
        except queue.Empty:
            pass
        except Exception as e:
            print(f"Error sending data: {e}")
        finally:
            now = time.time()
            if now - last_log >= 1.0:
                print(f"[video_send_task] packets={sent_packets} bytes={sent_bytes}")
                # 同步推送统计到前端，便于排查是否有视频数据出站
                try:
                    socketio.emit('video_stats', {
                        'packets': sent_packets,
                        'bytes': sent_bytes
                    }, to=client_sid)
                except Exception as e:
                    print(f"emit video_stats error: {e}")
                last_log = now
            socketio.sleep(0.001)
    print("video_send_task stopped")


def send_video_data(data):
    message_queue.put(data)


@socketio.on('connect')
def handle_connect():
    global scpy_ctx, client_sid
    print('Client connected')

    if scpy_ctx is not None:
        print(f'reject connection, client {scpy_ctx} is already connected')
        return False
    else:
        client_sid = request.sid
        scpy_ctx = Scrcpy()
        scpy_ctx.scrcpy_start(send_video_data, video_bit_rate)
        # 仅在视频套接字建立成功时启动发送线程
        if getattr(scpy_ctx, 'video_socket', None) is None:
            print('scrcpy_start failed: video socket not established')
            try:
                emit('server_error', {'message': 'scrcpy_start_failed'})
            except Exception as e:
                print(f"emit server_error failed: {e}")
            scpy_ctx = None
            client_sid = None
            return False
        socketio.start_background_task(video_send_task)
        print(f'connectioned, client  {scpy_ctx}')


@socketio.on('disconnect')
def handle_disconnect():
    global scpy_ctx, client_sid
    client_sid = None
    print('Client disconnected', {scpy_ctx})
    if scpy_ctx:
        scpy_ctx.scrcpy_stop()
        scpy_ctx = None
    print('scrcpy stopped')


@socketio.on('control_data')
def handle_control_data(data):
    global scpy_ctx
    if scpy_ctx:
        scpy_ctx.scrcpy_send_control(data)


@app.route("/api/clipboard", methods=["GET","POST"])
def api_clipboard():
    # 支持 GET 使用 query 参数，POST 使用 JSON body
    serial = request.args.get('serial') if request.method == 'GET' else (request.get_json(force=True) or {}).get('serial')
    if not serial:
        return jsonify({"ok": False, "error": "missing serial"}), 400
    try:
        if request.method == 'GET':
            out = subprocess.check_output(["adb","-s",serial,"shell","cmd","clipboard","get"], stderr=subprocess.STDOUT)
            text = out.decode(errors='ignore').strip()
            return jsonify({"ok": True, "text": text})
        else:
            data = request.get_json(force=True) or {}
            text = data.get('text','')
            subprocess.check_output(["adb","-s",serial,"shell","cmd","clipboard","set",text], stderr=subprocess.STDOUT)
            return jsonify({"ok": True})
    except subprocess.CalledProcessError as e:
        return jsonify({"ok": False, "error": e.output.decode(errors='ignore')}), 500
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


if __name__ == "__main__":
    # 以 SocketIO 启动，统一端口 5001
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)