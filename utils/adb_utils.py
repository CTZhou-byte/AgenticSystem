import subprocess
import time
import re


def run_adb(cmd: str):
    """执行单条 ADB 命令"""
    try:
        out = subprocess.check_output(["adb", "shell"] + cmd.split(), stderr=subprocess.STDOUT)
        return out.decode(errors='ignore')
    except subprocess.CalledProcessError as e:
        return e.output.decode(errors='ignore')
    except Exception as e:
        return f"ADB 执行出错: {e}"

SCRCPY_PATH = "/opt/homebrew/bin/scrcpy"
FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"


def start_scrcpy_usb_tcp():
    """启动 scrcpy USB 模式 + 本地 TCP 输出"""
    subprocess.run("pkill -f scrcpy", shell=True)
    time.sleep(0.5)

    cmd = [
        SCRCPY_PATH,
        "--no-playback",
        "--serial", "usb",
        "--video-bit-rate", "4M",
        "--max-fps", "30",
        "--tcp-listen", "127.0.0.1:8083",
        "--raw"
    ]

    print("🎬 启动 scrcpy TCP 输出 (USB 模式):", " ".join(cmd))
    return subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def screen_stream_generator():
    """从 scrcpy TCP 输出读取 H.264 视频流并转 MJPEG (multipart/x-mixed-replace)"""
    scrcpy_proc = start_scrcpy_usb_tcp()
    time.sleep(2)

    ffmpeg_cmd = [
        FFMPEG_PATH,
        "-f", "h264",
        "-i", "tcp://127.0.0.1:8083",
        "-vf", "scale=540:-1",
        "-f", "mjpeg",
        "-q:v", "5",
        "pipe:1"
    ]

    print("🎥 启动 ffmpeg 转码 tcp://127.0.0.1:8083 → MJPEG")
    ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

    try:
        while True:
            frame = ffmpeg_proc.stdout.read(4096)
            if not frame:
                break
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        # 清理子进程
        try:
            if ffmpeg_proc and ffmpeg_proc.poll() is None:
                ffmpeg_proc.kill()
        except Exception:
            pass
        try:
            if scrcpy_proc and scrcpy_proc.poll() is None:
                scrcpy_proc.kill()
        except Exception:
            pass