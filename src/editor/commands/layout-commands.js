/* Pane layout and focus commands. */
import { CONFIG, MAX_PANES } from "../config.js";
import { $ } from "../util.js";
import { cmd } from "../commands.js";
import { UI } from "../ui.js";
import { Layout } from "../layout.js";
import { UIState } from "../state.js";

/** Register one command for each predefined pane layout. */
CONFIG.LAYOUTS.forEach(L => cmd('layout.' + L.id, 'Layout', L.name, L.key, () => Layout.set(L.id), { checked: () => UIState.layout === L.id }));
/** Toggle between a single pane and two columns. */
cmd('view.split', 'Layout', 'Toggle Split View', 'Ctrl+K Ctrl+\\', () => UI.toggleSplit(), { checked: () => UIState.layout !== 'single' });
/** Focus the next visible pane. */
cmd('view.focusNext', 'Layout', 'Focus Next Pane', 'Ctrl+K Ctrl+Right', () => Layout.focusStep(1));
/** Focus the previous visible pane. */
cmd('view.focusPrev', 'Layout', 'Focus Previous Pane', 'Ctrl+K Ctrl+Left', () => Layout.focusStep(-1));

/** Register a focus command for each of the four possible panes. */
for (let i = 0; i < MAX_PANES; i++) cmd('pane.focus' + (i + 1), 'Layout', `Focus Pane ${i + 1}`, `Ctrl+K Ctrl+${i + 1}`, () => Layout.focusPane(i));

/** Show the active document in the next pane. */
cmd('pane.openNext', 'Layout', 'Show Current File in Next Pane', 'Ctrl+K Ctrl+O', () => Layout.openInNext());
/** Open the layout picker from the title-bar button. */
cmd('layout.pick', 'Layout', 'Choose Layout…', '', () => $('#btnLayout').click());
