import { SessionId } from '@deepseek-ai/dsh-session';
import { createVoiceUpgrade } from "./host/voice-server.js";
/** Services this host plugin depends on. */
export const inject = ['webServer', 'agents'];
const DEFAULT_VOICE = 'zh_female_vv_uranus_bigtts';
export function apply(ctx) {
    const upgrade = createVoiceUpgrade(process.env.VOLCENGINE_API_KEY ?? '', DEFAULT_VOICE, 
    // barge-in：打断朗读时取消对应 DSH 会话的 agent 回合（用户打断）。
    (dshSessionId) => {
        if (dshSessionId === '')
            return;
        ctx.agents.get(SessionId(dshSessionId))?.cancel({ kind: 'user' });
    });
    ctx.effect(() => ctx.webServer.registerUpgrade({ path: '/voice', handler: upgrade.handle }), 'ui-voice-live: /voice WebSocket route');
    ctx.effect(() => upgrade.close, 'ui-voice-live: /voice socket teardown');
}
//# sourceMappingURL=index.js.map