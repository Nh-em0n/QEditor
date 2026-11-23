/* Active pane and the document it is showing. */
import { $$ } from "./util.js";
import { Docs } from "./docs.js";
import { Layout } from "./layout.js";
import { Tabs } from "./tabs.js";
import { Sidebar } from "./sidebar.js";
import { Status } from "./status.js";
import { UI } from "./ui.js";
import { Find } from "./find.js";

/* =====================================================================
   7. APP STATE, SESSIONS, FILE / TAB MANAGER
   ===================================================================== */
export const App = {
  active: 0,
  panes: [],
  /** Returns the editor belonging to the active pane. */
  editor() { return this.panes[this.active].editor; },
  /** Returns the document shown in the active pane. */
  doc() { return Docs.byId.get(this.panes[this.active].docId); },
  /** Focuses the active editor unless a modal is open. */
  focus() { try { if (!document.body.classList.contains('modal-open')) this.editor().focus(); } catch (e) { /* ignore */ } },
  /** Switches the active pane and refreshes the interface. */
  setActive(i) {
    if (!Layout.visible(i)) i = 0;
    if (this.active === i) return;
    this.active = i;
    $$('.pane').forEach(p => p.classList.toggle('focused', +p.dataset.idx === i));
    Tabs.render(); Sidebar.render(); Status.schedule(); UI.updateTitle(); Find.onPaneChange();
  }
};
/** Returns the active pane's editor. */
export const E = () => App.editor();
