import subprocess
import time
import os


def run_adb(cmd: str):
    """执行单条 ADB 命令"""
    try:
        out = subprocess.check_output(["adb", "shell"] + cmd.split(), stderr=subprocess.STDOUT)
        return out.decode(errors='ignore')
    except subprocess.CalledProcessError as e:
        return e.output.decode(errors='ignore')
    except Exception as e:
        return f"ADB 执行出错: {e}"

FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"


def start_screenrecord_raw():
    """通过 adb exec-out 启动 screenrecord，输出原始 H.264 到 stdout"""
    # 结束可能残留的 screenrecord
    subprocess.run("pkill -f screenrecord", shell=True)
    time.sleep(0.3)

    cmd = [
        "adb", "exec-out",
        "screenrecord",
        "--output-format=h264",
        "--bit-rate", "4000000",
        "-"  # 输出到 stdout
    ]
    print("🎬 启动 screenrecord 原始视频输出:", " ".join(cmd))
    return subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def screen_stream_generator():
    """读取 H.264 并用 ffmpeg 转 MJPEG（multipart/x-mixed-replace）"""
    sr_proc = start_screenrecord_raw()
    time.sleep(0.5)

    ffmpeg_bin = FFMPEG_PATH if os.path.exists(FFMPEG_PATH) else "ffmpeg"
    ffmpeg_cmd = [
        ffmpeg_bin,
        "-f", "h264",
        "-i", "pipe:0",
        "-vf", "scale=540:-1",
        "-f", "mjpeg",
        "-q:v", "5",
        "pipe:1"
    ]
    print("🎥 启动 ffmpeg 转码 stdin(h264) → MJPEG")
    ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdin=sr_proc.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    buffer = bytearray()
    SOI = b"\xff\xd8"
    EOI = b"\xff\xd9"

    try:
        while True:
            chunk = ffmpeg_proc.stdout.read(16384)
            if not chunk:
                break
            buffer.extend(chunk)

            while True:
                soi = buffer.find(SOI)
                if soi == -1:
                    if len(buffer) > 1_000_000:
                        buffer[:] = buffer[-2048:]
                    break
                eoi = buffer.find(EOI, soi + 2)
                if eoi == -1:
                    break
                frame = bytes(buffer[soi:eoi + 2])
                del buffer[:eoi + 2]

                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        try:
            if ffmpeg_proc and ffmpeg_proc.poll() is None:
                ffmpeg_proc.kill()
        except Exception:
            pass
        try:
            if sr_proc and sr_proc.poll() is None:
                sr_proc.kill()
        except Exception:
            pass