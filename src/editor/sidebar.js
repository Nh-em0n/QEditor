/* File explorer sidebar. */
import { $, esc, clamp } from "./util.js";
import { S, saveSettings } from "./state.js";
import { App } from "./app.js";
import { Docs, isModified } from "./docs.js";
import { Langs } from "./langs.js";
import { UI } from "./ui.js";
import { Folders } from "./folders.js";

export const Sidebar = {
  el: $('#sbTree'), collapsed: new Set(), dragging: false,
  /** Renders the sidebar tree with local files and scratch documents. */
  render() {
    const active = App.doc();
    const groups = [['Local Files', Docs.list.filter(d => d.fromDisk && !d.folderId)], ['Scratch', Docs.list.filter(d => !d.fromDisk)]].filter(g => g[1].length);
    this.el.innerHTML = Folders.renderHTML() + groups.map(([name, docs]) => {
      const open = !this.collapsed.has(name);
      return `<button class="sb-folder" role="treeitem" aria-expanded="${open}" data-group="${name}"><i class="bi bi-chevron-down" aria-hidden="true"></i><i class="bi bi-folder2-open" aria-hidden="true"></i>${name} <span style="font-weight:400;color:var(--faint)">${docs.length}</span></button>` +
        `<ul class="sb-list" role="group">${docs.map(d => `<li><button class="sb-file${d === active ? ' active' : ''}${isModified(d) ? ' dirty' : ''}" role="treeitem" data-id="${d.id}" aria-label="${esc(d.name)}"><i class="bi ${Langs.icon(d.lang)}" style="color:${Langs.color(d.lang)}" aria-hidden="true"></i><span class="nm">${esc(d.name)}</span><span class="dot" aria-hidden="true"></span></button></li>`).join('')}</ul>`;
    }).join('');
  },
  /** Updates the modified indicator on the sidebar entry for a document. */
  markDirty(doc) { const b = $(`.sb-file[data-id="${doc.id}"]`, this.el); if (b) b.classList.toggle('dirty', isModified(doc)); },
  /** Applies a new sidebar width in pixels without saving it. */
  setWidth(px) {
    S.sidebarWidth = clamp(Math.round(px) || 240, 160, 520);
    UI.applySidebarWidth();
  },
  /** Wires pointer and keyboard dragging on the sidebar's right edge. */
  initResize() {
    const handle = $('#sbResize'), sidebar = $('#sidebar');
    if (!handle || !sidebar) return;
    /** Ends a drag, saves the final width, and refreshes the editors. */
    const stop = () => {
      if (!this.dragging) return;
      this.dragging = false;
      document.body.classList.remove('sb-resizing');
      saveSettings();
      UI.resize();
    };
    handle.addEventListener('pointerdown', e => {
      if (!document.body.classList.contains('sb-on') || e.button !== 0) return;
      e.preventDefault();
      this.dragging = true;
      document.body.classList.add('sb-resizing');
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers cannot be captured */ }
    });
    handle.addEventListener('pointermove', e => {
      if (this.dragging) this.setWidth(e.clientX - sidebar.getBoundingClientRect().left);
    });
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
    handle.addEventListener('lostpointercapture', stop);
    handle.addEventListener('dblclick', () => { this.setWidth(240); saveSettings(); UI.resize(); });
    handle.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      this.setWidth(S.sidebarWidth + (e.key === 'ArrowRight' ? (e.shiftKey ? 40 : 16) : (e.shiftKey ? -40 : -16)));
      saveSettings();
      UI.resize();
    });
  },
  /** Registers click handlers for file selection and folder toggling. */
  init() {
    document.addEventListener('folders:change', () => this.render());
    this.el.addEventListener('click', e => {
      const fc = e.target.closest('[data-folder-close]'), ft = e.target.closest('[data-folder-toggle]'), ff = e.target.closest('[data-folder-file]');
      if (fc) { e.stopPropagation(); Folders.close(fc.dataset.folderClose); return; }
      if (ft) { Folders.toggle(ft.dataset.folderToggle, ft.dataset.path || ''); return; }
      if (ff) { Folders.openFile(ff.dataset.folderFile, ff.dataset.path); return; }
      const f = e.target.closest('.sb-file'), g = e.target.closest('.sb-folder');
      if (f) { Docs.activate(Docs.byId.get(f.dataset.id)); if (window.innerWidth < 768) UI.setSidebar(false); }
      else if (g) { const n = g.dataset.group; this.collapsed.has(n) ? this.collapsed.delete(n) : this.collapsed.add(n); this.render(); }
    });
    $('#scrim').addEventListener('click', () => UI.setSidebar(false));
    this.initResize();
  }
};
