import { SessionId } from '@deepseek-ai/dsh-session';
import { createVoiceUpgrade } from "./host/voice-server.js";
import { readVoiceOperator } from "./host/voice-trust.js";
/** Services this host plugin depends on. */
export const inject = ['webServer', 'agents'];
const DEFAULT_VOICE = 'zh_female_vv_uranus_bigtts';
/**
 * dsh 0.2 的 `ctx.connection.admit()`。没有 connection 服务时返回 undefined，
 * /voice 仍只靠 loopback + 同源。有服务时只使用 operator 的 id、ctx、scope。
 */
function connectionAdmit(ctx) {
    const get = ctx.get;
    if (typeof get !== 'function')
        return undefined;
    const connection = get('connection');
    if (typeof connection?.admit !== 'function')
        return undefined;
    const admit = connection.admit.bind(connection);
    return (req) => {
        const result = admit(req);
        if (result !== null && typeof result === 'object' && result.peer !== undefined && typeof result.peer === 'object') {
            const operator = readVoiceOperator(result.peer);
            return operator === undefined ? { rejection: 403 } : { peer: operator };
        }
        if (result !== null && typeof result === 'object' && (result.rejection === 401 || result.rejection === 403)) {
            return { rejection: result.rejection };
        }
        return { rejection: 403 };
    };
}
export function apply(ctx) {
    const upgrade = createVoiceUpgrade(process.env.VOLCENGINE_API_KEY ?? '', DEFAULT_VOICE, 
    // barge-in：打断朗读时取消对应 DSH 会话的 agent 回合（用户打断）。
    (dshSessionId) => {
        if (dshSessionId === '')
            return;
        ctx.agents.get(SessionId(dshSessionId))?.cancel({ kind: 'user' });
    }, connectionAdmit(ctx));
    ctx.effect(() => ctx.webServer.registerUpgrade({ path: '/voice', handler: upgrade.handle }), 'ui-voice-live: /voice WebSocket route');
    ctx.effect(() => upgrade.close, 'ui-voice-live: /voice socket teardown');
}
//# sourceMappingURL=index.js.map