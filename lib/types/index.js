import { SessionId } from '@deepseek-ai/dsh-session';
import { createVoiceUpgrade } from "./host/voice-server.js";
import { readVoiceOperator } from "./host/voice-trust.js";
/** Services this host plugin depends on. */
export const inject = ['webServer', 'agents'];
const DEFAULT_VOICE = 'zh_female_vv_uranus_bigtts';
/**
 * 把 `ctx.connection.admit()` 收成 /voice 的准入结果。
 * 0.2.0-rc.2 的 operator 只有 id、ctx、scope。拿不到 admit、调用抛错、
 * 或结果不是放行，一律 401，不能把握手放过去。
 */
function admissionFrom(connection, req) {
    if (typeof connection?.admit !== 'function')
        return { rejection: 401 };
    let result;
    try {
        result = connection.admit(req);
    }
    catch {
        return { rejection: 401 };
    }
    if (result !== null && typeof result === 'object' && result.peer !== undefined && typeof result.peer === 'object') {
        const operator = readVoiceOperator(result.peer);
        return operator === undefined ? { rejection: 403 } : { peer: operator };
    }
    if (result !== null && typeof result === 'object' && (result.rejection === 401 || result.rejection === 403)) {
        return { rejection: result.rejection };
    }
    return { rejection: 401 };
}
export function apply(ctx) {
    // 没接上 connection 之前也拒绝。ctx.get('connection') 在 0.2.0-rc.2 上拿不到
    // 服务；和 dsh-retro / dsh-sparkos 一样，等 ctx.inject 把 connection 注入后再读
    // httpCtx.connection.admit。
    let admitRequest = () => ({ rejection: 401 });
    ctx.inject(['connection'], (httpCtx) => {
        admitRequest = (req) => admissionFrom(httpCtx.connection, req);
    });
    const upgrade = createVoiceUpgrade(process.env.VOLCENGINE_API_KEY ?? '', DEFAULT_VOICE, 
    // barge-in：打断朗读时取消对应 DSH 会话的 agent 回合（用户打断）。
    (dshSessionId) => {
        if (dshSessionId === '')
            return;
        ctx.agents.get(SessionId(dshSessionId))?.cancel({ kind: 'user' });
    }, (req) => admitRequest(req));
    ctx.effect(() => ctx.webServer.registerUpgrade({ path: '/voice', handler: upgrade.handle }), 'ui-voice-live: /voice WebSocket route');
    ctx.effect(() => upgrade.close, 'ui-voice-live: /voice socket teardown');
}
//# sourceMappingURL=index.js.map