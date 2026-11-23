/* DOM helpers and a guarded localStorage wrapper. */
import { CONFIG } from "./config.js";

/* =====================================================================
   2. UTILITIES, SAFE STORAGE, TOASTS, DIALOGS, PICKER
   ===================================================================== */
/** Returns the first element matching a selector within an optional root. */
export const $ = (s, r = document) => r.querySelector(s);
/** Returns all elements matching a selector within an optional root as an array. */
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
/** Escapes HTML special characters in a value for safe insertion into markup. */
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** Returns a wrapped function that delays invocation until calls stop for the given interval. */
export const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
/** Restricts a number to the inclusive range between a minimum and maximum. */
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/** Returns a wrapped function that runs at most once per animation frame. */
export const rafOnce = fn => { let q = 0; return () => { if (q) return; q = requestAnimationFrame(() => { q = 0; fn(); }); }; };
/** True when this page is the top-level browsing context (file pickers don't work inside cross-origin iframes). */
export const isTopLevel = (() => { try { return window.top === window.self; } catch (e) { return false; } })();
/** localStorage wrapper: every call is guarded; falls back to an in-memory map. */
export const Store = (() => {
  const mem = {};
  let ok = true;
  try { localStorage.setItem('__sx_t', '1'); localStorage.removeItem('__sx_t'); } catch (e) { ok = false; }
  return {
    /** Reads a stored value, falling back to the in-memory map or a default. */
    get(k, d = null) {
      try { if (ok) { const v = localStorage.getItem(CONFIG.LS_PREFIX + k); if (v !== null) return v; } } catch (e) { /* ignore */ }
      return k in mem ? mem[k] : d;
    },
    /** Writes a value to the in-memory map and to storage. */
    set(k, v) {
      mem[k] = v;
      try { if (ok) localStorage.setItem(CONFIG.LS_PREFIX + k, v); return true; } catch (e) { return false; }
    },
    /** Removes a key from the in-memory map and from storage. */
    remove(k) { delete mem[k]; try { if (ok) localStorage.removeItem(CONFIG.LS_PREFIX + k); } catch (e) { /* ignore */ } },
    /** Reads and parses a JSON value from storage, returning a default on failure. */
    getJSON(k, d) { try { const v = this.get(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    /** Serializes a value as JSON and stores it. */
    setJSON(k, v) { try { return this.set(k, JSON.stringify(v)); } catch (e) { return false; } }
  };
})();
