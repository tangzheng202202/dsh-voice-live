window.__ModuleLoader__.load({
  id: "@deepseek-ai/dsh-client-ui-voice-live",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/VoiceInputButton.tsx
var import_react = require("react");

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
var clsx_default = clsx;

// src/client/VoiceInputButton.tsx
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/usePipelineVoice.ts
var WS_URL = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/voice`;
var VOICE_OPTIONS = [
  { id: "zh_female_vv_uranus_bigtts", label: "\u6E29\u6696\u5973\u58F0" },
  { id: "zh_female_xiaohe_uranus_bigtts", label: "\u6E29\u67D4\u5973\u58F0" },
  { id: "zh_female_qingxinnvsheng_uranus_bigtts", label: "\u6E05\u65B0\u5973\u58F0" },
  { id: "zh_female_sajiaoxuemei_uranus_bigtts", label: "\u6492\u5A07\u5B66\u59B9" },
  { id: "zh_female_tianmeixiaoyuan_uranus_bigtts", label: "\u6E05\u7EAF\u751C\u7F8E\u5973\u58F0" },
  { id: "zh_female_tianmeitaozi_uranus_bigtts", label: "\u8F6F\u751C\u5973\u58F0" },
  { id: "zh_female_shuangkuaisisi_uranus_bigtts", label: "\u723D\u5FEB\u5973\u58F0" },
  { id: "zh_female_peiqi_uranus_bigtts", label: "\u7AE5\u58F0" },
  { id: "zh_female_linjianvhai_uranus_bigtts", label: "\u90BB\u5BB6\u5973\u5B69" },
  { id: "zh_female_kefunvsheng_uranus_bigtts", label: "\u6696\u9633\u5973\u58F0" },
  { id: "zh_female_xiaoxue_uranus_bigtts", label: "\u6E05\u6F88\u7AE5\u58F0" },
  { id: "zh_female_mizai_uranus_bigtts", label: "\u4FCF\u76AE\u5973\u58F0" },
  { id: "zh_female_jitangnv_uranus_bigtts", label: "\u6CBB\u6108\u5973\u58F0" },
  { id: "zh_female_meilinvyou_uranus_bigtts", label: "\u6E29\u67D4\u5973\u53CB\u58F0" },
  { id: "zh_female_liuchangnv_uranus_bigtts", label: "\u6D41\u7545\u5973\u58F0" },
  { id: "zh_female_yingyujiaoxue_uranus_bigtts", label: "\u6559\u5B66\u5973\u58F0" },
  { id: "zh_female_cancan_uranus_bigtts", label: "\u77E5\u6027\u5973\u58F0" },
  { id: "zh_male_m191_uranus_bigtts", label: "\u6C89\u7A33\u7537\u58F0" },
  { id: "zh_male_taocheng_uranus_bigtts", label: "\u6D3B\u529B\u9752\u5E74\u7537\u58F0" },
  { id: "zh_male_liufei_uranus_bigtts", label: "\u6D3B\u529B\u7537\u58F0" },
  { id: "zh_male_sophie_uranus_bigtts", label: "\u6E29\u67D4\u7537\u58F0" },
  { id: "zh_male_shaonianzixin_uranus_bigtts", label: "\u5C11\u5E74\u97F3" },
  { id: "zh_male_sunwukong_uranus_bigtts", label: "\u7334\u54E5\uFF08\u6D3B\u6CFC\u7537\u58F0\uFF09" },
  { id: "zh_male_dayi_uranus_bigtts", label: "\u6D51\u539A\u7537\u58F0" },
  { id: "zh_male_ruyayichen_uranus_bigtts", label: "\u5112\u96C5\u7537\u58F0" },
  { id: "saturn_zh_female_keainvsheng_tob", label: "\u53EF\u7231\u5973\u751F" },
  { id: "saturn_zh_female_tiaopigongzhu_tob", label: "\u8C03\u76AE\u516C\u4E3B" },
  { id: "saturn_zh_male_shuanglangshaonian_tob", label: "\u723D\u6717\u5C11\u5E74" },
  { id: "saturn_zh_male_tiancaitongzhuo_tob", label: "\u5929\u624D\u540C\u684C" },
  { id: "saturn_zh_female_cancan_tob", label: "\u77E5\u6027\u707F\u707F" }
];
var DEFAULT_VOICE = "zh_female_vv_uranus_bigtts";
function setActiveVoice(voice) {
  if (typeof localStorage !== "undefined") localStorage.setItem("dsh-voice", voice);
}
function getActiveVoice() {
  return (typeof localStorage !== "undefined" ? localStorage.getItem("dsh-voice") : null) ?? DEFAULT_VOICE;
}
var PROVIDERS = [
  { id: "volcengine", label: "\u706B\u5C71\u5F15\u64CE\uFF08\u8C46\u5305\uFF09" }
];
function getActiveProvider() {
  return "volcengine";
}
function setActiveProvider(provider) {
  if (provider === "volcengine" && typeof localStorage !== "undefined") {
    localStorage.setItem("dsh-voice-provider", provider);
  }
}
var REPLY_FIRST_TEXT = "\u597D\u7684\uFF0C\u6211\u53BB\u67E5\u4E00\u4E0B\u3002";
function getReplyFirst() {
  if (typeof localStorage === "undefined") return true;
  return localStorage.getItem("dsh-voice-reply-first") !== "0";
}
function setReplyFirst(on) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("dsh-voice-reply-first", on ? "1" : "0");
}
var DEFAULT_WAKE_WORD = "\u4F60\u597D\u5C0F\u6234";
function getWakeWordEnabled() {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("dsh-voice-wake") === "1";
}
function setWakeWordEnabled(on) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("dsh-voice-wake", on ? "1" : "0");
}
function getWakeWord() {
  if (typeof localStorage === "undefined") return DEFAULT_WAKE_WORD;
  return localStorage.getItem("dsh-voice-wakeword") ?? DEFAULT_WAKE_WORD;
}
function setWakeWord(word) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("dsh-voice-wakeword", word);
}
async function previewVoice(voice) {
  return await new Promise((resolve) => {
    let ws;
    try {
      ws = new WebSocket(WS_URL);
    } catch (error) {
      resolve({ ok: false, message: error.message });
      return;
    }
    ws.binaryType = "arraybuffer";
    const chunks = [];
    let currentTtsId = "";
    let settled = false;
    const timeout = setTimeout(() => {
      finish({ ok: false, message: "\u8BD5\u542C\u8D85\u65F6" });
    }, 15e3);
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      ws.close();
      resolve(result);
    };
    ws.onerror = () => {
      finish({ ok: false, message: "\u65E0\u6CD5\u8FDE\u63A5\u8BED\u97F3\u670D\u52A1\uFF08\u540E\u7AEF\u672A\u542F\u52A8\uFF09" });
    };
    ws.onclose = () => {
      if (!settled) finish({ ok: false, message: "\u8BED\u97F3\u8FDE\u63A5\u5DF2\u65AD\u5F00" });
    };
    ws.onmessage = (e) => {
      if (typeof e.data === "string") {
        let msg;
        try {
          const parsed = JSON.parse(e.data);
          if (typeof parsed !== "object" || parsed === null) return;
          msg = parsed;
        } catch {
          return;
        }
        if (msg.type === "ready") {
          if (msg.hasKey === false) {
            finish({ ok: false, message: "\u540E\u7AEF\u672A\u914D\u7F6E VOLCENGINE_API_KEY" });
            return;
          }
          const voiceSessionId = typeof msg.voiceSessionId === "string" ? msg.voiceSessionId : "";
          ws.send(JSON.stringify({ type: "config", voiceSessionId, provider: "volcengine", voice }));
          ws.send(JSON.stringify({ type: "tts_push", voiceSessionId, text: "\u4F60\u597D\uFF0C\u8FD9\u662F\u4F60\u9009\u62E9\u7684\u97F3\u8272\uFF0C\u542C\u8D77\u6765\u8FD8\u6EE1\u610F\u5417\uFF1F" }));
          ws.send(JSON.stringify({ type: "tts_flush", voiceSessionId }));
        } else if (msg.type === "tts_start") {
          currentTtsId = typeof msg.ttsId === "string" ? msg.ttsId : "";
        } else if (msg.type === "tts_done" && msg.ttsId === currentTtsId) {
          const audio = playOnce(chunks.splice(0), finish);
          if (audio === null) finish({ ok: false, message: "\u672A\u6536\u5230\u5408\u6210\u97F3\u9891" });
        } else if (msg.type === "tts_error" || msg.type === "error") {
          finish({ ok: false, message: typeof msg.message === "string" ? msg.message : "\u8BED\u97F3\u63A5\u53E3\u9519\u8BEF" });
        }
      } else if (e.data instanceof ArrayBuffer && currentTtsId !== "") {
        chunks.push(new Uint8Array(e.data));
      }
    };
  });
}
function playOnce(chunks, finish) {
  if (chunks.length === 0) return null;
  const blob = new Blob(chunks, { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  let settled = false;
  const done = (result) => {
    if (settled) return;
    settled = true;
    URL.revokeObjectURL(url);
    finish(result);
  };
  audio.onended = () => {
    done({ ok: true, message: "\u8BD5\u542C\u6210\u529F" });
  };
  audio.onerror = () => {
    done({ ok: false, message: "\u8BD5\u542C\u97F3\u9891\u64AD\u653E\u5931\u8D25" });
  };
  void audio.play().catch(() => {
    done({ ok: false, message: "\u6D4F\u89C8\u5668\u963B\u6B62\u4E86\u8BD5\u542C\u64AD\u653E" });
  });
  return audio;
}

// src/client/wake-word.ts
function speechRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}
function isSpeechRecognitionAvailable() {
  return speechRecognitionCtor() !== null;
}
var WebSpeechWakeWord = class {
  constructor(keyword, onWake) {
    this.keyword = keyword;
    this.onWake = onWake;
  }
  recognition = null;
  _active = false;
  /** 最近一次 start/onerror 的失败原因（空字符串 = 无错误）。 */
  lastError = "";
  get active() {
    return this._active;
  }
  /** 同步配置 + 启动；接口要求返回 Promise<boolean>，显式包装避免 async 空转。 */
  start() {
    this.lastError = "";
    const Ctor = speechRecognitionCtor();
    if (Ctor === null) {
      this.lastError = "SpeechRecognition API \u4E0D\u5B58\u5728";
      return Promise.resolve(false);
    }
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "zh-CN";
    rec.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i]?.[0]?.transcript ?? "";
        if (text.includes(this.keyword)) this.onWake();
      }
    };
    rec.onerror = (event) => {
      this.lastError = event.error || "unknown";
    };
    this.recognition = rec;
    try {
      rec.start();
      this._active = true;
      return Promise.resolve(true);
    } catch (error) {
      this.recognition = null;
      this.lastError = error.message || "start() threw";
      return Promise.resolve(false);
    }
  }
  stop() {
    try {
      this.recognition?.abort();
    } catch {
    }
    this.recognition = null;
    this._active = false;
  }
};
function createWakeWordDetector(keyword, onWake) {
  return new WebSpeechWakeWord(keyword, onWake);
}

// src/client/VoiceController.ts
var WS_URL2 = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/voice`;
var PCM_WORKLET = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(0);
  }
  process(inputs) {
    const input = inputs[0];
    if (input && input.length > 0 && input[0]) {
      const chunk = input[0];
      const merged = new Float32Array(this.buf.length + chunk.length);
      merged.set(this.buf, 0);
      merged.set(chunk, this.buf.length);
      if (merged.length >= 2048) {
        this.port.postMessage(merged.slice(0, 2048));
        this.buf = merged.slice(2048);
      } else {
        this.buf = merged;
      }
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;
var AudioCapture = class {
  constructor(onAudio, echoCancellation = true) {
    this.onAudio = onAudio;
    this.echoCancellation = echoCancellation;
  }
  stream = null;
  ctx = null;
  node = null;
  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: this.echoCancellation,
        noiseSuppression: true
      }
    });
    const ctx = new AudioContext({ sampleRate: 16e3 });
    this.stream = stream;
    this.ctx = ctx;
    let blobUrl = null;
    try {
      const src = ctx.createMediaStreamSource(stream);
      const mute = ctx.createGain();
      mute.gain.value = 0;
      mute.connect(ctx.destination);
      blobUrl = URL.createObjectURL(new Blob([PCM_WORKLET], { type: "application/javascript" }));
      await ctx.audioWorklet.addModule(blobUrl);
      const node = new AudioWorkletNode(ctx, "pcm-processor");
      node.port.onmessage = (ev) => {
        this.onAudio(toInt16(ev.data));
      };
      src.connect(node);
      node.connect(mute);
      this.node = node;
    } catch (error) {
      this.stop();
      throw error;
    } finally {
      if (blobUrl !== null) URL.revokeObjectURL(blobUrl);
    }
  }
  /** 回声消除实测探针：读取浏览器实际应用的约束（Chrome AEC3 是否生效）。 */
  getMicSettings() {
    return this.stream?.getTracks()[0]?.getSettings() ?? null;
  }
  /** AEC 是否被浏览器实际采纳（getUserMedia 请求了、约束报告也确认了）。 */
  get hasActiveAec() {
    const s = this.getMicSettings();
    return s?.echoCancellation === true;
  }
  stop() {
    try {
      this.node?.port.close();
    } catch {
    }
    this.node?.disconnect();
    this.node = null;
    this.stream?.getTracks().forEach((track) => {
      track.stop();
    });
    this.stream = null;
    void this.ctx?.close().catch(() => {
    });
    this.ctx = null;
  }
};
function toInt16(f32) {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    out[i] = Math.max(-1, Math.min(1, f32[i] ?? 0)) * 32767 | 0;
  }
  return out;
}
var PlaybackQueue = class {
  pending = /* @__PURE__ */ new Map();
  current = null;
  queue = [];
  /** 播放队列变空（无正在播放、无排队）时通知；用于应答模式的关闭时机。 */
  onIdle = null;
  /** 累积一个 ttsId 的音频分片。 */
  pushAudio(ttsId, chunk) {
    const list = this.pending.get(ttsId) ?? [];
    list.push(chunk);
    this.pending.set(ttsId, list);
  }
  /** 收到该 ttsId 的完整结束事件，封装成 blob 入播放队列。 */
  complete(ttsId) {
    const chunks = this.pending.get(ttsId);
    if (chunks === void 0 || chunks.length === 0) return;
    this.pending.delete(ttsId);
    const blob = new Blob(chunks, { type: "audio/mpeg" });
    this.queue.push({ url: URL.createObjectURL(blob) });
    this.pump();
  }
  /** 丢弃一个失败/取消的合成任务，避免残留分片占用内存。 */
  discard(ttsId) {
    this.pending.delete(ttsId);
  }
  pump() {
    if (this.current !== null || this.queue.length === 0) return;
    const item = this.queue.shift();
    if (item === void 0) return;
    const audio = new Audio(item.url);
    this.current = audio;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(item.url);
      if (this.current === audio) this.current = null;
      this.pump();
      this.maybeIdle();
    };
    audio.onended = finish;
    audio.onerror = finish;
    void audio.play().catch(finish);
  }
  maybeIdle() {
    if (this.current === null && this.queue.length === 0) this.onIdle?.();
  }
  /** 立即停止播放并清空（打断）。 */
  stop() {
    if (this.current !== null) {
      this.current.pause();
      this.current.onended = null;
      this.current.onerror = null;
      this.current = null;
    }
    for (const item of this.queue) URL.revokeObjectURL(item.url);
    this.queue = [];
    for (const chunks of this.pending.values()) chunks.length = 0;
    this.pending.clear();
  }
  get isPlaying() {
    return this.current !== null || this.queue.length > 0;
  }
};
var VoiceController = class _VoiceController {
  constructor(callbacks, echoCancellation = true, replyFirstText = "") {
    this.callbacks = callbacks;
    this.echoCancellation = echoCancellation;
    this.replyFirstText = replyFirstText;
    this.playback.onIdle = () => {
      this.maybeFinishReply();
    };
  }
  state = "idle";
  generation = 0;
  active = false;
  ws = null;
  capture = null;
  playback = new PlaybackQueue();
  voiceSessionId = "";
  capturing = false;
  currentTtsId = "";
  /** stop 后等待 asr_final 的超时兜底（正常路径收到 final 即提交）。 */
  stopTimer = null;
  readyResolve = null;
  /** 应答模式：语音提交后保持连接，用于朗读 agent 回复。 */
  replyMode = false;
  /** 回合结束标记：endReply 后播放空闲即关闭连接。 */
  replyDone = false;
  /** host 已处理完 tts_flush；必须等该确认，不能因本地暂时无音频而提前关连接。 */
  replyServerIdle = false;
  replyTimer = null;
  /** 同一语音会话已经提交的 utterance，抵御重复 final。 */
  submittedUtterances = /* @__PURE__ */ new Set();
  /** 当前 DSH 会话 id（随 config 上报，host 端打断时用它取消 agent 回合）。 */
  dshSessionId = "";
  /** 自动重连（单重连器）：任意时刻至多一个在途尝试/一个退避定时器。 */
  reconnectAttempts = 0;
  reconnectTimer = null;
  reconnectInFlight = false;
  static STOP_TIMEOUT_MS = 3e3;
  /** 应答模式空闲兜底：超过该时长无合成活动强制关闭。 */
  static REPLY_TIMEOUT_MS = 12e4;
  /** 重连退避起点（ms），每次失败翻倍直至上限。 */
  static RECONNECT_BASE_MS = 1e3;
  /** 单次重连失败上限；超过后进入 failed。 */
  static MAX_RECONNECT_ATTEMPTS = 5;
  get currentState() {
    return this.state;
  }
  get isActive() {
    return this.active;
  }
  /** 同步当前 DSH 会话 id（随 config 上报，供 host 端打断时取消 agent）。 */
  setDshSessionId(id) {
    this.dshSessionId = id;
  }
  /** 回声消除实测探针：true/false = 浏览器约束报告 AEC 开/关；null = 未采集。 */
  getMicAec() {
    return this.capture?.hasActiveAec ?? null;
  }
  setState(s) {
    if (this.state !== s) {
      this.state = s;
      this.callbacks.onState(s);
    }
  }
  /** 开始语音会话（acquiring → connecting → listening）。朗读中再次开始即打断上一轮。 */
  async start() {
    if (this.active) return;
    if (this.replyMode || this.ws !== null) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "tts_cancel", voiceSessionId: this.voiceSessionId }));
      }
      this.teardown();
    }
    const gen = ++this.generation;
    this.active = true;
    this.setState("acquiring");
    try {
      const capture = new AudioCapture((i16) => {
        if (!this.capturing || !this.active) return;
        if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(i16);
      }, this.echoCancellation);
      await capture.start();
      if (gen !== this.generation) {
        capture.stop();
        return;
      }
      this.capture = capture;
      this.setState("connecting");
      const ok = await this.connect(gen);
      if (!ok) {
        if (gen === this.generation) this.fail("\u65E0\u6CD5\u8FDE\u63A5\u8BED\u97F3\u670D\u52A1\uFF08\u540E\u7AEF\u672A\u542F\u52A8\uFF09");
        return;
      }
      this.setState("listening");
      this.capturing = true;
    } catch (e) {
      if (gen === this.generation) this.fail(e.message);
    }
  }
  connect(gen) {
    return new Promise((resolve) => {
      const ws = new WebSocket(WS_URL2);
      ws.binaryType = "arraybuffer";
      const timer = setTimeout(() => {
        ws.close();
        resolve(false);
      }, 3e3);
      ws.onopen = () => {
        clearTimeout(timer);
        if (gen !== this.generation) {
          ws.close();
          return;
        }
        ws.send(JSON.stringify({
          type: "config",
          provider: "volcengine",
          voice: localStorage.getItem("dsh-voice") ?? "zh_female_vv_uranus_bigtts",
          ...this.dshSessionId !== "" ? { dshSessionId: this.dshSessionId } : {}
        }));
      };
      ws.onmessage = (event) => {
        this.onMessage(gen, event);
      };
      ws.onclose = () => {
        clearTimeout(timer);
        this.readyResolve?.(false);
        this.readyResolve = null;
        if (gen === this.generation) {
          this.capturing = false;
          if (this.active && this.state !== "closing") this.scheduleReconnect();
        }
      };
      ws.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };
      this.ws = ws;
      this.readyResolve = resolve;
    });
  }
  /* ---- 自动重连（单重连器） ---- */
  scheduleReconnect() {
    if (this.reconnectInFlight || this.reconnectTimer !== null) return;
    this.reconnectAttempts++;
    const delay = Math.min(
      _VoiceController.RECONNECT_BASE_MS * 2 ** (this.reconnectAttempts - 1),
      1e4
    );
    this.setState("reconnecting");
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectInFlight = true;
      void this.doReconnect();
    }, delay);
  }
  async doReconnect() {
    try {
      const gen = ++this.generation;
      const ok = await this.connect(gen);
      this.reconnectInFlight = false;
      if (!ok) {
        if (this.reconnectAttempts >= _VoiceController.MAX_RECONNECT_ATTEMPTS) {
          this.fail("\u8BED\u97F3\u8FDE\u63A5\u5DF2\u65AD\u5F00\uFF0C\u91CD\u8FDE\u5931\u8D25");
          return;
        }
        this.scheduleReconnect();
        return;
      }
      this.reconnectAttempts = 0;
      this.capturing = true;
      this.setState("listening");
    } catch {
      this.reconnectInFlight = false;
      if (this.reconnectAttempts >= _VoiceController.MAX_RECONNECT_ATTEMPTS) {
        this.fail("\u8BED\u97F3\u8FDE\u63A5\u5DF2\u65AD\u5F00\uFF0C\u91CD\u8FDE\u5931\u8D25");
      } else {
        this.scheduleReconnect();
      }
    }
  }
  onMessage(gen, e) {
    if (gen !== this.generation) return;
    if (typeof e.data === "string") {
      let msg;
      try {
        const parsed = JSON.parse(e.data);
        if (typeof parsed !== "object" || parsed === null) return;
        msg = parsed;
      } catch {
        return;
      }
      if (msg.type === "ready") {
        this.voiceSessionId = typeof msg.voiceSessionId === "string" ? msg.voiceSessionId : "";
        if (msg.hasKey === false) {
          this.readyResolve?.(false);
          this.readyResolve = null;
          this.fail("\u540E\u7AEF\u672A\u914D\u7F6E VOLCENGINE_API_KEY");
          return;
        }
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "asr_start", voiceSessionId: this.voiceSessionId }));
        }
        this.readyResolve?.(true);
        this.readyResolve = null;
        return;
      }
      if (msg.type === "asr_final" && typeof msg.text === "string") {
        const utteranceId = typeof msg.utteranceId === "string" ? msg.utteranceId : "";
        if (utteranceId !== "" && this.submittedUtterances.has(utteranceId)) return;
        if (utteranceId !== "") this.submittedUtterances.add(utteranceId);
        const text = msg.text;
        this.active = false;
        this.stopCapture();
        this.clearStopTimer();
        this.setState("thinking");
        this.callbacks.onFinal(text);
        this.enterReplyMode();
        return;
      }
      if (this.state === "closing" || this.state === "failed") return;
      if (msg.type === "asr_partial" && typeof msg.text === "string") {
        this.callbacks.onPartial(msg.text);
      } else if (msg.type === "tts_start") {
        this.currentTtsId = typeof msg.ttsId === "string" ? msg.ttsId : "";
        this.setState("synthesizing");
      } else if (msg.type === "tts_done") {
        const ttsId = typeof msg.ttsId === "string" ? msg.ttsId : "";
        this.playback.complete(ttsId);
        if (this.currentTtsId === ttsId) this.currentTtsId = "";
        this.setState(this.capturing ? "listening" : "playing");
      } else if (msg.type === "tts_error") {
        const ttsId = typeof msg.ttsId === "string" ? msg.ttsId : "";
        this.playback.discard(ttsId);
        if (this.currentTtsId === ttsId) this.currentTtsId = "";
        this.callbacks.onError(typeof msg.message === "string" ? msg.message : "TTS \u5931\u8D25");
      } else if (msg.type === "tts_idle") {
        this.replyServerIdle = true;
        this.maybeFinishReply();
      } else if (msg.type === "error") {
        this.callbacks.onError(typeof msg.message === "string" ? msg.message : "\u8BED\u97F3\u63A5\u53E3\u9519\u8BEF");
      }
    } else if (e.data instanceof ArrayBuffer && this.currentTtsId !== "") {
      this.playback.pushAudio(this.currentTtsId, new Uint8Array(e.data));
    }
  }
  /** 正常停止：发送音频结束并等待最终结果（stop=await final），提交后进入应答模式。 */
  stop() {
    if (!this.active) return;
    this.active = false;
    this.stopCapture();
    this.setState("closing");
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "asr_end", voiceSessionId: this.voiceSessionId }));
      this.stopTimer = setTimeout(() => {
        this.teardown();
      }, _VoiceController.STOP_TIMEOUT_MS);
    } else {
      this.teardown();
    }
  }
  /** 取消：直接丢弃，立即关闭。 */
  cancel() {
    if (!this.active && !this.replyMode && this.ws === null && this.capture === null) return;
    this.active = false;
    this.stopCapture();
    this.setState("closing");
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "asr_cancel", voiceSessionId: this.voiceSessionId }));
      this.ws.send(JSON.stringify({ type: "tts_cancel", voiceSessionId: this.voiceSessionId }));
    }
    this.teardown();
  }
  /* ---- 回复朗读（应答模式） ---- */
  /** 把 agent 回复文本增量推给后端合成（host 端按标点切句、串行合成）。 */
  pushReplyText(text) {
    if (!this.replyMode) return;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.replyServerIdle = false;
      this.ws.send(JSON.stringify({ type: "tts_push", voiceSessionId: this.voiceSessionId, text }));
      this.armReplyTimer();
    }
  }
  /** 回合结束：flush 未合完的尾巴。 */
  flushReply() {
    if (this.replyMode && this.ws?.readyState === WebSocket.OPEN) {
      this.replyServerIdle = false;
      this.ws.send(JSON.stringify({ type: "tts_flush", voiceSessionId: this.voiceSessionId }));
    }
  }
  /**
   * 回合结束（组件在 running=false 时调用）：回复已全部推送，
   * 等 host 确认 flush 已处理且本地播放空闲后关闭连接。
   */
  endReply() {
    if (!this.replyMode) return;
    this.replyDone = true;
    this.maybeFinishReply();
  }
  enterReplyMode() {
    if (this.replyMode) return;
    this.replyMode = true;
    this.replyDone = false;
    this.replyServerIdle = false;
    this.armReplyTimer();
    if (this.replyFirstText !== "") this.pushReplyText(this.replyFirstText);
  }
  maybeFinishReply() {
    if (this.replyMode && this.replyDone && this.replyServerIdle && !this.playback.isPlaying) {
      this.teardown();
    }
  }
  stopCapture() {
    this.capturing = false;
    this.capture?.stop();
    this.capture = null;
  }
  armReplyTimer() {
    if (this.replyTimer !== null) clearTimeout(this.replyTimer);
    this.replyTimer = setTimeout(() => {
      this.teardown();
    }, _VoiceController.REPLY_TIMEOUT_MS);
  }
  clearReplyTimer() {
    if (this.replyTimer !== null) {
      clearTimeout(this.replyTimer);
      this.replyTimer = null;
    }
  }
  clearStopTimer() {
    if (this.stopTimer !== null) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
  }
  teardown() {
    this.generation++;
    this.clearStopTimer();
    this.clearReplyTimer();
    this.clearReconnect();
    this.replyMode = false;
    this.replyDone = false;
    this.replyServerIdle = false;
    this.active = false;
    this.stopCapture();
    this.ws?.close();
    this.ws = null;
    this.voiceSessionId = "";
    this.currentTtsId = "";
    this.submittedUtterances.clear();
    this.playback.stop();
    this.setState("idle");
  }
  clearReconnect() {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectInFlight = false;
    this.reconnectAttempts = 0;
  }
  fail(message) {
    this.active = false;
    this.stopCapture();
    this.setState("failed");
    this.callbacks.onError(message);
    this.teardown();
  }
};

