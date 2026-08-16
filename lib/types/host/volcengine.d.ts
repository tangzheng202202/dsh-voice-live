/**
 * Volcengine (Doubao) streaming TTS + ASR client for Node.js.
 *
 * A faithful port of the binary WebSocket protocol from the Python
 * `doubao_speech._ws_client` reference implementation:
 *
 *   voice-pipeline/.venv/lib/python3.14/site-packages/doubao_speech/_ws_client.py
 *
 * Only two differences from the Python client:
 *   1. Auth uses the single `X-Api-Key` header form (new API key) instead of
 *      the multi `X-Api-App-Id` / `X-Api-Access-Key` form.
 *   2. The ASR entrypoint accepts raw PCM16 (Buffer / file path / async
 *      iterable) directly rather than decoding wav/mp3 internally; use ffmpeg
 *      to produce PCM16 before calling `asrStream`.
 *
 * The wire framing (4-byte header + optional event/session/sequence fields +
 * payload) is byte-for-byte identical to the Python `Message` marshal/unmarshal.
 */
export declare class VolcengineVoiceError extends Error {
    code: number | undefined;
    payload: unknown;
    constructor(message: string, code?: number, payload?: unknown);
}
export declare enum MsgType {
    Invalid = 0,
    FullClientRequest = 1,
    AudioOnlyClient = 2,
    FullServerResponse = 9,
    AudioOnlyServer = 11,
    FrontEndResultServer = 12,
    Error = 15
}
export declare enum Flags {
    NoSeq = 0,
    PositiveSeq = 1,
    LastNoSeq = 2,
    NegativeSeq = 3,
    WithEvent = 4
}
export declare enum Serialization {
    Raw = 0,
    JSON = 1
}
export declare enum Compression {
    None = 0,
    Gzip = 1
}
export declare enum Event {
    None = 0,
    StartConnection = 1,
    FinishConnection = 2,
    ConnectionStarted = 50,
    ConnectionFailed = 51,
    ConnectionFinished = 52,
    StartSession = 100,
    CancelSession = 101,
    FinishSession = 102,
    SessionStarted = 150,
    SessionCanceled = 151,
    SessionFinished = 152,
    SessionFailed = 153,
    TaskRequest = 200,
    UpdateConfig = 201,
    TTSSentenceStart = 350,
    TTSSentenceEnd = 351,
    TTSResponse = 352,
    TTSEnded = 359,
    ASRInfo = 450,
    ASRResponse = 451,
    ASREnded = 459
}
export declare class Message {
    type: MsgType;
    flag: Flags;
    serialization: Serialization;
    compression: Compression;
    event: Event;
    session_id: string;
    connect_id: string;
    sequence: number;
    error_code: number;
    payload: Buffer;
    constructor(init?: Partial<Message>);
    marshal(): Buffer;
    static unmarshal(data: Buffer): Message;
    jsonPayload(): Record<string, unknown> | null;
}
export interface TtsStreamOptions {
    /** Output audio container. Default "mp3". */
    audioFormat?: 'mp3' | 'pcm' | 'ogg_opus';
    /** Sample rate in Hz. Default 24000. */
    sampleRate?: number;
    /** Speed multiplier (1.0 = normal). Default 1.0. */
    speedRatio?: number;
    /** X-Api-Resource-Id. Default "seed-tts-2.0". */
    resourceId?: string;
    /** Optional X-Api-Request-Id (also used as user uid). */
    requestId?: string;
    /** Per-phase receive timeout in ms. Default 30000. */
    timeoutMs?: number;
    /** Cancels the cloud session and releases its WebSocket immediately. */
    signal?: AbortSignal;
}
export declare function ttsStream(text: string, voice: string, apiKey: string, onAudio: (chunk: Buffer) => void, options?: TtsStreamOptions): Promise<void>;
export interface AsrResult {
    text: string;
    is_final: boolean;
    utterances: unknown[];
    raw: Record<string, unknown>;
}
export interface AsrStreamOptions {
    /** Sample rate in Hz. Default 16000. */
    sampleRate?: number;
    /** Bit depth. Default 16. */
    bits?: number;
    /** Channel count. Default 1. */
    channel?: number;
    /** Model name. Default "bigmodel". */
    modelName?: string;
    enableItn?: boolean;
    enablePunc?: boolean;
    enableDdc?: boolean;
    showUtterances?: boolean;
    /** Audio segment duration per frame in ms. Default 200. */
    segmentDurationMs?: number;
    /** 服务端端点检测（静音断句）窗口 ms（end_window_size）。设置后走真流式：持续发音频，服务端在静音超时后返回 definite final。 */
    endpointingMs?: number;
    /** 端点检测前的最短语音时长 ms（force_to_speech_time），防误断。需与 endpointingMs 同用。 */
    minSpeechMs?: number;
    /** X-Api-Resource-Id. Default "volc.bigasr.sauc.duration". */
    resourceId?: string;
    requestId?: string;
    timeoutMs?: number;
    /** Cancels the cloud session without requesting a final transcript. */
    signal?: AbortSignal;
}
/** 火山双向流式的句末在最后一个 utterance.definite，而非稳定存在的顶层 is_final。 */
export declare function isDefiniteAsrResult(result: Record<string, unknown>): boolean;
export declare function asrStream(pcmSource: AsyncIterable<Buffer> | Buffer | string, apiKey: string, onText: (result: AsrResult) => void, options?: AsrStreamOptions): Promise<void>;
//# sourceMappingURL=volcengine.d.ts.map