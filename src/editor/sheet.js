/* Keyboard shortcut cheat sheet and keybinding editor. */
import { $, esc } from "./util.js";
import { Commands } from "./commands.js";
import { Keys } from "./keys.js";
import { toast } from "./toast.js";
import { App } from "./app.js";

/* =====================================================================
   13. SHORTCUT CHEAT SHEET + KEYBINDING EDITOR
   ===================================================================== */
/** Shortcut cheat sheet modal with inline keybinding recording. */
export const Sheet = (() => {
  const el = $('#sheet'), modal = new bootstrap.Modal(el), body = $('#sheetBody'), filter = $('#sheetFilter');
  let rec = null;                        // {id, keys:[], timer}
  /** Renders the filtered shortcut list and highlights the command being recorded. */
  function render() {
    const q = filter.value.trim().toLowerCase();
    const cats = new Map();
    Commands.list.forEach(c => {
      if (q && !(Commands.label(c) + ' ' + Keys.pretty(Keys.effective(c.id))).toLowerCase().includes(q)) return;
      const k = c.category || 'General'; if (!cats.has(k)) cats.set(k, []); cats.get(k).push(c);
    });
    body.innerHTML = [...cats.entries()].map(([cat, cs]) =>
      `<div class="sh-cat">${esc(cat)}</div>` + cs.map(c => {
        const sc = Keys.effective(c.id), isRec = rec && rec.id === c.id;
        return `<div class="sh-row${isRec ? ' rec' : ''}" data-id="${c.id}"><span class="t">${esc(c.title)}</span>` +
          `<span class="k">${isRec ? `<span class="rec-msg">${rec.keys.length ? esc(Keys.pretty(rec.keys.join(' '))) + ' … ' : ''}Press new shortcut (Esc cancels, Backspace unbinds)</span>` : (sc ? Keys.html(sc) : '<span class="none">unbound</span>')}</span>` +
          `<button class="ib" data-edit="${c.id}" aria-label="Edit shortcut for ${esc(c.title)}" title="Edit shortcut"><i class="bi bi-pencil" aria-hidden="true"></i></button></div>`;
      }).join('')).join('') || '<div class="pal-empty">No matching commands</div>';
    const r = $('.sh-row.rec .ib', body); if (r) r.focus();
  }
  /** Finishes shortcut recording, optionally saving the new binding. */
  function endRec(save) {
    if (!rec) return;
    clearTimeout(rec.timer);
    const r = rec; rec = null;
    if (save && r.keys.length) {
      const replaced = Keys.setBinding(r.id, r.keys.join(' '));
      toast(replaced.length ? `Bound. Unbound "${replaced[0]}"` : 'Shortcut updated', { icon: 'bi-keyboard' });
    }
    render();
  }
  el.addEventListener('keydown', e => {
    if (!rec) return;
    e.preventDefault(); e.stopPropagation();           // capture everything while recording
    const cand = Keys.candidates(e)[0];
    if (!cand) return;
    if (cand === 'Esc') return endRec(false);
    if (cand === 'Backspace' || cand === 'Delete') { Keys.setBinding(rec.id, ''); toast('Shortcut removed', { icon: 'bi-keyboard' }); rec = null; return render(); }
    if (cand === 'Enter' && rec.keys.length) return endRec(true);
    clearTimeout(rec.timer);
    rec.keys.push(cand);
    if (rec.keys.length >= 2) return endRec(true);
    render();
    rec.timer = setTimeout(() => endRec(true), 1100);  // single combo unless a 2nd key follows quickly (chord)
  }, true);
  body.addEventListener('click', e => {
    const b = e.target.closest('[data-edit]'); if (!b) return;
    if (rec) endRec(false);
    rec = { id: b.dataset.edit, keys: [], timer: 0 };
    render();
  });
  filter.addEventListener('input', render);
  $('#sheetReset').addEventListener('click', () => { Keys.reset(); render(); toast('Key bindings reset to defaults', { icon: 'bi-arrow-counterclockwise' }); });
  el.addEventListener('hidden.bs.modal', () => { rec = null; setTimeout(() => App.focus(), 0); });
  return { /** Shows the shortcut sheet with a cleared filter. */ show() { filter.value = ''; rec = null; render(); modal.show(); setTimeout(() => filter.focus(), 60); } };
})();
