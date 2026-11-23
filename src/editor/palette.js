/* Command palette: commands, files, lines, and symbols. */
import { $, $$, clamp } from "./util.js";
import { Commands, Recent } from "./commands.js";
import { Keys } from "./keys.js";
import { Docs, isModified } from "./docs.js";
import { Langs, extractSymbols, SYM_BADGE } from "./langs.js";
import { App, E } from "./app.js";
import { Pick } from "./picker.js";
import { fuzzy, hlHtml } from "./fuzzy.js";

/* =====================================================================
    12. COMMAND PALETTE (modes: ">" commands, ":" line, "@" symbol, default goto-anything)
    ===================================================================== */
/** Palette controller: owns the modal and its keyboard / mouse interactions. */
export const Palette = (() => {
  const el = $('#palette'), modal = new bootstrap.Modal(el, { backdrop: true, keyboard: false });
  const input = $('#palInput'), listEl = $('#palList'), foot = $('#palFoot'), iconEl = $('#palIcon');
  let items = [], active = 0, committed = false, isOpen = false, revertFn = null, scrollTop = 0;
  const HINTS = {
    cmd: ['<kbd>↑</kbd><kbd>↓</kbd> navigate', '<kbd>Enter</kbd> run', '<kbd>Esc</kbd> close', '<kbd>:</kbd> line · <kbd>@</kbd> symbol · clear for files'],
    line: ['Type a line number, e.g. <kbd>:120</kbd> or <kbd>:120:8</kbd>', '<kbd>Enter</kbd> go'],
    sym: ['<kbd>↑</kbd><kbd>↓</kbd> preview', '<kbd>Enter</kbd> jump'],
    file: ['<kbd>↑</kbd><kbd>↓</kbd> navigate', '<kbd>Enter</kbd> switch tab', '<kbd>&gt;</kbd> commands · <kbd>:</kbd> line · <kbd>@</kbd> symbol']
  };

  /** Build palette rows for registered commands, ranked by recency and fuzzy score. */
  function cmdItems(q) {
    const recents = Recent.get();
    let arr = Commands.list.map(c => ({ c, label: Commands.label(c) }));
    if (!q.trim()) {
      const rank = id => { const i = recents.indexOf(id); return i < 0 ? 1e6 : i; };
      arr.sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.label.localeCompare(b.label));
    } else {
      arr = arr.map(a => { const m = fuzzy(q, a.label); if (!m) return null; const r = recents.indexOf(a.c.id); return { ...a, idx: m.idx, score: m.score + (r >= 0 ? 6 - r * 0.2 : 0) }; })
        .filter(Boolean).sort((a, b) => b.score - a.score);
    }
    return arr.slice(0, 120).map(a => {
      const sc = Keys.effective(a.c.id), on = a.c.checked && a.c.checked();
      const ci = a.c.category ? a.c.category.length + 2 : 0;
      return {
        key: a.c.id, icon: '', cmdId: a.c.id,
        html: (a.c.category ? `<span class="cat">${hlHtml(a.label.slice(0, ci), (a.idx || []).filter(i => i < ci))}</span>` : '') + hlHtml(a.label.slice(ci), (a.idx || []).filter(i => i >= ci).map(i => i - ci)),
        right: (on ? '<i class="bi bi-check-lg chk" aria-label="active"></i>' : '') + (!q.trim() && recents.includes(a.c.id) ? '<span class="badge-r">recent</span>' : '') + Keys.html(sc),
        preview: a.c.preview, revert: a.c.revert,
        run: () => Commands.exec(a.c.id, { recent: true })
      };
    });
  }

  /** Build palette rows for open documents (goto anything). */
  function fileItems(q) {
    const arr = Docs.mruDocs().map(d => { const m = fuzzy(q, d.name); return m ? { d, m } : null; }).filter(Boolean);
    if (q.trim()) arr.sort((a, b) => b.m.score - a.m.score);
    return arr.map(({ d, m }) => ({
      key: d.id, icon: `<i class="bi ${Langs.icon(d.lang)}" style="color:${Langs.color(d.lang)}"></i>`,
      html: hlHtml(d.name, q.trim() ? m.idx : []),
      right: `${isModified(d) ? '<span style="color:var(--accent)">● unsaved</span>' : ''}<span>${Langs.name(d.lang)}</span>${d === App.doc() ? '<span class="badge-r">current</span>' : ''}`,
      run: () => Docs.activate(d, App.active)
    }));
  }

  /** Build palette rows for symbols extracted from the active document. */
  function symItems(q) {
    const ed = E(), doc = App.doc();
    const syms = extractSymbols(ed.session.getLines(0, ed.session.getLength() - 1), doc.lang);
    const arr = syms.map(s => { const m = fuzzy(q, s.name); return m ? { s, m } : null; }).filter(Boolean);
    if (q.trim()) arr.sort((a, b) => b.m.score - a.m.score);
    const go = row => () => { ed.exitMultiSelectMode(); ed.gotoLine(row + 1, 0, false); ed.scrollToLine(row, true, false); ed.focus(); };
    return arr.slice(0, 200).map(({ s, m }) => ({
      key: 's' + s.row, icon: `<span class="sym-badge">${SYM_BADGE[s.kind] || '·'}</span>`,
      html: `<span style="padding-left:${s.level * 12}px">${hlHtml(s.name, q.trim() ? m.idx : [])}</span>`,
      right: `<span>${s.kind}</span><span>:${s.row + 1}</span>`,
      preview: () => ed.scrollToLine(s.row, true, false),
      revert: () => ed.session.setScrollTop(scrollTop),
      run: go(s.row)
    }));
  }

  /** Build the single "go to line" row (or a hint row when no line number is typed). */
  function lineItems(q) {
    const ed = E(), total = ed.session.getLength();
    const m = /^\s*(\d+)?(?::(\d+))?\s*$/.exec(q);
    if (!m || !m[1]) return [{ disabled: true, icon: '<i class="bi bi-hash"></i>', html: `Current line: ${ed.getCursorPosition().row + 1} of ${total}. Type a line number to jump.`, right: '', key: 'x' }];
    const n = clamp(+m[1], 1, total), col = m[2] ? +m[2] : 1;
    return [{
      key: 'line', icon: '<i class="bi bi-arrow-return-right"></i>', html: `Go to line ${n}${m[2] ? `, column ${col}` : ''}`, right: `of ${total}`,
      preview: () => ed.scrollToLine(n - 1, true, false), revert: () => ed.session.setScrollTop(scrollTop),
      run: () => { ed.exitMultiSelectMode(); ed.gotoLine(n, col - 1, false); ed.scrollToLine(n - 1, true, false); ed.focus(); }
    }];
  }

  /** Recompute items, icon and footer hints from the current input prefix. */
  function build() {
    const v = input.value, c = v[0];
    let mode, ic;
    if (c === '>') { mode = 'cmd'; items = cmdItems(v.slice(1)); ic = 'bi-terminal'; }
    else if (c === ':') { mode = 'line'; items = lineItems(v.slice(1)); ic = 'bi-hash'; }
    else if (c === '@') { mode = 'sym'; items = symItems(v.slice(1)); ic = 'bi-braces'; }
    else { mode = 'file'; items = fileItems(v); ic = 'bi-files'; }
    iconEl.className = 'bi ' + ic;
    input.placeholder = 'Go to file, > command, : line, @ symbol';
    foot.innerHTML = HINTS[mode].map(h => `<span>${h}</span>`).join('');
    active = items.findIndex(i => !i.disabled); if (active < 0) active = 0;
    render();
  }

  /** Render the current result list and apply the active item's preview. */
  function render() {
    if (!items.length) { listEl.innerHTML = '<li class="pal-empty" role="presentation">No matching results</li>'; input.removeAttribute('aria-activedescendant'); applyPreview(); return; }
    listEl.innerHTML = items.map((it, i) =>
      `<li class="pal-item${i === active ? ' active' : ''}${it.disabled ? ' disabled' : ''}" role="option" id="pal-o${i}" aria-selected="${i === active}" data-i="${i}">${it.icon ? `<span class="pi">${it.icon}</span>` : ''}<span class="pl">${it.html}</span><span class="pr">${it.right || ''}</span></li>`).join('');
    input.setAttribute('aria-activedescendant', 'pal-o' + active);
    scrollActive(); applyPreview();
  }

  /** Keep the active row inside the scroll viewport. */
  function scrollActive() { const a = $('.pal-item.active', listEl); if (a) a.scrollIntoView({ block: 'nearest' }); }

  /** Move the highlight to `i` (wrapping) and refresh the preview. */
  function setActive(i) {
    if (!items.length) return;
    active = (i + items.length) % items.length;
    $$('.pal-item', listEl).forEach((li, k) => { li.classList.toggle('active', k === active); li.setAttribute('aria-selected', String(k === active)); });
    input.setAttribute('aria-activedescendant', 'pal-o' + active);
    scrollActive(); applyPreview();
  }

  /** Live preview (themes, line, symbol): apply on selection, revert when the palette is cancelled. */
  function applyPreview() {
    const it = items[active];
    if (revertFn && (!it || it.revert !== revertFn)) { revertFn(); revertFn = null; }
    if (it && it.preview) { it.preview(); revertFn = it.revert || null; }
  }

  /** Run the active item and close the palette. */
  function commit() {
    const it = items[active];
    if (!it || it.disabled) return;
    committed = true; revertFn = null;
    modal.hide();
    setTimeout(() => it.run(), 0);
  }

  /** Open the palette with a prefill prefix (`>`, `:`, `@` or empty). */
  function show(prefill = '>') {
    Pick.close(false);
    if (isOpen) { input.value = prefill; input.focus(); build(); return; }
    committed = false; revertFn = null; isOpen = true;
    scrollTop = E().session.getScrollTop();
    input.value = prefill;
    modal.show();
    build();
    input.focus();
    input.setSelectionRange(prefill.length, prefill.length);
  }

  el.addEventListener('shown.bs.modal', () => { input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
  el.addEventListener('hidden.bs.modal', () => {
    if (!committed && revertFn) { revertFn(); }
    revertFn = null; isOpen = false;
    if (!committed) setTimeout(() => App.focus(), 0); else setTimeout(() => App.focus(), 30);
  });
  input.addEventListener('input', build);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'PageDown') { e.preventDefault(); setActive(Math.min(items.length - 1, active + 8)); }
    else if (e.key === 'PageUp') { e.preventDefault(); setActive(Math.max(0, active - 8)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.preventDefault(); modal.hide(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });
  listEl.addEventListener('mousemove', e => { const li = e.target.closest('.pal-item'); if (li && +li.dataset.i !== active && !items[+li.dataset.i].disabled) setActive(+li.dataset.i); });
  listEl.addEventListener('click', e => { const li = e.target.closest('.pal-item'); if (li) { active = +li.dataset.i; commit(); } });
  return { show, get isOpen() { return isOpen; } };
})();
