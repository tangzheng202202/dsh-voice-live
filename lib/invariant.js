//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-voice-live`.
* @module @deepseek-ai/dsh-client-ui-voice-live/invariant
*/
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-voice-live";
/** Cordis companion plugin name. */
const name = "client-ui-voice-live-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: mic / WebSocket / AudioContext resource ownership and
* the start→stop state machine live in the browser half and are covered by
* controller tests (per-session VoiceController, bounded queue, exactly-once
* ASR final, single serial TTS worker).
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
