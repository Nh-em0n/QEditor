/* Sublime Web — configuration, Ace setup, and shared constants. */
if (!window.ace || !window.bootstrap) {
  document.body.insertAdjacentHTML('afterbegin',
    '<div style="position:fixed;inset:0;display:grid;place-items:center;z-index:9999;background:#1e1e1e;color:#ddd;font:15px sans-serif;text-align:center;padding:24px">' +
    'The editor could not load its local libraries (Ace / Bootstrap).<br>Check that the vendor/ folder is present and reload.</div>');
  throw new Error('Ace/Bootstrap not available');
}

/* =====================================================================
   1. CONFIG
   ===================================================================== */
/** Builds a CSS font-family stack from a font name and fallback fonts. */
const mono = (name, rest = 'Consolas,"Cascadia Mono",Menlo,monospace') => `"${name}",${rest}`;
export const CONFIG = {
  ACE_BASE: './vendor/ace/',
  LS_PREFIX: 'sx.',
  APP_NAME: 'Sublime Web',
  DEFAULTS: {
    theme: null, fontSize: 14, fontFamily: 'JetBrains Mono', lineHeight: 1.6, ligatures: true,
    wrap: 'off', lastWrap: 'window', tabSize: 4, softTabs: true,
    whitespace: false, minimap: true, sidebar: true, sidebarWidth: 240, statusbar: true, header: true
  },
  LANGS: [
    { id: 'text',       name: 'Plain Text', mode: 'plain_text', exts: ['txt', 'log', 'text'],            icon: 'bi-filetype-txt',  color: '#8b949e' },
    { id: 'javascript', name: 'JavaScript', mode: 'javascript', exts: ['js', 'mjs', 'cjs', 'jsx'],       icon: 'bi-filetype-js',   color: '#f1e05a' },
    { id: 'typescript', name: 'TypeScript', mode: 'typescript', exts: ['ts', 'tsx', 'mts', 'cts'],       icon: 'bi-filetype-tsx',  color: '#3b8eea' },
    { id: 'html',       name: 'HTML',       mode: 'html',       exts: ['html', 'htm', 'xhtml'],          icon: 'bi-filetype-html', color: '#e8663d' },
    { id: 'css',        name: 'CSS',        mode: 'css',        exts: ['css'],                           icon: 'bi-filetype-css',  color: '#9a7bd8' },
    { id: 'json',       name: 'JSON',       mode: 'json',       exts: ['json', 'jsonc', 'webmanifest'],  icon: 'bi-filetype-json', color: '#cbcb41' },
    { id: 'python',     name: 'Python',     mode: 'python',     exts: ['py', 'pyw'],                     icon: 'bi-filetype-py',   color: '#4b8bbe' },
    { id: 'markdown',   name: 'Markdown',   mode: 'markdown',   exts: ['md', 'markdown', 'mdx'],         icon: 'bi-filetype-md',   color: '#519aba' },
    { id: 'sql',        name: 'SQL',        mode: 'sql',        exts: ['sql'],                           icon: 'bi-filetype-sql',  color: '#e38c00' },
    { id: 'php',        name: 'PHP',        mode: 'php',        exts: ['php', 'phtml'],                  icon: 'bi-filetype-php',  color: '#8892bf' },
    { id: 'xml',        name: 'XML',        mode: 'xml',        exts: ['xml', 'svg', 'xsd', 'xsl', 'plist'], icon: 'bi-filetype-xml', color: '#4a9fd8' },
    { id: 'yaml',       name: 'YAML',       mode: 'yaml',       exts: ['yml', 'yaml'],                   icon: 'bi-filetype-yml',  color: '#e06c75' }
  ],
  THEMES: [
    { id: 'monokai',         name: 'Monokai',         dark: true,  ace: 'monokai',              bg: '#272822', fg: '#f8f8f2', accent: '#a6e22e' },
    { id: 'one_dark',        name: 'One Dark',        dark: true,  ace: 'one_dark',             bg: '#282c34', fg: '#abb2bf', accent: '#61afef' },
    { id: 'dracula',         name: 'Dracula',         dark: true,  ace: 'dracula',              bg: '#282a36', fg: '#f8f8f2', accent: '#bd93f9' },
    { id: 'solarized_dark',  name: 'Solarized Dark',  dark: true,  ace: 'solarized_dark',       bg: '#002b36', fg: '#93a1a1', accent: '#2aa198' },
    { id: 'solarized_light', name: 'Solarized Light', dark: false, ace: 'solarized_light',      bg: '#fdf6e3', fg: '#586e75', accent: '#268bd2' },
    { id: 'github_light',    name: 'GitHub Light',    dark: false, ace: 'github_light_default', bg: '#ffffff', fg: '#24292f', accent: '#0969da' },
    { id: 'nord',            name: 'Nord',            dark: true,  ace: 'nord_dark',            bg: '#2e3440', fg: '#d8dee9', accent: '#88c0d0' },
    { id: 'tomorrow_night',  name: 'Tomorrow Night',  dark: true,  ace: 'tomorrow_night',       bg: '#1d1f21', fg: '#c5c8c6', accent: '#81a2be' }
  ],
  FONTS: [
    { id: 'JetBrains Mono',  stack: mono('JetBrains Mono') },
    { id: 'Fira Code',       stack: mono('Fira Code') },
    { id: 'Source Code Pro', stack: mono('Source Code Pro') },
    { id: 'Roboto Mono',     stack: mono('Roboto Mono') },
    { id: 'IBM Plex Mono',   stack: mono('IBM Plex Mono') },
    { id: 'Inconsolata',     stack: mono('Inconsolata') },
    { id: 'Space Mono',      stack: mono('Space Mono') },
    { id: 'Ubuntu Mono',     stack: mono('Ubuntu Mono') },
    { id: 'Consolas',        stack: 'Consolas,"Cascadia Mono","SF Mono",Menlo,"Courier New",monospace' },
    { id: 'Courier New',     stack: '"Courier New",Courier,monospace' }
  ],
  WRAPS: [['off', 'Off'], ['window', 'Window Width'], ['80', '80 Columns'], ['100', '100 Columns'], ['120', '120 Columns']],
  /** Pane layouts ("Origami"): each layout is a CSS grid-template-areas matrix of panes p0..p3. */
  LAYOUTS: [
    { id: 'single', name: 'Single Pane',          areas: [['p0']],                       key: 'Shift+Alt+1' },
    { id: 'cols2',  name: 'Two Columns',          areas: [['p0', 'p1']],                 key: 'Shift+Alt+2' },
    { id: 'cols3',  name: 'Three Columns',        areas: [['p0', 'p1', 'p2']],           key: 'Shift+Alt+3' },
    { id: 'rows2',  name: 'Two Rows',             areas: [['p0'], ['p1']],               key: 'Shift+Alt+4' },
    { id: 'grid4',  name: 'Grid (2 × 2)',         areas: [['p0', 'p1'], ['p2', 'p3']],   key: 'Shift+Alt+5' },
    { id: 'rows3',  name: 'Three Rows',           areas: [['p0'], ['p1'], ['p2']],       key: 'Shift+Alt+6' },
    { id: 'left2',  name: 'One Left, Two Right',  areas: [['p0', 'p1'], ['p0', 'p2']],   key: 'Shift+Alt+7' },
    { id: 'top2',   name: 'One Top, Two Bottom',  areas: [['p0', 'p0'], ['p1', 'p2']],   key: 'Shift+Alt+8' }
  ],
  MENUS: {
    File: ['file.new', 'file.open', 'file.openFolder', 'file.save', 'file.saveAs', '-', 'file.rename', 'file.close', 'file.closeOthers', 'file.closeAll'],
    Edit: ['edit.undo', 'edit.redo', '-', 'sel.all', '-', 'find.find', 'find.replace', '-', 'palette.commands'],
    View: ['view.sidebar', 'view.minimap', 'view.statusbar', 'view.header', 'view.whitespace', 'view.wrap', 'view.distraction', '-', 'view.zoomIn', 'view.zoomOut', 'view.zoomReset', '-', 'prefs.open', 'view.ligatures', 'theme.pick'],
    Layout: ['layout.single', 'layout.cols2', 'layout.cols3', 'layout.rows2', 'layout.rows3', 'layout.grid4', 'layout.left2', 'layout.top2', '-', 'view.focusNext', 'view.focusPrev', 'pane.openNext'],
    Syntax: [],   // filled from LANGS below
    Goto: ['goto.anything', 'goto.symbol', 'goto.line'],
    Help: ['help.shortcuts', 'keymap.reset']
  }
};
CONFIG.MENUS.Syntax = CONFIG.LANGS.map(l => 'lang.' + l.id);
CONFIG.LAYOUTS.forEach(L => { L.n = new Set(L.areas.flat()).size; });
ace.config.set('basePath', CONFIG.ACE_BASE);
export const AceRange = ace.require('ace/range').Range;
export const AceSearch = ace.require('ace/search').Search;
export const AceUndoManager = ace.require('ace/undomanager').UndoManager;
export const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
export const MAX_PANES = 4;
