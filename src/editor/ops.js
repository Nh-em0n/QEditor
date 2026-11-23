/* Multi-cursor editing operations. */
import { AceRange } from "./config.js";
import { toast } from "./toast.js";
import { Find } from "./find.js";

/* =====================================================================
   9. EDITING OPERATIONS (multi-cursor aware)
   ===================================================================== */
export const Ops = {
  /** Ctrl+L: select whole line(s); repeating extends one line at a time; works per cursor. */
  selectLine(ed) {
    const s = ed.session, last = s.getLength() - 1, lastLen = s.getLine(last).length;
    const spans = ed.selection.getAllRanges().map(r => {
      let a = r.start.row, b = r.end.row;
      if (r.end.column === 0 && b > a) b--;                       // end at col 0 doesn't include that row
      const full = !r.isEmpty() && r.start.column === 0 &&
        ((r.end.column === 0 && r.end.row > r.start.row) || (r.end.row === last && r.end.column === lastLen));
      if (full) b = Math.min(b + 1, last);                        // already whole lines: extend by one
      return [a, b];
    }).sort((x, y) => x[0] - y[0]);
    // merge touching/overlapping spans so multiple cursors don't produce duplicate selections
    const merged = [];
    spans.forEach(sp => {
      const m = merged[merged.length - 1];
      if (m && sp[0] <= m[1] + 1) m[1] = Math.max(m[1], sp[1]); else merged.push(sp.slice());
    });
    const ranges = merged.map(([a, b]) => b < last ? new AceRange(a, 0, b + 1, 0) : new AceRange(a, 0, last, lastLen));
    ed.selection.toSingleRange(ranges[0]);
    for (let i = 1; i < ranges.length; i++) ed.selection.addRange(ranges[i]);
    ed.renderer.scrollCursorIntoView();
  },
  /** Adds the next matching occurrence as an additional cursor. */
  addNextMatch(ed) { ed.selectMore(1, false, true); ed.renderer.scrollCursorIntoView(); },
  /** Selects every occurrence of the current word or selection. */
  selectAllMatches(ed) {
    const r = ed.selection.getRange(), wasEmpty = r.isEmpty();
    const wr = wasEmpty ? ed.session.getWordRange(r.start.row, r.start.column) : r;
    const needle = ed.session.getTextRange(wr);
    if (!needle) return toast('Nothing to select', { type: 'warn' });
    const n = ed.findAll(needle, { caseSensitive: true, wholeWord: wasEmpty, regExp: false });
    toast(`${n} match${n === 1 ? '' : 'es'} selected`, { icon: 'bi-cursor-text', ms: 1200 });
  },
  /** Exits multi-cursor mode, closes find, or clears the selection. */
  collapse(ed) {
    if (ed.inMultiSelectMode) ed.exitMultiSelectMode();
    else if (Find.isOpen) Find.close();
    else if (!ed.selection.isEmpty()) ed.selection.clearSelection();
  },
  /** Inserts a new line above or below each cursor with matching indentation. */
  insertLine(ed, below) {
    ed.forEachSelection(() => {
      const s = ed.session, row = ed.selection.getCursor().row, line = s.getLine(row);
      if (below) { ed.selection.moveCursorTo(row, line.length); ed.insert('\n'); }
      else {
        const ind = /^\s*/.exec(line)[0];
        s.insert({ row, column: 0 }, ind + '\n');
        ed.selection.moveCursorTo(row, ind.length);
      }
    });
    ed.renderer.scrollCursorIntoView();
  },
  /** Joins the selected lines, or the current line with the next, for each cursor. */
  joinLines(ed) {
    ed.forEachSelection(() => {
      const s = ed.session, r = ed.getSelectionRange();
      const a = r.start.row; let b = r.end.row;
      if (r.end.column === 0 && b > a) b--;
      if (b === a) b = a + 1;
      if (b >= s.getLength()) return;
      let text = s.getLine(a).replace(/\s+$/, ''); const col = text.length;
      for (let i = a + 1; i <= b; i++) { const t = s.getLine(i).trim(); if (t) text += (text && !/[(\[{]$/.test(text) ? ' ' : '') + t; }
      s.replace(new AceRange(a, 0, b, s.getLine(b).length), text);
      ed.selection.moveCursorTo(a, col);
    });
  },
  /** Apply fn(lines)->lines to the selected rows (or the whole doc when nothing is selected). */
  transformLines(ed, fn) {
    const s = ed.session, ranges = ed.selection.getAllRanges();
    let spans;
    if (ranges.every(r => r.isEmpty())) spans = [[0, s.getLength() - 1]];
    else {
      const raw = ranges.filter(r => !r.isEmpty()).map(r => [r.start.row, r.end.column === 0 && r.end.row > r.start.row ? r.end.row - 1 : r.end.row]).sort((x, y) => x[0] - y[0]);
      spans = [];
      raw.forEach(sp => { const m = spans[spans.length - 1]; if (m && sp[0] <= m[1]) m[1] = Math.max(m[1], sp[1]); else spans.push(sp.slice()); });
    }
    const results = spans.map(([a, b]) => fn(s.getLines(a, b)));
    let changed = false;
    for (let i = spans.length - 1; i >= 0; i--) {                 // bottom-up keeps earlier row numbers valid
      const [a, b] = spans[i], old = s.getLines(a, b);
      if (old.join('\n') === results[i].join('\n')) continue;
      changed = true;
      s.replace(new AceRange(a, 0, b, s.getLine(b).length), results[i].join('\n'));
    }
    if (!changed) return toast('Nothing to change', { type: 'warn', ms: 1200 });
    if (!ranges.every(r => r.isEmpty())) {
      let shift = 0; const out = [];
      spans.forEach(([a, b], i) => {
        const na = a + shift, nb = na + results[i].length - 1;
        out.push(new AceRange(na, 0, nb, s.getLine(nb).length)); shift += results[i].length - (b - a + 1);
      });
      ed.selection.toSingleRange(out[0]); for (let i = 1; i < out.length; i++) ed.selection.addRange(out[i]);
    }
  },
  /** Case transforms operate on each selection (or the word under an empty cursor). */
  transformText(ed, fn) {
    ed.forEachSelection(() => {
      const s = ed.session; let r = ed.getSelectionRange(); const wasEmpty = r.isEmpty(), orig = ed.selection.getCursor();
      if (wasEmpty) { r = s.getWordRange(r.start.row, r.start.column); if (r.isEmpty()) return; }
      const t = s.getTextRange(r), n = fn(t);
      if (n === t) return;
      s.replace(r, n);
      if (wasEmpty) ed.selection.moveCursorToPosition(orig);
      else ed.selection.setSelectionRange(new AceRange(r.start.row, r.start.column, r.end.row, r.end.column));
    });
  },
  /** Toggles line or block comments using the current language syntax. */
  toggleComment(ed, block) {
    const m = ed.session.getMode();
    if (block ? !m.blockComment : !(m.lineCommentStart || m.blockComment)) return toast('No ' + (block ? 'block ' : '') + 'comment syntax for this language', { type: 'warn' });
    ed.execCommand(block ? 'toggleBlockComment' : 'togglecomment');
  },
  /** Converts a string to title case. */
  title: s => s.toLowerCase().replace(/(^|[^\p{L}\p{N}'’])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()),
  /** Compares two strings for natural ascending order. */
  cmpAsc: (a, b) => a.localeCompare(b, undefined, { numeric: true }),
};
