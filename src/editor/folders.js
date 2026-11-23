/* Open-folder support: directory picker, recursive file listing, explorer tree. */
import { $, esc, isTopLevel } from "./util.js";
import { Dialog } from "./dialog.js";
import { toast } from "./toast.js";
import { Langs } from "./langs.js";
import { Docs } from "./docs.js";
import { Files } from "./files.js";

/** Limits keep a large directory from freezing the UI. */
const MAX_FILES = 500;
const MAX_DEPTH = 8;
/** Common generated/hidden directories that are not useful in the explorer. */
const SKIP = new Set(['.git', '.hg', '.svn', 'node_modules', 'dist', 'build', '.cache']);

/** Registry of folders opened through File → Open Folder. */
export const Folders = (() => {
  let seq = 0;
  const roots = [];

  /** Notifies the sidebar that the folder list changed. */
  const changed = () => document.dispatchEvent(new Event('folders:change'));

  /** Reads a directory handle recursively into a flat list of file entries. */
  async function walk(dir, prefix, out, depth) {
    if (depth > MAX_DEPTH || out.length >= MAX_FILES) return;
    try {
      const iterator = dir.values ? dir.values() : dir.entries();
      for await (const item of iterator) {
        if (out.length >= MAX_FILES) break;
        const h = Array.isArray(item) ? item[1] : item;
        if (!h || SKIP.has(h.name) || h.name.startsWith('.')) continue;
        const path = prefix ? prefix + '/' + h.name : h.name;
        if (h.kind === 'directory') await walk(h, path, out, depth + 1);
        else if (h.kind === 'file') out.push({ path, name: h.name, handle: h, file: await h.getFile() });
      }
    } catch (e) { console.warn('Could not list folder', e); }
  }

  /** Registers a folder, replacing an earlier folder with the same name. */
  function add(name, entries) {
    if (!entries.length) { toast('No readable files found in that folder', { type: 'warn' }); return; }
    const first = entries[0].path;
    const old = roots.findIndex(r => r.name === name && r.entries[0] && r.entries[0].path === first);
    if (old >= 0) roots.splice(old, 1);
    roots.unshift({ id: 'f' + (++seq), name, entries, collapsed: new Set() });
    changed();
    toast(`Opened folder ${name} (${entries.length} file${entries.length === 1 ? '' : 's'})`, { icon: 'bi-folder2-open' });
  }

  /** Offers the native directory picker, or a file-input fallback when it is unavailable. */
  async function open() {
    if (isTopLevel && window.showDirectoryPicker) {
      try {
        const dir = await window.showDirectoryPicker();
        const entries = [];
        await walk(dir, '', entries, 0);
        add(dir.name, entries);
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        console.warn('Native folder picker unavailable, falling back to <input>', e);
        Dialog.show({
          title: 'Open folder',
          message: 'The native folder picker is blocked here. Choose a folder from your computer:',
          buttons: [{ label: 'Cancel', value: null }, { label: 'Choose folder…', value: 'go', primary: true, action: () => $('#folderInput').click() }]
        });
        return;
      }
    }
    $('#folderInput').click();
  }

  /** Registers files chosen through the fallback <input webkitdirectory>. */
  function addFromInput(input) {
    const files = [...input.files];
    input.value = '';
    if (!files.length) return;
    const name = (files[0].webkitRelativePath || files[0].name).split('/')[0] || 'Folder';
    add(name, files.map(f => {
      const rel = f.webkitRelativePath || f.name;
      return { path: rel.startsWith(name + '/') ? rel.slice(name.length + 1) : rel, name: f.name, handle: null, file: f };
    }));
  }

  /** Removes a folder from the explorer. */
  function close(id) {
    const i = roots.findIndex(r => r.id === id);
    if (i >= 0) { roots.splice(i, 1); changed(); }
  }

  /** Expands or collapses a folder or subdirectory in the explorer. */
  function toggle(id, path) {
    const f = roots.find(r => r.id === id);
    if (!f) return;
    f.collapsed.has(path) ? f.collapsed.delete(path) : f.collapsed.add(path);
    changed();
  }

  /** Opens (or focuses) the document for a file inside a folder. */
  async function openFile(id, path) {
    const folder = roots.find(r => r.id === id);
    const entry = folder && folder.entries.find(e => e.path === path);
    if (!entry) return;
    for (const d of Docs.list) {
      if (d.folderId === id && d.folderPath === path) { Docs.activate(d); return; }
      if (entry.handle && d.handle && d.handle.isSameEntry && await d.handle.isSameEntry(entry.handle)) { Docs.activate(d); return; }
    }
    const doc = await Files.openFile(entry.file, entry.handle);
    if (doc) { doc.folderId = id; doc.folderPath = path; changed(); }
  }

  /** Builds a nested directory tree from the flat, sorted entry list. */
  function tree(entries) {
    const root = { dirs: new Map(), files: [] };
    entries.forEach(e => {
      const parts = e.path.split('/');
      let node = root;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node.dirs.has(parts[i])) node.dirs.set(parts[i], { dirs: new Map(), files: [] });
        node = node.dirs.get(parts[i]);
      }
      node.files.push(e);
    });
    return root;
  }

  /** Renders the nested <li> markup for one level of a folder tree. */
  function nodes(node, folder, prefix) {
    const dirs = [...node.dirs.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const files = node.files.slice().sort((a, b) => a.name.localeCompare(b.name));
    const dirHtml = dirs.map(([name, child]) => {
      const path = prefix ? prefix + '/' + name : name;
      const open = !folder.collapsed.has(path);
      return `<li><button class="sb-folder sb-subfolder" data-folder-toggle="${folder.id}" data-path="${esc(path)}" aria-expanded="${open}"><i class="bi bi-chevron-down" aria-hidden="true"></i><i class="bi bi-folder2" aria-hidden="true"></i>${esc(name)}</button><ul class="sb-list">${nodes(child, folder, path)}</ul></li>`;
    }).join('');
    const fileHtml = files.map(e => {
      const doc = Docs.list.find(d => d.folderId === folder.id && d.folderPath === e.path);
      const lang = Langs.detect(e.name);
      const dirty = doc && (doc.forceDirty || !doc.sessions[0].getUndoManager().isClean()) ? ' dirty' : '';
      return `<li><button class="sb-file${dirty}" data-folder-file="${folder.id}" data-path="${esc(e.path)}"${doc ? ` data-id="${doc.id}"` : ''} aria-label="${esc(e.name)}"><i class="bi ${Langs.icon(lang)}" style="color:${Langs.color(lang)}" aria-hidden="true"></i><span class="nm">${esc(e.name)}</span><span class="dot" aria-hidden="true"></span></button></li>`;
    }).join('');
    return dirHtml + fileHtml;
  }

  /** Renders every opened folder as a collapsible group for the sidebar. */
  function renderHTML() {
    return roots.map(f => {
      const open = !f.collapsed.has('');
      return `<button class="sb-folder" data-folder-toggle="${f.id}" data-path="" aria-expanded="${open}"><i class="bi bi-chevron-down" aria-hidden="true"></i><i class="bi bi-folder2-open" aria-hidden="true"></i>${esc(f.name)} <span style="font-weight:400;color:var(--faint)">${f.entries.length}</span><span class="sb-close" data-folder-close="${f.id}" role="button" aria-label="Close folder" title="Close folder">×</span></button><ul class="sb-list">${nodes(tree(f.entries), f, '')}</ul>`;
    }).join('');
  }

  $('#folderInput').addEventListener('change', e => addFromInput(e.target));

  return { open, close, toggle, openFile, renderHTML, get count() { return roots.length; } };
})();
