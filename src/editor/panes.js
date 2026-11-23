/* Editor panes: creation, event wiring, and per-pane header rendering. */
import { $, esc } from "./util.js";
import { S } from "./state.js";
import { Fonts, Langs } from "./langs.js";
import { Themes } from "./themes.js";
import { App } from "./app.js";
import { Status } from "./status.js";
import { Find } from "./find.js";
import { toast, copyToast } from "./toast.js";
import { Docs, isModified } from "./docs.js";
import { Layout } from "./layout.js";
import { Minimap } from "./minimap.js";

/** Create an Ace editor in pane `idx`, attach its minimap, and wire all pane events. */
export function makePane(idx) {
  const el = $('#pane' + idx);
  const editor = ace.edit($('.ed', el), {
    fontSize: S.fontSize, showPrintMargin: false, highlightActiveLine: true, highlightGutterLine: true,
    displayIndentGuides: true, showFoldWidgets: true, foldStyle: 'markbegin', behavioursEnabled: true,
    wrapBehavioursEnabled: true, showInvisibles: S.whitespace, scrollPastEnd: 0.5, animatedScroll: false,
    fadeFoldWidgets: false, enableMultiselect: true, enableBlockSelect: true, highlightSelectedWord: true,
    copyWithEmptySelection: true, useWorker: false, indentedSoftWrap: true, enableAutoIndent: true,
    fontFamily: Fonts.stack(S.fontFamily)
  });
  editor.setTheme('ace/theme/' + Themes.aceName());
  editor.renderer.setScrollMargin(6, 6, 0, 0);
  const pane = { idx, el, editor, docId: null, mm: null };
  pane.mm = new Minimap(pane);
  App.panes[idx] = pane;
  editor.on('focus', () => App.setActive(idx));
  ['changeSelection', 'multiSelect', 'singleSelect', 'changeSession', 'change'].forEach(ev => editor.on(ev, () => { if (App.active === idx) Status.schedule(); }));
  editor.on('changeSelection', () => { if (App.active === idx) Find.onSelection(); });
  editor.on('change', () => { if (App.active === idx) Find.onChange(); });
  editor.on('copy', copyToast);
  editor.on('cut', () => toast('Cut', { icon: 'bi-scissors', ms: 1000 }));
  // pane header focuses the pane
  $('.pane-head', el).addEventListener('click', () => editor.focus());
  // drag a tab onto a pane to open it there
  const hasTab = e => e.dataTransfer && [...(e.dataTransfer.types || [])].includes('text/x-tab');
  el.addEventListener('dragover', e => { if (hasTab(e)) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; el.classList.add('drop-target'); } }, true);
  el.addEventListener('dragleave', e => { if (!el.contains(e.relatedTarget)) el.classList.remove('drop-target'); }, true);
  el.addEventListener('drop', e => {
    if (!hasTab(e)) return;
    e.preventDefault(); e.stopPropagation(); el.classList.remove('drop-target');
    const d = Docs.byId.get(e.dataTransfer.getData('text/x-tab'));
    if (d) Docs.activate(d, idx);
  }, true);
  return pane;
}

/** Pane header helpers. */
export const Panes = {
  /** Refresh the filename / dirty dot shown above every visible pane. */
  renderHeads() {
    App.panes.forEach(p => {
      const head = $('.pane-head', p.el), d = Docs.byId.get(p.docId);
      if (!d || !Layout.visible(p.idx)) { head.innerHTML = ''; return; }
      head.innerHTML = `<i class="bi ${Langs.icon(d.lang)}" style="color:${Langs.color(d.lang)}" aria-hidden="true"></i><span class="nm">${esc(d.name)}</span>${isModified(d) ? '<span class="dot" aria-label="unsaved"></span>' : ''}<span class="pn">Pane ${p.idx + 1}</span>`;
    });
  }
};