// css-module:/workspace/src/client/VoiceInputButton.module.css
var css = "._28e688_mic {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 28px;\n  height: 28px;\n  border: none;\n  border-radius: 999px;\n  background: var(--dsw-specific-selector);\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n}\n\n._28e688_mic:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover-solid);\n}\n\n._28e688_mic:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n._28e688_active {\n  background: var(--dsw-alias-button-danger-fill, #c0392b);\n  color: #fff;\n}\n\n._28e688_error {\n  background: var(--dsw-alias-button-danger-fill, #c0392b);\n  color: #fff;\n  outline: 2px solid #e74c3c;\n  outline-offset: 1px;\n}\n\n/* \u79D1\u6280\u611F\u5706\u7403\uFF1Aactive \u65F6\u6E10\u53D8\u6838\u5FC3 + \u53CC\u5C42\u6269\u6563\u6CE2\u7EB9\u3002 */\n._28e688_orb {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 18px;\n  height: 18px;\n}\n\n._28e688_orbCore {\n  width: 10px;\n  height: 10px;\n  border-radius: 999px;\n  background: radial-gradient(circle at 32% 30%, #fff, #7fd0ff 38%, #2f81f7 70%, #1447a6);\n  box-shadow: 0 0 8px rgba(47, 129, 247, 0.9), 0 0 2px rgba(255, 255, 255, 0.8);\n}\n\n._28e688_orbRing {\n  position: absolute;\n  inset: 0;\n  border-radius: 999px;\n  border: 1px solid rgba(127, 208, 255, 0.85);\n  animation: _28e688_orb-pulse 1.6s ease-out infinite;\n}\n\n._28e688_orbRing:nth-child(3) {\n  animation-delay: 0.8s;\n}\n\n@keyframes _28e688_orb-pulse {\n  0% {\n    transform: scale(0.6);\n    opacity: 0.9;\n  }\n  100% {\n    transform: scale(2.1);\n    opacity: 0;\n  }\n}\n\n/* \u9EA6\u514B\u98CE\u6309\u94AE\u5BB9\u5668\uFF1A\u5B57\u5E55\u6D6E\u5C42\u5B9A\u4F4D\u951A\u70B9\u3002 */\n._28e688_wrap {\n  position: relative;\n  display: inline-flex;\n}\n\n/* \u5B9E\u65F6\u5B57\u5E55\uFF1A\u8BC6\u522B\u4E2D\u7684 asr_partial \u60AC\u6D6E\u663E\u793A\u5728\u6309\u94AE\u4E0A\u65B9\u3002 */\n._28e688_caption {\n  position: absolute;\n  bottom: calc(100% + 6px);\n  left: 50%;\n  transform: translateX(-50%);\n  max-width: 320px;\n  padding: 4px 10px;\n  border-radius: 8px;\n  background: rgba(0, 0, 0, 0.72);\n  color: #fff;\n  font-size: 12px;\n  line-height: 1.4;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  pointer-events: none;\n  z-index: 30;\n}\n";
var tagId = "@deepseek-ai/dsh-client-ui-voice-live/VoiceInputButton.module.css";
if (typeof document !== "undefined" && document.head && !document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]")) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-voice-live";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
var VoiceInputButton_default = { "orb-pulse": "_28e688_orb-pulse", "mic": "_28e688_mic", "active": "_28e688_active", "error": "_28e688_error", "orb": "_28e688_orb", "orbCore": "_28e688_orbCore", "orbRing": "_28e688_orbRing", "wrap": "_28e688_wrap", "caption": "_28e688_caption" };

