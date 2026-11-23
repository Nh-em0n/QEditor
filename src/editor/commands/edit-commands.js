/* Selection, undo/redo, line and text transformation commands. */
import { AceRange } from "../config.js";
import { cmd } from "../commands.js";
import { E } from "../app.js";
import { Ops } from "../ops.js";
import { toast } from "../toast.js";

/** Add a cursor on the line above. */
cmd('sel.addCursorAbove', 'Selection', 'Add Cursor Above', 'Ctrl+Alt+Up', () => E().selectMoreLines(-1), { scope: 'editor' });
/** Add a cursor on the line below. */
cmd('sel.addCursorBelow', 'Selection', 'Add Cursor Below', 'Ctrl+Alt+Down', () => E().selectMoreLines(1), { scope: 'editor' });
/** Add the next occurrence of the selection as a cursor. */
cmd('sel.addNext', 'Selection', 'Add Next Match as Cursor', 'Ctrl+D', () => Ops.addNextMatch(E()), { scope: 'editor' });
/** Select every occurrence of the current word or selection. */
cmd('sel.allMatches', 'Selection', 'Select All Matches', 'Ctrl+Shift+L', () => Ops.selectAllMatches(E()), { scope: 'editor' });
/** Select the current line; repeat to extend the selection. */
cmd('sel.line', 'Selection', 'Select Line (repeat to extend)', 'Ctrl+L', () => Ops.selectLine(E()), { scope: 'editor' });
/** Collapse to one cursor and clear the selection (or close Find). */
cmd('sel.single', 'Selection', 'Single Cursor / Clear Selection', 'Esc', () => Ops.collapse(E()), { scope: 'editor' });
/** Select the whole document. */
cmd('sel.all', 'Selection', 'Select All', 'Ctrl+A', () => E().selectAll(), { scope: 'editor' });

/** Undo the last edit. */
cmd('edit.undo', 'Edit', 'Undo', 'Ctrl+Z', () => E().undo(), { scope: 'editor' });
/** Redo the last undone edit. */
cmd('edit.redo', 'Edit', 'Redo', 'Ctrl+Y', () => E().redo(), { scope: 'editor', aliases: ['Ctrl+Shift+Z'] });

/** Duplicate the selected line(s) above. */
cmd('line.copyUp', 'Line', 'Copy Line Up', 'Shift+Alt+Up', () => E().execCommand('copylinesup'), { scope: 'editor' });
/** Duplicate the selected line(s) below. */
cmd('line.copyDown', 'Line', 'Copy Line Down', 'Shift+Alt+Down', () => E().execCommand('copylinesdown'), { scope: 'editor' });
/** Move the selected line(s) up. */
cmd('line.moveUp', 'Line', 'Move Line Up', 'Alt+Up', () => E().execCommand('movelinesup'), { scope: 'editor' });
/** Move the selected line(s) down. */
cmd('line.moveDown', 'Line', 'Move Line Down', 'Alt+Down', () => E().execCommand('movelinesdown'), { scope: 'editor' });
/** Delete the selected line(s). */
cmd('line.delete', 'Line', 'Delete Line', 'Ctrl+Shift+K', () => E().execCommand('removeline'), { scope: 'editor' });
/** Insert a blank line below each cursor. */
cmd('line.insertBelow', 'Line', 'Insert Line Below', 'Ctrl+Enter', () => Ops.insertLine(E(), true), { scope: 'editor' });
/** Insert a blank line above each cursor. */
cmd('line.insertAbove', 'Line', 'Insert Line Above', 'Ctrl+Shift+Enter', () => Ops.insertLine(E(), false), { scope: 'editor' });
/** Join the selected lines into one. */
cmd('line.join', 'Line', 'Join Lines', 'Ctrl+J', () => Ops.joinLines(E()), { scope: 'editor' });

/** Toggle a line comment. */
cmd('edit.toggleComment', 'Edit', 'Toggle Line Comment', 'Ctrl+/', () => Ops.toggleComment(E(), false), { scope: 'editor' });
/** Toggle a block comment. */
cmd('edit.toggleBlockComment', 'Edit', 'Toggle Block Comment', 'Ctrl+Shift+/', () => Ops.toggleComment(E(), true), { scope: 'editor' });
/** Indent the selected lines. */
cmd('edit.indent', 'Edit', 'Indent', 'Ctrl+]', () => E().execCommand('blockindent'), { scope: 'editor' });
/** Outdent the selected lines. */
cmd('edit.outdent', 'Edit', 'Outdent', 'Ctrl+[', () => E().execCommand('blockoutdent'), { scope: 'editor' });
/** Fold the current code block. */
cmd('edit.fold', 'Edit', 'Fold', 'Ctrl+Shift+[', () => E().execCommand('fold'), { scope: 'editor' });
/** Unfold the current code block. */
cmd('edit.unfold', 'Edit', 'Unfold', 'Ctrl+Shift+]', () => E().execCommand('unfold'), { scope: 'editor' });
/** Fold every foldable block in the document. */
cmd('edit.foldAll', 'Edit', 'Fold All', 'Ctrl+K Ctrl+0', () => E().session.foldAll(), { scope: 'editor' });
/** Unfold every block in the document. */
cmd('edit.unfoldAll', 'Edit', 'Unfold All', 'Ctrl+K Ctrl+J', () => E().session.unfold(), { scope: 'editor' });

/** Sort selected lines in ascending order. */
cmd('text.sortAsc', 'Edit', 'Sort Lines', '', () => Ops.transformLines(E(), l => l.slice().sort(Ops.cmpAsc)), { scope: 'editor' });
/** Sort selected lines in descending order. */
cmd('text.sortDesc', 'Edit', 'Sort Lines (Descending)', '', () => Ops.transformLines(E(), l => l.slice().sort((a, b) => Ops.cmpAsc(b, a))), { scope: 'editor' });
/** Reverse the order of selected lines. */
cmd('text.reverse', 'Edit', 'Reverse Lines', '', () => Ops.transformLines(E(), l => l.slice().reverse()), { scope: 'editor' });
/** Remove duplicate selected lines. */
cmd('text.unique', 'Edit', 'Remove Duplicate Lines', '', () => Ops.transformLines(E(), l => [...new Set(l)]), { scope: 'editor' });
/** Remove trailing whitespace from every line. */
cmd('text.trim', 'Edit', 'Trim Trailing Whitespace', '', () => {
  const s = E().session; let n = 0;
  for (let r = 0; r < s.getLength(); r++) { const ln = s.getLine(r), t = ln.replace(/[ \t]+$/, ''); if (t !== ln) { s.remove(new AceRange(r, t.length, r, ln.length)); n++; } }
  toast(n ? `Trimmed ${n} line${n > 1 ? 's' : ''}` : 'No trailing whitespace', { type: n ? 'info' : 'warn', ms: 1200 });
}, { scope: 'editor' });
/** Convert selections to upper case. */
cmd('text.upper', 'Edit', 'Convert to Uppercase', '', () => Ops.transformText(E(), t => t.toUpperCase()), { scope: 'editor' });
/** Convert selections to lower case. */
cmd('text.lower', 'Edit', 'Convert to Lowercase', '', () => Ops.transformText(E(), t => t.toLowerCase()), { scope: 'editor' });
/** Convert selections to title case. */
cmd('text.title', 'Edit', 'Convert to Title Case', '', () => Ops.transformText(E(), Ops.title), { scope: 'editor' });
