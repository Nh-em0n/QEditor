/* Find and replace panel. */
import { $, $$, debounce } from "./util.js";
import { AceSearch } from "./config.js";
import { toast } from "./toast.js";
import { App, E } from "./app.js";

/* =====================================================================
   10. FIND / REPLACE
   ===================================================================== */
export const Find = {
  isOpen: false, q: '', opts: { regExp: false, caseSensitive: false, wholeWord: false },
  ranges: [], hl: { session: null, ids: [] },
  el: $('#findPanel'), input: $('#findInput'), rep: $('#replaceInput'), count: $('#findCount'),
  /** Builds the search option object from the current query and toggles. */
  searchOpts() { return { needle: this.q, caseSensitive: this.opts.caseSensitive, wholeWord: this.opts.wholeWord, regExp: this.opts.regExp, wrap: true }; },
  /** Checks whether the current query is a valid regular expression when needed. */
  valid() { if (!this.opts.regExp || !this.q) return true; try { new RegExp(this.q); return true; } catch (e) { return false; } },
  /** Opens the find panel and initializes the query from the current selection. */
  open(withReplace) {
    const ed = E();
    this.isOpen = true; this.el.hidden = false;
    this.setReplace(withReplace === undefined ? !$('#replaceRow').hidden : withReplace);
    const sel = ed.getSelectedText();
    if (sel && !sel.includes('\n') && sel.length < 200) this.q = sel;
    this.input.value = this.q;
    this.input.focus(); this.input.select();
    this.update(false);
  },
  /** Hides the find panel, clears highlights, and restores editor focus. */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false; this.el.hidden = true; this.clearHL(); App.focus();
  },
  /** Shows or hides the replace row and updates its toggle state. */
  setReplace(on) {
    $('#replaceRow').hidden = !on;
    $('#replaceToggle').setAttribute('aria-expanded', String(on));
  },
  /** Removes all find result highlight markers from the editor session. */
  clearHL() {
    const { session, ids } = this.hl;
    if (session) ids.forEach(id => session.removeMarker(id));
    this.hl = { session: null, ids: [] };
  },
  /** Recompute matches, highlight them all, and refresh the counter. */
  update(jumpFirst) {
    this.clearHL();
    this.input.classList.toggle('invalid', !this.valid());
    const ed = E();
    this.ranges = [];
    if (this.q && this.valid()) {
      const sr = new AceSearch(); sr.set(this.searchOpts());
      this.ranges = sr.findAll(ed.session).filter(r => !r.isEmpty());
      const ids = this.ranges.slice(0, 3000).map(r => ed.session.addMarker(r, 'find-hl', 'text'));
      this.hl = { session: ed.session, ids };
      if (jumpFirst && this.ranges.length) ed.find(this.q, Object.assign(this.searchOpts(), { skipCurrent: false, backwards: false }));
    }
    this.updateCount();
  },
  /** Refreshes the match counter with the current result and selection. */
  updateCount() {
    const n = this.ranges.length, c = this.count;
    c.classList.toggle('none', !!this.q && n === 0);
    if (!this.q) { c.textContent = 'No results'; c.classList.remove('none'); return; }
    if (!this.valid()) { c.textContent = 'Invalid regex'; c.classList.add('none'); return; }
    if (!n) { c.textContent = 'No results'; return; }
    const sel = E().getSelectionRange();
    const i = this.ranges.findIndex(r => r.isEqual(sel));
    c.textContent = i >= 0 ? `${i + 1} of ${n}` : `${n} match${n > 1 ? 'es' : ''}`;
  },
  /** Moves to the next or previous match in the given direction. */
  jump(dir) {
    if (!this.q) return this.open();
    if (!this.valid()) return;
    const ed = E();
    const r = ed.find(this.q, Object.assign(this.searchOpts(), { backwards: dir < 0, skipCurrent: true }));
    if (!r) toast('No matches for "' + this.q + '"', { type: 'warn', ms: 1200 });
    this.updateCount();
  },
  /** Replaces the currently selected match and moves to the next one. */
  replaceOne() {
    if (!this.q || !this.valid()) return;
    const ed = E();
    ed.$search.set(Object.assign(this.searchOpts(), { skipCurrent: false, backwards: false }));
    ed.replace(this.rep.value);
    this.update(false); this.jump(1);
  },
  /** Replaces every match and reports the number of replacements. */
  replaceAllMatches() {
    if (!this.q || !this.valid()) return;
    const n = E().replaceAll(this.rep.value, this.searchOpts());
    toast(`Replaced ${n} occurrence${n === 1 ? '' : 's'}`, { icon: 'bi-arrow-repeat' });
    this.update(false);
  },
  /** Toggles a search option and refreshes the highlights. */
  toggleOpt(name) {
    this.opts[name] = !this.opts[name];
    $$('.tg').forEach(b => b.setAttribute('aria-pressed', String(!!this.opts[b.dataset.opt])));
    if (this.isOpen) this.update(true);
  },
  /** Uses the selected text or current word as the search query. */
  useSelection() {
    const sel = E().getSelectedText() || E().session.getTextRange(E().session.getWordRange(E().getCursorPosition().row, E().getCursorPosition().column));
    if (sel) { this.q = sel; this.input.value = sel; if (this.isOpen) this.update(false); toast('Find: ' + sel.slice(0, 30), { icon: 'bi-search', ms: 1000 }); }
  },
  /** Refreshes the search highlights when the active pane changes. */
  onPaneChange() { if (this.isOpen) this.update(false); },
  onSelection: debounce(() => { if (Find.isOpen) Find.updateCount(); }, 60),
  onChange: debounce(() => { if (Find.isOpen) Find.update(false); }, 160),
  /** Wires the find panel inputs and buttons to search and replace actions. */
  init() {
    this.input.addEventListener('input', () => { this.q = this.input.value; this.update(true); });
    this.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); this.jump(e.shiftKey ? -1 : 1); }
      else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    });
    this.rep.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); e.ctrlKey && e.altKey ? this.replaceAllMatches() : this.replaceOne(); }
      else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    });
    $$('.tg').forEach(b => b.addEventListener('click', () => this.toggleOpt(b.dataset.opt)));
    $('#findNext').addEventListener('click', () => this.jump(1));
    $('#findPrev').addEventListener('click', () => this.jump(-1));
    $('#findClose').addEventListener('click', () => this.close());
    $('#replaceOne').addEventListener('click', () => this.replaceOne());
    $('#replaceAll').addEventListener('click', () => this.replaceAllMatches());
    $('#replaceToggle').addEventListener('click', () => { this.setReplace($('#replaceRow').hidden); });
  }
};
