/* Command registry: palette, keybindings, menus, and the help screen. */
import { Store } from "./util.js";
import { toast } from "./toast.js";

/* =====================================================================
   3. COMMAND REGISTRY  —  single source of truth for palette,
      keybindings, menus and the help screen.
      { id, title, category, shortcut, run, scope, aliases, checked }
   ===================================================================== */
export const Commands = {
  list: [],
  byId: new Map(),
  /** Adds a command definition to the registry and indexes it by id. */
  register(def) {
    if (this.byId.has(def.id)) console.warn('Duplicate command id', def.id);
    this.list.push(def); this.byId.set(def.id, def); return def;
  },
  /** Formats a command's category and title for display. */
  label(c) { return c.category ? `${c.category}: ${c.title}` : c.title; },
  /** Runs a registered command by id and reports any errors as a toast. */
  exec(id, opts = {}) {
    const c = this.byId.get(id);
    if (!c) return;
    if (opts.recent) Recent.push(id);
    try {
      const r = c.run(opts.args);
      if (r && typeof r.catch === 'function') r.catch(err => { console.error(err); toast(String(err && err.message || err), { type: 'error' }); });
    } catch (err) { console.error(err); toast(String(err && err.message || err), { type: 'error' }); }
  }
};
export const Recent = {
  /** Reads the list of recently used command ids from storage. */
  get() { return Store.getJSON('recent', []); },
  /** Records a command as most recently used, keeping at most 25 ids. */
  push(id) { const a = this.get().filter(x => x !== id); a.unshift(id); Store.setJSON('recent', a.slice(0, 25)); }
};
/** Shorthand to register a command. extra: {scope:'editor', aliases:[], checked:fn, preview:fn, revert:fn} */
export const cmd = (id, category, title, shortcut, run, extra) =>
  Commands.register(Object.assign({ id, category, title, shortcut: shortcut || '', run }, extra));
