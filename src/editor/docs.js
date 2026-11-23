/* Documents, shared Ace sessions, and tab lifecycle. */
import { MAX_PANES, AceUndoManager } from "./config.js";
import { Langs } from "./langs.js";
import { S } from "./state.js";
import { App } from "./app.js";
import { Tabs } from "./tabs.js";
import { Sidebar } from "./sidebar.js";
import { Status } from "./status.js";
import { UI } from "./ui.js";
import { Find } from "./find.js";
import { Panes } from "./panes.js";
import { Persist } from "./persist.js";
import { Dialog } from "./dialog.js";
import { Files } from "./files.js";

/** Session (Ace EditSession) preferences shared by all documents. */
export const Sessions = {
  /** Applies the configured wrap mode to an editor session. */
  applyWrap(s) {
    const m = S.wrap;
    if (m === 'off') { s.setUseWrapMode(false); return; }
    s.setUseWrapMode(true);
    if (m === 'window') s.setWrapLimitRange(null, null); else { const n = +m; s.setWrapLimitRange(n, n); }
  },
  /** Configures language mode, indentation, and wrapping on a session. */
  prep(s, lang) {
    s.setUseWorker(false);                       // workers can't load cross-origin from the CDN
    s.setTabSize(S.tabSize); s.setUseSoftTabs(S.softTabs);
    this.applyWrap(s);
    s.setMode(Langs.mode(lang));
  },
  /** Invokes a callback for every session across all documents. */
  each(fn) { Docs.list.forEach(d => d.sessions.forEach(s => s && fn(s, d))); }
};
/** Reports whether a document has unsaved changes. */
export const isModified = d => d.forceDirty || !d.sessions[0].getUndoManager().isClean();
export const Docs = {
  list: [], byId: new Map(), mru: [], seq: 0, untitled: 0,
  /** Creates and registers a document with an initial editing session. */
  create(o) {
    const id = 'd' + (++this.seq);
    const lang = o.lang || Langs.detect(o.name);
    const doc = { id, name: o.name, lang, handle: o.handle || null, fromDisk: !!o.fromDisk, forceDirty: !!o.dirty, sessions: Array(MAX_PANES).fill(null), _m: false };
    const s = new ace.EditSession(o.text || '');
    s.setUndoManager(new AceUndoManager());      // a bare EditSession only has a stub manager (no isClean / real history)
    Sessions.prep(s, lang);
    doc.sessions[0] = s;
    doc._m = isModified(doc);
    s.on('change', () => Docs.onChange(doc));
    this.list.push(doc); this.byId.set(id, doc);
    return doc;
  },
  /** Secondary-pane sessions share the Document and undo stack with the primary one (independent cursor / scroll). */
  sessionFor(pane, doc) {
    if (pane.idx === 0) return doc.sessions[0];
    if (!doc.sessions[pane.idx]) {
      const s = new ace.EditSession(doc.sessions[0].getDocument());
      Sessions.prep(s, doc.lang);
      s.setUndoManager(doc.sessions[0].getUndoManager());
      doc.sessions[pane.idx] = s;
    }
    return doc.sessions[pane.idx];
  },
  /** Displays a document in the given pane's editor. */
  showIn(pane, doc) {
    pane.docId = doc.id;
    pane.editor.setSession(this.sessionFor(pane, doc));
    Panes.renderHeads();
  },
  /** Refreshes dirty indicators when a document's modified state changes. */
  recheck(doc) {
    if (!this.byId.has(doc.id)) return;
    const m = isModified(doc);
    if (m !== doc._m) { doc._m = m; Tabs.markDirty(doc); Sidebar.markDirty(doc); UI.updateTitle(); }
  },
  /** Responds to content changes by rechecking state and scheduling persistence. */
  onChange(doc) {
    this.recheck(doc);
    setTimeout(() => this.recheck(doc), 0);       // undo/redo update the manager's revision after the change event
    Persist.schedule(); Status.schedule();
  },
  /** Marks a document and its undo stack as saved. */
  markClean(doc) {
    doc.forceDirty = false;
    doc.sessions[0].getUndoManager().markClean();
    doc._m = false; Tabs.markDirty(doc); Sidebar.markDirty(doc); UI.updateTitle(); Persist.schedule();
  },
  /** Displays a document in a pane and makes that pane active. */
  activate(doc, idx = App.active) {
    if (!doc) return;
    const pane = App.panes[idx];
    this.showIn(pane, doc);
    this.mru = [doc.id, ...this.mru.filter(x => x !== doc.id)];
    if (idx !== App.active) App.setActive(idx); else { Tabs.render(); Sidebar.render(); Status.schedule(); UI.updateTitle(); Find.onPaneChange(); }
    Persist.schedule();
    pane.editor.focus();
  },
  /** Lists documents ordered from most recently to least recently used. */
  mruDocs() { return this.mru.map(id => this.byId.get(id)).filter(Boolean).concat(this.list.filter(d => !this.mru.includes(d.id))); },
  /** Creates and activates a new untitled document. */
  newFile(opts = {}) {
    const doc = this.create({ name: opts.name || `Untitled-${++this.untitled}`, text: opts.text || '', lang: opts.lang || 'text' });
    this.activate(doc); return doc;
  },
  /** Changes the language mode of a document across all its sessions. */
  setLang(doc, lang) {
    doc.lang = lang;
    doc.sessions.forEach(s => s && s.setMode(Langs.mode(lang)));
    Tabs.render(); Sidebar.render(); Status.schedule(); Persist.schedule(); Panes.renderHeads();
  },
  /** Renames a document and refreshes its language, tabs, and title. */
  rename(doc, name) {
    doc.name = name;
    if (Langs.hasKnownExt(name)) this.setLang(doc, Langs.detect(name)); else { Tabs.render(); Sidebar.render(); }
    UI.updateTitle(); Persist.schedule(); Panes.renderHeads();
  },
  /** Closes a document after resolving any unsaved changes. */
  async close(doc, { force = false } = {}) {
    if (!doc) return false;
    if (!force && isModified(doc)) {
      const r = await Dialog.show({
        title: 'Unsaved changes', message: `Do you want to save the changes you made to "${doc.name}"? Your changes will be lost if you don't save them.`,
        buttons: [{ label: 'Cancel', value: null }, { label: "Don't Save", value: 'discard', danger: true }, { label: 'Save', value: 'save', primary: true }]
      });
      if (!r || !r.value) return false;
      if (r.value === 'save' && !(await Files.save(doc))) return false;
    }
    const idx = this.list.indexOf(doc);
    this.list.splice(idx, 1); this.byId.delete(doc.id);
    this.mru = this.mru.filter(x => x !== doc.id);
    if (!this.list.length) this.create({ name: `Untitled-${++this.untitled}`, text: '', lang: 'text' });
    App.panes.forEach(p => {
      if (p.docId === doc.id) {
        const next = this.mruDocs()[0] || this.list[Math.min(idx, this.list.length - 1)];
        this.showIn(p, next);
      }
    });
    setTimeout(() => doc.sessions.forEach(s => s && s.destroy()), 0);
    Tabs.render(); Sidebar.render(); Status.schedule(); UI.updateTitle(); Find.onPaneChange(); Persist.schedule(); Panes.renderHeads();
    return true;
  },
  /** Closes several documents in order, stopping if one is cancelled. */
  async closeMany(docs) { for (const d of docs) { if (!(await this.close(d))) return false; } return true; },
  /** Moves a document to a new position in the tab order. */
  move(id, targetId, after) {
    const from = this.list.findIndex(d => d.id === id);
    if (from < 0 || id === targetId) return;
    const [d] = this.list.splice(from, 1);
    let to = this.list.findIndex(x => x.id === targetId);
    if (after) to++;
    this.list.splice(to, 0, d);
    Tabs.render(); Persist.schedule();
  },
  /** Activates the next or previous document in the tab order. */
  cycle(dir) {
    const i = this.list.indexOf(App.doc());
    this.activate(this.list[(i + dir + this.list.length) % this.list.length]);
  }
};
