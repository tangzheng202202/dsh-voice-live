// src/index.ts
import { SessionId } from "@deepseek-ai/dsh-session";

// src/host/voice-server.ts
import { randomUUID as randomUUID2 } from "node:crypto";
import WebSocket2, { WebSocketServer } from "ws";

// src/host/volcengine.ts
import WebSocket from "ws";
import { randomUUID } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
var TTS_URL = "wss://openspeech.bytedance.com/api/v3/tts/bidirection";
var ASR_URL = "wss://openspeech.bytedance.com/api/v3/sauc/bigmodel_async";
var VolcengineVoiceError = class extends Error {
  code;
  payload;
  constructor(message, code, payload) {
    super(code !== void 0 ? `[${code}] ${message}` : message);
    this.name = "VolcengineVoiceError";
    this.code = code;
    this.payload = payload;
  }
};
var Event = /* @__PURE__ */ ((Event2) => {
  Event2[Event2["None"] = 0] = "None";
  Event2[Event2["StartConnection"] = 1] = "StartConnection";
  Event2[Event2["FinishConnection"] = 2] = "FinishConnection";
  Event2[Event2["ConnectionStarted"] = 50] = "ConnectionStarted";
  Event2[Event2["ConnectionFailed"] = 51] = "ConnectionFailed";
  Event2[Event2["ConnectionFinished"] = 52] = "ConnectionFinished";
  Event2[Event2["StartSession"] = 100] = "StartSession";
  Event2[Event2["CancelSession"] = 101] = "CancelSession";
  Event2[Event2["FinishSession"] = 102] = "FinishSession";
  Event2[Event2["SessionStarted"] = 150] = "SessionStarted";
  Event2[Event2["SessionCanceled"] = 151] = "SessionCanceled";
  Event2[Event2["SessionFinished"] = 152] = "SessionFinished";
  Event2[Event2["SessionFailed"] = 153] = "SessionFailed";
  Event2[Event2["TaskRequest"] = 200] = "TaskRequest";
  Event2[Event2["UpdateConfig"] = 201] = "UpdateConfig";
  Event2[Event2["TTSSentenceStart"] = 350] = "TTSSentenceStart";
  Event2[Event2["TTSSentenceEnd"] = 351] = "TTSSentenceEnd";
  Event2[Event2["TTSResponse"] = 352] = "TTSResponse";
  Event2[Event2["TTSEnded"] = 359] = "TTSEnded";
  Event2[Event2["ASRInfo"] = 450] = "ASRInfo";
  Event2[Event2["ASRResponse"] = 451] = "ASRResponse";
  Event2[Event2["ASREnded"] = 459] = "ASREnded";
  return Event2;
})(Event || {});
var CONNECTION_EVENTS = /* @__PURE__ */ new Set([
  1 /* StartConnection */,
  2 /* FinishConnection */,
  50 /* ConnectionStarted */,
  51 /* ConnectionFailed */,
  52 /* ConnectionFinished */
]);
var SEQUENCED_TYPES = /* @__PURE__ */ new Set([
  1 /* FullClientRequest */,
  9 /* FullServerResponse */,
  12 /* FrontEndResultServer */,
  2 /* AudioOnlyClient */,
  11 /* AudioOnlyServer */
]);
var Message = class _Message {
  type = 0 /* Invalid */;
  flag = 0 /* NoSeq */;
  serialization = 1 /* JSON */;
  compression = 0 /* None */;
  event = 0 /* None */;
  session_id = "";
  connect_id = "";
  sequence = 0;
  error_code = 0;
  payload = Buffer.alloc(0);
  constructor(init) {
    if (init) Object.assign(this, init);
  }
  marshal() {
    const parts = [];
    parts.push(
      Buffer.from([
        17,
        // version=1, header_size=1 (=> 4-byte header)
        this.type << 4 | this.flag,
        this.serialization << 4 | this.compression,
        0
      ])
    );
    if (this.flag === 4 /* WithEvent */) {
      const ev = Buffer.alloc(4);
      ev.writeInt32BE(this.event, 0);
      parts.push(ev);
      if (!CONNECTION_EVENTS.has(this.event)) {
        const sid = Buffer.from(this.session_id, "utf-8");
        const lenBuf = Buffer.alloc(4);
        lenBuf.writeUInt32BE(sid.length, 0);
        parts.push(lenBuf);
        if (sid.length) parts.push(sid);
      }
    }
    if (this.type === 15 /* Error */) {
      const ec = Buffer.alloc(4);
      ec.writeUInt32BE(this.error_code >>> 0, 0);
      parts.push(ec);
    } else if ((this.flag === 1 /* PositiveSeq */ || this.flag === 3 /* NegativeSeq */) && SEQUENCED_TYPES.has(this.type)) {
      const seq = Buffer.alloc(4);
      seq.writeInt32BE(this.sequence, 0);
      parts.push(seq);
    }
    const size = Buffer.alloc(4);
    size.writeUInt32BE(this.payload.length, 0);
    parts.push(size);
    if (this.payload.length) parts.push(this.payload);
    return Buffer.concat(parts);
  }
  static unmarshal(data) {
    if (data.length < 4) {
      throw new Error(`frame too short: ${data.length} bytes`);
    }
    const headerSize = ((data[0] ?? 0) & 15) * 4;
    if (headerSize < 4) {
      throw new Error(`invalid header_size ${headerSize}`);
    }
    const msg = new _Message();
    msg.type = (data[1] ?? 0) >> 4;
    msg.flag = (data[1] ?? 0) & 15;
    msg.serialization = (data[2] ?? 0) >> 4;
    msg.compression = (data[2] ?? 0) & 15;
    let off = headerSize;
    const readI32 = () => {
      const v = data.readInt32BE(off);
      off += 4;
      return v;
    };
    const readU32 = () => {
      const v = data.readUInt32BE(off);
      off += 4;
      return v;
    };
    if (msg.flag === 4 /* WithEvent */) {
      msg.event = readI32();
      if (!CONNECTION_EVENTS.has(msg.event)) {
        const sidSize = readU32();
        if (sidSize) {
          msg.session_id = data.toString("utf-8", off, off + sidSize);
          off += sidSize;
        }
      } else if (msg.type === 9 /* FullServerResponse */) {
        if (off + 4 <= data.length) {
          const cidSize = readU32();
          if (cidSize) {
            msg.connect_id = data.toString("utf-8", off, off + cidSize);
            off += cidSize;
          }
        }
      }
    }
    if (msg.type === 15 /* Error */) {
      msg.error_code = readU32();
    } else if ((msg.flag === 1 /* PositiveSeq */ || msg.flag === 3 /* NegativeSeq */) && SEQUENCED_TYPES.has(msg.type)) {
      msg.sequence = readI32();
    } else if (msg.flag === 2 /* LastNoSeq */) {
    }
    if (off + 4 <= data.length) {
      const size = readU32();
      if (size) {
        msg.payload = data.subarray(off, off + size);
      }
    }
    return msg;
  }
  jsonPayload() {
    if (!this.payload.length) return null;
    let raw = this.payload;
    try {
      if (this.compression === 1 /* Gzip */) {
        raw = gunzipSync(raw);
      }
      const parsed = JSON.parse(raw.toString("utf-8"));
      return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }
};
function buildHeaders(apiKey, resourceId, requestId) {
  return {
    "X-Api-Key": apiKey,
    "X-Api-Resource-Id": resourceId,
    "X-Api-Connect-Id": randomUUID(),
    "X-Api-Request-Id": requestId ?? randomUUID()
  };
}
var MessageStream = class {
  items = [];
  waiters = [];
  done = false;
  push(item) {
    if (this.done) return;
    const w = this.waiters.shift();
    if (w) {
      if (item instanceof Error) w.reject(item);
      else w.resolve(item);
    } else {
      this.items.push(item);
    }
  }
  next() {
    const item = this.items.shift();
    if (item !== void 0) {
      return item instanceof Error ? Promise.reject(item) : Promise.resolve(item);
    }
    if (this.done) {
      return Promise.reject(new VolcengineVoiceError("connection closed"));
    }
    return new Promise((resolve, reject) => {
      this.waiters.push({ resolve, reject });
    });
  }
  close(err) {
    this.done = true;
    const e = err ?? new VolcengineVoiceError("connection closed");
    let waiter;
    while ((waiter = this.waiters.shift()) !== void 0) waiter.reject(e);
    this.items.length = 0;
  }
};
async function openWS(url, headers, timeoutMs, signal) {
  if (signal?.aborted === true) throw new VolcengineVoiceError("operation aborted");
  const ws = new WebSocket(url, { headers, maxPayload: 16 * 1024 * 1024 });
  const stream = new MessageStream();
  const abort = () => {
    ws.terminate();
  };
  signal?.addEventListener("abort", abort, { once: true });
  ws.once("close", () => {
    signal?.removeEventListener("abort", abort);
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.terminate();
      reject(new VolcengineVoiceError(`connect timed out (${timeoutMs}ms)`));
    }, timeoutMs);
    ws.once("open", () => {
      clearTimeout(timer);
      resolve();
    });
    ws.once("error", (err) => {
      clearTimeout(timer);
      const s = err.message;
      if (/401|403|auth/i.test(s)) {
        reject(new VolcengineVoiceError(`handshake rejected: ${s}`));
      } else {
        reject(new VolcengineVoiceError(`handshake failed: ${s}`));
      }
    });
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new VolcengineVoiceError("operation aborted"));
    }, { once: true });
  });
  ws.on("message", (data) => {
    const raw = data;
    if (typeof raw === "string") {
      stream.push(new VolcengineVoiceError(`unexpected text frame: ${raw.slice(0, 200)}`));
      return;
    }
    const buf = Array.isArray(raw) ? Buffer.concat(raw) : raw instanceof ArrayBuffer ? Buffer.from(new Uint8Array(raw)) : raw;
    if (!buf.length) {
      stream.push(new VolcengineVoiceError("empty server frame"));
      return;
    }
    try {
      stream.push(Message.unmarshal(buf));
    } catch (e) {
      stream.push(new VolcengineVoiceError(`malformed server frame: ${e.message}`));
    }
  });
  ws.on("close", () => {
    stream.close(new VolcengineVoiceError("connection closed"));
  });
  ws.on("error", (err) => {
    stream.close(new VolcengineVoiceError(`connection error: ${err.message}`));
  });
  return { ws, stream };
}
async function recv(stream, timeoutMs) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => {
        reject(new VolcengineVoiceError(`timed out waiting for server frame (${timeoutMs}ms)`));
      },
      timeoutMs
    );
  });
  try {
    return await Promise.race([stream.next(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}
function send(ws, msg) {
  ws.send(msg.marshal());
}
function assertNoServerError(msg) {
  if (msg.type === 15 /* Error */) {
    const body = msg.payload.toString("utf-8");
    throw new VolcengineVoiceError(`server error: ${body}`, msg.error_code, body);
  }
  if (msg.event === 51 /* ConnectionFailed */ || msg.event === 153 /* SessionFailed */) {
    const body = msg.jsonPayload() ?? msg.payload.toString("utf-8");
    throw new VolcengineVoiceError(
      `${Event[msg.event]}: ${JSON.stringify(body)}`,
      msg.error_code || void 0,
      body
    );
  }
}
async function ttsStream(text, voice, apiKey, onAudio, options = {}) {
  const {
    audioFormat = "mp3",
    sampleRate = 24e3,
    speedRatio = 1,
    resourceId = "seed-tts-2.0",
    requestId,
    timeoutMs = 3e4,
    signal
  } = options;
  const headers = buildHeaders(apiKey, resourceId, requestId);
  const uid = headers["X-Api-Request-Id"];
  const speechRate = Math.max(-50, Math.min(100, Math.round((speedRatio - 1) * 100)));
  const reqParams = {
    speaker: voice,
    audio_params: {
      format: audioFormat,
      sample_rate: sampleRate,
      speech_rate: speechRate
    }
  };
  const basePayload = {
    user: { uid },
    namespace: "BidirectionalTTS",
    req_params: reqParams
  };
  const sessionId = randomUUID();
  const { ws, stream } = await openWS(TTS_URL, headers, timeoutMs, signal);
  try {
    send(
      ws,
      new Message({
        type: 1 /* FullClientRequest */,
        flag: 4 /* WithEvent */,
        event: 1 /* StartConnection */,
        payload: Buffer.from("{}")
      })
    );
    let msg = await recv(stream, timeoutMs);
    assertNoServerError(msg);
    if (msg.event !== 50 /* ConnectionStarted */) {
      throw new VolcengineVoiceError(
        `expected ConnectionStarted, got ${Event[msg.event]}`
      );
    }
    send(
      ws,
      new Message({
        type: 1 /* FullClientRequest */,
        flag: 4 /* WithEvent */,
        event: 100 /* StartSession */,
        session_id: sessionId,
        payload: Buffer.from(
          JSON.stringify({ ...basePayload, event: 100 /* StartSession */ }),
          "utf-8"
        )
      })
    );
    msg = await recv(stream, timeoutMs);
    assertNoServerError(msg);
    if (msg.event !== 150 /* SessionStarted */) {
      throw new VolcengineVoiceError(
        `expected SessionStarted, got ${Event[msg.event]}`
      );
    }
    send(
      ws,
      new Message({
        type: 1 /* FullClientRequest */,
        flag: 4 /* WithEvent */,
        event: 200 /* TaskRequest */,
        session_id: sessionId,
        payload: Buffer.from(
          JSON.stringify({
            ...basePayload,
            event: 200 /* TaskRequest */,
            req_params: { ...reqParams, text }
          }),
          "utf-8"
        )
      })
    );
    send(
      ws,
      new Message({
        type: 1 /* FullClientRequest */,
        flag: 4 /* WithEvent */,
        event: 102 /* FinishSession */,
        session_id: sessionId,
        payload: Buffer.from("{}")
      })
    );
    let sessionDone = false;
    while (true) {
      msg = await recv(stream, timeoutMs);
      assertNoServerError(msg);
      if (msg.type === 11 /* AudioOnlyServer */) {
        if (msg.payload.length) onAudio(msg.payload);
      } else if (msg.type === 9 /* FullServerResponse */) {
        if (msg.event === 359 /* TTSEnded */ || msg.event === 152 /* SessionFinished */) {
          if (msg.event === 152 /* SessionFinished */) sessionDone = true;
          break;
        }
        continue;
      }
    }
    if (!sessionDone) {
      send(
        ws,
        new Message({
          type: 1 /* FullClientRequest */,
          flag: 4 /* WithEvent */,
          event: 102 /* FinishSession */,
          session_id: sessionId,
          payload: Buffer.from("{}")
        })
      );
      try {
        await recv(stream, timeoutMs);
      } catch {
      }
    }
    send(
      ws,
      new Message({
        type: 1 /* FullClientRequest */,
        flag: 4 /* WithEvent */,
        event: 2 /* FinishConnection */,
        payload: Buffer.from("{}")
      })
    );
    try {
      await recv(stream, timeoutMs);
    } catch {
    }
  } finally {
    try {
      ws.close();
    } catch {
    }
  }
}
function isDefiniteAsrResult(result) {
  if (result.is_final === true) return true;
  const utterances = result.utterances;
  if (!Array.isArray(utterances) || utterances.length === 0) return false;
  const last = utterances[utterances.length - 1];
  return typeof last === "object" && last !== null && last.definite === true;
}
async function* chunkSource(source, segmentBytes) {
  if (typeof source === "string") {
    source = await readFile(source);
  }
  if (Buffer.isBuffer(source)) {
    for (let i = 0; i < source.length; i += segmentBytes) {
      yield source.subarray(i, i + segmentBytes);
    }
    return;
  }
  let buf = Buffer.alloc(0);
  for await (const chunk of source) {
    if (chunk.length === 0) continue;
    buf = Buffer.concat([buf, chunk]);
    while (buf.length >= segmentBytes) {
      yield buf.subarray(0, segmentBytes);
      buf = buf.subarray(segmentBytes);
    }
  }
  if (buf.length) yield buf;
}
async function asrStream(pcmSource, apiKey, onText, options = {}) {
  const {
    sampleRate = 16e3,
    bits = 16,
    channel = 1,
    modelName = "bigmodel",
    enableItn = true,
    enablePunc = true,
    enableDdc = true,
    showUtterances = true,
    segmentDurationMs = 200,
    endpointingMs,
    minSpeechMs,
    resourceId = "volc.bigasr.sauc.duration",
    requestId,
    timeoutMs = 3e4,
    signal
  } = options;
  const headers = buildHeaders(apiKey, resourceId, requestId);
  const uid = headers["X-Api-Request-Id"];
  const segmentBytes = Math.max(
    1,
    Math.floor(sampleRate * (bits / 8) * channel * segmentDurationMs / 1e3)
  );
  const initPayload = {
    user: { uid },
    audio: {
      format: "pcm",
      codec: "raw",
      rate: sampleRate,
      bits,
      channel
    },
    request: {
      model_name: modelName,
      enable_itn: enableItn,
      enable_punc: enablePunc,
      enable_ddc: enableDdc,
      show_utterances: showUtterances,
      // 二遍识别 + VAD 分段：只有 enable_nonstream=true 时服务端才输出
      // definite final（配合 end_window_size 实现流式自动断句）。
      enable_nonstream: true,
      // 服务端端点检测：静音超时自动断句（输出 definite），客户端能量 VAD 不再决定句界。
      ...endpointingMs !== void 0 ? { end_window_size: endpointingMs } : {},
      ...minSpeechMs !== void 0 ? { force_to_speech_time: minSpeechMs } : {}
    }
  };
  const { ws, stream } = await openWS(ASR_URL, headers, timeoutMs, signal);
  let seq = 1;
  const initMsg = new Message({
    type: 1 /* FullClientRequest */,
    flag: 1 /* PositiveSeq */,
    serialization: 1 /* JSON */,
    compression: 1 /* Gzip */,
    sequence: seq,
    payload: gzipSync(Buffer.from(JSON.stringify(initPayload), "utf-8"))
  });
  const state = {
    recvError: null,
    finished: false
  };
  const receiver = (async () => {
    try {
      while (true) {
        const msg = await recv(stream, timeoutMs);
        if (msg.type === 15 /* Error */) {
          assertNoServerError(msg);
          continue;
        }
        const payload = msg.jsonPayload();
        if (msg.type === 9 /* FullServerResponse */ && payload) {
          const result = payload.result;
          if (result && typeof result === "object") {
            const r = result;
            const isFinal = isDefiniteAsrResult(r) || Boolean(msg.flag & 2 /* LastNoSeq */);
            const out = {
              text: typeof r.text === "string" ? r.text : "",
              is_final: isFinal,
              utterances: Array.isArray(r.utterances) ? r.utterances : [],
              raw: payload
            };
            onText(out);
            if (isFinal || msg.flag & 2 /* LastNoSeq */) {
              state.finished = true;
              const q = pcmSource;
              q?.abort?.();
              return;
            }
          } else if (msg.flag & 2 /* LastNoSeq */) {
            return;
          }
        }
      }
    } catch (e) {
      if (signal?.aborted !== true) state.recvError = e;
    }
  })();
  try {
    send(ws, initMsg);
    seq += 1;
    let prev = null;
    for await (const chunk of chunkSource(pcmSource, segmentBytes)) {
      if (state.finished) break;
      if (prev !== null) {
        send(
          ws,
          new Message({
            type: 2 /* AudioOnlyClient */,
            flag: 1 /* PositiveSeq */,
            serialization: 1 /* JSON */,
            compression: 1 /* Gzip */,
            sequence: seq,
            payload: gzipSync(prev)
          })
        );
        seq += 1;
      }
      prev = chunk;
    }
    if (!state.finished && signal?.aborted !== true) {
      const finalBytes = prev ?? Buffer.alloc(0);
      send(
        ws,
        new Message({
          type: 2 /* AudioOnlyClient */,
          flag: 3 /* NegativeSeq */,
          serialization: 1 /* JSON */,
          compression: 1 /* Gzip */,
          sequence: -seq,
          payload: gzipSync(finalBytes)
        })
      );
    }
  } catch (e) {
    if (signal?.aborted !== true && state.recvError === null) state.recvError = e;
    ws.terminate();
  }
  try {
    if (signal?.aborted === true) ws.terminate();
    await receiver;
    if (state.recvError !== null) throw state.recvError;
  } finally {
    try {
      ws.close();
    } catch {
    }
  }
}

// src/host/voice-trust.ts
function isLoopbackHostname(hostname) {
  if (hostname === "localhost" || hostname === "[::1]") return true;
  const parts = hostname.split(".");
  return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
function isTrustedVoiceRequest(req) {
  const host = req.headers.host;
  if (typeof host !== "string") return false;
  let hostUrl;
  try {
    hostUrl = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false;
  if (req.headers["sec-fetch-site"] === "cross-site") return false;
  const origin = req.headers.origin;
  if (origin === void 0) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
function rejectWebSocketUpgrade(socket) {
  socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
  socket.destroy();
}

// src/host/bounded-queue.ts
var BoundedQueue = class {
  constructor(maxBytes = 1024 * 1024) {
    this.maxBytes = maxBytes;
  }
  buf = [];
  waiters = [];
  ended = false;
  aborted = false;
  bytes = 0;
  /** 入队一帧音频；超上限或已结束/取消时返回 false（帧被拒绝，不记入队列）。 */
  push(chunk) {
    if (this.ended || this.aborted || chunk.length === 0) return false;
    if (chunk.length > this.maxBytes || this.bytes + chunk.length > this.maxBytes) return false;
    const w = this.waiters.shift();
    if (w !== void 0) {
      w({ value: chunk, done: false });
    } else {
      this.buf.push(chunk);
      this.bytes += chunk.length;
    }
    return true;
  }
  /** 正常结束：剩余帧消费完后迭代器返回 done，调用方据此发 NegativeSeq 收尾等最终结果。 */
  end() {
    if (this.ended) return;
    this.ended = true;
    this.drainWaiters();
  }
  /** 取消：清空队列并结束，调用方据此直接丢弃、不再等结果。 */
  abort() {
    if (this.aborted) return;
    this.aborted = true;
    this.ended = true;
    this.buf = [];
    this.bytes = 0;
    this.drainWaiters();
  }
  get isEnded() {
    return this.ended;
  }
  get isAborted() {
    return this.aborted;
  }
  get size() {
    return this.bytes;
  }
  drainWaiters() {
    let w = this.waiters.shift();
    while (w !== void 0) {
      w({ value: void 0, done: true });
      w = this.waiters.shift();
    }
  }
  [Symbol.asyncIterator]() {
    return {
      next: () => {
        const item = this.buf.shift();
        if (item !== void 0) {
          this.bytes -= item.length;
          return Promise.resolve({ value: item, done: false });
        }
        if (this.ended) return Promise.resolve({ value: void 0, done: true });
        return new Promise((resolve) => {
          this.waiters.push(resolve);
        });
      }
    };
  }
};

// src/host/asr-utterance.ts
var ENDPOINTING_MS = 800;
var MIN_SPEECH_MS = 1e3;
var AsrUtterance = class {
  constructor(apiKey, id, onFinal, onPartial, onError, onSettled = () => {
  }) {
    this.apiKey = apiKey;
    this.onFinal = onFinal;
    this.onPartial = onPartial;
    this.onError = onError;
    this.onSettled = onSettled;
    this.id = id;
  }
  id;
  queue = new BoundedQueue();
  cancelled = false;
  finished = false;
  abortController = new AbortController();
  /** 启动流式识别（并发 sender/receiver）。 */
  start() {
    void (async () => {
      try {
        await asrStream(this.queue, this.apiKey, (r) => {
          if (this.cancelled) return;
          if (r.is_final) {
            const t = r.text.trim();
            if (t !== "") this.onFinal(t);
          } else {
            const t = r.text.trim();
            if (t !== "") this.onPartial(t);
          }
        }, {
          endpointingMs: ENDPOINTING_MS,
          minSpeechMs: MIN_SPEECH_MS,
          signal: this.abortController.signal
        });
      } catch (e) {
        if (!this.cancelled) this.onError(e);
      } finally {
        this.finished = true;
        this.onSettled();
      }
    })();
  }
  /** 喂一帧音频；已结束/已取消时静默丢弃。 */
  push(pcm) {
    if (this.finished || this.cancelled) return false;
    return this.queue.push(pcm);
  }
  /** 正常停止：结束音频流，等待服务端最终结果（exactly-once）。 */
  end() {
    if (this.finished || this.cancelled) return;
    this.queue.end();
  }
  /** 取消：直接丢弃，不提交最终结果。 */
  cancel() {
    if (this.finished) return;
    this.cancelled = true;
    this.queue.abort();
    this.abortController.abort();
  }
  get isFinished() {
    return this.finished;
  }
};

// src/host/voice-server.ts
var SENT_RE = /^([^。！？!?.\n]+[。！？!?.\n]+)([\s\S]*)$/;
var MAX_FRAME_BYTES = 1024 * 1024;
var MAX_TEXT_LEN = 1e4;
var MAX_TTS_BUFFER_CHARS = 2e4;
var MAX_CONNECTIONS = 8;
var MAX_SESSION_MS = 60 * 60 * 1e3;
var VOICE_RMS_THRESHOLD = 300;
function popSentence(text) {
  const m = text.trimStart().match(SENT_RE);
  if (m) return [(m[1] ?? "").trim(), m[2] ?? ""];
  return [null, text];
}
function hasVoiceEnergy(pcm, threshold = VOICE_RMS_THRESHOLD) {
  const n = Math.floor(pcm.length / 2);
  if (n === 0) return false;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const s = pcm.readInt16LE(i * 2);
    sum += s * s;
  }
  return Math.sqrt(sum / n) > threshold;
}
var VoiceSession = class {
  constructor(ws, defaultApiKey, defaultVoice, cancelAgent) {
    this.ws = ws;
    this.cancelAgent = cancelAgent;
    this.apiKey = defaultApiKey;
    this.voice = defaultVoice;
  }
  voiceSessionId = randomUUID2();
  ttsBuf = "";
  apiKey;
  voice;
  /** 朗读期硬门控：true 时丢弃麦克风帧，避免外放朗读声被录进去当新指令。 */
  ttsActive = false;
  acceptingAudio = false;
  disposed = false;
  currentUt = null;
  utSeq = 0;
  ttsSeq = 0;
  msgSeq = 0;
  ttsGeneration = 0;
  ttsAbort = null;
  /** 浏览器当前所在的 DSH 会话（config 消息携带），用于打断时取消 agent 回合。 */
  dshSessionId = "";
  applyConfig(data) {
    if (typeof data.voice === "string" && data.voice) this.voice = data.voice;
    if (typeof data.dshSessionId === "string" && data.dshSessionId) this.dshSessionId = data.dshSessionId;
  }
  feedAudio(pcm) {
    if (!this.acceptingAudio || this.ttsActive || this.disposed) return;
    if (this.currentUt === null) {
      if (!hasVoiceEnergy(pcm)) return;
      this.startUtterance();
    }
    const ut = this.currentUt;
    if (ut !== null && !ut.push(pcm)) {
      ut.cancel();
      if (this.currentUt === ut) this.currentUt = null;
      this.acceptingAudio = false;
      this.send({
        type: "error",
        voiceSessionId: this.voiceSessionId,
        message: "asr: audio queue overflow",
        sequence: ++this.msgSeq
      });
    }
  }
  /** 显式打开一个识别回合；同一时刻只允许一个 utterance owner。 */
  asrStart() {
    if (this.disposed) return;
    this.currentUt?.cancel();
    this.currentUt = null;
    this.acceptingAudio = true;
  }
  startUtterance() {
    const id = String(++this.utSeq);
    const session = this.voiceSessionId;
    const ut = new AsrUtterance(
      this.apiKey,
      id,
      (text) => {
        if (this.currentUt === ut) this.currentUt = null;
        this.acceptingAudio = false;
        this.send({ type: "asr_final", voiceSessionId: session, utteranceId: id, text, sequence: ++this.msgSeq });
      },
      (text) => {
        this.send({ type: "asr_partial", voiceSessionId: session, utteranceId: id, text, sequence: ++this.msgSeq });
      },
      (err) => {
        if (this.currentUt === ut) this.currentUt = null;
        this.acceptingAudio = false;
        this.send({ type: "error", voiceSessionId: session, message: `asr: ${err.message}`, sequence: ++this.msgSeq });
      },
      () => {
        if (this.currentUt === ut) this.currentUt = null;
      }
    );
    this.currentUt = ut;
    ut.start();
  }
  /** 正常停止：发送音频结束并等待最终结果（exactly-once）。 */
  asrEnd() {
    this.acceptingAudio = false;
    this.currentUt?.end();
    this.currentUt = null;
  }
  /** 取消：直接丢弃，不提交结果。 */
  asrCancel() {
    this.acceptingAudio = false;
    this.currentUt?.cancel();
    this.currentUt = null;
  }
  /** 单一串行 TTS worker：所有合成请求排队执行，天然保证顺序与并发=1。 */
  ttsChain = Promise.resolve();
  pushTts(text, voice) {
    if (this.disposed) return;
    if (this.ttsBuf.length + text.length > MAX_TTS_BUFFER_CHARS) {
      this.send({ type: "error", message: "tts: pending text is too large", sequence: ++this.msgSeq });
      return;
    }
    this.ttsBuf += text;
    void this.enqueueTts(async () => {
      for (; ; ) {
        const [sentence, rest] = popSentence(this.ttsBuf);
        if (sentence === null) break;
        this.ttsBuf = rest;
        await this.speak(sentence, voice || this.voice);
      }
    });
  }
  flushTts(voice) {
    return this.enqueueTts(async () => {
      const tail = this.ttsBuf.trim();
      this.ttsBuf = "";
      if (tail) await this.speak(tail, voice || this.voice);
      this.send({ type: "tts_idle", voiceSessionId: this.voiceSessionId, sequence: ++this.msgSeq });
    });
  }
  /** 把一次合成任务挂到串行链尾（前一个失败不阻断后一个）。 */
  enqueueTts(job) {
    const generation = this.ttsGeneration;
    const guarded = async () => {
      if (this.disposed || generation !== this.ttsGeneration) return;
      await job();
    };
    const next = this.ttsChain.then(guarded, guarded);
    this.ttsChain = next;
    return next;
  }
  async speak(text, voice) {
    const ttsId = String(++this.ttsSeq);
    const generation = this.ttsGeneration;
    const abort = new AbortController();
    this.ttsAbort = abort;
    this.ttsActive = true;
    try {
      this.send({ type: "tts_start", ttsId, text, sequence: ++this.msgSeq });
      let ok = false;
      try {
        await ttsStream(text, voice, this.apiKey, (chunk) => {
          if (!this.disposed && generation === this.ttsGeneration && !abort.signal.aborted && this.ws.readyState === WebSocket2.OPEN) {
            this.ws.send(chunk);
          }
        }, { signal: abort.signal });
        ok = true;
      } catch (e) {
        if (!this.disposed && generation === this.ttsGeneration) {
          this.send({ type: "tts_error", ttsId, message: `tts: ${e.message}`, sequence: ++this.msgSeq });
        }
      }
      if (ok && !this.disposed && generation === this.ttsGeneration) {
        this.send({ type: "tts_done", ttsId, sequence: ++this.msgSeq });
      }
    } finally {
      if (this.ttsAbort === abort) this.ttsAbort = null;
      this.ttsActive = false;
    }
  }
  /** 打断当前朗读并令已排队的旧代次任务全部失效；同时取消 agent 回合（barge-in）。 */
  cancelTts() {
    this.ttsGeneration++;
    this.ttsBuf = "";
    this.ttsAbort?.abort();
    this.ttsAbort = null;
    if (this.dshSessionId !== "") this.cancelAgent?.(this.dshSessionId);
  }
  /** WebSocket owner 释放时终止所有云端与本地异步资源。 */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.asrCancel();
    this.cancelTts();
  }
  send(obj) {
    if (this.ws.readyState === WebSocket2.OPEN) this.ws.send(JSON.stringify(obj));
  }
};
function createVoiceUpgrade(defaultApiKey, defaultVoice, cancelAgent) {
  const wss = new WebSocketServer({ noServer: true });
  wss.on("connection", (ws) => {
    if (wss.clients.size > MAX_CONNECTIONS) {
      ws.close(1008, "too many connections");
      return;
    }
    const lifetime = setTimeout(() => {
      ws.terminate();
    }, MAX_SESSION_MS);
    ws.on("close", () => {
      clearTimeout(lifetime);
    });
    const session = new VoiceSession(ws, defaultApiKey, defaultVoice, cancelAgent);
    ws.once("close", () => {
      session.dispose();
    });
    ws.send(JSON.stringify({
      type: "ready",
      voiceSessionId: session.voiceSessionId,
      asr: "volcano",
      tts: "volcano",
      voice: defaultVoice,
      hasKey: defaultApiKey.length > 0
    }));
    ws.on("message", (data, isBinary) => {
      const buf = Buffer.isBuffer(data) ? data : Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data);
      if (isBinary) {
        if (buf.length > MAX_FRAME_BYTES) return;
        session.feedAudio(buf);
        return;
      }
      if (buf.length > 64 * 1024) return;
      try {
        const parsed = JSON.parse(buf.toString("utf8"));
        if (typeof parsed !== "object" || parsed === null) return;
        const msg = parsed;
        const isMySession = (m) => typeof m.voiceSessionId !== "string" || m.voiceSessionId === session.voiceSessionId;
        switch (msg.type) {
          case "config":
            if (isMySession(msg)) session.applyConfig(msg);
            break;
          case "asr_start":
            if (isMySession(msg)) session.asrStart();
            break;
          case "asr_end":
            if (isMySession(msg)) session.asrEnd();
            break;
          case "asr_cancel":
            if (isMySession(msg)) session.asrCancel();
            break;
          case "tts_cancel":
            if (isMySession(msg)) session.cancelTts();
            break;
          case "tts_push": {
            if (!isMySession(msg)) break;
            const text = typeof msg.text === "string" ? msg.text : "";
            if (text.length > MAX_TEXT_LEN) return;
            session.pushTts(text, typeof msg.voice === "string" ? msg.voice : void 0);
            break;
          }
          case "tts_flush":
            if (isMySession(msg)) void session.flushTts(typeof msg.voice === "string" ? msg.voice : void 0);
            break;
          default:
            break;
        }
      } catch {
      }
    });
  });
  return {
    handle: (req, socket, head) => {
      if (!isTrustedVoiceRequest(req)) {
        rejectWebSocketUpgrade(socket);
        return;
      }
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    },
    close: () => {
      for (const client of wss.clients) client.terminate();
      wss.close();
    }
  };
}

// src/index.ts
var inject = ["webServer", "agents"];
var DEFAULT_VOICE = "zh_female_vv_uranus_bigtts";
function apply(ctx) {
  const upgrade = createVoiceUpgrade(
    process.env.VOLCENGINE_API_KEY ?? "",
    DEFAULT_VOICE,
    // barge-in：打断朗读时取消对应 DSH 会话的 agent 回合（用户打断）。
    (dshSessionId) => {
      if (dshSessionId === "") return;
      ctx.agents.get(SessionId(dshSessionId))?.cancel({ kind: "user" });
    }
  );
  ctx.effect(
    () => ctx.webServer.registerUpgrade({ path: "/voice", handler: upgrade.handle }),
    "ui-voice-live: /voice WebSocket route"
  );
  ctx.effect(() => upgrade.close, "ui-voice-live: /voice socket teardown");
}
export {
  apply,
  inject
};