// src/client/VoiceInputButton.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ACTIVE_STATES = /* @__PURE__ */ new Set([
  "acquiring",
  "connecting",
  "listening",
  "recognizing",
  "thinking",
  "synthesizing",
  "playing",
  "interrupting",
  "reconnecting"
]);
function replyTextOf(p) {
  if (p === null) return "";
  let out = "";
  for (const b of p.blocks) {
    if (b.kind === "text" && typeof b.text === "string") out += b.text;
  }
  return out;
}
function VoiceInputButton({ inputActions, useSession, t }) {
  const [state, setState] = (0, import_react.useState)("idle");
  const [error, setError] = (0, import_react.useState)(null);
  const [caption, setCaption] = (0, import_react.useState)("");
  const controllerRef = (0, import_react.useRef)(null);
  const voiceTurnRef = (0, import_react.useRef)(false);
  const spokenLenRef = (0, import_react.useRef)(0);
  const controller = () => {
    if (controllerRef.current === null) {
      controllerRef.current = new VoiceController({
        onState: setState,
        onPartial: (text) => {
          inputActions.setDraft(text);
          setCaption(text);
        },
        onFinal: (text) => {
          voiceTurnRef.current = true;
          inputActions.setDraft(text);
          setCaption("");
          inputActions.submit();
        },
        onError: (message) => {
          setError(message);
        }
      }, void 0, getReplyFirst() ? REPLY_FIRST_TEXT : "");
    }
    return controllerRef.current;
  };
  const running = useSession((s) => s.running);
  const partial = useSession((s) => s.partial);
  const dshSessionId = useSession((s) => s.sessionId);
  (0, import_react.useEffect)(() => {
    controllerRef.current?.setDshSessionId(dshSessionId);
  }, [dshSessionId]);
  const wakeDetectorRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!getWakeWordEnabled()) return;
    let stopped = false;
    const detector = createWakeWordDetector(getWakeWord(), () => {
      if (stopped) return;
      const c = controller();
      if (!c.isActive) void c.start();
    });
    wakeDetectorRef.current = detector;
    void detector.start();
    return () => {
      stopped = true;
      detector.stop();
      wakeDetectorRef.current = null;
    };
  }, []);
  (0, import_react.useEffect)(() => {
    const c = controllerRef.current;
    if (c === null) return;
    if (!running) {
      if (voiceTurnRef.current) {
        c.flushReply();
        c.endReply();
        voiceTurnRef.current = false;
        spokenLenRef.current = 0;
      }
      return;
    }
    if (!voiceTurnRef.current) return;
    const text = replyTextOf(partial);
    if (text.length < spokenLenRef.current) spokenLenRef.current = 0;
    if (text.length > spokenLenRef.current) {
      c.pushReplyText(text.slice(spokenLenRef.current));
      spokenLenRef.current = text.length;
    }
  }, [running, partial]);
  (0, import_react.useEffect)(() => () => {
    controllerRef.current?.cancel();
  }, []);
  const active = ACTIVE_STATES.has(state);
  const tooltip = error ?? (active ? t("voice.micActive") : t("voice.mic"));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: VoiceInputButton_default.wrap, children: [
    active && caption !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: VoiceInputButton_default.caption, "aria-hidden": true, children: caption }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Tooltip, { label: tooltip, side: "top", delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        className: clsx_default(VoiceInputButton_default.mic, active && VoiceInputButton_default.active, error && VoiceInputButton_default.error),
        "aria-label": error ?? t("voice.mic"),
        "aria-pressed": active,
        onClick: () => {
          setError(null);
          const c = controller();
          if (c.isActive) c.stop();
          else void c.start();
        },
        children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: VoiceInputButton_default.orb, "aria-hidden": true, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: VoiceInputButton_default.orbCore }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: VoiceInputButton_default.orbRing }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: VoiceInputButton_default.orbRing })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { viewBox: "0 0 16 16", width: "16", height: "16", "aria-hidden": true, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 1a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 1 1-5 0v-3A2.5 2.5 0 0 1 8 1Z", fill: "currentColor" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5 7.5a4.5 4.5 0 0 0 9 0h-1.5a3 3 0 0 1-6 0h-1.5Z", fill: "currentColor" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 11.75a4.25 4.25 0 0 1-4.25-4.25H2.25A5.75 5.75 0 0 0 7.25 13.2V15h1.5v-1.8a5.75 5.75 0 0 0 5-5.7h-1.5A4.25 4.25 0 0 1 8 11.75Z", fill: "currentColor" })
        ] })
      }
    ) })
  ] });
}

