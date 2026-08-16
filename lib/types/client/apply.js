import { VoiceInputButton } from "./VoiceInputButton.js";
import { VoiceSettingsSection } from "./VoiceSettingsSection.js";
import { en, NS, zh } from "./locales.js";
/** Services required by this plugin. */
export const inject = ['slots', 'locale'];
/**
 * Register the voice dictionaries, the composer mic control, and the settings
 * section, each once its slot declaration is on the ledger.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-voice-live: dictionaries');
    const t = ctx.locale.bind(NS);
    ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
        name: 'conversation.input.left',
        id: 'voice',
        order: 0,
        locale: NS,
    }, VoiceInputButton));
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'voice',
        order: 100,
        label: () => t('voice.nav'),
        locale: NS,
    }, VoiceSettingsSection));
}
//# sourceMappingURL=apply.js.map