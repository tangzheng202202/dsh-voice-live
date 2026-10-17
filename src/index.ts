/**
 * Host entry: registers the `/voice` WebSocket upgrade route so the browser
 * can reach Volcengine streaming ASR/TTS through DSH itself (no separate
 * Python backend). Runs inside the DSH host process, so it starts and stops
 * with DSH.
 */
import type { IncomingMessage } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-agent'
import { SessionId } from '@deepseek-ai/dsh-session'
import { createVoiceUpgrade } from './host/voice-server.ts'
import { readVoiceOperator, type VoiceAdmit, type VoiceAdmission } from './host/voice-trust.ts'

/** Services this host plugin depends on. */
export const inject = ['webServer', 'agents']

const DEFAULT_VOICE = 'zh_female_vv_uranus_bigtts'

/**
 * dsh 0.2 的 `ctx.connection.admit()`。没有 connection 服务时返回 undefined，
 * /voice 仍只靠 loopback + 同源。有服务时只使用 operator 的 id、ctx、scope。
 */
function connectionAdmit(ctx: Context): VoiceAdmit | undefined {
  const get = (ctx as { get?: (name: string) => unknown }).get
  if (typeof get !== 'function') return undefined
  const connection = get('connection') as { admit?: (req: IncomingMessage) => { peer?: object; rejection?: unknown } } | undefined
  if (typeof connection?.admit !== 'function') return undefined
  const admit = connection.admit.bind(connection)
  return (req): VoiceAdmission => {
    const result = admit(req)
    if (result !== null && typeof result === 'object' && result.peer !== undefined && typeof result.peer === 'object') {
      const operator = readVoiceOperator(result.peer)
      return operator === undefined ? { rejection: 403 } : { peer: operator }
    }
    if (result !== null && typeof result === 'object' && (result.rejection === 401 || result.rejection === 403)) {
      return { rejection: result.rejection }
    }
    return { rejection: 403 }
  }
}

export function apply(ctx: Context): void {
  const upgrade = createVoiceUpgrade(
    process.env.VOLCENGINE_API_KEY ?? '',
    DEFAULT_VOICE,
    // barge-in：打断朗读时取消对应 DSH 会话的 agent 回合（用户打断）。
    (dshSessionId) => {
      if (dshSessionId === '') return
      ctx.agents.get(SessionId(dshSessionId))?.cancel({ kind: 'user' })
    },
    connectionAdmit(ctx),
  )
  ctx.effect(
    () => ctx.webServer.registerUpgrade({ path: '/voice', handler: upgrade.handle }),
    'ui-voice-live: /voice WebSocket route',
  )
  ctx.effect(() => upgrade.close, 'ui-voice-live: /voice socket teardown')
}
