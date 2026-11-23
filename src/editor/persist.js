/* Hot-exit session persistence: tabs, text, cursors, and layout. */
import { MAX_PANES } from "./config.js";
import { Store, debounce, clamp } from "./util.js";
import { Docs, isModified } from "./docs.js";
import { App } from "./app.js";
import { Layout } from "./layout.js";
import { UIState } from "./state.js";
import { Tabs } from "./tabs.js";
import { Sidebar } from "./sidebar.js";
import { Status } from "./status.js";
import { UI } from "./ui.js";

/** Hot-exit style session persistence (tabs, text, cursor positions, layout). */
export const Persist = {
  schedule: debounce(() => Persist.save(), 700),
  /** Saves documents, pane assignments, layout, and the active pane. */
  save() {
    try {
      const docs = Docs.list.map(d => {
        const s = d.sessions[0], c = s.selection.getCursor();
        return { name: d.name, lang: d.lang, text: s.getValue(), dirty: isModified(d), fromDisk: d.fromDisk, cur: { row: c.row, column: c.column }, top: s.getScrollTop() };
      });
      /** Finds the index of the document shown in a pane. */
      const idx = i => Math.max(0, Docs.list.findIndex(d => d.id === (App.panes[i] && App.panes[i].docId)));
      Store.setJSON('session', { docs, panes: App.panes.map((p, i) => idx(i)), layout: UIState.layout, active: App.active, untitled: Docs.untitled });
    } catch (e) { /* quota or serialization failure: ignore */ }
  },
  /** Rebuilds documents, panes, and layout from the saved session. */
  restore() {
    const data = Store.getJSON('session', null);
    if (!data || !Array.isArray(data.docs) || !data.docs.length) return false;
    Docs.untitled = data.untitled || 0;
    data.docs.forEach(d => {
      const doc = Docs.create({ name: d.name, text: d.text, lang: d.lang, dirty: d.dirty, fromDisk: d.fromDisk });
      const s = doc.sessions[0];
      if (d.cur) s.selection.moveCursorTo(d.cur.row, d.cur.column);
      if (d.top) s.setScrollTop(d.top);
    });
    const layout = Layout.byId.has(data.layout) ? data.layout : (data.split ? 'cols2' : 'single');
    const idxs = data.panes || [data.a0 || 0, data.a1 || 0];
    UIState.layout = layout; Layout.apply();
    for (let i = MAX_PANES - 1; i >= 0; i--) {
      Docs.showIn(App.panes[i], Docs.list[clamp(idxs[i] || 0, 0, Docs.list.length - 1)]);
    }
    const act = Layout.visible(data.active || 0) ? (data.active || 0) : 0;
    App.panes[act].editor.focus(); App.setActive(act);
    Docs.mru = [App.panes[act].docId];
    Tabs.render(); Sidebar.render(); Status.schedule(); UI.updateTitle();
    return true;
  }
};
window.addEventListener('beforeunload', e => {
  Persist.save();
  if (Docs.list.some(isModified)) { e.preventDefault(); e.returnValue = ''; }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) Persist.save(); });
