/* Menu bar built from the command registry. */
import { $, esc } from "./util.js";
import { CONFIG } from "./config.js";
import { Commands } from "./commands.js";
import { Keys } from "./keys.js";
import { Palette } from "./palette.js";
import { Pick } from "./picker.js";
import { App } from "./app.js";

export const Menus = {
  el: $('#menubar'),
  /** Builds the menu bar and wires dropdown, command, and focus restoration handlers. */
  init() {
    this.el.innerHTML = Object.keys(CONFIG.MENUS).map(name =>
      `<div class="dropdown"><button class="menu-btn" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true">${name}</button><ul class="dropdown-menu" data-menu="${name}" role="menu"></ul></div>`).join('');
    this.el.addEventListener('show.bs.dropdown', e => this.fill($('.dropdown-menu', e.target.closest('.dropdown'))));
    this.el.addEventListener('click', e => {
      const b = e.target.closest('[data-cmd]'); if (!b) return;
      // run in the same gesture for things that need user activation (file picker)
      if (b.dataset.cmd === 'file.open') Commands.exec('file.open', { recent: true });
      else setTimeout(() => { Commands.exec(b.dataset.cmd, { recent: true }); }, 0);
    });
    this.el.addEventListener('hidden.bs.dropdown', () => { setTimeout(() => { if (!Palette.isOpen && !Pick.isOpen && !document.body.classList.contains('modal-open')) App.focus(); }, 0); });
  },
  /** Populates a dropdown with commands, shortcuts, and checked states from the registry. */
  fill(ul) {
    ul.innerHTML = CONFIG.MENUS[ul.dataset.menu].map(id => {
      if (id === '-') return '<li><hr class="dropdown-divider"></li>';
      const c = Commands.byId.get(id); if (!c) return '';
      const on = c.checked && c.checked();
      return `<li><button class="dropdown-item" role="menuitem" data-cmd="${id}"><span class="chk">${on ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : ''}</span><span>${esc(c.title)}</span><span class="sc">${Keys.html(Keys.effective(id))}</span></button></li>`;
    }).join('');
  }
};
