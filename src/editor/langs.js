/* Language modes, font stacks, and go-to-symbol extraction. */
import { CONFIG } from "./config.js";
import { S } from "./state.js";

/* =====================================================================
   6. LANGUAGES, FONTS, SYMBOLS
   ===================================================================== */
/** Language registry: detects modes from filenames and exposes display metadata. */
export const Langs = (() => {
  const byId = new Map(CONFIG.LANGS.map(l => [l.id, l]));
  const byExt = new Map();
  CONFIG.LANGS.forEach(l => l.exts.forEach(e => byExt.set(e, l.id)));
  return {
    byId, list: CONFIG.LANGS,
    /** Detects a language id from a file name's extension. */
    detect(name) { const m = /\.([^.\/\\]+)$/.exec(name || ''); return (m && byExt.get(m[1].toLowerCase())) || 'text'; },
    /** Checks whether a file name has an extension mapped to a known language. */
    hasKnownExt(name) { const m = /\.([^.\/\\]+)$/.exec(name || ''); return !!(m && byExt.has(m[1].toLowerCase())); },
    /** Returns the display name for a language id, falling back to plain text. */
    name(id) { return (byId.get(id) || byId.get('text')).name; },
    /** Returns the Ace mode path for a language id, falling back to plain text. */
    mode(id) { return 'ace/mode/' + (byId.get(id) || byId.get('text')).mode; },
    /** Returns the icon class for a language id, falling back to plain text. */
    icon(id) { return (byId.get(id) || byId.get('text')).icon; },
    /** Returns the accent color for a language id, falling back to plain text. */
    color(id) { return (byId.get(id) || byId.get('text')).color; }
  };
})();
export const Fonts = {
  /** Finds the font preset matching an id. */
  known: id => CONFIG.FONTS.find(f => f.id === id),
  /** CSS font stack for a preset or any custom family name. */
  stack(id) {
    const f = this.known(id);
    if (f) return f.stack;
    const clean = String(id || '').replace(/["';{}<>\\]/g, '').trim();
    return clean ? `"${clean}",${CONFIG.FONTS[0].stack}` : CONFIG.FONTS[0].stack;
  },
  /** Ask the browser to fetch a web font, then let Ace re-measure the glyph width. */
  ensure(id, cb) {
    const name = String(id || '').replace(/["']/g, '');
    if (!document.fonts || !name) return;
    Promise.all([document.fonts.load(`${S.fontSize}px "${name}"`), document.fonts.load(`bold ${S.fontSize}px "${name}"`)])
      .catch(() => {}).then(() => cb && cb());
  }
};
/** Regex-based symbol extraction for "go to symbol" (@). Returns [{name, row, kind, level}] */
export function extractSymbols(lines, lang) {
  const out = [];
  const CTRL = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'else', 'with', 'super', 'constructor_']);
  /** Adds an extracted symbol to the result list. */
  const push = (name, row, kind, level = 0) => out.push({ name, row, kind, level });
  let inFence = false;
  lines.forEach((ln, row) => {
    let m;
    switch (lang) {
      case 'javascript': case 'typescript':
        if ((m = /^\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/.exec(ln))) return push(m[1], row, 'class');
        if (lang === 'typescript' && (m = /^\s*(?:export\s+)?(?:declare\s+)?(?:interface|type|enum)\s+([A-Za-z_$][\w$]*)/.exec(ln))) return push(m[1], row, 'type');
        if ((m = /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/.exec(ln))) return push(m[1], row, 'function');
        if ((m = /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*(?::\s*[^=]+)?=>|[A-Za-z_$][\w$]*\s*=>)/.exec(ln))) return push(m[1], row, 'function');
        if ((m = /^\s+(?:(?:public|private|protected|static|readonly|override)\s+)*(?:async\s+)?(?:get\s+|set\s+)?\*?([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{\s*$/.exec(ln)) && !CTRL.has(m[1])) return push(m[1], row, 'method', 1);
        break;
      case 'python':
        if ((m = /^(\s*)class\s+(\w+)/.exec(ln))) return push(m[2], row, 'class', Math.min(2, m[1].length >> 2));
        if ((m = /^(\s*)(?:async\s+)?def\s+(\w+)/.exec(ln))) return push(m[2], row, m[1].length ? 'method' : 'function', Math.min(2, m[1].length >> 2));
        break;
      case 'php':
        if ((m = /^\s*(?:abstract\s+|final\s+)?(?:class|interface|trait|enum)\s+(\w+)/.exec(ln))) return push(m[1], row, 'class');
        if ((m = /^\s*(?:(?:public|private|protected|static|abstract|final)\s+)*function\s+&?(\w+)/.exec(ln))) return push(m[1], row, 'function');
        break;
      case 'css':
        if ((m = /^\s*(@(?:media|keyframes|supports|font-face)[^{]*)\{/.exec(ln))) return push(m[1].trim(), row, 'type');
        if ((m = /^\s*([^@\s{}\/][^{}]*?)\s*\{\s*$/.exec(ln))) return push(m[1], row, 'selector');
        break;
      case 'markdown':
        if (/^\s*(```|~~~)/.test(ln)) { inFence = !inFence; return; }
        if (!inFence && (m = /^(#{1,6})\s+(.+?)\s*#*$/.exec(ln))) return push(m[2], row, 'heading', m[1].length - 1);
        break;
      case 'sql':
        if ((m = /^\s*create\s+(?:or\s+replace\s+)?(?:temp(?:orary)?\s+)?(table|view|function|procedure|index|trigger)\s+(?:if\s+not\s+exists\s+)?([\w."`\[\]]+)/i.exec(ln))) return push(m[2], row, m[1].toLowerCase() === 'table' ? 'class' : 'function');
        break;
      case 'yaml':
        if ((m = /^([A-Za-z0-9_.\-"']+):(\s|$)/.exec(ln))) return push(m[1], row, 'selector');
        break;
      case 'json':
        if ((m = /^(?: {2}|\t)"([^"]+)"\s*:/.exec(ln))) return push(m[1], row, 'selector');
        break;
      case 'html':
        if ((m = /<h([1-3])\b[^>]*>([^<]+)/i.exec(ln))) return push(m[2].trim(), row, 'heading', m[1] - 1);
        if ((m = /<(\w+)[^>]*\sid=["']([^"']+)["']/.exec(ln))) return push('#' + m[2] + '  <' + m[1] + '>', row, 'selector');
        break;
      case 'xml':
        if ((m = /<(\w[\w:.-]*)[^>]*\s(?:id|name)=["']([^"']+)["']/.exec(ln))) return push(m[2] + '  <' + m[1] + '>', row, 'selector');
        break;
    }
  });
  return out;
}
export const SYM_BADGE = { class: 'C', function: 'ƒ', method: 'm', type: 'T', selector: '#', heading: 'H' };
