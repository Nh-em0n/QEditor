/* Preferences dialog. */
import { $, esc } from "./util.js";
import { CONFIG } from "./config.js";
import { S, saveSettings } from "./state.js";
import { Fonts } from "./langs.js";
import { Themes } from "./themes.js";
import { UI } from "./ui.js";
import { toast } from "./toast.js";
import { Pick } from "./picker.js";
import { App } from "./app.js";

/** Preferences dialog: font family / size / line height / ligatures plus the main editor options. */
export const Settings = (() => {
  /** Looks up a settings dialog element by id. */
  const el = $('#settings'), modal = new bootstrap.Modal(el), q = id => document.getElementById(id);
  let built = false;
  /** Populates the font, theme, and wrap selects. */
  function build() {
    q('setFont').innerHTML = CONFIG.FONTS.map(f => `<option value="${esc(f.id)}" style="font-family:${esc(f.stack)}">${esc(f.id)}</option>`).join('') + '<option value="__custom">Custom…</option>';
    q('setTheme').innerHTML = CONFIG.THEMES.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
    q('setWrap').innerHTML = CONFIG.WRAPS.map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join('');
    built = true;
  }
  /** Synchronizes dialog controls with the current settings. */
  function sync() {
    if (!built) return;
    const known = Fonts.known(S.fontFamily);
    q('setFont').value = known ? S.fontFamily : '__custom';
    if (document.activeElement !== q('setFontCustom')) q('setFontCustom').value = known ? '' : S.fontFamily;
    q('setSize').value = S.fontSize; q('setSizeVal').textContent = S.fontSize + ' px';
    q('setLh').value = S.lineHeight; q('setLhVal').textContent = (+S.lineHeight).toFixed(2);
    q('setLiga').checked = !!S.ligatures;
    q('setTheme').value = Themes.current || '';
    q('setIndent').value = S.softTabs ? 'spaces' : 'tabs';
    q('setTab').value = String(S.tabSize);
    q('setWrap').value = S.wrap;
    q('setWs').checked = !!S.whitespace; q('setMini').checked = !!S.minimap; q('setStatus').checked = !!S.statusbar;
  }
  /** Applies a custom font family entered by the user. */
  function applyCustom() {
    const v = q('setFontCustom').value.trim();
    if (!v) return toast('Type a font name first', { type: 'warn', ms: 1200 });
    UI.setFont(v);
  }
  /** Builds the dialog and wires all of its preference controls. */
  function init() {
    build();
    q('setFont').addEventListener('change', e => { if (e.target.value === '__custom') q('setFontCustom').focus(); else UI.setFont(e.target.value, true); });
    q('setFontApply').addEventListener('click', applyCustom);
    q('setFontCustom').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyCustom(); } });
    q('setSize').addEventListener('input', e => UI.setSize(e.target.value, true));
    q('setSizeDown').addEventListener('click', () => UI.setSize(S.fontSize - 1, true));
    q('setSizeUp').addEventListener('click', () => UI.setSize(S.fontSize + 1, true));
    q('setLh').addEventListener('input', e => UI.setLineHeight(e.target.value));
    q('setLiga').addEventListener('change', e => { S.ligatures = e.target.checked; saveSettings(); UI.applyFont(); });
    q('setTheme').addEventListener('change', e => Themes.set(e.target.value));
    q('setIndent').addEventListener('change', e => UI.setIndent({ soft: e.target.value === 'spaces' }));
    q('setTab').addEventListener('change', e => UI.setIndent({ size: +e.target.value }));
    q('setWrap').addEventListener('change', e => UI.setWrap(e.target.value));
    q('setWs').addEventListener('change', e => UI.setWhitespace(e.target.checked));
    q('setMini').addEventListener('change', e => { S.minimap = e.target.checked; saveSettings(); UI.applyLayout(); });
    q('setStatus').addEventListener('change', e => { S.statusbar = e.target.checked; saveSettings(); UI.applyLayout(); });
    q('setReset').addEventListener('click', () => {
      const d = CONFIG.DEFAULTS; S.fontFamily = d.fontFamily; S.fontSize = d.fontSize; S.lineHeight = d.lineHeight; S.ligatures = d.ligatures;
      q('setFontCustom').value = ''; saveSettings(); UI.applyFont(); toast('Font settings reset', { icon: 'bi-arrow-counterclockwise', ms: 1200 });
    });
    el.addEventListener('hidden.bs.modal', () => setTimeout(() => App.focus(), 0));
    sync();
  }
  return {
    init, sync,
    /** Opens the preferences dialog and focuses the requested field. */
    show(focusCustom) {
      Pick.close(false); sync(); modal.show();
      el.addEventListener('shown.bs.modal', () => (focusCustom ? q('setFontCustom') : q('setFont')).focus(), { once: true });
    }
  };
})();
