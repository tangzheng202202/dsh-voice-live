/** Registers the voice-live slots: composer mic control + settings section. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type VoiceKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Voice-live plugin dictionaries. */
        voice: VoiceKey;
    }
}
/** Services required by this plugin. */
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=apply.d.ts.map