/* View / appearance commands. */
import { CONFIG } from "../config.js";
import { cmd } from "../commands.js";
import { UI } from "../ui.js";
import { S, saveSettings, UIState } from "../state.js";
import { Settings } from "../settings.js";

/** Show or hide the file explorer sidebar. */
cmd('view.sidebar', 'View', 'Toggle Sidebar', 'Ctrl+K Ctrl+B', () => UI.setSidebar(!S.sidebar), { checked: () => S.sidebar });
/** Show or hide the minimap. */
cmd('view.minimap', 'View', 'Toggle Minimap', '', () => { S.minimap = !S.minimap; saveSettings(); UI.applyLayout(); Settings.sync(); }, { checked: () => S.minimap });
/** Show or hide the status bar. */
cmd('view.statusbar', 'View', 'Toggle Status Bar', '', () => { S.statusbar = !S.statusbar; saveSettings(); UI.applyLayout(); Settings.sync(); }, { checked: () => S.statusbar });
/** Show or hide the title bar with its menus and toolbar buttons. */
cmd('view.header', 'View', 'Toggle Header', 'Alt+H', () => { S.header = !S.header; saveSettings(); UI.applyLayout(); }, { checked: () => S.header });
/** Show or hide invisible whitespace characters. */
cmd('view.whitespace', 'View', 'Toggle Whitespace', '', () => UI.setWhitespace(!S.whitespace), { checked: () => S.whitespace });
/** Toggle distraction-free (zen) mode. */
cmd('view.distraction', 'View', 'Toggle Distraction Free Mode', 'Shift+F11', () => UI.toggleZen(), { checked: () => UIState.zen });
/** Increase the editor font size. */
cmd('view.zoomIn', 'View', 'Increase Font Size', 'Ctrl+=', () => UI.setZoom(S.fontSize + 1), { aliases: ['Ctrl+Shift+=', 'Ctrl++'] });
/** Decrease the editor font size. */
cmd('view.zoomOut', 'View', 'Decrease Font Size', 'Ctrl+-', () => UI.setZoom(S.fontSize - 1));
/** Restore the default font size. */
cmd('view.zoomReset', 'View', 'Reset Font Size', 'Ctrl+0', () => UI.setZoom(CONFIG.DEFAULTS.fontSize));
/** Toggle font ligatures. */
cmd('view.ligatures', 'View', 'Toggle Font Ligatures', '', () => { S.ligatures = !S.ligatures; saveSettings(); UI.applyFont(); }, { checked: () => S.ligatures });
/** Toggle word wrap on/off using the last chosen width. */
cmd('view.wrap', 'View', 'Toggle Word Wrap', 'Alt+Z', () => UI.setWrap(S.wrap === 'off' ? (S.lastWrap || 'window') : 'off'), { checked: () => S.wrap !== 'off' });

/** Register one command for each available wrap mode. */
CONFIG.WRAPS.forEach(([id, name]) => cmd('wrap.' + id, 'Word Wrap', name, '', () => UI.setWrap(id), { checked: () => S.wrap === id }));
