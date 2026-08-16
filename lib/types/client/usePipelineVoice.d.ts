/**
 * 语音插件的配置与试听工具（生命周期交给 VoiceController）。
 * API key 由后端环境变量提供，前端不持有、不读写任何 key。
 */
/** 可选音色（30 个，均经 seed-tts-2.0 实测通过）。 */
export declare const VOICE_OPTIONS: readonly {
    id: string;
    label: string;
}[];
export declare const DEFAULT_VOICE = "zh_female_vv_uranus_bigtts";
export declare function setActiveVoice(voice: string): void;
export declare function getActiveVoice(): string;
/** 服务商（实际仅火山后端可用）。 */
export declare const PROVIDERS: readonly {
    id: string;
    label: string;
}[];
export declare function getActiveProvider(): string;
export declare function setActiveProvider(provider: string): void;
/** 「先响应后思考」开场白（语音提交后立即朗读，agent 正式回复随后排队）。 */
export declare const REPLY_FIRST_TEXT = "\u597D\u7684\uFF0C\u6211\u53BB\u67E5\u4E00\u4E0B\u3002";
/** 是否开启「先响应后思考」（默认开）。 */
export declare function getReplyFirst(): boolean;
export declare function setReplyFirst(on: boolean): void;
/** 默认唤醒词。 */
export declare const DEFAULT_WAKE_WORD = "\u4F60\u597D\u5C0F\u6234";
/** 是否开启语音唤醒（默认关：开启会持续占用麦克风）。 */
export declare function getWakeWordEnabled(): boolean;
export declare function setWakeWordEnabled(on: boolean): void;
/** 自定义唤醒词。 */
export declare function getWakeWord(): string;
export declare function setWakeWord(word: string): void;
/** 试听结果。 */
export interface PreviewResult {
    ok: boolean;
    message: string;
}
/** 试听：连接后端合成一句示例并播放。key 由后端环境变量提供，前端不传。 */
export declare function previewVoice(voice: string): Promise<PreviewResult>;
//# sourceMappingURL=usePipelineVoice.d.ts.map