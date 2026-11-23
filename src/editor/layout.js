/* Pane layouts rendered as CSS grid-template-areas. */
import { CONFIG } from "./config.js";
import { UIState } from "./state.js";
import { $ } from "./util.js";
import { App } from "./app.js";
import { Docs } from "./docs.js";
import { UI } from "./ui.js";
import { Tabs } from "./tabs.js";
import { Panes } from "./panes.js";
import { Persist } from "./persist.js";
import { toast } from "./toast.js";

/** Pane layouts. Each layout is rendered as a CSS grid (grid-template-areas), so any arrangement is just data. */
export const Layout = {
  byId: new Map(CONFIG.LAYOUTS.map(l => [l.id, l])),
  /** Returns the current layout definition, falling back to a single pane. */
  get cur() { return this.byId.get(UIState.layout) || this.byId.get('single'); },
  /** Returns the number of panes in the current layout. */
  count() { return this.cur.n; },
  /** Checks whether a pane index is visible in the current layout. */
  visible(i) { return i < this.count(); },
  /** Tiny SVG thumbnail of a layout (used in the picker and the title bar). */
  icon(L) {
    const R = L.areas.length, C = L.areas[0].length, W = 16, H = 16;
    const rects = [...new Set(L.areas.flat())].map(p => {
      let r0 = 99, r1 = -1, c0 = 99, c1 = -1;
      L.areas.forEach((row, r) => row.forEach((v, c) => { if (v === p) { r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c); } }));
      const cw = W / C, rh = H / R;
      return `<rect x="${(c0 * cw + 1).toFixed(2)}" y="${(r0 * rh + 1).toFixed(2)}" width="${((c1 - c0 + 1) * cw - 2).toFixed(2)}" height="${((r1 - r0 + 1) * rh - 2).toFixed(2)}" rx="1.5"/>`;
    }).join('');
    return `<svg class="lay-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">${rects}</svg>`;
  },
  /** Applies the current layout's grid areas to the editors container and resizes panes. */
  apply() {
    const L = this.cur, ed = $('#editors');
    ed.dataset.layout = L.id;
    ed.style.gridTemplateAreas = L.areas.map(r => `"${r.join(' ')}"`).join(' ');
    ed.style.gridTemplateColumns = `repeat(${L.areas[0].length}, minmax(0, 1fr))`;
    ed.style.gridTemplateRows = `repeat(${L.areas.length}, minmax(0, 1fr))`;
    App.panes.forEach(p => { p.el.style.gridArea = 'p' + p.idx; p.el.classList.toggle('off', p.idx >= L.n); });
    document.body.classList.toggle('multi', L.n > 1);
    const b = $('#btnLayout'); if (b) { b.classList.toggle('on', L.n > 1); b.title = 'Pane Layout: ' + L.name; }
    UI.resize();
  },
  /** Switches layouts, loading files into newly revealed panes and refreshing tabs. */
  set(id, { quiet = false } = {}) {
    const L = this.byId.get(id); if (!L) return;
    const prev = this.count();
    UIState.layout = L.id; this.apply();
    // newly revealed panes start on a file that is not already visible (if there is one)
    for (let i = prev; i < L.n; i++) {
      const p = App.panes[i];
      const cand = Docs.mruDocs().find(d => !App.panes.slice(0, i).some(q => q.docId === d.id)) || App.doc();
      Docs.showIn(p, cand);
    }
    if (App.active >= L.n) { App.setActive(0); App.panes[0].editor.focus(); }
    Tabs.render(); Panes.renderHeads(); Persist.schedule();
    if (!quiet) toast('Layout: ' + L.name, { icon: 'bi-layout-split', ms: 1100 });
    if (L.n > prev && prev >= 1) App.panes[prev].editor.focus();
  },
  /** Moves focus to the next or previous visible pane. */
  focusStep(d) {
    const n = this.count(); if (n < 2) return toast('Only one pane. Pick a layout first (Alt+Shift+2)', { type: 'warn' });
    App.panes[(App.active + d + n) % n].editor.focus();
  },
  /** Focuses a specific pane if it is visible, otherwise shows a warning. */
  focusPane(i) {
    if (!this.visible(i)) return toast(`Pane ${i + 1} is not in this layout`, { type: 'warn', ms: 1200 });
    App.panes[i].editor.focus();
  },
  /** Opens the active document in the next pane, creating a split if needed. */
  openInNext() {
    const n = this.count();
    if (n < 2) { this.set('cols2', { quiet: true }); }
    const from = App.active, to = (from + 1) % this.count();
    Docs.activate(App.doc(), to);
  }
};
