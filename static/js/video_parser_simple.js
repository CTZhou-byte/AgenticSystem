(function(){
  // 如果已存在则不覆盖
  if (typeof window !== 'undefined' && typeof window.VideoParser !== 'undefined') {
    return;
  }
  function concatParts(parts){
    var total = 0;
    for (var i = 0; i < parts.length; i++) total += parts[i].length;
    var out = new Uint8Array(total);
    var off = 0;
    for (var j = 0; j < parts.length; j++) { out.set(parts[j], off); off += parts[j].length; }
    return out;
  }
  function hasAnnexB(buf){
    for (var i = 0; i < buf.length - 4; i++){
      if (buf[i] === 0 && buf[i+1] === 0){
        if (buf[i+2] === 1) return true;
        if (buf[i+2] === 0 && buf[i+3] === 1) return true;
      }
    }
    return false;
  }
  function addStartCode(nal){
    var out = new Uint8Array(nal.length + 4);
    out[0]=0; out[1]=0; out[2]=0; out[3]=1; out.set(nal,4);
    return out;
  }
  function HybridVideoParser(cb){
    this.cb = cb;
    this.sps = null;
    this.pps = null;
    this.inited = false;
  }
  HybridVideoParser.prototype._emitInitIfReady = function(){
    if (!this.inited && this.sps && this.pps){
      this.inited = true;
      this.cb({ type: 'init', data: { sps: addStartCode(this.sps), pps: addStartCode(this.pps) } });
    }
  };
  HybridVideoParser.prototype._inspectNal = function(nal){
    if (!nal || !nal.length) return;
    var type = nal[0] & 0x1f;
    if (type === 7) this.sps = nal; else if (type === 8) this.pps = nal;
  };
  // 新增：按帧追加。将长度前缀的 NAL 逐个转换为 Annex-B，并合并为一个帧送出。
  HybridVideoParser.prototype.appendFrame = function(chunk){
    if (!(chunk instanceof Uint8Array)) chunk = new Uint8Array(chunk);
    var parts = [];
    if (hasAnnexB(chunk)){
      // 已是 Annex-B：提取 SPS/PPS 以便初始化，然后原样送出
      // 简单扫描所有起始码，截取 NAL 用于类型检测
      var b = chunk;
      for (var i = 0; i < b.length - 4; i++){
        if (b[i] === 0 && b[i+1] === 0 && ((b[i+2] === 1) || (b[i+2] === 0 && b[i+3] === 1))){
          var start = (b[i+2] === 1) ? i+3 : i+4;
          var next = i+1;
          for (; next < b.length - 4; next++){
            if (b[next] === 0 && b[next+1] === 0 && ((b[next+2] === 1) || (b[next+2] === 0 && b[next+3] === 1))) break;
          }
          var nal = b.slice(start, next);
          this._inspectNal(nal);
          i = next - 1;
        }
      }
      this._emitInitIfReady();
      this.cb({ type: 'frame', data: chunk });
      return;
    }
    // 长度前缀 -> Annex-B
    var offset = 0;
    var b = chunk;
    while (b.length - offset >= 4){
      var len = (b[offset] << 24) | (b[offset+1] << 16) | (b[offset+2] << 8) | (b[offset+3]);
      if (len <= 0 || len > 5*1024*1024){
        // 尝试小端或终止
        var len_le = (b[offset+3] << 24) | (b[offset+2] << 16) | (b[offset+1] << 8) | (b[offset]);
        if (len_le > 0 && len_le <= 5*1024*1024){ len = len_le; }
        else { break; }
      }
      if (b.length - offset - 4 < len) break;
      var start = offset + 4;
      var nal = b.slice(start, start + len);
      this._inspectNal(nal);
      parts.push(addStartCode(nal));
      offset = start + len;
    }
    this._emitInitIfReady();
    if (parts.length){
      var joined = concatParts(parts);
      this.cb({ type: 'frame', data: joined });
    }
  };
  // 兼容旧逻辑：按数据块追加；尽量转换为 Annex-B 后按 NAL 送出（不推荐）
  HybridVideoParser.prototype.appendData = function(chunk){
    // 退化处理：当后端不是按帧推送时使用。
    this.appendFrame(chunk);
  };
  if (typeof window !== 'undefined') window.VideoParser = HybridVideoParser;
  else if (typeof global !== 'undefined') global.VideoParser = HybridVideoParser;
})();