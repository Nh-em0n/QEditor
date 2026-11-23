/* Tab strip. */
import { $, $$, esc } from "./util.js";
import { App } from "./app.js";
import { Docs, isModified } from "./docs.js";
import { Layout } from "./layout.js";
import { Langs } from "./langs.js";
import { Panes } from "./panes.js";
import { Commands } from "./commands.js";

/* =====================================================================
   11. UI COMPONENTS: tabs, sidebar, status bar, menus, layout
   ===================================================================== */
export const Tabs = {
  bar: $('#tabs'),
  /** Renders all document tabs and marks the active, visible, and modified ones. */
  render() {
    const active = App.doc();
    const visibleDocs = new Set(App.panes.slice(0, Layout.count()).map(p => p.docId));
    this.bar.innerHTML = '';
    Docs.list.forEach(d => {
      const t = document.createElement('div');
      t.className = 'tab' + (d === active ? ' active' : '') + (visibleDocs.has(d.id) ? ' shown' : '') + (isModified(d) ? ' dirty' : '');
      t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', String(d === active));
      t.tabIndex = d === active ? 0 : -1; t.draggable = true; t.dataset.id = d.id; t.title = d.name;
      t.innerHTML = `<i class="bi ${Langs.icon(d.lang)} tab-ico" style="color:${Langs.color(d.lang)}" aria-hidden="true"></i><span class="tab-name">${esc(d.name)}</span>` +
        `<button class="tab-x" tabindex="-1" aria-label="Close ${esc(d.name)}"><span class="dot"></span><i class="bi bi-x-lg" aria-hidden="true"></i></button>`;
      this.bar.appendChild(t);
    });
    const a = $('.tab.active', this.bar);
    if (a) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    Panes.renderHeads();
  },
  /** Updates the modified indicator on the document's tab. */
  markDirty(doc) { const t = $(`.tab[data-id="${doc.id}"]`, this.bar); if (t) t.classList.toggle('dirty', isModified(doc)); Panes.renderHeads(); },
  /** Registers click, keyboard, and drag-and-drop handlers on the tab strip. */
  init() {
    /** Returns the document associated with a tab element. */
    const bar = this.bar, docOf = el => { const t = el.closest('.tab'); return t && Docs.byId.get(t.dataset.id); };
    bar.addEventListener('click', e => {
      const d = docOf(e.target); if (!d) return;
      if (e.target.closest('.tab-x')) Docs.close(d); else Docs.activate(d);
    });
    bar.addEventListener('dblclick', e => { if (e.target === bar) Docs.newFile(); });   // double-click empty space = new tab
    bar.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });      // stop middle-click autoscroll
    bar.addEventListener('auxclick', e => { if (e.button === 1) { const d = docOf(e.target); if (d) { e.preventDefault(); Docs.close(d); } } });
    bar.addEventListener('keydown', e => {
      const d = docOf(e.target); if (!d) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Docs.activate(d); }
      else if (e.key === 'Delete') { Docs.close(d); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const i = Docs.list.indexOf(d) + (e.key === 'ArrowRight' ? 1 : -1), n = Docs.list[(i + Docs.list.length) % Docs.list.length];
        const el = $(`.tab[data-id="${n.id}"]`, bar); el.tabIndex = 0; el.focus();
      }
    });
    // drag to reorder (or drop on a pane to open it there)
    let dragId = null;
    /** Removes drag and drop helper classes from all tabs. */
    const clear = () => $$('.tab', bar).forEach(t => t.classList.remove('drop-before', 'drop-after', 'dragging'));
    bar.addEventListener('dragstart', e => {
      const t = e.target.closest('.tab'); if (!t) return;
      dragId = t.dataset.id; e.dataTransfer.setData('text/x-tab', dragId); e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => t.classList.add('dragging'), 0);
    });
    bar.addEventListener('dragover', e => {
      if (!dragId) return;
      e.preventDefault(); e.dataTransfer.dropEffect = 'move';
      const t = e.target.closest('.tab'); $$('.tab', bar).forEach(x => x.classList.remove('drop-before', 'drop-after'));
      if (!t || t.dataset.id === dragId) return;
      const r = t.getBoundingClientRect();
      t.classList.add(e.clientX > r.left + r.width / 2 ? 'drop-after' : 'drop-before');
    });
    bar.addEventListener('drop', e => {
      if (!dragId) return;
      e.preventDefault();
      const t = e.target.closest('.tab');
      if (t) { const r = t.getBoundingClientRect(); Docs.move(dragId, t.dataset.id, e.clientX > r.left + r.width / 2); }
      dragId = null; clear();
    });
    bar.addEventListener('dragend', () => { dragId = null; clear(); $$('.pane').forEach(p => p.classList.remove('drop-target')); });
    $('#btnNewTab').addEventListener('click', () => Commands.exec('file.new'));
  }
};
