/**
 * Host-side WebSocket voice endpoint: browser mic PCM -> Volcengine streaming
 * ASR (server-side endpointing), browser reply text -> Volcengine TTS.
 *
 * Protocol (browser <-> this endpoint, one WebSocket):
 *   browser -> host:  binary = 16kHz Int16 mono mic PCM
 *                     {"type":"config","provider","voice"}
 *                     {"type":"asr_end","voiceSessionId"}   normal stop, await final
 *                     {"type":"asr_cancel","voiceSessionId"} discard
 *                     {"type":"tts_push","text"} / {"type":"tts_flush"}
 *   host -> browser:  {"type":"ready","voiceSessionId",...}
 *                     {"type":"asr_partial","voiceSessionId","utteranceId","text","sequence"}
 *                     {"type":"asr_final","voiceSessionId","utteranceId","text","sequence"}
 *                     {"type":"tts_start","ttsId","text"} + binary audio + {"type":"tts_done","ttsId"}
 *                     {"type":"error","message"}
 *
 * Every async operation has a single lifecycle owner; all accept AbortSignal
 * where applicable; ASR audio flows through a bounded queue (no unbounded
 * Buffer.concat); TTS is a single serial worker (at most one output stream).
 */
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import WebSocket from 'ws';
import { type VoiceAdmit } from './voice-trust.ts';
/** 单个 WebSocket 连接的语音会话（导出供单元测试直接驱动防御分支）。 */
export declare class VoiceSession {
    private readonly ws;
    private readonly cancelAgent?;
    readonly voiceSessionId: `${string}-${string}-${string}-${string}-${string}`;
    private ttsBuf;
    private apiKey;
    private voice;
    /** 朗读期硬门控：true 时丢弃麦克风帧，避免外放朗读声被录进去当新指令。 */
    private ttsActive;
    private acceptingAudio;
    private disposed;
    private currentUt;
    private utSeq;
    private ttsSeq;
    private msgSeq;
    private ttsGeneration;
    private ttsAbort;
    /** 浏览器当前所在的 DSH 会话（config 消息携带），用于打断时取消 agent 回合。 */
    private dshSessionId;
    constructor(ws: WebSocket, defaultApiKey: string, defaultVoice: string, cancelAgent?: ((dshSessionId: string) => void) | undefined);
    applyConfig(data: Record<string, unknown>): void;
    feedAudio(pcm: Buffer): void;
    /** 显式打开一个识别回合；同一时刻只允许一个 utterance owner。 */
    asrStart(): void;
    private startUtterance;
    /** 正常停止：发送音频结束并等待最终结果（exactly-once）。 */
    asrEnd(): void;
    /** 取消：直接丢弃，不提交结果。 */
    asrCancel(): void;
    /** 单一串行 TTS worker：所有合成请求排队执行，天然保证顺序与并发=1。 */
    private ttsChain;
    pushTts(text: string, voice?: string): void;
    flushTts(voice?: string): Promise<void>;
    /** 把一次合成任务挂到串行链尾（前一个失败不阻断后一个）。 */
    private enqueueTts;
    private speak;
    /** 打断当前朗读并令已排队的旧代次任务全部失效；同时取消 agent 回合（barge-in）。 */
    cancelTts(): void;
    /** WebSocket owner 释放时终止所有云端与本地异步资源。 */
    dispose(): void;
    private send;
}
/**
 * Bind a WebSocketServer to the webserver upgrade route and wire one session
 * per connection. Returns the upgrade handler plus its disposer.
 */
export declare function createVoiceUpgrade(defaultApiKey: string, defaultVoice: string, cancelAgent?: (dshSessionId: string) => void, admit?: VoiceAdmit): {
    handle: (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
    close: () => void;
};
//# sourceMappingURL=voice-server.d.ts.map