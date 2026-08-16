/**
 * Host entry: registers the `/voice` WebSocket upgrade route so the browser
 * can reach Volcengine streaming ASR/TTS through DSH itself (no separate
 * Python backend). Runs inside the DSH host process, so it starts and stops
 * with DSH.
 */
import type { Context } from '@deepseek-ai/cordis';
/** Services this host plugin depends on. */
export declare const inject: string[];
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map