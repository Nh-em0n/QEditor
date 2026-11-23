/* Keybinding manager. Canonical combo: "Ctrl+Shift+Alt+Key". Chords: "Ctrl+K Ctrl+B". */
import { isMac } from "./config.js";
import { $, esc, Store } from "./util.js";
import { Commands } from "./commands.js";

/* =====================================================================
   4. KEYBINDING MANAGER
      Canonical combo format: "Ctrl+Shift+Alt+Key"; chords: "Ctrl+K Ctrl+B".
      On macOS, Cmd is treated as Ctrl.
   ===================================================================== */
/** Keybinding manager: maps canonical combos and chords to command ids. */
export const Keys = (() => {
  let map = new Map(), prefixes = new Set();
  let overrides = Store.getJSON('keymap', {});
  let pending = null, pendingTimer = 0;
  const CODE_MAP = { Slash: '/', BracketLeft: '[', BracketRight: ']', Backslash: '\\', Equal: '=', Minus: '-', Comma: ',', Period: '.', Semicolon: ';', Quote: "'", Backquote: '`', Space: 'Space', Enter: 'Enter', NumpadEnter: 'Enter', Escape: 'Esc', Tab: 'Tab', Backspace: 'Backspace', Delete: 'Delete', ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right', PageUp: 'PageUp', PageDown: 'PageDown', Home: 'Home', End: 'End', NumpadAdd: '+', NumpadSubtract: '-' };
  const KEY_MAP = { ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right', Escape: 'Esc', ' ': 'Space' };
  const MODS = ['Control', 'Shift', 'Alt', 'Meta', 'AltGraph'];
  /** Returns up to two candidate combo strings (physical-key based, then character based). */
  function candidates(e) {
    if (MODS.includes(e.key)) return [];
    const mods = [];
    if (e.ctrlKey || (isMac && e.metaKey)) mods.push('Ctrl');
    if (e.shiftKey) mods.push('Shift');
    if (e.altKey) mods.push('Alt');
    const c = e.code || '';
    let a = null;
    if (/^Key[A-Z]$/.test(c)) a = c[3];
    else if (/^Digit\d$/.test(c)) a = c[5];
    else if (/^Numpad\d$/.test(c)) a = c[6];
    else if (/^F\d+$/.test(c)) a = c;
    else if (CODE_MAP[c]) a = CODE_MAP[c];
    let b = null;
    const k = e.key;
    if (k) b = k.length === 1 ? k.toUpperCase() : (KEY_MAP[k] || k);
    return [...new Set([a, b].filter(Boolean).map(n => [...mods, n].join('+')))];
  }
  /** Returns the active shortcut for a command, honoring saved overrides. */
  const effective = id => (id in overrides ? overrides[id] : (Commands.byId.get(id) || {}).shortcut || '');
  /** Rebuilds the shortcut lookup map and refreshes shortcut hints in the UI. */
  function rebuild() {
    map = new Map(); prefixes = new Set();
    /** Maps a shortcut to a command id and records chord prefixes. */
    const add = (sc, id) => { if (!sc) return; map.set(sc, id); const p = sc.split(' '); if (p.length > 1) prefixes.add(p[0]); };
    // aliases first so primary shortcuts always win a conflict
    Commands.list.forEach(c => { if (!(c.id in overrides)) (c.aliases || []).forEach(a => add(a, c.id)); });
    Commands.list.forEach(c => add(effective(c.id), c.id));
    const kb = $('#palKbd'); if (kb) kb.textContent = pretty(effective('palette.commands'));
    /** Adds a shortcut hint to a toolbar button's tooltip. */
    const tip = (id, sel, label) => { const b = $(sel); const s = pretty(effective(id)); if (b) b.title = label + (s ? ` (${s})` : ''); };
    tip('file.new', '#btnNew', 'New File'); tip('file.new', '#btnNewTab', 'New File');
    tip('file.open', '#btnOpen', 'Open File'); tip('file.save', '#btnSave', 'Save');
  }
  /** Saves shortcut overrides to storage. */
  function persist() { Store.setJSON('keymap', overrides); }
  /** Assigns a shortcut to a command, clearing conflicts, and returns the affected titles. */
  function setBinding(id, sc) {
    const def = (Commands.byId.get(id) || {}).shortcut || '';
    const replaced = [];
    if (sc) Commands.list.forEach(c => { if (c.id !== id && effective(c.id) === sc) { overrides[c.id] = ''; replaced.push(c.title); } });
    if (sc === def) delete overrides[id]; else overrides[id] = sc;
    persist(); rebuild();
    return replaced;
  }
  /** Removes all shortcut overrides and rebuilds the binding map. */
  function reset() { overrides = {}; Store.remove('keymap'); rebuild(); }
  /** Updates the status bar hint text. */
  function setHint(t) { const h = $('#sbHint'); if (h) h.textContent = t; }
  /** Prevents the default action and propagation of a keyboard event. */
  function stop(e) { e.preventDefault(); e.stopPropagation(); }
  /** Checks whether the event target is a form field outside the code editor. */
  function inForeignInput(e) {
    const t = e.target;
    return t && t.closest && t.closest('input,textarea,select,[contenteditable="true"]') && !t.closest('.ace_editor');
  }
  /** Dispatches keyboard events to matching commands, including chord sequences. */
  function onKeydown(e) {
    if (e.isComposing) return;
    if (document.body.classList.contains('modal-open')) return;      // dialogs handle their own keys
    const cands = candidates(e);
    if (!cands.length) return;
    if (cands.includes('Esc') && document.querySelector('.dropdown-menu.show')) return;
    // second half of a chord
    if (pending) {
      clearTimeout(pendingTimer);
      const first = pending; pending = null; setHint('');
      stop(e);
      for (const c of cands) {
        const id = map.get(first + ' ' + c);
        if (id) { Commands.exec(id); return; }
      }
      return;                                                         // unknown chord: swallow like Sublime does
    }
    for (const c of cands) {
      const id = map.get(c);
      if (!id) continue;
      const def = Commands.byId.get(id);
      if (def.scope === 'editor' && inForeignInput(e)) return;
      stop(e);
      Commands.exec(id);
      return;
    }
    for (const c of cands) {
      if (prefixes.has(c) && !inForeignInput(e)) {
        stop(e);
        pending = c;
        setHint(`(${pretty(c)}) was pressed. Waiting for second key of chord…`);
        pendingTimer = setTimeout(() => { pending = null; setHint(''); }, 2200);
        return;
      }
    }
  }
  /** Split one combo into display parts (relies on canonical Ctrl, Shift, Alt order). */
  function parts(chord) {
    const out = []; let s = chord;
    for (const m of ['Ctrl+', 'Shift+', 'Alt+']) if (s.startsWith(m)) { out.push(m.slice(0, -1)); s = s.slice(m.length); }
    out.push(s); return out;
  }
  const GLYPH = { Up: '↑', Down: '↓', Left: '←', Right: '→', Ctrl: isMac ? '⌘' : 'Ctrl', Alt: isMac ? '⌥' : 'Alt', Shift: isMac ? '⇧' : 'Shift' };
  /** Formats a shortcut or chord sequence with readable key glyphs. */
  function pretty(sc) { return sc ? sc.split(' ').map(ch => parts(ch).map(p => GLYPH[p] || p).join('+')).join(', ') : ''; }
  /** Formats a shortcut or chord sequence as HTML keyboard tags. */
  function html(sc) {
    if (!sc) return '';
    return sc.split(' ').map(ch => `<span class="kg">${parts(ch).map(p => `<kbd>${esc(GLYPH[p] || p)}</kbd>`).join('')}</span>`).join('<span class="then">then</span>');
  }
  window.addEventListener('keydown', onKeydown, true);
  return { rebuild, effective, setBinding, reset, candidates, pretty, html, /** Reports whether any shortcut overrides are in effect. */ hasOverrides: () => Object.keys(overrides).length > 0 };
})();