// src/client/VoiceSettingsSection.tsx
var import_react2 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// css-module:/workspace/src/client/VoiceSettingsSection.module.css
var css2 = "._745281_section {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  max-width: 420px;\n  padding: 8px 0;\n}\n\n._745281_heading {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--dsw-alias-label-primary);\n}\n\n._745281_field {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n._745281_label {\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary, #8b8b92);\n}\n\n._745281_input {\n  height: 32px;\n  padding: 0 10px;\n  border: 1px solid var(--dsw-alias-border, #303038);\n  border-radius: 8px;\n  background: var(--dsw-alias-interactive-bg, transparent);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  outline: none;\n}\n\n._745281_input:focus {\n  border-color: var(--dsw-alias-button-info-fill);\n}\n\n._745281_hint {\n  margin: 0;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary, #8b8b92);\n  line-height: 1.5;\n}\n\n._745281_keyRow,\n._745281_voiceRow {\n  display: flex;\n  gap: 8px;\n}\n\n._745281_keyRow ._745281_input,\n._745281_voiceRow ._745281_input {\n  flex: 1;\n  min-width: 0;\n}\n\n._745281_eyeButton,\n._745281_previewButton {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border, #303038);\n  border-radius: 8px;\n  background: var(--dsw-specific-selector);\n  color: var(--dsw-alias-label-secondary, #8b8b92);\n  cursor: pointer;\n  font-size: 13px;\n}\n\n._745281_previewButton:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n._745281_previewButton:hover:not(:disabled),\n._745281_eyeButton:hover {\n  background: var(--dsw-alias-interactive-bg-hover-solid);\n  color: var(--dsw-alias-label-primary);\n}\n\n._745281_okHint {\n  margin: 0;\n  font-size: 12px;\n  color: #2ecc71;\n}\n\n._745281_errHint {\n  margin: 0;\n  font-size: 12px;\n  color: #e74c3c;\n}\n\n._745281_checkbox {\n  margin-right: 6px;\n  accent-color: var(--dsw-alias-interactive-accent, #2f81f7);\n  vertical-align: -2px;\n}\n\n._745281_aecResult {\n  margin-left: 8px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary, #8a8f98);\n}\n";
var tagId2 = "@deepseek-ai/dsh-client-ui-voice-live/VoiceSettingsSection.module.css";
if (typeof document !== "undefined" && document.head && !document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId2) + "]")) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-voice-live";
  tag.dataset.pluginCss = tagId2;
  tag.textContent = css2;
  document.head.appendChild(tag);
}
var VoiceSettingsSection_default = { "section": "_745281_section", "heading": "_745281_heading", "field": "_745281_field", "label": "_745281_label", "input": "_745281_input", "hint": "_745281_hint", "keyRow": "_745281_keyRow", "voiceRow": "_745281_voiceRow", "eyeButton": "_745281_eyeButton", "previewButton": "_745281_previewButton", "okHint": "_745281_okHint", "errHint": "_745281_errHint", "checkbox": "_745281_checkbox", "aecResult": "_745281_aecResult" };

