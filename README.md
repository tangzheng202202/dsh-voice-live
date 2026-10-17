# @deepseek-ai/dsh-client-ui-voice-live

English | [中文](README.zh.md)

Real-time voice interaction for DSH: press the composer mic, speak, and the
assistant replies aloud. The package ships two halves:

- **Host half** registers the `/voice` WebSocket upgrade route inside the DSH
  host process. One connection carries a session that feeds microphone PCM to
  Volcengine streaming ASR (bigmodel_async with server-side VAD endpointing)
  and streams assistant reply text to Volcengine streaming TTS
  (seed-tts-2.0). The upgrade is gated by a loopback-Host + same-origin trust
  fence, and by `connection.admit` when that service is present. Every async
  operation has one lifecycle owner, audio flows through a bounded queue, and
  TTS is a single serial worker.
- **Client half** renders the composer mic control (`conversation.input.left`)
  and the Voice settings section (`settings.section`). A per-session
  `VoiceController` state machine owns all resources — `AudioCapture`
  (MediaStream/AudioContext/AudioWorklet), `VoiceTransport` (WebSocket) and
  `PlaybackQueue` (audio) — and rejects stale/late messages by generation.

The API key is read from `process.env.VOLCENGINE_API_KEY` on the host; the
browser never holds or transmits a key. `/voice` requires a loopback Host and
a same-origin `Origin`, then `ctx.connection.admit()` (wired with
`ctx.inject(['connection'])`, the same way other plugins do). A missing admit
function or a logged-out browser is HTTP 401. The operator this plugin reads
has only `id`, `ctx`, and `scope`. If `ready` says `hasKey` is not true, the
mic button resets and shows `后端未配置 VOLCENGINE_API_KEY`.

## Install (about 5 minutes)

This package is `dsh-voice-live`. Official `@deepseek-ai/dsh-*` peers accept
the published `0.0.1-rc.5` set **or** dsh `0.2.x` from `0.2.0-rc.2` up to but
not including `0.3.0` (`0.0.1-rc.5 || >=0.2.0-rc.2 <0.3.0-0`). dsh compares
those ranges with its own version, which is why an exact `0.0.1-rc.5` pin is
rejected on `0.2.0-rc.2`. Cordis stays `^4.0.1`. Development installs and
`npm test` still use the `0.0.1-rc.5` packages, because that set installs
cleanly and does not pull the unpublished `@deepseek-ai/dsh-compact` package.
`@deepseek-ai/dsh-client-runtime` has no `0.2.0-rc.2` release; the web client
in that Harness still exposes the same `ctx.slots.inject` / `ctx.slots.register`
contract.

1. Use DeepSeek Harness `0.2.0-rc.2` (or another `0.2.x` in the peer range), or a Harness that already has the `0.0.1-rc.5` packages.
2. Put the key on the host. Copy the variable name from
   [`examples/api-key.env.example`](examples/api-key.env.example) into
   `~/.dsh/api-key.env` (the value stays on your machine):

   ```sh
   VOLCENGINE_API_KEY=your-key-here
   ```

3. Install and restart the web UI:

   ```sh
   dsh plugin --profile web add github:tangzheng202202/dsh-voice-live
   ```

   GitHub installs run the package build. `npm run build` in this repo uses
   only `esbuild` and `tsc`; it does not need a DSH monorepo checkout.
4. Open a chat, allow the microphone, and click the mic on the left of the
   composer. Speak, then pause about 1.5 seconds. The line sends itself.
   You should hear 「好的，我去查一下。」 before the real answer. If the host
   has no key, the button reports `后端未配置 VOLCENGINE_API_KEY`.

Screenshots and a GIF belong in `assets/` (not added yet):

<!-- 截图 / GIF 位置
assets/voice-live.gif        点麦克风 → 草稿出字 → 自动发送 → 听到开场白
assets/settings-voices.png   设置页里的 30 个音色
assets/barge-in.png          朗读过程中再次开口，播放被打断
-->

To hack on the repo itself: `npm install`, then `npm test`, then `npm run build`.
License: [MIT](LICENSE).

## Interaction model

- Tap the mic to start. While active the button renders a tech orb with pulse
  rings; speech is recognized incrementally into the composer draft.
