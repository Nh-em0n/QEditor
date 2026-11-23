/* Status bar. */
import { $, rafOnce } from "./util.js";
import { CONFIG } from "./config.js";
import { S } from "./state.js";
import { App } from "./app.js";
import { Langs } from "./langs.js";
import { Pick } from "./picker.js";
import { Commands } from "./commands.js";
import { UI } from "./ui.js";

export const Status = {
  schedule: rafOnce(() => Status.update()),
  /** Refreshes the status bar with cursor, selection, indentation, language, font, and line details. */
  update() {
    const ed = App.panes[App.active] && App.editor(), doc = App.doc();
    if (!ed || !doc) return;
    const s = ed.session, c = ed.getCursorPosition(), tab = s.getTabSize();
    // visual column (tabs expand to the next tab stop), like Sublime
    const line = s.getLine(c.row); let v = 0;
    for (let i = 0; i < c.column; i++) v += line[i] === '\t' ? tab - (v % tab) : 1;
    $('#sbPos').textContent = `Line ${c.row + 1}, Column ${v + 1}`;
    const ranges = ed.selection.getAllRanges(), n = ranges.length;
    let chars = 0; ranges.forEach(r => { if (!r.isEmpty()) chars += s.getTextRange(r).length; });
    $('#sbSel').textContent = `${n} cursor${n > 1 ? 's' : ''}` + (chars ? `, ${chars} character${chars > 1 ? 's' : ''} selected` : '');
    $('#sbIndent').textContent = (S.softTabs ? 'Spaces: ' : 'Tab Size: ') + S.tabSize;
    $('#sbEol').textContent = s.getDocument().getNewLineCharacter() === '\r\n' ? 'CRLF' : 'LF';
    $('#sbLang').textContent = Langs.name(doc.lang);
    $('#sbFontTxt').textContent = `${S.fontFamily} ${S.fontSize}px`;
    const len = s.getLength(); $('#sbLines').textContent = `${len} line${len > 1 ? 's' : ''}`;
    UI.updateTitle();
  },
  /** Wires status bar items to commands and command pickers. */
  init() {
    /** Attaches a click handler that opens a command picker for a status bar item. */
    const pick = (id, title, ids, opts) => $(id).addEventListener('click', e => Pick.open(e.currentTarget, { title, items: Pick.fromCommands(ids, opts && opts()), filter: !!(opts && opts().filter) }));
    $('#sbPos').addEventListener('click', () => Commands.exec('goto.line'));
    pick('#sbIndent', 'Indentation', ['indent.spaces', 'indent.tabs', 'indent.size2', 'indent.size4', 'indent.size8']);
    pick('#sbEol', 'Line endings', ['eol.lf', 'eol.crlf']);
    pick('#sbLang', 'Syntax / language', CONFIG.LANGS.map(l => 'lang.' + l.id), () => ({
      filter: true, icon: c => { const id = c.id.slice(5); return `<i class="bi ${Langs.icon(id)}" style="color:${Langs.color(id)}"></i>`; }
    }));
    $('#sbFont').addEventListener('click', () => Commands.exec('prefs.open'));
  }
};