// src/client/VoiceSettingsSection.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function VoiceSettingsSection({ t }) {
  const [provider, setProvider] = (0, import_react2.useState)(getActiveProvider());
  const [voice, setVoice] = (0, import_react2.useState)(getActiveVoice());
  const [replyFirst, setReplyFirstState] = (0, import_react2.useState)(getReplyFirst());
  const [wakeEnabled, setWakeEnabledState] = (0, import_react2.useState)(getWakeWordEnabled());
  const [wakeWord, setWakeWordState] = (0, import_react2.useState)(getWakeWord());
  const [previewing, setPreviewing] = (0, import_react2.useState)(false);
  const [previewResult, setPreviewResult] = (0, import_react2.useState)(null);
  const [aecState, setAecState] = (0, import_react2.useState)(null);
  const [aecProbing, setAecProbing] = (0, import_react2.useState)(false);
  const [wakeDiag, setWakeDiag] = (0, import_react2.useState)(null);
  const [wakeProbing, setWakeProbing] = (0, import_react2.useState)(false);
  const preview = () => {
    setPreviewing(true);
    setPreviewResult(null);
    void previewVoice(voice).then((r2) => {
      setPreviewResult(r2);
    }).finally(() => {
      setPreviewing(false);
    });
  };
  const probeAec = async () => {
    setAecProbing(true);
    setAecState(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      const track = stream.getAudioTracks()[0];
      const applied = track?.getSettings().echoCancellation === true;
      track?.stop();
      setAecState(applied ? t("voice.aecOn") : t("voice.aecOff"));
    } catch {
      setAecState(t("voice.aecUnavailable"));
    } finally {
      setAecProbing(false);
    }
  };
  const probeWake = async () => {
    setWakeProbing(true);
    setWakeDiag(null);
    try {
      if (!isSpeechRecognitionAvailable()) {
        setWakeDiag(t("voice.wakeUnsupported"));
        return;
      }
      const det = new WebSpeechWakeWord(getWakeWord(), () => {
      });
      const ok = await det.start();
      if (!ok) {
        setWakeDiag(det.lastError || t("voice.wakeUnavailable"));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (det.lastError) {
        setWakeDiag(`${t("voice.wakeError")}: ${det.lastError}`);
      } else {
        setWakeDiag(t("voice.wakeOk"));
      }
      det.stop();
    } finally {
      setWakeProbing(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.section, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: VoiceSettingsSection_default.heading, children: t("voice.heading") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: VoiceSettingsSection_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.label, children: t("voice.provider") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "select",
        {
          className: VoiceSettingsSection_default.input,
          value: provider,
          onChange: (e) => {
            setProvider(e.target.value);
            setActiveProvider(e.target.value);
          },
          children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: p.id, children: p.label }, p.id))
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.label, children: t("voice.voice") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.voiceRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "select",
          {
            className: VoiceSettingsSection_default.input,
            value: voice,
            onChange: (e) => {
              setVoice(e.target.value);
              setActiveVoice(e.target.value);
            },
            children: VOICE_OPTIONS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: v.id, children: v.label }, v.id))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: VoiceSettingsSection_default.previewButton,
            disabled: previewing,
            onClick: preview,
            children: previewing ? "\u2026" : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.IconPlayOutline16, { size: 14 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: VoiceSettingsSection_default.field, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: VoiceSettingsSection_default.label, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          type: "checkbox",
          className: VoiceSettingsSection_default.checkbox,
          checked: replyFirst,
          onChange: (e) => {
            setReplyFirstState(e.target.checked);
            setReplyFirst(e.target.checked);
          }
        }
      ),
      t("voice.replyFirst")
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { className: VoiceSettingsSection_default.field, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: VoiceSettingsSection_default.label, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          type: "checkbox",
          className: VoiceSettingsSection_default.checkbox,
          checked: wakeEnabled,
          onChange: (e) => {
            setWakeEnabledState(e.target.checked);
            setWakeWordEnabled(e.target.checked);
          }
        }
      ),
      t("voice.wakeEnable")
    ] }) }),
    wakeEnabled && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.label, children: t("voice.wakeWord") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "input",
        {
          className: VoiceSettingsSection_default.input,
          type: "text",
          value: wakeWord,
          maxLength: 20,
          onChange: (e) => {
            setWakeWordState(e.target.value);
            setWakeWord(e.target.value);
          }
        }
      )
    ] }),
    wakeEnabled && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.label, children: t("voice.wakeProbe") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.voiceRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: VoiceSettingsSection_default.previewButton,
            disabled: wakeProbing,
            onClick: () => {
              void probeWake();
            },
            children: wakeProbing ? t("voice.wakeProbeBusy") : t("voice.wakeProbe")
          }
        ),
        wakeDiag !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.aecResult, children: wakeDiag })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: VoiceSettingsSection_default.hint, children: t("voice.wakeNetworkHint") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.label, children: t("voice.aecProbe") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: VoiceSettingsSection_default.voiceRow, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: VoiceSettingsSection_default.previewButton,
            disabled: aecProbing,
            onClick: () => {
              void probeAec();
            },
            children: aecProbing ? "\u2026" : t("voice.aecProbeAction")
          }
        ),
        aecState !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: VoiceSettingsSection_default.aecResult, children: aecState })
      ] })
    ] }),
    previewResult !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: previewResult.ok ? VoiceSettingsSection_default.okHint : VoiceSettingsSection_default.errHint, children: previewResult.message }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: VoiceSettingsSection_default.hint, children: t("voice.hint") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: VoiceSettingsSection_default.hint, children: t("voice.backendKeyHint") })
  ] });
}

