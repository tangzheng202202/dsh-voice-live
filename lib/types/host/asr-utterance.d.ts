export declare class AsrUtterance {
    private readonly apiKey;
    private readonly onFinal;
    private readonly onPartial;
    private readonly onError;
    private readonly onSettled;
    readonly id: string;
    private queue;
    private cancelled;
    private finished;
    private readonly abortController;
    constructor(apiKey: string, id: string, onFinal: (text: string) => void, onPartial: (text: string) => void, onError: (err: Error) => void, onSettled?: () => void);
    /** 启动流式识别（并发 sender/receiver）。 */
    start(): void;
    /** 喂一帧音频；已结束/已取消时静默丢弃。 */
    push(pcm: Buffer): boolean;
    /** 正常停止：结束音频流，等待服务端最终结果（exactly-once）。 */
    end(): void;
    /** 取消：直接丢弃，不提交最终结果。 */
    cancel(): void;
    get isFinished(): boolean;
}
//# sourceMappingURL=asr-utterance.d.ts.map