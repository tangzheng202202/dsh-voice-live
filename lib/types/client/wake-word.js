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
/** 从浏览器取 SpeechRecognition 构造器（标准优先，webkit 兜底）。 */
function speechRecognitionCtor() {
    if (typeof window === 'undefined')
        return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}
/** 浏览器语音识别是否可用（构造器存在即视为 API 可用，实际联网结果以 start 为准）。 */
export function isSpeechRecognitionAvailable() {
    return speechRecognitionCtor() !== null;
}
/** Web Speech API 实现的唤醒词检测器。 */
export class WebSpeechWakeWord {
    keyword;
    onWake;
    recognition = null;
    _active = false;
    /** 最近一次 start/onerror 的失败原因（空字符串 = 无错误）。 */
    lastError = '';
    constructor(keyword, onWake) {
        this.keyword = keyword;
        this.onWake = onWake;
    }
    get active() {
        return this._active;
    }
    /** 同步配置 + 启动；接口要求返回 Promise<boolean>，显式包装避免 async 空转。 */
    start() {
        this.lastError = '';
        const Ctor = speechRecognitionCtor();
        if (Ctor === null) {
            this.lastError = 'SpeechRecognition API 不存在';
            return Promise.resolve(false);
        }
        const rec = new Ctor();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'zh-CN';
        rec.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i]?.[0]?.transcript ?? '';
                if (text.includes(this.keyword))
                    this.onWake();
            }
        };
        // 不静默：记录失败原因，供设置页诊断显示（Chrome 国内网络常报 network）。
        rec.onerror = (event) => {
            this.lastError = event.error || 'unknown';
        };
        this.recognition = rec;
        try {
            rec.start();
            this._active = true;
            return Promise.resolve(true);
        }
        catch (error) {
            this.recognition = null;
            this.lastError = error.message || 'start() threw';
            return Promise.resolve(false);
        }
    }
    stop() {
        try {
            this.recognition?.abort();
        }
        catch { /* already stopped */ }
        this.recognition = null;
        this._active = false;
    }
}
/** 便捷工厂：默认 Web Speech 实现；可换成未来的本地 WASM 实现。 */
export function createWakeWordDetector(keyword, onWake) {
    return new WebSpeechWakeWord(keyword, onWake);
}
//# sourceMappingURL=wake-word.js.map