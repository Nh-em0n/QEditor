/* Chrome: title, sidebar, font, wrap, and indent. */
import { $, esc, clamp } from "./util.js";
import { CONFIG } from "./config.js";
import { S, saveSettings, UIState } from "./state.js";
import { App } from "./app.js";
import { Layout } from "./layout.js";
import { Sessions, isModified } from "./docs.js";
import { Fonts } from "./langs.js";
import { Settings } from "./settings.js";
import { toast } from "./toast.js";
import { Status } from "./status.js";

export const UI = {
  /** Updates the window and document titles with the active document's name and modified state. */
  updateTitle() {
    const d = App.doc(); if (!d) return;
    const m = isModified(d);
    $('#titleText').innerHTML = `<b>${esc(d.name)}</b>${m ? ' ●' : ''} — ${CONFIG.APP_NAME}`;
    document.title = `${m ? '● ' : ''}${d.name} — ${CONFIG.APP_NAME}`;
  },
  /** Toggles body classes for the sidebar, minimap, status bar, and zen mode, then applies the pane layout. */
  applyLayout() {
    const b = document.body.classList;
    b.toggle('sb-on', !!S.sidebar); b.toggle('no-minimap', !S.minimap); b.toggle('no-status', !S.statusbar); b.toggle('no-header', !S.header);
    b.toggle('zen', UIState.zen);
    this.applySidebarWidth();
    Layout.apply();
  },
  /** Applies the persisted sidebar width to the page layout. */
  applySidebarWidth() {
    document.documentElement.style.setProperty('--sbw', clamp(Math.round(+S.sidebarWidth) || 240, 160, 520) + 'px');
  },
  /** Resizes all editor panes immediately and again after a short delay. */
  resize() { requestAnimationFrame(() => App.panes.forEach(p => { p.editor.resize(true); p.mm.schedule(); })); setTimeout(() => App.panes.forEach(p => p.editor.resize(true)), 220); },
  /** Shows or hides the sidebar and persists the setting. */
  setSidebar(on) { S.sidebar = on; saveSettings(); this.applyLayout(); },
  /** Push font family / size / line-height / ligature settings to every editor. */
  applyFont() {
    const stack = Fonts.stack(S.fontFamily);
    const r = document.documentElement.style;
    r.setProperty('--code', stack); r.setProperty('--liga', S.ligatures ? 'normal' : 'none'); r.setProperty('--lh', String(S.lineHeight));
    /** Re-measures and redraws all editor panes after font changes. */
    const refresh = () => App.panes.forEach(p => { p.editor.renderer.updateFontSize(); p.editor.resize(true); p.mm.schedule(); });
    App.panes.forEach(p => { p.editor.setOption('fontFamily', stack); p.editor.setFontSize(S.fontSize); });
    refresh(); requestAnimationFrame(refresh);
    Fonts.ensure(S.fontFamily, refresh);          // web fonts load lazily: re-measure when ready
    Status.schedule(); Settings.sync();
  },
  /** Sets the font family, refreshes editors, and optionally shows a notification. */
  setFont(name, quiet) {
    S.fontFamily = name; saveSettings(); this.applyFont();
    if (!quiet) toast('Font: ' + name, { icon: 'bi-fonts', ms: 1200 });
  },
  /** Sets the font size within bounds, refreshes editors, and optionally shows a notification. */
  setSize(n, quiet) {
    S.fontSize = clamp(Math.round(+n) || 14, 8, 40); saveSettings(); this.applyFont();
    if (!quiet) toast(`Font size ${S.fontSize}px`, { icon: 'bi-zoom-in', ms: 900 });
  },
  /** Sets the font size through the standard size setter. */
  setZoom(n) { this.setSize(n); },
  /** Sets the editor line height within bounds and refreshes fonts. */
  setLineHeight(v) { S.lineHeight = clamp(+v || 1.6, 1.1, 2.2); saveSettings(); this.applyFont(); },
  /** Changes word wrap mode for all documents and persists the setting. */
  setWrap(mode) {
    if (S.wrap !== 'off') S.lastWrap = S.wrap;
    S.wrap = mode; if (mode !== 'off') S.lastWrap = mode;
    saveSettings(); Sessions.each(s => Sessions.applyWrap(s)); Settings.sync();
    toast('Word wrap: ' + (CONFIG.WRAPS.find(w => w[0] === mode) || [0, mode])[1], { icon: 'bi-text-wrap', ms: 1000 });
  },
  /** Updates tab size and soft-tab settings across all documents. */
  setIndent({ size, soft }) {
    if (size) S.tabSize = size; if (soft !== undefined) S.softTabs = soft;
    saveSettings(); Sessions.each(s => { s.setTabSize(S.tabSize); s.setUseSoftTabs(S.softTabs); });
    Status.schedule(); Settings.sync();
    toast((S.softTabs ? 'Spaces: ' : 'Tabs, size ') + S.tabSize, { icon: 'bi-text-indent-left', ms: 1000 });
  },
  /** Shows or hides invisible whitespace characters in all editors. */
  setWhitespace(on) { S.whitespace = on; saveSettings(); App.panes.forEach(p => p.editor.setShowInvisibles(on)); Settings.sync(); },
  /** Toggles between single-pane and two-column layouts. */
  toggleSplit() { Layout.set(UIState.layout === 'single' ? 'cols2' : 'single'); },
  /** Toggles distraction-free mode and restores editor focus. */
  toggleZen() {
    UIState.zen = !UIState.zen; this.applyLayout();
    if (UIState.zen) toast('Distraction free mode. Shift+F11 to exit', { icon: 'bi-eye-slash', ms: 2200 });
    App.focus();
  }
};
