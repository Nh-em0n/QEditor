/* Wire the shell and open the restored session or the samples. */
import "./register-commands.js";
import { CONFIG, MAX_PANES } from "./config.js";
import { $ } from "./util.js";
import { UIState } from "./state.js";
import { Commands } from "./commands.js";
import { Keys } from "./keys.js";
import { Themes } from "./themes.js";
import { makePane } from "./panes.js";
import { UI } from "./ui.js";
import { Tabs } from "./tabs.js";
import { Sidebar } from "./sidebar.js";
import { Status } from "./status.js";
import { Menus } from "./menus.js";
import { Find } from "./find.js";
import { Settings } from "./settings.js";
import { Persist } from "./persist.js";
import { Docs } from "./docs.js";
import { App } from "./app.js";
import { Pick } from "./picker.js";
import { Layout } from "./layout.js";
import { SAMPLE_JS, SAMPLE_MD } from "./samples.js";

/** Initializes the shell, restores the session or samples, and wires the toolbar. */
export function boot() {
  Themes.init();
  Keys.rebuild();
  for (let i = 0; i < MAX_PANES; i++) makePane(i);
  UI.applyLayout();
  UI.applyFont();
  Tabs.init(); Sidebar.init(); Status.init(); Menus.init(); Find.init(); Settings.init();
  Themes.apply(Themes.current);
  if (!Persist.restore()) {
    const a = Docs.create({ name: 'demo.js', text: SAMPLE_JS });
    Docs.create({ name: 'Welcome.md', text: SAMPLE_MD });
    Docs.activate(a, 0);
  }
  $('#btnSidebar').addEventListener('click', () => Commands.exec('view.sidebar'));
  $('#btnPalette').addEventListener('click', () => Commands.exec('palette.commands'));
  $('#btnNew').addEventListener('click', () => Commands.exec('file.new'));
  $('#btnOpen').addEventListener('click', () => Commands.exec('file.open'));
  $('#btnSave').addEventListener('click', () => Commands.exec('file.save'));
  $('#btnSettings').addEventListener('click', () => Commands.exec('prefs.open'));
  $('#btnLayout').addEventListener('click', e => Pick.open(e.currentTarget, {
    title: 'Pane layout', filter: false,
    items: CONFIG.LAYOUTS.map(L => ({ label: L.name, icon: Layout.icon(L), sc: Keys.effective('layout.' + L.id), checked: UIState.layout === L.id, run: () => Commands.exec('layout.' + L.id, { recent: true }) }))
  }));
  new ResizeObserver(() => App.panes.forEach(p => p.editor.resize())).observe($('#editors'));
  // fonts load asynchronously; Ace must re-measure the character width afterwards
  if (document.fonts) document.fonts.addEventListener('loadingdone', () => App.panes.forEach(p => { p.editor.renderer.updateFontSize(); p.mm.schedule(); }));
  window.addEventListener('resize', () => App.panes.forEach(p => p.mm.schedule()));
  Status.update();
  App.panes[App.active].editor.focus();
}
