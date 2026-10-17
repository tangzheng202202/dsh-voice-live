/**
 * /voice WebSocket 信任检查（与 client-connection 的 /api 栅栏同构）。
 * 防御两条浏览器对本地 HTTP 服务的 confused-deputy 路径：
 *  - DNS rebinding：Host 头写着攻击者域名，但 socket 打到了本机服务；
 *  - 跨站请求：恶意页面发起的 WebSocket 握手。
 * 当前允许 loopback 主机 + 同源 Origin。通过栅栏之后必须再过
 * `ctx.connection.admit()`（0.2.0-rc.2 的 operator 只有 id、ctx、scope）。
 * 拿不到 admit 时拒绝，不放行。
 */
/** 归一化 hostname 是否为本机 loopback（localhost / ::1 / 127/8）。 */
export function isLoopbackHostname(hostname) {
    if (hostname === 'localhost' || hostname === '[::1]')
        return true;
    const parts = hostname.split('.');
    return parts.length === 4
        && parts[0] === '127'
        && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/**
 * 一个 WebSocket upgrade 请求是否被信任：
 *  - Host 必须解析为 loopback 主机（DNS rebinding 防御）；
 *  - sec-fetch-site 为 cross-site 时直接拒绝；
 *  - 浏览器若带 Origin，必须与 Host 同源。
 */
export function isTrustedVoiceRequest(req) {
    const host = req.headers.host;
    if (typeof host !== 'string')
        return false;
    let hostUrl;
    try {
        hostUrl = new URL(`http://${host}`);
    }
    catch {
        return false;
    }
    if (!isLoopbackHostname(hostUrl.hostname))
        return false;
    if (req.headers['sec-fetch-site'] === 'cross-site')
        return false;
    const origin = req.headers.origin;
    if (origin === undefined)
        return true;
    try {
        return new URL(origin).host === hostUrl.host;
    }
    catch {
        return false;
    }
}
/**
 * 只读 operator 的 id、ctx、scope。缺任一项就当没通过鉴权。
 * 不读其它字段：0.2.0-rc.2 的 admit() 没有 user、token 之类的属性。
 */
export function readVoiceOperator(peer) {
    const record = peer;
    const id = record.id;
    const ctx = record.ctx;
    const scope = record.scope;
    if (typeof id !== 'string' || id === '')
        return undefined;
    if (typeof ctx !== 'object' || ctx === null)
        return undefined;
    if (typeof scope !== 'object' || scope === null)
        return undefined;
    return { id, ctx, scope };
}
/** 拒绝一次 WebSocket upgrade（HTTP 401/403 后立即断开）。 */
export function rejectWebSocketUpgrade(socket, status = 403) {
    const reason = status === 401 ? 'Unauthorized' : 'Forbidden';
    socket.write(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\n\r\n`);
    socket.destroy();
}
//# sourceMappingURL=voice-trust.js.map