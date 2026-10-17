import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Composer mic control, registered on `conversation.input.left` (the additive
 * left tool-row seat). Framework-injected `inputActions` writes the transcript
 * into the draft and submits; no private InputBar keyboard face is touched.
 *
 * 生命周期交给 VoiceController（React 外部状态机），组件只读状态、转发
 * start/stop 动作，并订阅会话回复流：语音发起回合的 agent 回复文本增量
 * 经 pushReplyText 推给后端合成朗读；回合结束 flush + 关闭。
 */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import { getReplyFirst, REPLY_FIRST_TEXT } from "./usePipelineVoice.js";
import { createWakeWordDetector } from "./wake-word.js";
import { getWakeWord, getWakeWordEnabled } from "./usePipelineVoice.js";
import { VoiceController } from "./VoiceController.js";
import css from './VoiceInputButton.module.css';
const ACTIVE_STATES = new Set([
    'acquiring', 'connecting', 'listening', 'recognizing', 'thinking',
    'synthesizing', 'playing', 'interrupting', 'reconnecting',
]);
/** 回复朗读只取正文（text block），跳过 reasoning（思考）与工具块。 */
function replyTextOf(p) {
    if (p === null)
        return '';
    let out = '';
    for (const b of p.blocks) {
        if (b.kind === 'text' && typeof b.text === 'string')
            out += b.text;
    }
    return out;
}
export function VoiceInputButton({ inputActions, useSession, t }) {
    const [state, setState] = useState('idle');
    const [error, setError] = useState(null);
    /** 实时字幕：识别中把 asr_partial 悬浮显示在麦克风按钮上方。 */
    const [caption, setCaption] = useState('');
    const controllerRef = useRef(null);
    /** 当前回合是否由语音发起（决定是否朗读回复）。 */
    const voiceTurnRef = useRef(false);
    /** 已朗读的回复文本长度水位（增量去重）。 */
    const spokenLenRef = useRef(0);
    const controller = () => {
        if (controllerRef.current === null) {
            controllerRef.current = new VoiceController({
                onState: setState,
                onPartial: (text) => {
                    inputActions.setDraft(text);
                    setCaption(text);
                },
                onFinal: (text) => {
                    voiceTurnRef.current = true; // 语音发起回合：回复要朗读
                    inputActions.setDraft(text);
                    setCaption('');
                    inputActions.submit();
                },
                onError: (message) => { setError(message); },
            }, undefined, getReplyFirst() ? REPLY_FIRST_TEXT : '');
        }
        return controllerRef.current;
    };
    const running = useSession(s => s.running);
    const partial = useSession(s => s.partial);
    const dshSessionId = useSession(s => s.sessionId);
    // 同步当前 DSH 会话 id（随 config 上报，host 端打断时用它取消 agent 回合）。
    useEffect(() => {
        controllerRef.current?.setDshSessionId(dshSessionId);
    }, [dshSessionId]);
    // 语音唤醒：开启时挂一个常驻监听器，识别到唤醒词自动进入语音会话。
    const wakeDetectorRef = useRef(null);
    useEffect(() => {
        if (!getWakeWordEnabled())
            return;
        let stopped = false;
        const detector = createWakeWordDetector(getWakeWord(), () => {
            if (stopped)
                return;
            const c = controller();
            if (!c.isActive)
                void c.start(); // 唤醒即开始对话
        });
        wakeDetectorRef.current = detector;
        void detector.start();
        return () => {
            stopped = true;
            detector.stop();
            wakeDetectorRef.current = null;
        };
    }, []);
    // 回复朗读：语音回合内，把 partial 正文增量推给后端合成。
    useEffect(() => {
        const c = controllerRef.current;
        if (c === null)
            return;
        if (!running) {
            // 回合结束：flush 尾巴并结束应答模式（播放完即关闭连接）。
            if (voiceTurnRef.current) {
                c.flushReply();
                c.endReply();
                voiceTurnRef.current = false;
                spokenLenRef.current = 0;
            }
            return;
        }
        if (!voiceTurnRef.current)
            return;
        const text = replyTextOf(partial);
        if (text.length < spokenLenRef.current)
            spokenLenRef.current = 0; // 流回退（罕见）：重头
        if (text.length > spokenLenRef.current) {
            c.pushReplyText(text.slice(spokenLenRef.current));
            spokenLenRef.current = text.length;
        }
    }, [running, partial]);
    useEffect(() => () => {
        controllerRef.current?.cancel();
    }, []);
    const active = ACTIVE_STATES.has(state);
    const tooltip = error ?? (active ? t('voice.micActive') : t('voice.mic'));
    return (_jsxs("div", { className: css.wrap, children: [error !== null && (_jsx("span", { className: css.alert, role: "alert", children: error })), error === null && active && caption !== '' && (_jsx("span", { className: css.caption, "aria-hidden": true, children: caption })), _jsx(Tooltip, { label: tooltip, side: "top", delayMs: 500, children: _jsx("button", { type: "button", className: clsx(css.mic, active && css.active, error && css.error), "aria-label": error ?? t('voice.mic'), "aria-pressed": active, onClick: () => {
                        setError(null);
                        const c = controller();
                        if (c.isActive)
                            c.stop();
                        else
                            void c.start();
                    }, children: active ? (_jsxs("span", { className: css.orb, "aria-hidden": true, children: [_jsx("span", { className: css.orbCore }), _jsx("span", { className: css.orbRing }), _jsx("span", { className: css.orbRing })] })) : (_jsxs("svg", { viewBox: "0 0 16 16", width: "16", height: "16", "aria-hidden": true, children: [_jsx("path", { d: "M8 1a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 1 1-5 0v-3A2.5 2.5 0 0 1 8 1Z", fill: "currentColor" }), _jsx("path", { d: "M3.5 7.5a4.5 4.5 0 0 0 9 0h-1.5a3 3 0 0 1-6 0h-1.5Z", fill: "currentColor" }), _jsx("path", { d: "M8 11.75a4.25 4.25 0 0 1-4.25-4.25H2.25A5.75 5.75 0 0 0 7.25 13.2V15h1.5v-1.8a5.75 5.75 0 0 0 5-5.7h-1.5A4.25 4.25 0 0 1 8 11.75Z", fill: "currentColor" })] })) }) })] }));
}
//# sourceMappingURL=VoiceInputButton.js.map