/**
 * 语音控制器：每个会话独享、React 外部的状态机与资源所有权编排。
 *
 * 状态机：idle → acquiring → connecting → listening → recognizing →
 *         thinking → synthesizing → playing
 *         + interrupting / reconnecting / closing / failed
 *
 * 生命周期（半双工 + 回复朗读）：
 * - start()：acquire mic + 连接 /voice；若上一轮仍在朗读，先打断并新建会话。
 * - stop()：停止采集，发 asr_end 并等待 final；final 提交后进入应答模式
 *   （replyMode）：WebSocket 保持打开，agent 回复文本经 pushReplyText 推给
 *   后端合成、播放；回合结束（endReply）且播放空闲后关闭，超时兜底。
 * - cancel()：丢弃，立即关闭。
 *
 * 资源所有权：
 * - AudioCapture  唯一持有 MediaStream / AudioContext / AudioWorklet。
 * - VoiceTransport 唯一持有 WebSocket、协议序号与（阶段3）重连。
 * - PlaybackQueue 唯一持有音频播放与取消。
 * - VoiceController 持有启动代次，拒绝迟到消息/旧代次。
 */
export type VoiceState = 'idle' | 'acquiring' | 'connecting' | 'listening' | 'recognizing' | 'thinking' | 'synthesizing' | 'playing' | 'interrupting' | 'reconnecting' | 'closing' | 'failed';
export interface VoiceCallbacks {
    onState: (s: VoiceState) => void;
    onFinal: (text: string) => void;
    onPartial: (text: string) => void;
    onError: (message: string) => void;
}
/** 统一控制器：状态机 + 资源编排 + 代次防串扰 + 回复朗读。 */
export declare class VoiceController {
    private readonly callbacks;
    private readonly echoCancellation;
    /** 「先响应后思考」开场白；非空时每次语音提交后先朗读它，再排 agent 正式回复。 */
    private readonly replyFirstText;
    private state;
    private generation;
    private active;
    private ws;
    private capture;
    private readonly playback;
    private voiceSessionId;
    private capturing;
    private currentTtsId;
    /** stop 后等待 asr_final 的超时兜底（正常路径收到 final 即提交）。 */
    private stopTimer;
    private readyResolve;
    /** 应答模式：语音提交后保持连接，用于朗读 agent 回复。 */
    private replyMode;
    /** 回合结束标记：endReply 后播放空闲即关闭连接。 */
    private replyDone;
    /** host 已处理完 tts_flush；必须等该确认，不能因本地暂时无音频而提前关连接。 */
    private replyServerIdle;
    private replyTimer;
    /** 同一语音会话已经提交的 utterance，抵御重复 final。 */
    private readonly submittedUtterances;
    /** 当前 DSH 会话 id（随 config 上报，host 端打断时用它取消 agent 回合）。 */
    private dshSessionId;
    /** 自动重连（单重连器）：任意时刻至多一个在途尝试/一个退避定时器。 */
    private reconnectAttempts;
    private reconnectTimer;
    private reconnectInFlight;
    /** 等到 ready 为止的握手计时。open 不清掉，否则漏掉 ready 时按钮会一直停在连接中。 */
    private connectTimer;
    private static readonly STOP_TIMEOUT_MS;
    /** 应答模式空闲兜底：超过该时长无合成活动强制关闭。 */
    private static readonly REPLY_TIMEOUT_MS;
    /** 重连退避起点（ms），每次失败翻倍直至上限。 */
    private static readonly RECONNECT_BASE_MS;
    /** 单次重连失败上限；超过后进入 failed。 */
    private static readonly MAX_RECONNECT_ATTEMPTS;
    constructor(callbacks: VoiceCallbacks, echoCancellation?: boolean, 
    /** 「先响应后思考」开场白；非空时每次语音提交后先朗读它，再排 agent 正式回复。 */
    replyFirstText?: string);
    get currentState(): VoiceState;
    get isActive(): boolean;
    /** 同步当前 DSH 会话 id（随 config 上报，供 host 端打断时取消 agent）。 */
    setDshSessionId(id: string): void;
    /** 回声消除实测探针：true/false = 浏览器约束报告 AEC 开/关；null = 未采集。 */
    getMicAec(): boolean | null;
    private setState;
    /** 开始语音会话（acquiring → connecting → listening）。朗读中再次开始即打断上一轮。 */
    start(): Promise<void>;
    private connect;
    private scheduleReconnect;
    private doReconnect;
    private onMessage;
    /** 正常停止：发送音频结束并等待最终结果（stop=await final），提交后进入应答模式。 */
    stop(): void;
    /** 取消：直接丢弃，立即关闭。 */
    cancel(): void;
    /** 把 agent 回复文本增量推给后端合成（host 端按标点切句、串行合成）。 */
    pushReplyText(text: string): void;
    /** 回合结束：flush 未合完的尾巴。 */
    flushReply(): void;
    /**
     * 回合结束（组件在 running=false 时调用）：回复已全部推送，
     * 等 host 确认 flush 已处理且本地播放空闲后关闭连接。
     */
    endReply(): void;
    private enterReplyMode;
    private maybeFinishReply;
    private stopCapture;
    private armReplyTimer;
    private clearReplyTimer;
    private clearStopTimer;
    private clearConnectTimer;
    private teardown;
    private clearReconnect;
    private fail;
}
//# sourceMappingURL=VoiceController.d.ts.map