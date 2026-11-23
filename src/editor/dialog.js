/* Promise-based dialog on top of one Bootstrap modal. */
import { $ } from "./util.js";
import { App } from "./app.js";

/** Promise-based dialog on top of one Bootstrap modal. A button may carry `action`, run inside the click (user gesture). */
export const Dialog = (() => {
  const el = $('#dlg'), modal = new bootstrap.Modal(el), input = $('#dlgInput'), foot = $('#dlgFoot');
  /** Configures and shows the modal, resolving when a button is clicked or the modal closes. */
  function show({ title, message = '', input: inputVal = null, buttons }) {
    return new Promise(resolve => {
      let done = false;
      /** Resolves the dialog promise only once with the chosen result. */
      const finish = v => { if (!done) { done = true; resolve(v); } };
      $('#dlgTitle').textContent = title;
      $('#dlgMsg').textContent = message;
      input.hidden = inputVal === null;
      if (inputVal !== null) input.value = inputVal;
      foot.innerHTML = '';
      let primaryBtn = null;
      buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sx' + (b.primary ? ' primary' : '') + (b.danger ? ' danger' : '');
        btn.textContent = b.label;
        btn.addEventListener('click', () => { if (b.action) b.action(); finish({ value: b.value, input: input.value }); modal.hide(); });
        if (b.primary) primaryBtn = btn;
        foot.appendChild(btn);
      });
      input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); primaryBtn && primaryBtn.click(); } };
      el.addEventListener('hidden.bs.modal', () => { finish(null); setTimeout(() => App.focus(), 0); }, { once: true });
      el.addEventListener('shown.bs.modal', () => {
        if (inputVal !== null) { input.focus(); input.select(); } else if (primaryBtn) primaryBtn.focus();
      }, { once: true });
      modal.show();
    });
  }
  return {
    show,
    /** Prompts for text and resolves with the entered value or null when cancelled. */
    async prompt(title, message, value) {
      const r = await show({ title, message, input: value, buttons: [{ label: 'Cancel', value: null }, { label: 'OK', value: 'ok', primary: true }] });
      return r && r.value === 'ok' ? r.input : null;
    }
  };
})();
