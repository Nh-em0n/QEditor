/* Transient status toasts. */
import { $, esc } from "./util.js";

/** Displays a transient status toast that automatically disappears. */
export function toast(msg, { icon, type = 'info', ms = 1800 } = {}) {
  const host = $('#toasts');
  while (host.children.length > 3) host.firstChild.remove();
  const ic = icon || (type === 'error' ? 'bi-x-octagon' : type === 'warn' ? 'bi-exclamation-triangle' : 'bi-check2-circle');
  const el = document.createElement('div');
  el.className = 'sx-toast ' + type;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `<i class="bi ${ic}" aria-hidden="true"></i><span>${esc(msg)}</span>`;
  host.appendChild(el);
  setTimeout(() => el.remove(), ms);
}
let lastCopyToast = 0;
/** Shows a throttled "Copied" confirmation toast. */
export const copyToast = () => { const n = Date.now(); if (n - lastCopyToast > 600) { lastCopyToast = n; toast('Copied', { icon: 'bi-clipboard-check', ms: 1200 }); } };
