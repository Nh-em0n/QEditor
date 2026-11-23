/* Persisted editor settings and session-only view state. */
import { CONFIG } from "./config.js";
import { Store } from "./util.js";

export const S = Object.assign({}, CONFIG.DEFAULTS, Store.getJSON('settings', {}));
if (window.innerWidth < 768) S.sidebar = false;       // sidebar collapses on small screens
/** Persists the current editor settings to storage. */
export const saveSettings = () => Store.setJSON('settings', S);
export const UIState = { layout: 'single', zen: false };     // runtime/session view state
