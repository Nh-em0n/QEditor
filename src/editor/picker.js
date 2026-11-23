/* Anchored picker popover (language, indentation, line endings, layout). */
import { $, $$, esc, clamp } from "./util.js";
import { toast } from "./toast.js";
import { App } from "./app.js";
import { Commands } from "./commands.js";
import { Keys } from "./keys.js";

/** Small anchored popover with an optional filter box. Independent of the command palette modal. */
export const Pick = (() => {
  const el = $('#picker'), filter = $('#pkFilter'), list = $('#pkList'), titleEl = $('#pkTitle');
  let items = [], shown = [], act = 0, isOpen = false, anchor = null, lastClose = { a: null, t: 0 };
  /** Hides the picker popover and optionally restores focus to the editor. */
  function close(refocus = true) {
    if (!isOpen) return;
    isOpen = false; el.hidden = true; lastClose = { a: anchor, t: Date.now() };
    if (refocus) setTimeout(() => App.focus(), 0);
  }
  /** Filters picker items by the current query and rebuilds the list markup. */
  function render() {
    const q = filter.value.trim().toLowerCase();
    shown = items.filter(i => !q || i.label.toLowerCase().includes(q));
    if (act >= shown.length || act < 0) act = 0;
    list.innerHTML = shown.length ? shown.map((it, i) =>
      `<li class="pk-item${i === act ? ' active' : ''}" role="option" aria-selected="${i === act}" data-i="${i}"><span class="chk">${it.checked ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : ''}</span>${it.icon ? `<span class="pi">${it.icon}</span>` : ''}<span class="pl">${esc(it.label)}</span>${it.sc ? `<span class="sc">${Keys.html(it.sc)}</span>` : ''}</li>`).join('')
      : '<li class="pk-empty" role="presentation">No matches</li>';
    const a = $('.pk-item.active', list); if (a) a.scrollIntoView({ block: 'nearest' });
  }
  /** Positions the picker popover beside its anchor within the viewport. */
  function place() {
    const r = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    const left = clamp(r.right - w, 8, Math.max(8, window.innerWidth - w - 8));
    const top = r.top > window.innerHeight / 2 ? Math.max(8, r.top - h - 6) : Math.min(r.bottom + 6, window.innerHeight - h - 8);
    el.style.left = left + 'px'; el.style.top = top + 'px';
  }
  /** Opens the picker popover anchored to an element with an optional title and filter. */
  function open(anchorEl, { title = '', items: its, filter: withFilter = true }) {
    if (isOpen) close(false);
    if (lastClose.a === anchorEl && Date.now() - lastClose.t < 250) return;   // clicking the trigger again toggles it off
    anchor = anchorEl; items = its; isOpen = true;
    titleEl.textContent = title; titleEl.hidden = !title;
    filter.value = ''; filter.hidden = !withFilter;
    act = Math.max(0, items.findIndex(i => i.checked));
    el.hidden = false; render(); place();
    (withFilter ? filter : el).focus({ preventScroll: true });
    const a = $('.pk-item.active', list); if (a) a.scrollIntoView({ block: 'nearest' });
  }
  /** Runs the selected picker action after closing the popover. */
  function commit(i) {
    const it = shown[i]; if (!it) return;
    close(false);
    setTimeout(() => { try { it.run(); } catch (e) { console.error(e); toast(String(e.message || e), { type: 'error' }); } setTimeout(() => App.focus(), 60); }, 0);
  }
  filter.addEventListener('input', () => { act = 0; render(); });
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); act = (act + 1) % Math.max(1, shown.length); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); act = (act - 1 + shown.length) % Math.max(1, shown.length); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(act); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });
  list.addEventListener('click', e => { const li = e.target.closest('.pk-item'); if (li) commit(+li.dataset.i); });
  list.addEventListener('mousemove', e => { const li = e.target.closest('.pk-item'); if (li && +li.dataset.i !== act) { act = +li.dataset.i; $$('.pk-item', list).forEach((x, k) => x.classList.toggle('active', k === act)); } });
  document.addEventListener('pointerdown', e => { if (isOpen && !el.contains(e.target) && !(anchor && anchor.contains(e.target))) close(false); }, true);
  window.addEventListener('resize', () => close(false));
  window.addEventListener('blur', () => close(false));
  /** Build items straight from registered commands. */
  function fromCommands(ids, opts = {}) {
    return ids.map(id => Commands.byId.get(id)).filter(Boolean).map(c => ({
      label: opts.label ? opts.label(c) : c.title, checked: !!(c.checked && c.checked()), sc: Keys.effective(c.id),
      icon: opts.icon ? opts.icon(c) : '', run: () => Commands.exec(c.id, { recent: true })
    }));
  }
  return { open, close, fromCommands, /** Reports whether the picker popover is currently open. */ get isOpen() { return isOpen; } };
})();
