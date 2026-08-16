/**
 * 唤醒词检测器（stage 3）。
 *
 * 可插拔接口：默认实现用浏览器 Web Speech API（Chrome 的
 * webkitSpeechRecognition，continuous + zh-CN）在后台持续监听，
 * 识别到关键词（默认「你好小戴」）即触发 onWake 回调。
 *
 * sherpa-onnx WASM 是任务书首选，但其官方浏览器分发点
 * （jsdelivr `sherpa-onnx-wasm` npm 包）当前已 404 失效，无法按官方
 * 路径集成；本接口保留给未来可用的本地 WASM 实现（构造时注入），
 * 真实推理需要浏览器实测。
 *
 * 隐私与资源：唤醒开启时麦克风被浏览器持续占用；检测器只在唤醒
 * 状态下运行，对话交给 VoiceController（半双工）后由门控防止串扰。
 */
/** 浏览器 SpeechRecognition 构造器（标准/前缀）。 */
type SpeechRecognitionCtor = new () => {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: {
        resultIndex: number;
        results: ArrayLike<ArrayLike<{
            transcript: string;
        }>>;
    }) => void) | null;
    onerror: ((event: {
        error: string;
    }) => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
};
declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionCtor;
        webkitSpeechRecognition?: SpeechRecognitionCtor;
    }
}
/** 唤醒词检测器接口（可插拔：可注入本地 WASM 实现）。 */
export interface WakeWordDetector {
    /** 开始监听；返回 false 表示当前环境不支持。 */
    start(): Promise<boolean>;
    stop(): void;
    readonly active: boolean;
}
/** 浏览器语音识别是否可用（构造器存在即视为 API 可用，实际联网结果以 start 为准）。 */
export declare function isSpeechRecognitionAvailable(): boolean;
/** Web Speech API 实现的唤醒词检测器。 */
export declare class WebSpeechWakeWord implements WakeWordDetector {
    private readonly keyword;
    private readonly onWake;
    private recognition;
    private _active;
    /** 最近一次 start/onerror 的失败原因（空字符串 = 无错误）。 */
    lastError: string;
    constructor(keyword: string, onWake: () => void);
    get active(): boolean;
    /** 同步配置 + 启动；接口要求返回 Promise<boolean>，显式包装避免 async 空转。 */
    start(): Promise<boolean>;
    stop(): void;
}
/** 便捷工厂：默认 Web Speech 实现；可换成未来的本地 WASM 实现。 */
export declare function createWakeWordDetector(keyword: string, onWake: () => void): WakeWordDetector;
export {};
//# sourceMappingURL=wake-word.d.ts.map