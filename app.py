from flask import Flask, render_template, send_from_directory, Response, jsonify, request
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

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

# 视频流：scrcpy + ffmpeg → MJPEG
from utils.adb_utils import screen_stream_generator, run_adb

@app.route("/stream")
def stream_mjpeg():
    return Response(screen_stream_generator(), mimetype='multipart/x-mixed-replace; boundary=frame')

# 简单控制：点击坐标 → adb input tap
@app.route("/api/tap", methods=["POST"])
def api_tap():
    data = request.get_json(force=True)
    x = int(data.get("x", 0))
    y = int(data.get("y", 0))
    output = run_adb(f"input tap {x} {y}")
    return jsonify({"ok": True, "output": output})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)