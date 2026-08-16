/**
 * 有界异步队列：真流式 ASR 的音频输入通道。
 * - 有界：超过 maxBytes 的帧被拒绝（返回 false），禁止无界 Buffer.concat。
 * - 支持正常结束（end：发完剩余后 close）与取消（abort：直接丢弃）。
 * - AsyncIterable：供 asrStream 的 sender 持续消费。
 */
export declare class BoundedQueue implements AsyncIterable<Buffer> {
    private readonly maxBytes;
    private buf;
    private waiters;
    private ended;
    private aborted;
    private bytes;
    constructor(maxBytes?: number);
    /** 入队一帧音频；超上限或已结束/取消时返回 false（帧被拒绝，不记入队列）。 */
    push(chunk: Buffer): boolean;
    /** 正常结束：剩余帧消费完后迭代器返回 done，调用方据此发 NegativeSeq 收尾等最终结果。 */
    end(): void;
    /** 取消：清空队列并结束，调用方据此直接丢弃、不再等结果。 */
    abort(): void;
    get isEnded(): boolean;
    get isAborted(): boolean;
    get size(): number;
    private drainWaiters;
    [Symbol.asyncIterator](): AsyncIterator<Buffer>;
}
//# sourceMappingURL=bounded-queue.d.ts.map