// src/client/locales.ts
var NS = "voice";
var zh = {
  "voice.nav": "\u8BED\u97F3\u4EA4\u4E92",
  "voice.heading": "\u8BED\u97F3\u4EA4\u4E92",
  "voice.provider": "\u670D\u52A1\u5546",
  "voice.apiKey": "API Key",
  "voice.apiKeyPlaceholder": "\u7C98\u8D34\u4F60\u7684 API Key",
  "voice.voice": "\u97F3\u8272",
  "voice.hint": "\u97F3\u8272\u7528\u4E8E\u6717\u8BFB\u56DE\u7B54\uFF1BAPI Key \u7528\u4E8E\u6240\u9009\u670D\u52A1\u5546\u7684\u8BED\u97F3\u8BC6\u522B\u4E0E\u5408\u6210\u3002",
  "voice.preview": "\u8BD5\u542C",
  "voice.mic": "\u5B9E\u65F6\u8BED\u97F3",
  "voice.micActive": "\u5B9E\u65F6\u8BED\u97F3\u5BF9\u8BDD\u4E2D\uFF08\u70B9\u51FB\u7ED3\u675F\uFF09",
  "voice.backendKeyHint": "API Key \u7531\u540E\u7AEF\u63D0\u4F9B\uFF08~/.dsh/api-key.env \u4E2D\u7684 VOLCENGINE_API_KEY\uFF09\uFF0C\u65E0\u9700\u5728\u6B64\u586B\u5199\u3002",
  "voice.replyFirst": "\u5148\u54CD\u5E94\u540E\u601D\u8003\uFF08\u8BF4\u5B8C\u5148\u56DE\u5E94\u4E00\u53E5\uFF0C\u518D\u8BA9\u52A9\u624B\u53BB\u67E5\uFF09",
  "voice.aecProbe": "\u56DE\u58F0\u6D88\u9664\u68C0\u6D4B\uFF08\u53D7\u63A7\u6D4B\u8BD5\uFF1A\u626C\u58F0\u5668/\u8033\u673A\u5BF9\u6BD4\u7528\uFF09",
  "voice.aecProbeAction": "\u68C0\u6D4B",
  "voice.aecOn": "\u6D4F\u89C8\u5668\u5DF2\u5BF9\u9EA6\u514B\u98CE\u5E94\u7528\u56DE\u58F0\u6D88\u9664\uFF08AEC \u751F\u6548\uFF09",
  "voice.aecOff": "\u6D4F\u89C8\u5668\u672A\u5E94\u7528\u56DE\u58F0\u6D88\u9664\uFF08AEC \u672A\u751F\u6548\uFF09",
  "voice.aecUnavailable": "\u65E0\u6CD5\u8BBF\u95EE\u9EA6\u514B\u98CE\uFF08\u68C0\u67E5\u6D4F\u89C8\u5668\u6743\u9650\uFF09",
  "voice.wakeEnable": "\u8BED\u97F3\u5524\u9192\uFF08\u8BF4\u5524\u9192\u8BCD\u81EA\u52A8\u5F00\u59CB\u5BF9\u8BDD\uFF0C\u4F1A\u6301\u7EED\u5360\u7528\u9EA6\u514B\u98CE\uFF09",
  "voice.wakeWord": "\u5524\u9192\u8BCD",
  "voice.wakeProbe": "\u68C0\u6D4B\u5524\u9192\u53EF\u7528\u6027",
  "voice.wakeProbeBusy": "\u68C0\u6D4B\u4E2D\u2026",
  "voice.wakeOk": "\u6D4F\u89C8\u5668\u8BED\u97F3\u8BC6\u522B\u53EF\u7528",
  "voice.wakeUnsupported": "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 Web Speech \u8BED\u97F3\u8BC6\u522B\uFF08\u5EFA\u8BAE Chrome \u6216 Safari\uFF09",
  "voice.wakeUnavailable": "\u8BED\u97F3\u8BC6\u522B\u65E0\u6CD5\u542F\u52A8",
  "voice.wakeError": "\u8BED\u97F3\u8BC6\u522B\u51FA\u9519",
  "voice.wakeNetworkHint": "Chrome \u7684\u8BED\u97F3\u8BC6\u522B\u4F9D\u8D56\u53EF\u8BBF\u95EE\u7684 Google \u8BED\u97F3\u670D\u52A1\uFF1B\u5F53\u524D\u7F51\u7EDC\u4E0D\u53EF\u8FBE\u65F6\u65E0\u6CD5\u5524\u9192\u3002"
};
var en = {
  "voice.nav": "Voice",
  "voice.heading": "Voice Interaction",
  "voice.provider": "Provider",
  "voice.apiKey": "API Key",
  "voice.apiKeyPlaceholder": "Paste your API key",
  "voice.voice": "Voice",
  "voice.hint": "The voice reads replies aloud; the API key powers the selected provider's ASR and TTS.",
  "voice.preview": "Preview",
  "voice.mic": "Real-time voice",
  "voice.micActive": "Real-time voice on (click to end)",
  "voice.backendKeyHint": "The API key is provided by the backend (VOLCENGINE_API_KEY in ~/.dsh/api-key.env).",
  "voice.replyFirst": "Reply first, then think (acknowledge the request before the assistant goes to look it up)",
  "voice.aecProbe": "Echo-cancellation probe (controlled test: speaker vs headphone)",
  "voice.aecProbeAction": "Probe",
  "voice.aecOn": "The browser applied AEC to the mic track",
  "voice.aecOff": "The browser did not apply AEC to the mic track",
  "voice.aecUnavailable": "Mic unavailable (check browser permission)",
  "voice.wakeEnable": "Wake word (speak the keyword to start; keeps the mic on)",
  "voice.wakeWord": "Wake word",
  "voice.wakeProbe": "Probe wake availability",
  "voice.wakeProbeBusy": "Probing\u2026",
  "voice.wakeOk": "Browser speech recognition is available",
  "voice.wakeUnsupported": "This browser does not support the Web Speech API (Chrome or Safari recommended)",
  "voice.wakeUnavailable": "Speech recognition failed to start",
  "voice.wakeError": "Speech recognition error",
  "voice.wakeNetworkHint": "Chrome speech recognition relies on the Google speech service; it cannot wake when that service is unreachable."
};

// src/client/apply.ts
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "ui-voice-live: dictionaries");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
    name: "conversation.input.left",
    id: "voice",
    order: 0,
    locale: NS
  }, VoiceInputButton));
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "voice",
    order: 100,
    label: () => t("voice.nav"),
    locale: NS
  }, VoiceSettingsSection));
}

    return module.exports;
  }
});
