/* Preferences, fonts, indentation, syntax, line endings and color schemes. */
import { CONFIG } from "../config.js";
import { cmd } from "../commands.js";
import { Settings } from "../settings.js";
import { UI } from "../ui.js";
import { S, saveSettings } from "../state.js";
import { Langs } from "../langs.js";
import { Themes } from "../themes.js";
import { Palette } from "../palette.js";
import { App, E } from "../app.js";
import { Docs } from "../docs.js";
import { Tabs } from "../tabs.js";
import { Sidebar } from "../sidebar.js";
import { Status } from "../status.js";
import { toast } from "../toast.js";

/** Open the preferences dialog. */
cmd('prefs.open', 'Preferences', 'Settings: Font, Theme & Editor…', 'Ctrl+,', () => Settings.show());
/** Open preferences focused on the custom font field. */
cmd('font.custom', 'Font', 'Custom Font…', '', () => Settings.show(true));

/** Register one command for each preset font. */
CONFIG.FONTS.forEach(f => cmd('font.' + f.id, 'Font', f.id, '', () => UI.setFont(f.id), { checked: () => S.fontFamily === f.id }));
/** Increase the configured line height. */
cmd('font.lhUp', 'Font', 'Increase Line Height', '', () => UI.setLineHeight(+(S.lineHeight + 0.1).toFixed(2)));
/** Decrease the configured line height. */
cmd('font.lhDown', 'Font', 'Decrease Line Height', '', () => UI.setLineHeight(+(S.lineHeight - 0.1).toFixed(2)));

/** Switch indentation to spaces. */
cmd('indent.spaces', 'Indentation', 'Indent Using Spaces', '', () => UI.setIndent({ soft: true }), { checked: () => S.softTabs });
/** Switch indentation to hard tabs. */
cmd('indent.tabs', 'Indentation', 'Indent Using Tabs', '', () => UI.setIndent({ soft: false }), { checked: () => !S.softTabs });
/** Register the available tab widths. */
[2, 4, 8].forEach(n => cmd('indent.size' + n, 'Indentation', `Tab Width: ${n}`, '', () => UI.setIndent({ size: n }), { checked: () => S.tabSize === n }));

/** Apply a line-ending mode to the active document and mark it dirty. */
const setEol = mode => {
  const d = E().session.getDocument(); d.setNewLineMode(mode);
  const doc = App.doc(); doc.forceDirty = true; doc._m = true;
  Tabs.markDirty(doc); Sidebar.markDirty(doc); Status.schedule();
  toast('Line endings: ' + (mode === 'windows' ? 'CRLF' : 'LF'), { icon: 'bi-arrow-return-left', ms: 1200 });
};
/** Use Unix line endings (LF). */
cmd('eol.lf', 'Line Endings', 'Unix (LF)', '', () => setEol('unix'), { checked: () => E().session.getDocument().getNewLineCharacter() === '\n' });
/** Use Windows line endings (CRLF). */
cmd('eol.crlf', 'Line Endings', 'Windows (CRLF)', '', () => setEol('windows'), { checked: () => E().session.getDocument().getNewLineCharacter() === '\r\n' });

/** Register a syntax-mode command for each known language. */
Langs.list.forEach(l => cmd('lang.' + l.id, 'Syntax', l.name, '', () => { Docs.setLang(App.doc(), l.id); toast('Syntax: ' + l.name, { icon: 'bi-code-slash', ms: 1100 }); }, { checked: () => App.doc() && App.doc().lang === l.id }));

/** Register color schemes with live preview while arrowing through the palette. */
CONFIG.THEMES.forEach(t => cmd('theme.' + t.id, 'Color Scheme', t.name, '', () => Themes.set(t.id), {
  checked: () => Themes.current === t.id, preview: () => Themes.apply(t.id), revert: () => Themes.revert()
}));
/** Open the palette filtered to color schemes. */
cmd('theme.pick', 'Preferences', 'Select Color Scheme…', '', () => Palette.show('>Color Scheme: '));