- Endpointing is server-side: after ~1.5 s of silence a definite ASR final is
  emitted and submitted **without pressing stop**. `stop()` is still "send end
  and await the final"; `cancel()` discards.
- After submission the connection stays open in *reply mode*: the assistant's
  streaming text is synthesized sentence by sentence and played only after its
  `tts_done` completion event. When **reply-first** is enabled (default), the
  voice replies "好的，我去查一下。" immediately, then queues the real answer.
- Speaking again mid-reply **interrupts**: playback stops, TTS is cancelled,
  the in-flight agent turn is cancelled through DSH's agents service, old
  message ids are invalidated, and a new recognition starts.
- A dropped connection while listening auto-reconnects (single reconnecter,
  exponential backoff, max 5 attempts).

## Settings

The Voice section lets you pick a voice (30 verified Volcengine voices),
preview it, and toggle reply-first. The preview connects over the same `/voice`
route and is completion-event driven (no fixed sleep).

## Protocol (browser ↔ host, one WebSocket)

- browser → host: binary = 16 kHz Int16 mono mic PCM; control frames
  `config` (provider/voice/dshSessionId), `asr_start`, `asr_end`, `asr_cancel`,
  `tts_push`, `tts_flush`, `tts_cancel`.
- host → browser: `ready`, `asr_partial`/`asr_final` (with voiceSessionId,
  utteranceId, sequence), `tts_start` + binary audio + `tts_done`, `tts_error`,
  `tts_idle`, `error`.
- Control frames carrying a `voiceSessionId` must match the session; oversized
  frames and malformed JSON are dropped; a forged Host gets a 403.

## Model Experience

### Voice path

#### What the model sees

Nothing: the microphone stream goes to Volcengine ASR and the assistant reply text to Volcengine TTS over the host `/voice` route, and neither request composes, appends, or rewrites any LLM prompt (the assistant turn is DSH's ordinary agent loop).

#### Token effect

None: this package assembles and sends no model request, so it meters no tokens; any metering belongs entirely to the agent loop that services the submitted prompt.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

- **Wake word** ships as a Web Speech API implementation (Chrome/Safari,
  zh-CN, keyword match on the recognized transcript). It is off by default
  (keeps the mic held). Two constraints are documented rather than papered
  over:
  - Chrome's Web Speech recognition routes through Google's cloud
    recognizer, which is unreachable from mainland networks — the settings
    probe (`检测唤醒可用性`) surfaces the exact `onerror` reason
    (e.g. `network`) instead of failing silently; Safari (Apple's service)
    is the working browser on macOS.
  - The preferred local offline engine, sherpa-onnx WASM keyword spotting,
  is blocked upstream: the `sherpa-onnx-wasm` npm package is deleted (404
  on npm/jsdelivr/unpkg/npmmirror) and the current GitHub release assets
  are task-specific builds whose wasm binaries contain no KWS kernel
  (verified: no `sherpa_onnx_*_kws` symbols). vosk-browser was evaluated as
  a fallback but its fixed Chinese model vocabulary cannot constrain custom
  keywords such as the default wake phrase. The `WakeWordDetector` interface
  keeps the seam for a future local WASM engine once a distribution exists.
- **Echo cancellation** relies on the browser's AEC (Chrome AEC3) applied to
  the WebRTC mic track. `VoiceController.getMicAec()` reports whether the
  browser actually applied AEC. `new Audio()` playback is not covered by
  Chrome's AEC (Chromium bug 687574), so the loop stays half-duplex: mic frames
  are gated while TTS plays, and barge-in stops playback before new recognition.
  The controlled echo test (speaker vs headphone, AEC on/off) is documented in
  the deliverable notes; the runtime decision is half-duplex + interrupt.
- **Live captions** surface as the incremental composer draft (asr_partial);
  there is no floating caption overlay yet.
- Server-side endpointing depends on Volcengine's optimized bidirectional
  endpoint (`bigmodel_async` + `enable_nonstream`); a plain `bigmodel` stream
  only returns partials and never finalizes on its own.
- The `*.host.spec.ts` tests run in this repo with `npm test` (vitest). The
  host half's type declarations are emitted by `tsc -b` inside `npm run build`.

## Where this came from

The source was extracted from the DSH monorepo package
`packages/client/ui-voice-live`. The copyright line in [LICENSE](LICENSE)
still names DeepSeek. Build and test run in this repository.
