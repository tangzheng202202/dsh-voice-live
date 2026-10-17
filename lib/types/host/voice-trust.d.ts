/**
 * /voice WebSocket 信任检查（与 client-connection 的 /api 栅栏同构）。
 * 防御两条浏览器对本地 HTTP 服务的 confused-deputy 路径：
 *  - DNS rebinding：Host 头写着攻击者域名，但 socket 打到了本机服务；
 *  - 跨站请求：恶意页面发起的 WebSocket 握手。
 * 当前允许 loopback 主机 + 同源 Origin。通过栅栏之后必须再过
 * `ctx.connection.admit()`（0.2.0-rc.2 的 operator 只有 id、ctx、scope）。
 * 拿不到 admit 时拒绝，不放行。
 */
import type { IncomingMessage } from 'node:http';
/** 归一化 hostname 是否为本机 loopback（localhost / ::1 / 127/8）。 */
export declare function isLoopbackHostname(hostname: string): boolean;
/**
 * 一个 WebSocket upgrade 请求是否被信任：
 *  - Host 必须解析为 loopback 主机（DNS rebinding 防御）；
 *  - sec-fetch-site 为 cross-site 时直接拒绝；
 *  - 浏览器若带 Origin，必须与 Host 同源。
 */
export declare function isTrustedVoiceRequest(req: IncomingMessage): boolean;
/** 0.2.0-rc.2 `connection.admit()` 成功时 operator 上实际可读的字段。 */
export interface VoiceOperator {
    readonly id: string;
    readonly ctx: object;
    readonly scope: object;
}
/** admit() 的两种结果：放行并给出 operator，或拒绝状态。 */
export type VoiceAdmission = {
    readonly peer: VoiceOperator;
} | {
    readonly rejection: 401 | 403;
};
/** 宿主鉴权回调。升级处理函数在缺省时直接 401。 */
export type VoiceAdmit = (req: IncomingMessage) => VoiceAdmission;
/**
 * 只读 operator 的 id、ctx、scope。缺任一项就当没通过鉴权。
 * 不读其它字段：0.2.0-rc.2 的 admit() 没有 user、token 之类的属性。
 */
export declare function readVoiceOperator(peer: object): VoiceOperator | undefined;
/** 拒绝一次 WebSocket upgrade（HTTP 401/403 后立即断开）。 */
export declare function rejectWebSocketUpgrade(socket: import('node:stream').Duplex, status?: 401 | 403): void;
//# sourceMappingURL=voice-trust.d.ts.map