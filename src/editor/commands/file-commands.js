/* File, tab and goto commands. Importing this module registers them. */
import { cmd } from "../commands.js";
import { Docs } from "../docs.js";
import { Files } from "../files.js";
import { Folders } from "../folders.js";
import { App } from "../app.js";
import { Dialog } from "../dialog.js";
import { Palette } from "../palette.js";
import { toast } from "../toast.js";

/** Create a new untitled document. */
cmd('file.new', 'File', 'New File', 'Alt+N', () => Docs.newFile(), { aliases: ['Ctrl+N', 'Ctrl+Alt+N'] });
/** Open file(s) through the native picker or the fallback input. */
cmd('file.open', 'File', 'Open File…', 'Ctrl+O', () => Files.open());
/** Open a folder and list its files in the explorer sidebar. */
cmd('file.openFolder', 'File', 'Open Folder…', 'Alt+Shift+O', () => Folders.open());
/** Save the active document. */
cmd('file.save', 'File', 'Save', 'Ctrl+S', () => Files.save(App.doc()));
/** Save the active document under a new name. */
cmd('file.saveAs', 'File', 'Save As…', 'Ctrl+Shift+S', () => Files.save(App.doc(), true));
/** Rename the active document (the extension selects the syntax mode). */
cmd('file.rename', 'File', 'Rename…', '', async () => {
  const d = App.doc(), n = await Dialog.prompt('Rename file', 'New name (the extension sets the syntax):', d.name);
  if (n && n.trim()) Docs.rename(d, n.trim());
});
/** Close the active tab, prompting when it has unsaved changes. */
cmd('file.close', 'File', 'Close Tab', 'Shift+Alt+W', () => Docs.close(App.doc()), { aliases: ['Ctrl+W'] });
/** Close every tab except the active one. */
cmd('file.closeOthers', 'File', 'Close Other Tabs', '', () => Docs.closeMany(Docs.list.filter(d => d !== App.doc())));
/** Close all open tabs. */
cmd('file.closeAll', 'File', 'Close All Tabs', '', () => Docs.closeMany([...Docs.list]));
/** Move to the next tab. */
cmd('tab.next', 'File', 'Next Tab', 'Alt+]', () => Docs.cycle(1), { aliases: ['Ctrl+PageDown'] });
/** Move to the previous tab. */
cmd('tab.prev', 'File', 'Previous Tab', 'Alt+[', () => Docs.cycle(-1), { aliases: ['Ctrl+PageUp'] });
/** Copy the active document's filename to the clipboard. */
cmd('file.copyName', 'File', 'Copy File Name', '', () => {
  const n = App.doc().name;
  const done = () => toast('Copied "' + n + '"', { icon: 'bi-clipboard-check' });
  try { navigator.clipboard.writeText(n).then(done, () => toast('Clipboard unavailable', { type: 'warn' })); } catch (e) { toast('Clipboard unavailable', { type: 'warn' }); }
});

/** Open the command palette in command mode. */
cmd('palette.commands', 'Goto', 'Command Palette', 'Ctrl+Shift+P', () => Palette.show('>'), { aliases: ['F1'] });
/** Open the palette in switch-file mode. */
cmd('goto.anything', 'Goto', 'Goto Anything (Switch File)', 'Ctrl+P', () => Palette.show(''));
/** Open the palette in go-to-line mode. */
cmd('goto.line', 'Goto', 'Go to Line…', 'Ctrl+G', () => Palette.show(':'));
/** Open the palette in symbol mode. */
cmd('goto.symbol', 'Goto', 'Go to Symbol…', 'Ctrl+R', () => Palette.show('@'));
