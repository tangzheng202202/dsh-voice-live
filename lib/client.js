window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-voice-live",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region ../../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
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
		//#endregion
		//#region src/client/usePipelineVoice.ts
		/**
		* 语音插件的配置与试听工具（生命周期交给 VoiceController）。
		* API key 由后端环境变量提供，前端不持有、不读写任何 key。
		*/
		const WS_URL$1 = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/voice`;
		/** 可选音色（30 个，均经 seed-tts-2.0 实测通过）。 */
		const VOICE_OPTIONS = [
			{
				id: "zh_female_vv_uranus_bigtts",
				label: "温暖女声"
			},
			{
				id: "zh_female_xiaohe_uranus_bigtts",
				label: "温柔女声"
			},
			{
				id: "zh_female_qingxinnvsheng_uranus_bigtts",
				label: "清新女声"
			},
			{
				id: "zh_female_sajiaoxuemei_uranus_bigtts",
				label: "撒娇学妹"
			},
			{
				id: "zh_female_tianmeixiaoyuan_uranus_bigtts",
				label: "清纯甜美女声"
			},
			{
				id: "zh_female_tianmeitaozi_uranus_bigtts",
				label: "软甜女声"
			},
			{
				id: "zh_female_shuangkuaisisi_uranus_bigtts",
				label: "爽快女声"
			},
			{
				id: "zh_female_peiqi_uranus_bigtts",
				label: "童声"
			},
			{
				id: "zh_female_linjianvhai_uranus_bigtts",
				label: "邻家女孩"
			},
			{
				id: "zh_female_kefunvsheng_uranus_bigtts",
				label: "暖阳女声"
			},
			{
				id: "zh_female_xiaoxue_uranus_bigtts",
				label: "清澈童声"
			},
			{
				id: "zh_female_mizai_uranus_bigtts",
				label: "俏皮女声"
			},
			{
				id: "zh_female_jitangnv_uranus_bigtts",
				label: "治愈女声"
			},
			{
				id: "zh_female_meilinvyou_uranus_bigtts",
				label: "温柔女友声"
			},
			{
				id: "zh_female_liuchangnv_uranus_bigtts",
				label: "流畅女声"
			},
			{
				id: "zh_female_yingyujiaoxue_uranus_bigtts",
				label: "教学女声"
			},
			{
				id: "zh_female_cancan_uranus_bigtts",
				label: "知性女声"
			},
			{
				id: "zh_male_m191_uranus_bigtts",
				label: "沉稳男声"
			},
			{
				id: "zh_male_taocheng_uranus_bigtts",
				label: "活力青年男声"
			},
			{
				id: "zh_male_liufei_uranus_bigtts",
				label: "活力男声"
			},
			{
				id: "zh_male_sophie_uranus_bigtts",
				label: "温柔男声"
			},
			{
				id: "zh_male_shaonianzixin_uranus_bigtts",
				label: "少年音"
			},
			{
				id: "zh_male_sunwukong_uranus_bigtts",
				label: "猴哥（活泼男声）"
			},
			{
				id: "zh_male_dayi_uranus_bigtts",
				label: "浑厚男声"
			},
			{
				id: "zh_male_ruyayichen_uranus_bigtts",
				label: "儒雅男声"
			},
			{
				id: "saturn_zh_female_keainvsheng_tob",
				label: "可爱女生"
			},
			{
				id: "saturn_zh_female_tiaopigongzhu_tob",
				label: "调皮公主"
			},
			{
				id: "saturn_zh_male_shuanglangshaonian_tob",
				label: "爽朗少年"
			},
			{
				id: "saturn_zh_male_tiancaitongzhuo_tob",
				label: "天才同桌"
			},
			{
				id: "saturn_zh_female_cancan_tob",
				label: "知性灿灿"
			}
		];
		function setActiveVoice(voice) {
			if (typeof localStorage !== "undefined") localStorage.setItem("dsh-voice", voice);
		}
		function getActiveVoice() {
			return (typeof localStorage !== "undefined" ? localStorage.getItem("dsh-voice") : null) ?? "zh_female_vv_uranus_bigtts";
		}
		/** 服务商（实际仅火山后端可用）。 */
		const PROVIDERS = [{
			id: "volcengine",
			label: "火山引擎（豆包）"
		}];
		function getActiveProvider() {
			return "volcengine";
		}
		function setActiveProvider(provider) {
			if (provider === "volcengine" && typeof localStorage !== "undefined") localStorage.setItem("dsh-voice-provider", provider);
		}
		/** 「先响应后思考」开场白（语音提交后立即朗读，agent 正式回复随后排队）。 */
		const REPLY_FIRST_TEXT = "好的，我去查一下。";
		/** 是否开启「先响应后思考」（默认开）。 */
		function getReplyFirst() {
			if (typeof localStorage === "undefined") return true;
			return localStorage.getItem("dsh-voice-reply-first") !== "0";
		}
		function setReplyFirst(on) {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem("dsh-voice-reply-first", on ? "1" : "0");
		}
		/** 默认唤醒词。 */
		const DEFAULT_WAKE_WORD = "你好小戴";
		/** 是否开启语音唤醒（默认关：开启会持续占用麦克风）。 */
		function getWakeWordEnabled() {
			if (typeof localStorage === "undefined") return false;
			return localStorage.getItem("dsh-voice-wake") === "1";
		}
		function setWakeWordEnabled(on) {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem("dsh-voice-wake", on ? "1" : "0");
		}
		/** 自定义唤醒词。 */
		function getWakeWord() {
			if (typeof localStorage === "undefined") return DEFAULT_WAKE_WORD;
			return localStorage.getItem("dsh-voice-wakeword") ?? "你好小戴";
		}
		function setWakeWord(word) {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem("dsh-voice-wakeword", word);
		}
		/** 试听：连接后端合成一句示例并播放。key 由后端环境变量提供，前端不传。 */
		async function previewVoice(voice) {
			return await new Promise((resolve) => {
				let ws;
				try {
					ws = new WebSocket(WS_URL$1);
				} catch (error) {
					resolve({
						ok: false,
						message: error.message
					});
					return;
				}
				ws.binaryType = "arraybuffer";
				const chunks = [];
				let currentTtsId = "";
				let settled = false;
				const timeout = setTimeout(() => {
					finish({
						ok: false,
						message: "试听超时"
					});
				}, 15e3);
				const finish = (result) => {
					if (settled) return;
					settled = true;
					clearTimeout(timeout);
					ws.close();
					resolve(result);
				};
				ws.onerror = () => {
					finish({
						ok: false,
						message: "无法连接语音服务（后端未启动）"
					});
				};
				ws.onclose = () => {
					if (!settled) finish({
						ok: false,
						message: "语音连接已断开"
					});
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
								finish({
									ok: false,
									message: "后端未配置 VOLCENGINE_API_KEY"
								});
								return;
							}
							const voiceSessionId = typeof msg.voiceSessionId === "string" ? msg.voiceSessionId : "";
							ws.send(JSON.stringify({
								type: "config",
								voiceSessionId,
								provider: "volcengine",
								voice
							}));
							ws.send(JSON.stringify({
								type: "tts_push",
								voiceSessionId,
								text: "你好，这是你选择的音色，听起来还满意吗？"
							}));
							ws.send(JSON.stringify({
								type: "tts_flush",
								voiceSessionId
							}));
						} else if (msg.type === "tts_start") currentTtsId = typeof msg.ttsId === "string" ? msg.ttsId : "";
						else if (msg.type === "tts_done" && msg.ttsId === currentTtsId) {
							if (playOnce(chunks.splice(0), finish) === null) finish({
								ok: false,
								message: "未收到合成音频"
							});
						} else if (msg.type === "tts_error" || msg.type === "error") finish({
							ok: false,
							message: typeof msg.message === "string" ? msg.message : "语音接口错误"
						});
					} else if (e.data instanceof ArrayBuffer && currentTtsId !== "") chunks.push(new Uint8Array(e.data));
				};
			});
		}
		/** 播放一段 mp3；结束、解码失败或 autoplay 拒绝都由同一完成路径回收 URL。 */
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
				done({
					ok: true,
					message: "试听成功"
				});
			};
			audio.onerror = () => {
				done({
					ok: false,
					message: "试听音频播放失败"
				});
			};
			audio.play().catch(() => {
				done({
					ok: false,
					message: "浏览器阻止了试听播放"
				});
			});
			return audio;
		}
		//#endregion
		//#region src/client/wake-word.ts
		/** 从浏览器取 SpeechRecognition 构造器（标准优先，webkit 兜底）。 */
		function speechRecognitionCtor() {
			if (typeof window === "undefined") return null;
			return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
		}
		/** 浏览器语音识别是否可用（构造器存在即视为 API 可用，实际联网结果以 start 为准）。 */
		function isSpeechRecognitionAvailable() {
			return speechRecognitionCtor() !== null;
		}
		/** Web Speech API 实现的唤醒词检测器。 */
		var WebSpeechWakeWord = class {
			keyword;
			onWake;
			recognition = null;
			_active = false;
			/** 最近一次 start/onerror 的失败原因（空字符串 = 无错误）。 */
			lastError = "";
			constructor(keyword, onWake) {
				this.keyword = keyword;
				this.onWake = onWake;
			}
			get active() {
				return this._active;
			}
			/** 同步配置 + 启动；接口要求返回 Promise<boolean>，显式包装避免 async 空转。 */
			start() {
				this.lastError = "";
				const Ctor = speechRecognitionCtor();
				if (Ctor === null) {
					this.lastError = "SpeechRecognition API 不存在";
					return Promise.resolve(false);
				}
				const rec = new Ctor();
				rec.continuous = true;
				rec.interimResults = false;
				rec.lang = "zh-CN";
				rec.onresult = (event) => {
					for (let i = event.resultIndex; i < event.results.length; i++) if ((event.results[i]?.[0]?.transcript ?? "").includes(this.keyword)) this.onWake();
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
				} catch {}
				this.recognition = null;
				this._active = false;
			}
		};
		/** 便捷工厂：默认 Web Speech 实现；可换成未来的本地 WASM 实现。 */
		function createWakeWordDetector(keyword, onWake) {
			return new WebSpeechWakeWord(keyword, onWake);
		}
		//#endregion
		//#region src/client/VoiceController.ts
		const WS_URL = `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host}/voice`;
		/** AudioWorklet 采集器：每累计 2048 帧（@16k ≈ 128ms）把 Float32 帧发回主线程。 */
		const PCM_WORKLET = `
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
		/** 唯一拥有 MediaStream / AudioContext / AudioWorklet。 */
		var AudioCapture = class {
			onAudio;
			echoCancellation;
			stream = null;
			ctx = null;
			node = null;
			constructor(onAudio, echoCancellation = true) {
				this.onAudio = onAudio;
				this.echoCancellation = echoCancellation;
			}
			async start() {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: {
					channelCount: 1,
					echoCancellation: this.echoCancellation,
					noiseSuppression: true
				} });
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
				return this.getMicSettings()?.echoCancellation === true;
			}
			stop() {
				try {
					this.node?.port.close();
				} catch {}
				this.node?.disconnect();
				this.node = null;
				this.stream?.getTracks().forEach((track) => {
					track.stop();
				});
				this.stream = null;
				this.ctx?.close().catch(() => {});
				this.ctx = null;
			}
		};
		function toInt16(f32) {
			const out = new Int16Array(f32.length);
			for (let i = 0; i < f32.length; i++) out[i] = Math.max(-1, Math.min(1, f32[i] ?? 0)) * 32767 | 0;
			return out;
		}
		/** 唯一拥有音频播放与取消；按 ttsId 成组，收到完整结束事件才播放。 */
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
				/* v8 ignore next -- length>0 时 shift 必有值，此守卫仅防未来类型变更 */
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
				audio.play().catch(finish);
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
		/** 统一控制器：状态机 + 资源编排 + 代次防串扰 + 回复朗读。 */
		var VoiceController = class VoiceController {
			callbacks;
			echoCancellation;
			replyFirstText;
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
			constructor(callbacks, echoCancellation = true, replyFirstText = "") {
				this.callbacks = callbacks;
				this.echoCancellation = echoCancellation;
				this.replyFirstText = replyFirstText;
				this.playback.onIdle = () => {
					this.maybeFinishReply();
				};
			}
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
					if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({
						type: "tts_cancel",
						voiceSessionId: this.voiceSessionId
					}));
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
					if (!await this.connect(gen)) {
						if (gen === this.generation) this.fail("无法连接语音服务（后端未启动）");
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
					const ws = new WebSocket(WS_URL);
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
			scheduleReconnect() {
				if (this.reconnectInFlight || this.reconnectTimer !== null) return;
				this.reconnectAttempts++;
				const delay = Math.min(VoiceController.RECONNECT_BASE_MS * 2 ** (this.reconnectAttempts - 1), 1e4);
				this.setState("reconnecting");
				this.reconnectTimer = setTimeout(() => {
					this.reconnectTimer = null;
					this.reconnectInFlight = true;
					this.doReconnect();
				}, delay);
			}
			async doReconnect() {
				try {
					const gen = ++this.generation;
					const ok = await this.connect(gen);
					this.reconnectInFlight = false;
					if (!ok) {
						if (this.reconnectAttempts >= VoiceController.MAX_RECONNECT_ATTEMPTS) {
							this.fail("语音连接已断开，重连失败");
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
					if (this.reconnectAttempts >= VoiceController.MAX_RECONNECT_ATTEMPTS) this.fail("语音连接已断开，重连失败");
					else this.scheduleReconnect();
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
							this.fail("后端未配置 VOLCENGINE_API_KEY");
							return;
						}
						if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({
							type: "asr_start",
							voiceSessionId: this.voiceSessionId
						}));
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
					if (msg.type === "asr_partial" && typeof msg.text === "string") this.callbacks.onPartial(msg.text);
					else if (msg.type === "tts_start") {
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
						this.callbacks.onError(typeof msg.message === "string" ? msg.message : "TTS 失败");
					} else if (msg.type === "tts_idle") {
						this.replyServerIdle = true;
						this.maybeFinishReply();
					} else if (msg.type === "error") this.callbacks.onError(typeof msg.message === "string" ? msg.message : "语音接口错误");
				} else if (e.data instanceof ArrayBuffer && this.currentTtsId !== "") this.playback.pushAudio(this.currentTtsId, new Uint8Array(e.data));
			}
			/** 正常停止：发送音频结束并等待最终结果（stop=await final），提交后进入应答模式。 */
			stop() {
				if (!this.active) return;
				this.active = false;
				this.stopCapture();
				this.setState("closing");
				if (this.ws?.readyState === WebSocket.OPEN) {
					this.ws.send(JSON.stringify({
						type: "asr_end",
						voiceSessionId: this.voiceSessionId
					}));
					this.stopTimer = setTimeout(() => {
						this.teardown();
					}, VoiceController.STOP_TIMEOUT_MS);
				} else this.teardown();
			}
			/** 取消：直接丢弃，立即关闭。 */
			cancel() {
				if (!this.active && !this.replyMode && this.ws === null && this.capture === null) return;
				this.active = false;
				this.stopCapture();
				this.setState("closing");
				if (this.ws?.readyState === WebSocket.OPEN) {
					this.ws.send(JSON.stringify({
						type: "asr_cancel",
						voiceSessionId: this.voiceSessionId
					}));
					this.ws.send(JSON.stringify({
						type: "tts_cancel",
						voiceSessionId: this.voiceSessionId
					}));
				}
				this.teardown();
			}
			/** 把 agent 回复文本增量推给后端合成（host 端按标点切句、串行合成）。 */
			pushReplyText(text) {
				if (!this.replyMode) return;
				if (this.ws?.readyState === WebSocket.OPEN) {
					this.replyServerIdle = false;
					this.ws.send(JSON.stringify({
						type: "tts_push",
						voiceSessionId: this.voiceSessionId,
						text
					}));
					this.armReplyTimer();
				}
			}
			/** 回合结束：flush 未合完的尾巴。 */
			flushReply() {
				if (this.replyMode && this.ws?.readyState === WebSocket.OPEN) {
					this.replyServerIdle = false;
					this.ws.send(JSON.stringify({
						type: "tts_flush",
						voiceSessionId: this.voiceSessionId
					}));
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
				if (this.replyMode && this.replyDone && this.replyServerIdle && !this.playback.isPlaying) this.teardown();
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
				}, VoiceController.REPLY_TIMEOUT_MS);
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
		//#endregion
		//#region \0dsh-css:/Users/mac/cow/apps/dsh/packages/client/ui-voice-live/src/client/VoiceInputButton.module.css.mjs
		const css$1 = "._8p0UkG_mic{background:var(--dsw-specific-selector);width:28px;height:28px;color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:999px;flex:none;place-items:center;display:grid}._8p0UkG_mic:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}._8p0UkG_mic:disabled{opacity:.5;cursor:default}._8p0UkG_active{background:var(--dsw-alias-button-danger-fill,#c0392b);color:#fff}._8p0UkG_error{background:var(--dsw-alias-button-danger-fill,#c0392b);color:#fff;outline-offset:1px;outline:2px solid #e74c3c}._8p0UkG_orb{place-items:center;width:18px;height:18px;display:grid;position:relative}._8p0UkG_orbCore{background:radial-gradient(circle at 32% 30%,#fff,#7fd0ff 38%,#2f81f7 70%,#1447a6);border-radius:999px;width:10px;height:10px;box-shadow:0 0 8px #2f81f7e6,0 0 2px #fffc}._8p0UkG_orbRing{border:1px solid #7fd0ffd9;border-radius:999px;animation:1.6s ease-out infinite _8p0UkG_orb-pulse;position:absolute;inset:0}._8p0UkG_orbRing:nth-child(3){animation-delay:.8s}@keyframes _8p0UkG_orb-pulse{0%{opacity:.9;transform:scale(.6)}to{opacity:0;transform:scale(2.1)}}._8p0UkG_wrap{display:inline-flex;position:relative}._8p0UkG_caption{color:#fff;white-space:nowrap;text-overflow:ellipsis;pointer-events:none;z-index:30;background:#000000b8;border-radius:8px;max-width:320px;padding:4px 10px;font-size:12px;line-height:1.4;position:absolute;bottom:calc(100% + 6px);left:50%;overflow:hidden;transform:translate(-50%)}";
		const tagId$1 = "@deepseek-ai/dsh-client-ui-voice-live/VoiceInputButton.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-voice-live";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var VoiceInputButton_module_css_default = {
			"error": "_8p0UkG_error",
			"mic": "_8p0UkG_mic",
			"active": "_8p0UkG_active",
			"orb": "_8p0UkG_orb",
			"orbRing": "_8p0UkG_orbRing",
			"orbCore": "_8p0UkG_orbCore",
			"wrap": "_8p0UkG_wrap",
			"orb-pulse": "_8p0UkG_orb-pulse",
			"caption": "_8p0UkG_caption"
		};
		//#endregion
		//#region src/client/VoiceInputButton.tsx
		/**
		* Composer mic control, registered on `conversation.input.left` (the additive
		* left tool-row seat). Framework-injected `inputActions` writes the transcript
		* into the draft and submits; no private InputBar keyboard face is touched.
		*
		* 生命周期交给 VoiceController（React 外部状态机），组件只读状态、转发
		* start/stop 动作，并订阅会话回复流：语音发起回合的 agent 回复文本增量
		* 经 pushReplyText 推给后端合成朗读；回合结束 flush + 关闭。
		*/
		const ACTIVE_STATES = new Set([
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
		/** 回复朗读只取正文（text block），跳过 reasoning（思考）与工具块。 */
		function replyTextOf(p) {
			if (p === null) return "";
			let out = "";
			for (const b of p.blocks) if (b.kind === "text" && typeof b.text === "string") out += b.text;
			return out;
		}
		function VoiceInputButton({ inputActions, useSession, t }) {
			const [state, setState] = (0, react.useState)("idle");
			const [error, setError] = (0, react.useState)(null);
			/** 实时字幕：识别中把 asr_partial 悬浮显示在麦克风按钮上方。 */
			const [caption, setCaption] = (0, react.useState)("");
			const controllerRef = (0, react.useRef)(null);
			/** 当前回合是否由语音发起（决定是否朗读回复）。 */
			const voiceTurnRef = (0, react.useRef)(false);
			/** 已朗读的回复文本长度水位（增量去重）。 */
			const spokenLenRef = (0, react.useRef)(0);
			const controller = () => {
				if (controllerRef.current === null) controllerRef.current = new VoiceController({
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
				return controllerRef.current;
			};
			const running = useSession((s) => s.running);
			const partial = useSession((s) => s.partial);
			const dshSessionId = useSession((s) => s.sessionId);
			(0, react.useEffect)(() => {
				controllerRef.current?.setDshSessionId(dshSessionId);
			}, [dshSessionId]);
			const wakeDetectorRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!getWakeWordEnabled()) return;
				let stopped = false;
				const detector = createWakeWordDetector(getWakeWord(), () => {
					if (stopped) return;
					const c = controller();
					if (!c.isActive) c.start();
				});
				wakeDetectorRef.current = detector;
				detector.start();
				return () => {
					stopped = true;
					detector.stop();
					wakeDetectorRef.current = null;
				};
			}, []);
			(0, react.useEffect)(() => {
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
			(0, react.useEffect)(() => () => {
				controllerRef.current?.cancel();
			}, []);
			const active = ACTIVE_STATES.has(state);
			const tooltip = error ?? (active ? t("voice.micActive") : t("voice.mic"));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: VoiceInputButton_module_css_default.wrap,
				children: [active && caption !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: VoiceInputButton_module_css_default.caption,
					"aria-hidden": true,
					children: caption
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: tooltip,
					side: "top",
					delayMs: 500,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: clsx(VoiceInputButton_module_css_default.mic, active && VoiceInputButton_module_css_default.active, error && VoiceInputButton_module_css_default.error),
						"aria-label": error ?? t("voice.mic"),
						"aria-pressed": active,
						onClick: () => {
							setError(null);
							const c = controller();
							if (c.isActive) c.stop();
							else c.start();
						},
						children: active ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: VoiceInputButton_module_css_default.orb,
							"aria-hidden": true,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: VoiceInputButton_module_css_default.orbCore }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: VoiceInputButton_module_css_default.orbRing }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: VoiceInputButton_module_css_default.orbRing })
							]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 16 16",
							width: "16",
							height: "16",
							"aria-hidden": true,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M8 1a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 1 1-5 0v-3A2.5 2.5 0 0 1 8 1Z",
									fill: "currentColor"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M3.5 7.5a4.5 4.5 0 0 0 9 0h-1.5a3 3 0 0 1-6 0h-1.5Z",
									fill: "currentColor"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M8 11.75a4.25 4.25 0 0 1-4.25-4.25H2.25A5.75 5.75 0 0 0 7.25 13.2V15h1.5v-1.8a5.75 5.75 0 0 0 5-5.7h-1.5A4.25 4.25 0 0 1 8 11.75Z",
									fill: "currentColor"
								})
							]
						})
					})
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/mac/cow/apps/dsh/packages/client/ui-voice-live/src/client/VoiceSettingsSection.module.css.mjs
		const css = ".p5Z7Ma_section{flex-direction:column;gap:16px;max-width:420px;padding:8px 0;display:flex}.p5Z7Ma_heading{color:var(--dsw-alias-label-primary);margin:0;font-size:16px;font-weight:600}.p5Z7Ma_field{flex-direction:column;gap:6px;display:flex}.p5Z7Ma_label{color:var(--dsw-alias-label-secondary,#8b8b92);font-size:12px}.p5Z7Ma_input{border:1px solid var(--dsw-alias-border,#303038);background:var(--dsw-alias-interactive-bg,transparent);height:32px;color:var(--dsw-alias-label-primary);border-radius:8px;outline:none;padding:0 10px;font-size:13px}.p5Z7Ma_input:focus{border-color:var(--dsw-alias-button-info-fill)}.p5Z7Ma_hint{color:var(--dsw-alias-label-secondary,#8b8b92);margin:0;font-size:12px;line-height:1.5}.p5Z7Ma_keyRow,.p5Z7Ma_voiceRow{gap:8px;display:flex}.p5Z7Ma_keyRow .p5Z7Ma_input,.p5Z7Ma_voiceRow .p5Z7Ma_input{flex:1;min-width:0}.p5Z7Ma_eyeButton,.p5Z7Ma_previewButton{border:1px solid var(--dsw-alias-border,#303038);background:var(--dsw-specific-selector);width:32px;height:32px;color:var(--dsw-alias-label-secondary,#8b8b92);cursor:pointer;border-radius:8px;flex:none;place-items:center;padding:0;font-size:13px;display:grid}.p5Z7Ma_previewButton:disabled{opacity:.5;cursor:default}.p5Z7Ma_previewButton:hover:not(:disabled),.p5Z7Ma_eyeButton:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}.p5Z7Ma_okHint{color:#2ecc71;margin:0;font-size:12px}.p5Z7Ma_errHint{color:#e74c3c;margin:0;font-size:12px}.p5Z7Ma_checkbox{accent-color:var(--dsw-alias-interactive-accent,#2f81f7);vertical-align:-2px;margin-right:6px}.p5Z7Ma_aecResult{color:var(--dsw-alias-label-secondary,#8a8f98);margin-left:8px;font-size:12px}";
		const tagId = "@deepseek-ai/dsh-client-ui-voice-live/VoiceSettingsSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-voice-live";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var VoiceSettingsSection_module_css_default = {
			"previewButton": "p5Z7Ma_previewButton",
			"field": "p5Z7Ma_field",
			"errHint": "p5Z7Ma_errHint",
			"keyRow": "p5Z7Ma_keyRow",
			"heading": "p5Z7Ma_heading",
			"section": "p5Z7Ma_section",
			"input": "p5Z7Ma_input",
			"voiceRow": "p5Z7Ma_voiceRow",
			"label": "p5Z7Ma_label",
			"hint": "p5Z7Ma_hint",
			"okHint": "p5Z7Ma_okHint",
			"checkbox": "p5Z7Ma_checkbox",
			"aecResult": "p5Z7Ma_aecResult",
			"eyeButton": "p5Z7Ma_eyeButton"
		};
		//#endregion
		//#region src/client/VoiceSettingsSection.tsx
		/**
		* "语音交互" settings section: provider + voice + preview。
		* API Key 由后端环境变量提供（阶段 A 起），不再在此填写。
		* Persists through localStorage helpers with no module-global lifecycle state.
		*/
		function VoiceSettingsSection({ t }) {
			const [provider, setProvider] = (0, react.useState)(getActiveProvider());
			const [voice, setVoice] = (0, react.useState)(getActiveVoice());
			const [replyFirst, setReplyFirstState] = (0, react.useState)(getReplyFirst());
			const [wakeEnabled, setWakeEnabledState] = (0, react.useState)(getWakeWordEnabled());
			const [wakeWord, setWakeWordState] = (0, react.useState)(getWakeWord());
			const [previewing, setPreviewing] = (0, react.useState)(false);
			const [previewResult, setPreviewResult] = (0, react.useState)(null);
			/** echo 受控测试探针：浏览器是否真的对麦克风应用了 AEC。 */
			const [aecState, setAecState] = (0, react.useState)(null);
			const [aecProbing, setAecProbing] = (0, react.useState)(false);
			/** 唤醒可用性诊断：浏览器是否真的能跑 Web Speech 识别（Chrome 国内网络常见 network 失败）。 */
			const [wakeDiag, setWakeDiag] = (0, react.useState)(null);
			const [wakeProbing, setWakeProbing] = (0, react.useState)(false);
			const preview = () => {
				setPreviewing(true);
				setPreviewResult(null);
				previewVoice(voice).then((r) => {
					setPreviewResult(r);
				}).finally(() => {
					setPreviewing(false);
				});
			};
			/** 请求一次麦克风并读取浏览器实际应用的约束（受控回声测试的探针）。 */
			const probeAec = async () => {
				setAecProbing(true);
				setAecState(null);
				try {
					const track = (await navigator.mediaDevices.getUserMedia({ audio: {
						echoCancellation: true,
						noiseSuppression: true
					} })).getAudioTracks()[0];
					const applied = track?.getSettings().echoCancellation === true;
					track?.stop();
					setAecState(applied ? t("voice.aecOn") : t("voice.aecOff"));
				} catch {
					setAecState(t("voice.aecUnavailable"));
				} finally {
					setAecProbing(false);
				}
			};
			/** 唤醒可用性探针：短暂启动一次识别并读取失败原因（不长期占用麦克风）。 */
			const probeWake = async () => {
				setWakeProbing(true);
				setWakeDiag(null);
				try {
					if (!isSpeechRecognitionAvailable()) {
						setWakeDiag(t("voice.wakeUnsupported"));
						return;
					}
					const det = new WebSpeechWakeWord(getWakeWord(), () => {});
					if (!await det.start()) {
						setWakeDiag(det.lastError || t("voice.wakeUnavailable"));
						return;
					}
					await new Promise((resolve) => setTimeout(resolve, 1500));
					if (det.lastError) setWakeDiag(`${t("voice.wakeError")}: ${det.lastError}`);
					else setWakeDiag(t("voice.wakeOk"));
					det.stop();
				} finally {
					setWakeProbing(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: VoiceSettingsSection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: VoiceSettingsSection_module_css_default.heading,
						children: t("voice.heading")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: VoiceSettingsSection_module_css_default.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: VoiceSettingsSection_module_css_default.label,
							children: t("voice.provider")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
							className: VoiceSettingsSection_module_css_default.input,
							value: provider,
							onChange: (e) => {
								setProvider(e.target.value);
								setActiveProvider(e.target.value);
							},
							children: PROVIDERS.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.label
							}, p.id))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: VoiceSettingsSection_module_css_default.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: VoiceSettingsSection_module_css_default.label,
							children: t("voice.voice")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: VoiceSettingsSection_module_css_default.voiceRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
								className: VoiceSettingsSection_module_css_default.input,
								value: voice,
								onChange: (e) => {
									setVoice(e.target.value);
									setActiveVoice(e.target.value);
								},
								children: VOICE_OPTIONS.map((v) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: v.id,
									children: v.label
								}, v.id))
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: VoiceSettingsSection_module_css_default.previewButton,
								disabled: previewing,
								onClick: preview,
								children: previewing ? "…" : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlayOutline16, { size: 14 })
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
						className: VoiceSettingsSection_module_css_default.field,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: VoiceSettingsSection_module_css_default.label,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: VoiceSettingsSection_module_css_default.checkbox,
								checked: replyFirst,
								onChange: (e) => {
									setReplyFirstState(e.target.checked);
									setReplyFirst(e.target.checked);
								}
							}), t("voice.replyFirst")]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
						className: VoiceSettingsSection_module_css_default.field,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: VoiceSettingsSection_module_css_default.label,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: VoiceSettingsSection_module_css_default.checkbox,
								checked: wakeEnabled,
								onChange: (e) => {
									setWakeEnabledState(e.target.checked);
									setWakeWordEnabled(e.target.checked);
								}
							}), t("voice.wakeEnable")]
						})
					}),
					wakeEnabled && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: VoiceSettingsSection_module_css_default.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: VoiceSettingsSection_module_css_default.label,
							children: t("voice.wakeWord")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: VoiceSettingsSection_module_css_default.input,
							type: "text",
							value: wakeWord,
							maxLength: 20,
							onChange: (e) => {
								setWakeWordState(e.target.value);
								setWakeWord(e.target.value);
							}
						})]
					}),
					wakeEnabled && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: VoiceSettingsSection_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: VoiceSettingsSection_module_css_default.label,
								children: t("voice.wakeProbe")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: VoiceSettingsSection_module_css_default.voiceRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: VoiceSettingsSection_module_css_default.previewButton,
									disabled: wakeProbing,
									onClick: () => {
										probeWake();
									},
									children: wakeProbing ? t("voice.wakeProbeBusy") : t("voice.wakeProbe")
								}), wakeDiag !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: VoiceSettingsSection_module_css_default.aecResult,
									children: wakeDiag
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: VoiceSettingsSection_module_css_default.hint,
								children: t("voice.wakeNetworkHint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: VoiceSettingsSection_module_css_default.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: VoiceSettingsSection_module_css_default.label,
							children: t("voice.aecProbe")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: VoiceSettingsSection_module_css_default.voiceRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: VoiceSettingsSection_module_css_default.previewButton,
								disabled: aecProbing,
								onClick: () => {
									probeAec();
								},
								children: aecProbing ? "…" : t("voice.aecProbeAction")
							}), aecState !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: VoiceSettingsSection_module_css_default.aecResult,
								children: aecState
							})]
						})]
					}),
					previewResult !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: previewResult.ok ? VoiceSettingsSection_module_css_default.okHint : VoiceSettingsSection_module_css_default.errHint,
						children: previewResult.message
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: VoiceSettingsSection_module_css_default.hint,
						children: t("voice.hint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: VoiceSettingsSection_module_css_default.hint,
						children: t("voice.backendKeyHint")
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** Voice namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "voice";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"voice.nav": "语音交互",
			"voice.heading": "语音交互",
			"voice.provider": "服务商",
			"voice.apiKey": "API Key",
			"voice.apiKeyPlaceholder": "粘贴你的 API Key",
			"voice.voice": "音色",
			"voice.hint": "音色用于朗读回答；API Key 用于所选服务商的语音识别与合成。",
			"voice.preview": "试听",
			"voice.mic": "实时语音",
			"voice.micActive": "实时语音对话中（点击结束）",
			"voice.backendKeyHint": "API Key 由后端提供（~/.dsh/api-key.env 中的 VOLCENGINE_API_KEY），无需在此填写。",
			"voice.replyFirst": "先响应后思考（说完先回应一句，再让助手去查）",
			"voice.aecProbe": "回声消除检测（受控测试：扬声器/耳机对比用）",
			"voice.aecProbeAction": "检测",
			"voice.aecOn": "浏览器已对麦克风应用回声消除（AEC 生效）",
			"voice.aecOff": "浏览器未应用回声消除（AEC 未生效）",
			"voice.aecUnavailable": "无法访问麦克风（检查浏览器权限）",
			"voice.wakeEnable": "语音唤醒（说唤醒词自动开始对话，会持续占用麦克风）",
			"voice.wakeWord": "唤醒词",
			"voice.wakeProbe": "检测唤醒可用性",
			"voice.wakeProbeBusy": "检测中…",
			"voice.wakeOk": "浏览器语音识别可用",
			"voice.wakeUnsupported": "当前浏览器不支持 Web Speech 语音识别（建议 Chrome 或 Safari）",
			"voice.wakeUnavailable": "语音识别无法启动",
			"voice.wakeError": "语音识别出错",
			"voice.wakeNetworkHint": "Chrome 的语音识别依赖可访问的 Google 语音服务；当前网络不可达时无法唤醒。"
		};
		/** English dictionary. */
		const en = {
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
			"voice.wakeProbeBusy": "Probing…",
			"voice.wakeOk": "Browser speech recognition is available",
			"voice.wakeUnsupported": "This browser does not support the Web Speech API (Chrome or Safari recommended)",
			"voice.wakeUnavailable": "Speech recognition failed to start",
			"voice.wakeError": "Speech recognition error",
			"voice.wakeNetworkHint": "Chrome speech recognition relies on the Google speech service; it cannot wake when that service is unreachable."
		};
		//#endregion
		//#region src/client/apply.ts
		/** Services required by this plugin. */
		const inject = ["slots", "locale"];
		/**
		* Register the voice dictionaries, the composer mic control, and the settings
		* section, each once its slot declaration is on the ledger.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-voice-live: dictionaries");
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
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map