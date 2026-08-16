/**
 * Host-side WebSocket voice endpoint: browser mic PCM -> Volcengine streaming
 * ASR (server-side endpointing), browser reply text -> Volcengine TTS.
 *
 * Protocol (browser <-> this endpoint, one WebSocket):
 *   browser -> host:  binary = 16kHz Int16 mono mic PCM
 *                     {"type":"config","provider","voice"}
 *                     {"type":"asr_end","voiceSessionId"}   normal stop, await final
 *                     {"type":"asr_cancel","voiceSessionId"} discard
 *                     {"type":"tts_push","text"} / {"type":"tts_flush"}
 *   host -> browser:  {"type":"ready","voiceSessionId",...}
 *                     {"type":"asr_partial","voiceSessionId","utteranceId","text","sequence"}
 *                     {"type":"asr_final","voiceSessionId","utteranceId","text","sequence"}
 *                     {"type":"tts_start","ttsId","text"} + binary audio + {"type":"tts_done","ttsId"}
 *                     {"type":"error","message"}
 *
 * Every async operation has a single lifecycle owner; all accept AbortSignal
 * where applicable; ASR audio flows through a bounded queue (no unbounded
 * Buffer.concat); TTS is a single serial worker (at most one output stream).
 */
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
/**
 * Bind a WebSocketServer to the webserver upgrade route and wire one session
 * per connection. Returns the upgrade handler plus its disposer.
 */
export declare function createVoiceUpgrade(defaultApiKey: string, defaultVoice: string, cancelAgent?: (dshSessionId: string) => void): {
    handle: (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
    close: () => void;
};
//# sourceMappingURL=voice-server.d.ts.map