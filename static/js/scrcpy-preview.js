// Modular scrcpy preview using @yume-chan packages and WebCodecs
// Provides start/stop controls and logs

export function initScrcpyPreview() {
  const startBtn = document.getElementById('startWebCodec');
  const stopBtn = document.getElementById('stopPreview');
  const canvasEl = document.getElementById('canvas');
  const logEl = document.getElementById('log');

  let resources = {
    transport: null,
    connection: null,
    decoder: null,
    renderer: null,
    client: null,
    pipe: null,
  };

  function appendLog(msg) {
    logEl.textContent += `\n${msg}`;
    logEl.scrollTop = logEl.scrollHeight;
  }

  function ensureWebUsbAvailable() {
    const isSecure = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!isSecure) throw new Error('WebUSB 需要安全上下文（HTTPS 或 localhost）。');
    if (!('usb' in navigator)) throw new Error('当前浏览器不支持 WebUSB。请使用 Chrome/Edge。');
  }

  startBtn?.addEventListener('click', async () => {
    try {
      ensureWebUsbAvailable();
      appendLog('开始选择设备以启用 WebCodec 预览…');
      const usbDevice = await navigator.usb.requestDevice({
        filters: [{ classCode: 0xff, subclassCode: 0x42, protocolCode: 0x01 }]
      });
      if (!usbDevice) { appendLog('用户取消设备选择'); return; }
      appendLog(`设备已选择：${usbDevice.productName || usbDevice.vendorId}`);

      const [
        awaitAdbDaemonWebUsb,
        awaitAdb,
        awaitAdbCred,
        { AdbScrcpyClient, AdbScrcpyOptions2_1 },
        { DefaultServerPath, ScrcpyVideoCodecId },
        { WebGLVideoFrameRenderer, BitmapVideoFrameRenderer, WebCodecsVideoDecoder },
      ] = await Promise.all([
        import('@yume-chan/adb-daemon-webusb'),
        import('@yume-chan/adb'),
        import('@yume-chan/adb-credential-web'),
        import('@yume-chan/adb-scrcpy'),
        import('@yume-chan/scrcpy'),
        import('@yume-chan/scrcpy-decoder-webcodecs'),
      ]);

      const { AdbDaemonWebUsbDeviceManager } = awaitAdbDaemonWebUsb;
      const manager = new AdbDaemonWebUsbDeviceManager(navigator.usb);
      const wrappedDevices = await manager.getDevices();
      const wrapped = wrappedDevices.find(d => d.raw === usbDevice) || wrappedDevices[0];
      if (!wrapped) { appendLog('未找到已授权设备，请重试'); return; }

      const { AdbDaemonTransport } = awaitAdb;
      const { default: AdbWebCredentialStore } = awaitAdbCred;
      const connection = await wrapped.connect();
      const transport = await AdbDaemonTransport.authenticate({
        serial: wrapped.serial ?? (usbDevice.serialNumber ?? ''),
        connection,
        credentialStore: new AdbWebCredentialStore('LocalADB')
      });
      resources.transport = transport;
      resources.connection = connection;

      appendLog('启动 scrcpy server 并建立视频流…');
      const options = new AdbScrcpyOptions2_1({
        video: true,
        audio: false,
        control: false,
        videoCodec: ScrcpyVideoCodecId.H264,
        sendFrameMeta: false,
      });
      const client = await AdbScrcpyClient.start(transport.adb, DefaultServerPath, options);
      resources.client = client;

      canvasEl.style.display = 'block';
      const { metadata: videoMetadata, stream: videoPacketStream } = await client.videoStream;
      const renderer = (WebGLVideoFrameRenderer && WebGLVideoFrameRenderer.isSupported)
        ? new WebGLVideoFrameRenderer(canvasEl)
        : new BitmapVideoFrameRenderer(canvasEl);
      const decoder = new WebCodecsVideoDecoder({ codec: videoMetadata.codec, renderer });
      resources.renderer = renderer;
      resources.decoder = decoder;
      decoder.sizeChanged(({ width, height }) => {
        canvasEl.width = width;
        canvasEl.height = height;
      });
      resources.pipe = videoPacketStream.pipeTo(decoder.writable).catch((e) => {
        console.error(e);
        appendLog('解码错误：' + (e?.message || e));
      });

      startBtn.disabled = true;
      stopBtn.disabled = false;
      stopBtn.style.display = 'inline-block';
      appendLog('预览已启动。');
    } catch (e) {
      console.error(e);
      appendLog('WebCodec 预览失败：' + (e?.message || e));
    }
  });

  stopBtn?.addEventListener('click', async () => {
    stopBtn.disabled = true;
    try {
      if (resources.pipe && typeof resources.pipe.cancel === 'function') {
        await resources.pipe.cancel();
      }
      if (resources.decoder && typeof resources.decoder.close === 'function') {
        await resources.decoder.close();
      }
      // transport/connection cleanup
      try { await resources.transport?.dispose?.(); } catch {}
      try { await resources.connection?.close?.(); } catch {}
      // client has no explicit close; rely on transport disposal
      resources = { transport: null, connection: null, decoder: null, renderer: null, client: null, pipe: null };
      const canvasEl = document.getElementById('canvas');
      canvasEl.style.display = 'none';
      appendLog('预览已停止。');
    } catch (e) {
      console.error(e);
      appendLog('停止失败：' + (e?.message || e));
    } finally {
      startBtn.disabled = false;
    }
  });
}