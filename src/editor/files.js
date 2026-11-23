/* Open and save: File System Access API, with input/download fallback. */
import { $, isTopLevel } from "./util.js";
import { toast } from "./toast.js";
import { Dialog } from "./dialog.js";
import { Docs, isModified } from "./docs.js";
import { Langs } from "./langs.js";
import { App } from "./app.js";

/** File I/O: File System Access API when it works (top-level pages), otherwise <input type=file> / download. */
export const Files = {
  // The native pickers throw SecurityError inside cross-origin iframes *and* burn the click's user
  // activation, which then blocks the <input> fallback. So only try them when we are top-level.
  pickerOk: isTopLevel && !!window.showOpenFilePicker,
  /** Opens files with the native picker or falls back to the file input. */
  async open() {
    if (this.pickerOk) {
      try {
        const hs = await window.showOpenFilePicker({ multiple: true });
        for (const h of hs) await this.openHandle(h);
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        console.warn('Native file picker unavailable, falling back to <input>', e);
        this.pickerOk = false;
        this.chooseDialog();                                   // fresh click => fresh user activation
        return;
      }
    }
    $('#fileInput').click();
  },
  /** Prompts the user to choose files when the native picker is unavailable. */
  chooseDialog() {
    Dialog.show({
      title: 'Open files', message: 'The native file picker is blocked here. Choose files from your computer:',
      buttons: [{ label: 'Cancel', value: null }, { label: 'Choose files…', value: 'go', primary: true, action: () => $('#fileInput').click() }]
    });
  },
  /** Opens a file handle, focusing an already-open document when possible. */
  async openHandle(h) {
    try {
      for (const d of Docs.list) if (d.handle && d.handle.isSameEntry && await d.handle.isSameEntry(h)) { Docs.activate(d); return; }
      await this.openFile(await h.getFile(), h);
    } catch (e) { toast('Could not open file: ' + e.message, { type: 'error' }); }
  },
  /** Reads a file into a new document, replacing a pristine empty tab. */
  async openFile(file, handle) {
    try {
      if (file.size > 20 * 1024 * 1024) { toast(`${file.name} is too large (>20 MB)`, { type: 'warn' }); return; }
      const text = await file.text();
      if (text.slice(0, 8000).includes('\u0000')) { toast(`${file.name} looks like a binary file`, { type: 'warn' }); return; }
      // replace a pristine empty "Untitled" tab, like most editors do
      const only = Docs.list.length === 1 ? Docs.list[0] : null;
      const doc = Docs.create({ name: file.name, text, handle, fromDisk: true });
      Docs.activate(doc);
      if (only && !only.fromDisk && !isModified(only) && !only.sessions[0].getValue()) Docs.close(only, { force: true });
      toast('Opened ' + file.name, { icon: 'bi-folder2-open', ms: 1200 });
      return doc;
    } catch (e) { toast('Could not read ' + file.name, { type: 'error' }); return null; }
  },
  /** Suggests a filename with an extension matching the document's language. */
  suggest(doc) {
    if (/\.[^.]+$/.test(doc.name)) return doc.name;
    const l = Langs.byId.get(doc.lang);
    return doc.name + '.' + ((l && l.exts[0]) || 'txt');
  },
  /** Saves text to disk through a temporary download link. */
  download(name, text) {
    const a = document.createElement('a');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
  /** Save (or Save As). Returns true when the document was persisted. */
  async save(doc, as = false) {
    doc = doc || App.doc();
    const text = doc.sessions[0].getValue();
    if (isTopLevel && window.showSaveFilePicker) {
      try {
        let h = doc.handle;
        if (!h || as) { h = await window.showSaveFilePicker({ suggestedName: this.suggest(doc) }); }
        const w = await h.createWritable(); await w.write(text); await w.close();
        doc.handle = h; doc.fromDisk = true;
        if (h.name !== doc.name) Docs.rename(doc, h.name);
        Docs.markClean(doc); toast('Saved ' + doc.name, { icon: 'bi-floppy' });
        return true;
      } catch (e) {
        if (e && e.name === 'AbortError') return false;
        console.warn('Falling back to download', e);
      }
    }
    let name = this.suggest(doc);
    if (as || !doc.fromDisk) {
      const r = await Dialog.prompt(as ? 'Save As' : 'Save File', 'File name:', name);
      if (!r) return false;
      name = r.trim() || name;
    }
    this.download(name, text);
    if (name !== doc.name) Docs.rename(doc, name);
    doc.fromDisk = true;
    Docs.markClean(doc); toast('Saved ' + name + ' (downloaded)', { icon: 'bi-download' });
    return true;
  }
};
$('#fileInput').addEventListener('change', async e => {
  const files = [...e.target.files];
  e.target.value = '';
  for (const f of files) await Files.openFile(f, null);
});
// Drag & drop of files onto the window
/** Reports whether a drag event carries files. */
const hasFiles = e => e.dataTransfer && [...(e.dataTransfer.types || [])].includes('Files');
window.addEventListener('dragover', e => { if (hasFiles(e)) { e.preventDefault(); document.body.classList.add('drag-file'); } });
window.addEventListener('dragleave', e => { if (e.relatedTarget === null) document.body.classList.remove('drag-file'); });
window.addEventListener('drop', async e => {
  if (!hasFiles(e)) return;
  e.preventDefault(); document.body.classList.remove('drag-file');
  // DataTransfer items must be read synchronously, before any await
  const entries = [...e.dataTransfer.items].filter(i => i.kind === 'file').map(i => ({
    file: i.getAsFile(), hp: i.getAsFileSystemHandle && isTopLevel ? i.getAsFileSystemHandle() : null
  }));
  for (const en of entries) {
    try {
      const h = en.hp ? await en.hp.catch(() => null) : null;
      if (h && h.kind === 'directory') { toast('Folders are not supported, drop files', { type: 'warn' }); continue; }
      if (h && h.kind === 'file') await Files.openHandle(h); else if (en.file) await Files.openFile(en.file, null);
    } catch (err) { toast('Could not open dropped file', { type: 'error' }); }
  }
});
