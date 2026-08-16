/**
 * /voice WebSocket 信任检查（与 client-connection 的 /api 栅栏同构）。
 * 防御两条浏览器对本地 HTTP 服务的 confused-deputy 路径：
 *  - DNS rebinding：Host 头写着攻击者域名，但 socket 打到了本机服务；
 *  - 跨站请求：恶意页面发起的 WebSocket 握手。
 * 当前只允许 loopback 主机 + 同源 Origin；非本机暴露在信任检查落地前不允许。
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
/** 拒绝一次 WebSocket upgrade（HTTP 403 后立即断开）。 */
export declare function rejectWebSocketUpgrade(socket: import('node:stream').Duplex): void;
//# sourceMappingURL=voice-trust.d.ts.map