/* Color scheme manager. --bg / --fg / --accent drive the rest of the UI. */
import { CONFIG } from "./config.js";
import { S, saveSettings } from "./state.js";
import { toast } from "./toast.js";
import { App } from "./app.js";
import { Settings } from "./settings.js";

/* =====================================================================
   5. THEME MANAGER
   ===================================================================== */
/** Color scheme manager: applies light/dark palettes to the UI and Ace panes. */
export const Themes = (() => {
  const byId = new Map(CONFIG.THEMES.map(t => [t.id, t]));
  let current = null;
  /** Chooses the initial theme from settings or the operating system color scheme. */
  function initial() {
    if (S.theme && byId.has(S.theme)) return S.theme;
    // first visit: respect the OS color scheme
    let dark = true;
    try { dark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { /* ignore */ }
    return dark ? 'one_dark' : 'github_light';
  }
  /** Applies a theme without persisting (used for live preview). */
  function apply(id) {
    const t = byId.get(id) || byId.get('monokai');
    const r = document.documentElement;
    r.style.setProperty('--bg', t.bg); r.style.setProperty('--fg', t.fg); r.style.setProperty('--accent', t.accent);
    r.dataset.mode = t.dark ? 'dark' : 'light';
    r.setAttribute('data-bs-theme', t.dark ? 'dark' : 'light');
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t.bg;
    if (App.panes.length) App.panes.forEach(p => { p.editor.setTheme('ace/theme/' + t.ace); p.mm.themeChanged(); });
  }
  /** Applies, persists, and announces a theme selection. */
  function set(id) { if (!byId.has(id)) return; current = id; S.theme = id; saveSettings(); apply(id); Settings.sync(); toast('Color scheme: ' + byId.get(id).name, { icon: 'bi-palette', ms: 1200 }); }
  return {
    /** Initializes the current theme and applies it. */
    init() { current = initial(); apply(current); },
    apply, set, byId,
    /** Re-applies the current theme to undo a live preview. */
    revert() { apply(current); },
    /** Returns the id of the active theme. */
    get current() { return current; },
    /** Returns the Ace theme name for the active theme. */
    aceName() { return (byId.get(current) || byId.get('monokai')).ace; }
  };
})();
