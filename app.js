(() => {
  // src/editor/config.js
  if (!window.ace || !window.bootstrap) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div style="position:fixed;inset:0;display:grid;place-items:center;z-index:9999;background:#1e1e1e;color:#ddd;font:15px sans-serif;text-align:center;padding:24px">The editor could not load its local libraries (Ace / Bootstrap).<br>Check that the vendor/ folder is present and reload.</div>'
    );
    throw new Error("Ace/Bootstrap not available");
  }
  var mono = (name, rest = 'Consolas,"Cascadia Mono",Menlo,monospace') => `"${name}",${rest}`;
  var CONFIG = {
    ACE_BASE: "./vendor/ace/",
    LS_PREFIX: "sx.",
    APP_NAME: "Sublime Web",
    DEFAULTS: {
      theme: null,
      fontSize: 14,
      fontFamily: "JetBrains Mono",
      lineHeight: 1.6,
      ligatures: true,
      wrap: "off",
      lastWrap: "window",
      tabSize: 4,
      softTabs: true,
      whitespace: false,
      minimap: true,
      sidebar: true,
      sidebarWidth: 240,
      statusbar: true,
      header: true
    },
    LANGS: [
      { id: "text", name: "Plain Text", mode: "plain_text", exts: ["txt", "log", "text"], icon: "bi-filetype-txt", color: "#8b949e" },
      { id: "javascript", name: "JavaScript", mode: "javascript", exts: ["js", "mjs", "cjs", "jsx"], icon: "bi-filetype-js", color: "#f1e05a" },
      { id: "typescript", name: "TypeScript", mode: "typescript", exts: ["ts", "tsx", "mts", "cts"], icon: "bi-filetype-tsx", color: "#3b8eea" },
      { id: "html", name: "HTML", mode: "html", exts: ["html", "htm", "xhtml"], icon: "bi-filetype-html", color: "#e8663d" },
      { id: "css", name: "CSS", mode: "css", exts: ["css"], icon: "bi-filetype-css", color: "#9a7bd8" },
      { id: "json", name: "JSON", mode: "json", exts: ["json", "jsonc", "webmanifest"], icon: "bi-filetype-json", color: "#cbcb41" },
      { id: "python", name: "Python", mode: "python", exts: ["py", "pyw"], icon: "bi-filetype-py", color: "#4b8bbe" },
      { id: "markdown", name: "Markdown", mode: "markdown", exts: ["md", "markdown", "mdx"], icon: "bi-filetype-md", color: "#519aba" },
      { id: "sql", name: "SQL", mode: "sql", exts: ["sql"], icon: "bi-filetype-sql", color: "#e38c00" },
      { id: "php", name: "PHP", mode: "php", exts: ["php", "phtml"], icon: "bi-filetype-php", color: "#8892bf" },
      { id: "xml", name: "XML", mode: "xml", exts: ["xml", "svg", "xsd", "xsl", "plist"], icon: "bi-filetype-xml", color: "#4a9fd8" },
      { id: "yaml", name: "YAML", mode: "yaml", exts: ["yml", "yaml"], icon: "bi-filetype-yml", color: "#e06c75" }
    ],
    THEMES: [
      { id: "monokai", name: "Monokai", dark: true, ace: "monokai", bg: "#272822", fg: "#f8f8f2", accent: "#a6e22e" },
      { id: "one_dark", name: "One Dark", dark: true, ace: "one_dark", bg: "#282c34", fg: "#abb2bf", accent: "#61afef" },
      { id: "dracula", name: "Dracula", dark: true, ace: "dracula", bg: "#282a36", fg: "#f8f8f2", accent: "#bd93f9" },
      { id: "solarized_dark", name: "Solarized Dark", dark: true, ace: "solarized_dark", bg: "#002b36", fg: "#93a1a1", accent: "#2aa198" },
      { id: "solarized_light", name: "Solarized Light", dark: false, ace: "solarized_light", bg: "#fdf6e3", fg: "#586e75", accent: "#268bd2" },
      { id: "github_light", name: "GitHub Light", dark: false, ace: "github_light_default", bg: "#ffffff", fg: "#24292f", accent: "#0969da" },
      { id: "nord", name: "Nord", dark: true, ace: "nord_dark", bg: "#2e3440", fg: "#d8dee9", accent: "#88c0d0" },
      { id: "tomorrow_night", name: "Tomorrow Night", dark: true, ace: "tomorrow_night", bg: "#1d1f21", fg: "#c5c8c6", accent: "#81a2be" }
    ],
    FONTS: [
      { id: "JetBrains Mono", stack: mono("JetBrains Mono") },
      { id: "Fira Code", stack: mono("Fira Code") },
      { id: "Source Code Pro", stack: mono("Source Code Pro") },
      { id: "Roboto Mono", stack: mono("Roboto Mono") },
      { id: "IBM Plex Mono", stack: mono("IBM Plex Mono") },
      { id: "Inconsolata", stack: mono("Inconsolata") },
      { id: "Space Mono", stack: mono("Space Mono") },
      { id: "Ubuntu Mono", stack: mono("Ubuntu Mono") },
      { id: "Consolas", stack: 'Consolas,"Cascadia Mono","SF Mono",Menlo,"Courier New",monospace' },
      { id: "Courier New", stack: '"Courier New",Courier,monospace' }
    ],
    WRAPS: [["off", "Off"], ["window", "Window Width"], ["80", "80 Columns"], ["100", "100 Columns"], ["120", "120 Columns"]],
    /** Pane layouts ("Origami"): each layout is a CSS grid-template-areas matrix of panes p0..p3. */
    LAYOUTS: [
      { id: "single", name: "Single Pane", areas: [["p0"]], key: "Shift+Alt+1" },
      { id: "cols2", name: "Two Columns", areas: [["p0", "p1"]], key: "Shift+Alt+2" },
      { id: "cols3", name: "Three Columns", areas: [["p0", "p1", "p2"]], key: "Shift+Alt+3" },
      { id: "rows2", name: "Two Rows", areas: [["p0"], ["p1"]], key: "Shift+Alt+4" },
      { id: "grid4", name: "Grid (2 \xD7 2)", areas: [["p0", "p1"], ["p2", "p3"]], key: "Shift+Alt+5" },
      { id: "rows3", name: "Three Rows", areas: [["p0"], ["p1"], ["p2"]], key: "Shift+Alt+6" },
      { id: "left2", name: "One Left, Two Right", areas: [["p0", "p1"], ["p0", "p2"]], key: "Shift+Alt+7" },
      { id: "top2", name: "One Top, Two Bottom", areas: [["p0", "p0"], ["p1", "p2"]], key: "Shift+Alt+8" }
    ],
    MENUS: {
      File: ["file.new", "file.open", "file.openFolder", "file.save", "file.saveAs", "-", "file.rename", "file.close", "file.closeOthers", "file.closeAll"],
      Edit: ["edit.undo", "edit.redo", "-", "sel.all", "-", "find.find", "find.replace", "-", "palette.commands"],
      View: ["view.sidebar", "view.minimap", "view.statusbar", "view.header", "view.whitespace", "view.wrap", "view.distraction", "-", "view.zoomIn", "view.zoomOut", "view.zoomReset", "-", "prefs.open", "view.ligatures", "theme.pick"],
      Layout: ["layout.single", "layout.cols2", "layout.cols3", "layout.rows2", "layout.rows3", "layout.grid4", "layout.left2", "layout.top2", "-", "view.focusNext", "view.focusPrev", "pane.openNext"],
      Syntax: [],
      // filled from LANGS below
      Goto: ["goto.anything", "goto.symbol", "goto.line"],
      Help: ["help.shortcuts", "keymap.reset"]
    }
  };
  CONFIG.MENUS.Syntax = CONFIG.LANGS.map((l) => "lang." + l.id);
  CONFIG.LAYOUTS.forEach((L) => {
    L.n = new Set(L.areas.flat()).size;
  });
  ace.config.set("basePath", CONFIG.ACE_BASE);
  var AceRange = ace.require("ace/range").Range;
  var AceSearch = ace.require("ace/search").Search;
  var AceUndoManager = ace.require("ace/undomanager").UndoManager;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  var MAX_PANES = 4;

  // src/editor/util.js
  var $ = (s, r = document) => r.querySelector(s);
  var $$ = (s, r = document) => [...r.querySelectorAll(s)];
  var esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var debounce = (fn, ms) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  };
  var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  var rafOnce = (fn) => {
    let q = 0;
    return () => {
      if (q) return;
      q = requestAnimationFrame(() => {
        q = 0;
        fn();
      });
    };
  };
  var isTopLevel = (() => {
    try {
      return window.top === window.self;
    } catch (e) {
      return false;
    }
  })();
  var Store = (() => {
    const mem = {};
    let ok = true;
    try {
      localStorage.setItem("__sx_t", "1");
      localStorage.removeItem("__sx_t");
    } catch (e) {
      ok = false;
    }
    return {
      /** Reads a stored value, falling back to the in-memory map or a default. */
      get(k, d = null) {
        try {
          if (ok) {
            const v = localStorage.getItem(CONFIG.LS_PREFIX + k);
            if (v !== null) return v;
          }
        } catch (e) {
        }
        return k in mem ? mem[k] : d;
      },
      /** Writes a value to the in-memory map and to storage. */
      set(k, v) {
        mem[k] = v;
        try {
          if (ok) localStorage.setItem(CONFIG.LS_PREFIX + k, v);
          return true;
        } catch (e) {
          return false;
        }
      },
      /** Removes a key from the in-memory map and from storage. */
      remove(k) {
        delete mem[k];
        try {
          if (ok) localStorage.removeItem(CONFIG.LS_PREFIX + k);
        } catch (e) {
        }
      },
      /** Reads and parses a JSON value from storage, returning a default on failure. */
      getJSON(k, d) {
        try {
          const v = this.get(k);
          return v == null ? d : JSON.parse(v);
        } catch (e) {
          return d;
        }
      },
      /** Serializes a value as JSON and stores it. */
      setJSON(k, v) {
        try {
          return this.set(k, JSON.stringify(v));
        } catch (e) {
          return false;
        }
      }
    };
  })();

  // src/editor/toast.js
  function toast(msg, { icon, type = "info", ms = 1800 } = {}) {
    const host = $("#toasts");
    while (host.children.length > 3) host.firstChild.remove();
    const ic = icon || (type === "error" ? "bi-x-octagon" : type === "warn" ? "bi-exclamation-triangle" : "bi-check2-circle");
    const el = document.createElement("div");
    el.className = "sx-toast " + type;
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = `<i class="bi ${ic}" aria-hidden="true"></i><span>${esc(msg)}</span>`;
    host.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }
  var lastCopyToast = 0;
  var copyToast = () => {
    const n = Date.now();
    if (n - lastCopyToast > 600) {
      lastCopyToast = n;
      toast("Copied", { icon: "bi-clipboard-check", ms: 1200 });
    }
  };

  // src/editor/commands.js
  var Commands = {
    list: [],
    byId: /* @__PURE__ */ new Map(),
    /** Adds a command definition to the registry and indexes it by id. */
    register(def) {
      if (this.byId.has(def.id)) console.warn("Duplicate command id", def.id);
      this.list.push(def);
      this.byId.set(def.id, def);
      return def;
    },
    /** Formats a command's category and title for display. */
    label(c) {
      return c.category ? `${c.category}: ${c.title}` : c.title;
    },
    /** Runs a registered command by id and reports any errors as a toast. */
    exec(id, opts = {}) {
      const c = this.byId.get(id);
      if (!c) return;
      if (opts.recent) Recent.push(id);
      try {
        const r = c.run(opts.args);
        if (r && typeof r.catch === "function") r.catch((err) => {
          console.error(err);
          toast(String(err && err.message || err), { type: "error" });
        });
      } catch (err) {
        console.error(err);
        toast(String(err && err.message || err), { type: "error" });
      }
    }
  };
  var Recent = {
    /** Reads the list of recently used command ids from storage. */
    get() {
      return Store.getJSON("recent", []);
    },
    /** Records a command as most recently used, keeping at most 25 ids. */
    push(id) {
      const a = this.get().filter((x) => x !== id);
      a.unshift(id);
      Store.setJSON("recent", a.slice(0, 25));
    }
  };
  var cmd = (id, category, title, shortcut, run, extra) => Commands.register(Object.assign({ id, category, title, shortcut: shortcut || "", run }, extra));

  // src/editor/state.js
  var S = Object.assign({}, CONFIG.DEFAULTS, Store.getJSON("settings", {}));
  if (window.innerWidth < 768) S.sidebar = false;
  var saveSettings = () => Store.setJSON("settings", S);
  var UIState = { layout: "single", zen: false };

  // src/editor/langs.js
  var Langs = (() => {
    const byId = new Map(CONFIG.LANGS.map((l) => [l.id, l]));
    const byExt = /* @__PURE__ */ new Map();
    CONFIG.LANGS.forEach((l) => l.exts.forEach((e) => byExt.set(e, l.id)));
    return {
      byId,
      list: CONFIG.LANGS,
      /** Detects a language id from a file name's extension. */
      detect(name) {
        const m = /\.([^.\/\\]+)$/.exec(name || "");
        return m && byExt.get(m[1].toLowerCase()) || "text";
      },
      /** Checks whether a file name has an extension mapped to a known language. */
      hasKnownExt(name) {
        const m = /\.([^.\/\\]+)$/.exec(name || "");
        return !!(m && byExt.has(m[1].toLowerCase()));
      },
      /** Returns the display name for a language id, falling back to plain text. */
      name(id) {
        return (byId.get(id) || byId.get("text")).name;
      },
      /** Returns the Ace mode path for a language id, falling back to plain text. */
      mode(id) {
        return "ace/mode/" + (byId.get(id) || byId.get("text")).mode;
      },
      /** Returns the icon class for a language id, falling back to plain text. */
      icon(id) {
        return (byId.get(id) || byId.get("text")).icon;
      },
      /** Returns the accent color for a language id, falling back to plain text. */
      color(id) {
        return (byId.get(id) || byId.get("text")).color;
      }
    };
  })();
  var Fonts = {
    /** Finds the font preset matching an id. */
    known: (id) => CONFIG.FONTS.find((f) => f.id === id),
    /** CSS font stack for a preset or any custom family name. */
    stack(id) {
      const f = this.known(id);
      if (f) return f.stack;
      const clean = String(id || "").replace(/["';{}<>\\]/g, "").trim();
      return clean ? `"${clean}",${CONFIG.FONTS[0].stack}` : CONFIG.FONTS[0].stack;
    },
    /** Ask the browser to fetch a web font, then let Ace re-measure the glyph width. */
    ensure(id, cb) {
      const name = String(id || "").replace(/["']/g, "");
      if (!document.fonts || !name) return;
      Promise.all([document.fonts.load(`${S.fontSize}px "${name}"`), document.fonts.load(`bold ${S.fontSize}px "${name}"`)]).catch(() => {
      }).then(() => cb && cb());
    }
  };
  function extractSymbols(lines, lang) {
    const out = [];
    const CTRL = /* @__PURE__ */ new Set(["if", "for", "while", "switch", "catch", "function", "return", "else", "with", "super", "constructor_"]);
    const push = (name, row, kind, level = 0) => out.push({ name, row, kind, level });
    let inFence = false;
    lines.forEach((ln, row) => {
      let m;
      switch (lang) {
        case "javascript":
        case "typescript":
          if (m = /^\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/.exec(ln)) return push(m[1], row, "class");
          if (lang === "typescript" && (m = /^\s*(?:export\s+)?(?:declare\s+)?(?:interface|type|enum)\s+([A-Za-z_$][\w$]*)/.exec(ln))) return push(m[1], row, "type");
          if (m = /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/.exec(ln)) return push(m[1], row, "function");
          if (m = /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*(?::\s*[^=]+)?=>|[A-Za-z_$][\w$]*\s*=>)/.exec(ln)) return push(m[1], row, "function");
          if ((m = /^\s+(?:(?:public|private|protected|static|readonly|override)\s+)*(?:async\s+)?(?:get\s+|set\s+)?\*?([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{\s*$/.exec(ln)) && !CTRL.has(m[1])) return push(m[1], row, "method", 1);
          break;
        case "python":
          if (m = /^(\s*)class\s+(\w+)/.exec(ln)) return push(m[2], row, "class", Math.min(2, m[1].length >> 2));
          if (m = /^(\s*)(?:async\s+)?def\s+(\w+)/.exec(ln)) return push(m[2], row, m[1].length ? "method" : "function", Math.min(2, m[1].length >> 2));
          break;
        case "php":
          if (m = /^\s*(?:abstract\s+|final\s+)?(?:class|interface|trait|enum)\s+(\w+)/.exec(ln)) return push(m[1], row, "class");
          if (m = /^\s*(?:(?:public|private|protected|static|abstract|final)\s+)*function\s+&?(\w+)/.exec(ln)) return push(m[1], row, "function");
          break;
        case "css":
          if (m = /^\s*(@(?:media|keyframes|supports|font-face)[^{]*)\{/.exec(ln)) return push(m[1].trim(), row, "type");
          if (m = /^\s*([^@\s{}\/][^{}]*?)\s*\{\s*$/.exec(ln)) return push(m[1], row, "selector");
          break;
        case "markdown":
          if (/^\s*(```|~~~)/.test(ln)) {
            inFence = !inFence;
            return;
          }
          if (!inFence && (m = /^(#{1,6})\s+(.+?)\s*#*$/.exec(ln))) return push(m[2], row, "heading", m[1].length - 1);
          break;
        case "sql":
          if (m = /^\s*create\s+(?:or\s+replace\s+)?(?:temp(?:orary)?\s+)?(table|view|function|procedure|index|trigger)\s+(?:if\s+not\s+exists\s+)?([\w."`\[\]]+)/i.exec(ln)) return push(m[2], row, m[1].toLowerCase() === "table" ? "class" : "function");
          break;
        case "yaml":
          if (m = /^([A-Za-z0-9_.\-"']+):(\s|$)/.exec(ln)) return push(m[1], row, "selector");
          break;
        case "json":
          if (m = /^(?: {2}|\t)"([^"]+)"\s*:/.exec(ln)) return push(m[1], row, "selector");
          break;
        case "html":
          if (m = /<h([1-3])\b[^>]*>([^<]+)/i.exec(ln)) return push(m[2].trim(), row, "heading", m[1] - 1);
          if (m = /<(\w+)[^>]*\sid=["']([^"']+)["']/.exec(ln)) return push("#" + m[2] + "  <" + m[1] + ">", row, "selector");
          break;
        case "xml":
          if (m = /<(\w[\w:.-]*)[^>]*\s(?:id|name)=["']([^"']+)["']/.exec(ln)) return push(m[2] + "  <" + m[1] + ">", row, "selector");
          break;
      }
    });
    return out;
  }
  var SYM_BADGE = { class: "C", function: "\u0192", method: "m", type: "T", selector: "#", heading: "H" };

  // src/editor/themes.js
  var Themes = (() => {
    const byId = new Map(CONFIG.THEMES.map((t) => [t.id, t]));
    let current = null;
    function initial() {
      if (S.theme && byId.has(S.theme)) return S.theme;
      let dark = true;
      try {
        dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } catch (e) {
      }
      return dark ? "one_dark" : "github_light";
    }
    function apply(id) {
      const t = byId.get(id) || byId.get("monokai");
      const r = document.documentElement;
      r.style.setProperty("--bg", t.bg);
      r.style.setProperty("--fg", t.fg);
      r.style.setProperty("--accent", t.accent);
      r.dataset.mode = t.dark ? "dark" : "light";
      r.setAttribute("data-bs-theme", t.dark ? "dark" : "light");
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = t.bg;
      if (App.panes.length) App.panes.forEach((p) => {
        p.editor.setTheme("ace/theme/" + t.ace);
        p.mm.themeChanged();
      });
    }
    function set(id) {
      if (!byId.has(id)) return;
      current = id;
      S.theme = id;
      saveSettings();
      apply(id);
      Settings.sync();
      toast("Color scheme: " + byId.get(id).name, { icon: "bi-palette", ms: 1200 });
    }
    return {
      /** Initializes the current theme and applies it. */
      init() {
        current = initial();
        apply(current);
      },
      apply,
      set,
      byId,
      /** Re-applies the current theme to undo a live preview. */
      revert() {
        apply(current);
      },
      /** Returns the id of the active theme. */
      get current() {
        return current;
      },
      /** Returns the Ace theme name for the active theme. */
      aceName() {
        return (byId.get(current) || byId.get("monokai")).ace;
      }
    };
  })();

  // src/editor/keys.js
  var Keys = (() => {
    let map = /* @__PURE__ */ new Map(), prefixes = /* @__PURE__ */ new Set();
    let overrides = Store.getJSON("keymap", {});
    let pending = null, pendingTimer = 0;
    const CODE_MAP = { Slash: "/", BracketLeft: "[", BracketRight: "]", Backslash: "\\", Equal: "=", Minus: "-", Comma: ",", Period: ".", Semicolon: ";", Quote: "'", Backquote: "`", Space: "Space", Enter: "Enter", NumpadEnter: "Enter", Escape: "Esc", Tab: "Tab", Backspace: "Backspace", Delete: "Delete", ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right", PageUp: "PageUp", PageDown: "PageDown", Home: "Home", End: "End", NumpadAdd: "+", NumpadSubtract: "-" };
    const KEY_MAP = { ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right", Escape: "Esc", " ": "Space" };
    const MODS = ["Control", "Shift", "Alt", "Meta", "AltGraph"];
    function candidates(e) {
      if (MODS.includes(e.key)) return [];
      const mods = [];
      if (e.ctrlKey || isMac && e.metaKey) mods.push("Ctrl");
      if (e.shiftKey) mods.push("Shift");
      if (e.altKey) mods.push("Alt");
      const c = e.code || "";
      let a = null;
      if (/^Key[A-Z]$/.test(c)) a = c[3];
      else if (/^Digit\d$/.test(c)) a = c[5];
      else if (/^Numpad\d$/.test(c)) a = c[6];
      else if (/^F\d+$/.test(c)) a = c;
      else if (CODE_MAP[c]) a = CODE_MAP[c];
      let b = null;
      const k = e.key;
      if (k) b = k.length === 1 ? k.toUpperCase() : KEY_MAP[k] || k;
      return [...new Set([a, b].filter(Boolean).map((n) => [...mods, n].join("+")))];
    }
    const effective = (id) => id in overrides ? overrides[id] : (Commands.byId.get(id) || {}).shortcut || "";
    function rebuild() {
      map = /* @__PURE__ */ new Map();
      prefixes = /* @__PURE__ */ new Set();
      const add = (sc, id) => {
        if (!sc) return;
        map.set(sc, id);
        const p = sc.split(" ");
        if (p.length > 1) prefixes.add(p[0]);
      };
      Commands.list.forEach((c) => {
        if (!(c.id in overrides)) (c.aliases || []).forEach((a) => add(a, c.id));
      });
      Commands.list.forEach((c) => add(effective(c.id), c.id));
      const kb = $("#palKbd");
      if (kb) kb.textContent = pretty(effective("palette.commands"));
      const tip = (id, sel, label) => {
        const b = $(sel);
        const s = pretty(effective(id));
        if (b) b.title = label + (s ? ` (${s})` : "");
      };
      tip("file.new", "#btnNew", "New File");
      tip("file.new", "#btnNewTab", "New File");
      tip("file.open", "#btnOpen", "Open File");
      tip("file.save", "#btnSave", "Save");
    }
    function persist() {
      Store.setJSON("keymap", overrides);
    }
    function setBinding(id, sc) {
      const def = (Commands.byId.get(id) || {}).shortcut || "";
      const replaced = [];
      if (sc) Commands.list.forEach((c) => {
        if (c.id !== id && effective(c.id) === sc) {
          overrides[c.id] = "";
          replaced.push(c.title);
        }
      });
      if (sc === def) delete overrides[id];
      else overrides[id] = sc;
      persist();
      rebuild();
      return replaced;
    }
    function reset() {
      overrides = {};
      Store.remove("keymap");
      rebuild();
    }
    function setHint(t) {
      const h = $("#sbHint");
      if (h) h.textContent = t;
    }
    function stop(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    function inForeignInput(e) {
      const t = e.target;
      return t && t.closest && t.closest('input,textarea,select,[contenteditable="true"]') && !t.closest(".ace_editor");
    }
    function onKeydown(e) {
      if (e.isComposing) return;
      if (document.body.classList.contains("modal-open")) return;
      const cands = candidates(e);
      if (!cands.length) return;
      if (cands.includes("Esc") && document.querySelector(".dropdown-menu.show")) return;
      if (pending) {
        clearTimeout(pendingTimer);
        const first = pending;
        pending = null;
        setHint("");
        stop(e);
        for (const c of cands) {
          const id = map.get(first + " " + c);
          if (id) {
            Commands.exec(id);
            return;
          }
        }
        return;
      }
      for (const c of cands) {
        const id = map.get(c);
        if (!id) continue;
        const def = Commands.byId.get(id);
        if (def.scope === "editor" && inForeignInput(e)) return;
        stop(e);
        Commands.exec(id);
        return;
      }
      for (const c of cands) {
        if (prefixes.has(c) && !inForeignInput(e)) {
          stop(e);
          pending = c;
          setHint(`(${pretty(c)}) was pressed. Waiting for second key of chord\u2026`);
          pendingTimer = setTimeout(() => {
            pending = null;
            setHint("");
          }, 2200);
          return;
        }
      }
    }
    function parts(chord) {
      const out = [];
      let s = chord;
      for (const m of ["Ctrl+", "Shift+", "Alt+"]) if (s.startsWith(m)) {
        out.push(m.slice(0, -1));
        s = s.slice(m.length);
      }
      out.push(s);
      return out;
    }
    const GLYPH = { Up: "\u2191", Down: "\u2193", Left: "\u2190", Right: "\u2192", Ctrl: isMac ? "\u2318" : "Ctrl", Alt: isMac ? "\u2325" : "Alt", Shift: isMac ? "\u21E7" : "Shift" };
    function pretty(sc) {
      return sc ? sc.split(" ").map((ch) => parts(ch).map((p) => GLYPH[p] || p).join("+")).join(", ") : "";
    }
    function html(sc) {
      if (!sc) return "";
      return sc.split(" ").map((ch) => `<span class="kg">${parts(ch).map((p) => `<kbd>${esc(GLYPH[p] || p)}</kbd>`).join("")}</span>`).join('<span class="then">then</span>');
    }
    window.addEventListener("keydown", onKeydown, true);
    return {
      rebuild,
      effective,
      setBinding,
      reset,
      candidates,
      pretty,
      html,
      /** Reports whether any shortcut overrides are in effect. */
      hasOverrides: () => Object.keys(overrides).length > 0
    };
  })();

  // src/editor/picker.js
  var Pick = (() => {
    const el = $("#picker"), filter = $("#pkFilter"), list = $("#pkList"), titleEl = $("#pkTitle");
    let items = [], shown = [], act = 0, isOpen = false, anchor = null, lastClose = { a: null, t: 0 };
    function close(refocus = true) {
      if (!isOpen) return;
      isOpen = false;
      el.hidden = true;
      lastClose = { a: anchor, t: Date.now() };
      if (refocus) setTimeout(() => App.focus(), 0);
    }
    function render() {
      const q = filter.value.trim().toLowerCase();
      shown = items.filter((i) => !q || i.label.toLowerCase().includes(q));
      if (act >= shown.length || act < 0) act = 0;
      list.innerHTML = shown.length ? shown.map((it, i) => `<li class="pk-item${i === act ? " active" : ""}" role="option" aria-selected="${i === act}" data-i="${i}"><span class="chk">${it.checked ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : ""}</span>${it.icon ? `<span class="pi">${it.icon}</span>` : ""}<span class="pl">${esc(it.label)}</span>${it.sc ? `<span class="sc">${Keys.html(it.sc)}</span>` : ""}</li>`).join("") : '<li class="pk-empty" role="presentation">No matches</li>';
      const a = $(".pk-item.active", list);
      if (a) a.scrollIntoView({ block: "nearest" });
    }
    function place() {
      const r = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
      const left = clamp(r.right - w, 8, Math.max(8, window.innerWidth - w - 8));
      const top = r.top > window.innerHeight / 2 ? Math.max(8, r.top - h - 6) : Math.min(r.bottom + 6, window.innerHeight - h - 8);
      el.style.left = left + "px";
      el.style.top = top + "px";
    }
    function open(anchorEl, { title = "", items: its, filter: withFilter = true }) {
      if (isOpen) close(false);
      if (lastClose.a === anchorEl && Date.now() - lastClose.t < 250) return;
      anchor = anchorEl;
      items = its;
      isOpen = true;
      titleEl.textContent = title;
      titleEl.hidden = !title;
      filter.value = "";
      filter.hidden = !withFilter;
      act = Math.max(0, items.findIndex((i) => i.checked));
      el.hidden = false;
      render();
      place();
      (withFilter ? filter : el).focus({ preventScroll: true });
      const a = $(".pk-item.active", list);
      if (a) a.scrollIntoView({ block: "nearest" });
    }
    function commit(i) {
      const it = shown[i];
      if (!it) return;
      close(false);
      setTimeout(() => {
        try {
          it.run();
        } catch (e) {
          console.error(e);
          toast(String(e.message || e), { type: "error" });
        }
        setTimeout(() => App.focus(), 60);
      }, 0);
    }
    filter.addEventListener("input", () => {
      act = 0;
      render();
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        act = (act + 1) % Math.max(1, shown.length);
        render();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        act = (act - 1 + shown.length) % Math.max(1, shown.length);
        render();
      } else if (e.key === "Enter") {
        e.preventDefault();
        commit(act);
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    });
    list.addEventListener("click", (e) => {
      const li = e.target.closest(".pk-item");
      if (li) commit(+li.dataset.i);
    });
    list.addEventListener("mousemove", (e) => {
      const li = e.target.closest(".pk-item");
      if (li && +li.dataset.i !== act) {
        act = +li.dataset.i;
        $$(".pk-item", list).forEach((x, k) => x.classList.toggle("active", k === act));
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (isOpen && !el.contains(e.target) && !(anchor && anchor.contains(e.target))) close(false);
    }, true);
    window.addEventListener("resize", () => close(false));
    window.addEventListener("blur", () => close(false));
    function fromCommands(ids, opts = {}) {
      return ids.map((id) => Commands.byId.get(id)).filter(Boolean).map((c) => ({
        label: opts.label ? opts.label(c) : c.title,
        checked: !!(c.checked && c.checked()),
        sc: Keys.effective(c.id),
        icon: opts.icon ? opts.icon(c) : "",
        run: () => Commands.exec(c.id, { recent: true })
      }));
    }
    return {
      open,
      close,
      fromCommands,
      /** Reports whether the picker popover is currently open. */
      get isOpen() {
        return isOpen;
      }
    };
  })();

  // src/editor/settings.js
  var Settings = (() => {
    const el = $("#settings"), modal = new bootstrap.Modal(el), q = (id) => document.getElementById(id);
    let built = false;
    function build() {
      q("setFont").innerHTML = CONFIG.FONTS.map((f) => `<option value="${esc(f.id)}" style="font-family:${esc(f.stack)}">${esc(f.id)}</option>`).join("") + '<option value="__custom">Custom\u2026</option>';
      q("setTheme").innerHTML = CONFIG.THEMES.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("");
      q("setWrap").innerHTML = CONFIG.WRAPS.map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join("");
      built = true;
    }
    function sync() {
      if (!built) return;
      const known = Fonts.known(S.fontFamily);
      q("setFont").value = known ? S.fontFamily : "__custom";
      if (document.activeElement !== q("setFontCustom")) q("setFontCustom").value = known ? "" : S.fontFamily;
      q("setSize").value = S.fontSize;
      q("setSizeVal").textContent = S.fontSize + " px";
      q("setLh").value = S.lineHeight;
      q("setLhVal").textContent = (+S.lineHeight).toFixed(2);
      q("setLiga").checked = !!S.ligatures;
      q("setTheme").value = Themes.current || "";
      q("setIndent").value = S.softTabs ? "spaces" : "tabs";
      q("setTab").value = String(S.tabSize);
      q("setWrap").value = S.wrap;
      q("setWs").checked = !!S.whitespace;
      q("setMini").checked = !!S.minimap;
      q("setStatus").checked = !!S.statusbar;
    }
    function applyCustom() {
      const v = q("setFontCustom").value.trim();
      if (!v) return toast("Type a font name first", { type: "warn", ms: 1200 });
      UI.setFont(v);
    }
    function init() {
      build();
      q("setFont").addEventListener("change", (e) => {
        if (e.target.value === "__custom") q("setFontCustom").focus();
        else UI.setFont(e.target.value, true);
      });
      q("setFontApply").addEventListener("click", applyCustom);
      q("setFontCustom").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyCustom();
        }
      });
      q("setSize").addEventListener("input", (e) => UI.setSize(e.target.value, true));
      q("setSizeDown").addEventListener("click", () => UI.setSize(S.fontSize - 1, true));
      q("setSizeUp").addEventListener("click", () => UI.setSize(S.fontSize + 1, true));
      q("setLh").addEventListener("input", (e) => UI.setLineHeight(e.target.value));
      q("setLiga").addEventListener("change", (e) => {
        S.ligatures = e.target.checked;
        saveSettings();
        UI.applyFont();
      });
      q("setTheme").addEventListener("change", (e) => Themes.set(e.target.value));
      q("setIndent").addEventListener("change", (e) => UI.setIndent({ soft: e.target.value === "spaces" }));
      q("setTab").addEventListener("change", (e) => UI.setIndent({ size: +e.target.value }));
      q("setWrap").addEventListener("change", (e) => UI.setWrap(e.target.value));
      q("setWs").addEventListener("change", (e) => UI.setWhitespace(e.target.checked));
      q("setMini").addEventListener("change", (e) => {
        S.minimap = e.target.checked;
        saveSettings();
        UI.applyLayout();
      });
      q("setStatus").addEventListener("change", (e) => {
        S.statusbar = e.target.checked;
        saveSettings();
        UI.applyLayout();
      });
      q("setReset").addEventListener("click", () => {
        const d = CONFIG.DEFAULTS;
        S.fontFamily = d.fontFamily;
        S.fontSize = d.fontSize;
        S.lineHeight = d.lineHeight;
        S.ligatures = d.ligatures;
        q("setFontCustom").value = "";
        saveSettings();
        UI.applyFont();
        toast("Font settings reset", { icon: "bi-arrow-counterclockwise", ms: 1200 });
      });
      el.addEventListener("hidden.bs.modal", () => setTimeout(() => App.focus(), 0));
      sync();
    }
    return {
      init,
      sync,
      /** Opens the preferences dialog and focuses the requested field. */
      show(focusCustom) {
        Pick.close(false);
        sync();
        modal.show();
        el.addEventListener("shown.bs.modal", () => (focusCustom ? q("setFontCustom") : q("setFont")).focus(), { once: true });
      }
    };
  })();

  // src/editor/status.js
  var Status = {
    schedule: rafOnce(() => Status.update()),
    /** Refreshes the status bar with cursor, selection, indentation, language, font, and line details. */
    update() {
      const ed = App.panes[App.active] && App.editor(), doc = App.doc();
      if (!ed || !doc) return;
      const s = ed.session, c = ed.getCursorPosition(), tab = s.getTabSize();
      const line = s.getLine(c.row);
      let v = 0;
      for (let i = 0; i < c.column; i++) v += line[i] === "	" ? tab - v % tab : 1;
      $("#sbPos").textContent = `Line ${c.row + 1}, Column ${v + 1}`;
      const ranges = ed.selection.getAllRanges(), n = ranges.length;
      let chars = 0;
      ranges.forEach((r) => {
        if (!r.isEmpty()) chars += s.getTextRange(r).length;
      });
      $("#sbSel").textContent = `${n} cursor${n > 1 ? "s" : ""}` + (chars ? `, ${chars} character${chars > 1 ? "s" : ""} selected` : "");
      $("#sbIndent").textContent = (S.softTabs ? "Spaces: " : "Tab Size: ") + S.tabSize;
      $("#sbEol").textContent = s.getDocument().getNewLineCharacter() === "\r\n" ? "CRLF" : "LF";
      $("#sbLang").textContent = Langs.name(doc.lang);
      $("#sbFontTxt").textContent = `${S.fontFamily} ${S.fontSize}px`;
      const len = s.getLength();
      $("#sbLines").textContent = `${len} line${len > 1 ? "s" : ""}`;
      UI.updateTitle();
    },
    /** Wires status bar items to commands and command pickers. */
    init() {
      const pick = (id, title, ids, opts) => $(id).addEventListener("click", (e) => Pick.open(e.currentTarget, { title, items: Pick.fromCommands(ids, opts && opts()), filter: !!(opts && opts().filter) }));
      $("#sbPos").addEventListener("click", () => Commands.exec("goto.line"));
      pick("#sbIndent", "Indentation", ["indent.spaces", "indent.tabs", "indent.size2", "indent.size4", "indent.size8"]);
      pick("#sbEol", "Line endings", ["eol.lf", "eol.crlf"]);
      pick("#sbLang", "Syntax / language", CONFIG.LANGS.map((l) => "lang." + l.id), () => ({
        filter: true,
        icon: (c) => {
          const id = c.id.slice(5);
          return `<i class="bi ${Langs.icon(id)}" style="color:${Langs.color(id)}"></i>`;
        }
      }));
      $("#sbFont").addEventListener("click", () => Commands.exec("prefs.open"));
    }
  };

  // src/editor/ui.js
  var UI = {
    /** Updates the window and document titles with the active document's name and modified state. */
    updateTitle() {
      const d = App.doc();
      if (!d) return;
      const m = isModified(d);
      $("#titleText").innerHTML = `<b>${esc(d.name)}</b>${m ? " \u25CF" : ""} \u2014 ${CONFIG.APP_NAME}`;
      document.title = `${m ? "\u25CF " : ""}${d.name} \u2014 ${CONFIG.APP_NAME}`;
    },
    /** Toggles body classes for the sidebar, minimap, status bar, and zen mode, then applies the pane layout. */
    applyLayout() {
      const b = document.body.classList;
      b.toggle("sb-on", !!S.sidebar);
      b.toggle("no-minimap", !S.minimap);
      b.toggle("no-status", !S.statusbar);
      b.toggle("no-header", !S.header);
      b.toggle("zen", UIState.zen);
      this.applySidebarWidth();
      Layout.apply();
    },
    /** Applies the persisted sidebar width to the page layout. */
    applySidebarWidth() {
      document.documentElement.style.setProperty("--sbw", clamp(Math.round(+S.sidebarWidth) || 240, 160, 520) + "px");
    },
    /** Resizes all editor panes immediately and again after a short delay. */
    resize() {
      requestAnimationFrame(() => App.panes.forEach((p) => {
        p.editor.resize(true);
        p.mm.schedule();
      }));
      setTimeout(() => App.panes.forEach((p) => p.editor.resize(true)), 220);
    },
    /** Shows or hides the sidebar and persists the setting. */
    setSidebar(on) {
      S.sidebar = on;
      saveSettings();
      this.applyLayout();
    },
    /** Push font family / size / line-height / ligature settings to every editor. */
    applyFont() {
      const stack = Fonts.stack(S.fontFamily);
      const r = document.documentElement.style;
      r.setProperty("--code", stack);
      r.setProperty("--liga", S.ligatures ? "normal" : "none");
      r.setProperty("--lh", String(S.lineHeight));
      const refresh = () => App.panes.forEach((p) => {
        p.editor.renderer.updateFontSize();
        p.editor.resize(true);
        p.mm.schedule();
      });
      App.panes.forEach((p) => {
        p.editor.setOption("fontFamily", stack);
        p.editor.setFontSize(S.fontSize);
      });
      refresh();
      requestAnimationFrame(refresh);
      Fonts.ensure(S.fontFamily, refresh);
      Status.schedule();
      Settings.sync();
    },
    /** Sets the font family, refreshes editors, and optionally shows a notification. */
    setFont(name, quiet) {
      S.fontFamily = name;
      saveSettings();
      this.applyFont();
      if (!quiet) toast("Font: " + name, { icon: "bi-fonts", ms: 1200 });
    },
    /** Sets the font size within bounds, refreshes editors, and optionally shows a notification. */
    setSize(n, quiet) {
      S.fontSize = clamp(Math.round(+n) || 14, 8, 40);
      saveSettings();
      this.applyFont();
      if (!quiet) toast(`Font size ${S.fontSize}px`, { icon: "bi-zoom-in", ms: 900 });
    },
    /** Sets the font size through the standard size setter. */
    setZoom(n) {
      this.setSize(n);
    },
    /** Sets the editor line height within bounds and refreshes fonts. */
    setLineHeight(v) {
      S.lineHeight = clamp(+v || 1.6, 1.1, 2.2);
      saveSettings();
      this.applyFont();
    },
    /** Changes word wrap mode for all documents and persists the setting. */
    setWrap(mode) {
      if (S.wrap !== "off") S.lastWrap = S.wrap;
      S.wrap = mode;
      if (mode !== "off") S.lastWrap = mode;
      saveSettings();
      Sessions.each((s) => Sessions.applyWrap(s));
      Settings.sync();
      toast("Word wrap: " + (CONFIG.WRAPS.find((w) => w[0] === mode) || [0, mode])[1], { icon: "bi-text-wrap", ms: 1e3 });
    },
    /** Updates tab size and soft-tab settings across all documents. */
    setIndent({ size, soft }) {
      if (size) S.tabSize = size;
      if (soft !== void 0) S.softTabs = soft;
      saveSettings();
      Sessions.each((s) => {
        s.setTabSize(S.tabSize);
        s.setUseSoftTabs(S.softTabs);
      });
      Status.schedule();
      Settings.sync();
      toast((S.softTabs ? "Spaces: " : "Tabs, size ") + S.tabSize, { icon: "bi-text-indent-left", ms: 1e3 });
    },
    /** Shows or hides invisible whitespace characters in all editors. */
    setWhitespace(on) {
      S.whitespace = on;
      saveSettings();
      App.panes.forEach((p) => p.editor.setShowInvisibles(on));
      Settings.sync();
    },
    /** Toggles between single-pane and two-column layouts. */
    toggleSplit() {
      Layout.set(UIState.layout === "single" ? "cols2" : "single");
    },
    /** Toggles distraction-free mode and restores editor focus. */
    toggleZen() {
      UIState.zen = !UIState.zen;
      this.applyLayout();
      if (UIState.zen) toast("Distraction free mode. Shift+F11 to exit", { icon: "bi-eye-slash", ms: 2200 });
      App.focus();
    }
  };

  // src/editor/find.js
  var Find = {
    isOpen: false,
    q: "",
    opts: { regExp: false, caseSensitive: false, wholeWord: false },
    ranges: [],
    hl: { session: null, ids: [] },
    el: $("#findPanel"),
    input: $("#findInput"),
    rep: $("#replaceInput"),
    count: $("#findCount"),
    /** Builds the search option object from the current query and toggles. */
    searchOpts() {
      return { needle: this.q, caseSensitive: this.opts.caseSensitive, wholeWord: this.opts.wholeWord, regExp: this.opts.regExp, wrap: true };
    },
    /** Checks whether the current query is a valid regular expression when needed. */
    valid() {
      if (!this.opts.regExp || !this.q) return true;
      try {
        new RegExp(this.q);
        return true;
      } catch (e) {
        return false;
      }
    },
    /** Opens the find panel and initializes the query from the current selection. */
    open(withReplace) {
      const ed = E();
      this.isOpen = true;
      this.el.hidden = false;
      this.setReplace(withReplace === void 0 ? !$("#replaceRow").hidden : withReplace);
      const sel = ed.getSelectedText();
      if (sel && !sel.includes("\n") && sel.length < 200) this.q = sel;
      this.input.value = this.q;
      this.input.focus();
      this.input.select();
      this.update(false);
    },
    /** Hides the find panel, clears highlights, and restores editor focus. */
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.el.hidden = true;
      this.clearHL();
      App.focus();
    },
    /** Shows or hides the replace row and updates its toggle state. */
    setReplace(on) {
      $("#replaceRow").hidden = !on;
      $("#replaceToggle").setAttribute("aria-expanded", String(on));
    },
    /** Removes all find result highlight markers from the editor session. */
    clearHL() {
      const { session, ids } = this.hl;
      if (session) ids.forEach((id) => session.removeMarker(id));
      this.hl = { session: null, ids: [] };
    },
    /** Recompute matches, highlight them all, and refresh the counter. */
    update(jumpFirst) {
      this.clearHL();
      this.input.classList.toggle("invalid", !this.valid());
      const ed = E();
      this.ranges = [];
      if (this.q && this.valid()) {
        const sr = new AceSearch();
        sr.set(this.searchOpts());
        this.ranges = sr.findAll(ed.session).filter((r) => !r.isEmpty());
        const ids = this.ranges.slice(0, 3e3).map((r) => ed.session.addMarker(r, "find-hl", "text"));
        this.hl = { session: ed.session, ids };
        if (jumpFirst && this.ranges.length) ed.find(this.q, Object.assign(this.searchOpts(), { skipCurrent: false, backwards: false }));
      }
      this.updateCount();
    },
    /** Refreshes the match counter with the current result and selection. */
    updateCount() {
      const n = this.ranges.length, c = this.count;
      c.classList.toggle("none", !!this.q && n === 0);
      if (!this.q) {
        c.textContent = "No results";
        c.classList.remove("none");
        return;
      }
      if (!this.valid()) {
        c.textContent = "Invalid regex";
        c.classList.add("none");
        return;
      }
      if (!n) {
        c.textContent = "No results";
        return;
      }
      const sel = E().getSelectionRange();
      const i = this.ranges.findIndex((r) => r.isEqual(sel));
      c.textContent = i >= 0 ? `${i + 1} of ${n}` : `${n} match${n > 1 ? "es" : ""}`;
    },
    /** Moves to the next or previous match in the given direction. */
    jump(dir) {
      if (!this.q) return this.open();
      if (!this.valid()) return;
      const ed = E();
      const r = ed.find(this.q, Object.assign(this.searchOpts(), { backwards: dir < 0, skipCurrent: true }));
      if (!r) toast('No matches for "' + this.q + '"', { type: "warn", ms: 1200 });
      this.updateCount();
    },
    /** Replaces the currently selected match and moves to the next one. */
    replaceOne() {
      if (!this.q || !this.valid()) return;
      const ed = E();
      ed.$search.set(Object.assign(this.searchOpts(), { skipCurrent: false, backwards: false }));
      ed.replace(this.rep.value);
      this.update(false);
      this.jump(1);
    },
    /** Replaces every match and reports the number of replacements. */
    replaceAllMatches() {
      if (!this.q || !this.valid()) return;
      const n = E().replaceAll(this.rep.value, this.searchOpts());
      toast(`Replaced ${n} occurrence${n === 1 ? "" : "s"}`, { icon: "bi-arrow-repeat" });
      this.update(false);
    },
    /** Toggles a search option and refreshes the highlights. */
    toggleOpt(name) {
      this.opts[name] = !this.opts[name];
      $$(".tg").forEach((b) => b.setAttribute("aria-pressed", String(!!this.opts[b.dataset.opt])));
      if (this.isOpen) this.update(true);
    },
    /** Uses the selected text or current word as the search query. */
    useSelection() {
      const sel = E().getSelectedText() || E().session.getTextRange(E().session.getWordRange(E().getCursorPosition().row, E().getCursorPosition().column));
      if (sel) {
        this.q = sel;
        this.input.value = sel;
        if (this.isOpen) this.update(false);
        toast("Find: " + sel.slice(0, 30), { icon: "bi-search", ms: 1e3 });
      }
    },
    /** Refreshes the search highlights when the active pane changes. */
    onPaneChange() {
      if (this.isOpen) this.update(false);
    },
    onSelection: debounce(() => {
      if (Find.isOpen) Find.updateCount();
    }, 60),
    onChange: debounce(() => {
      if (Find.isOpen) Find.update(false);
    }, 160),
    /** Wires the find panel inputs and buttons to search and replace actions. */
    init() {
      this.input.addEventListener("input", () => {
        this.q = this.input.value;
        this.update(true);
      });
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.jump(e.shiftKey ? -1 : 1);
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.close();
        }
      });
      this.rep.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.ctrlKey && e.altKey ? this.replaceAllMatches() : this.replaceOne();
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.close();
        }
      });
      $$(".tg").forEach((b) => b.addEventListener("click", () => this.toggleOpt(b.dataset.opt)));
      $("#findNext").addEventListener("click", () => this.jump(1));
      $("#findPrev").addEventListener("click", () => this.jump(-1));
      $("#findClose").addEventListener("click", () => this.close());
      $("#replaceOne").addEventListener("click", () => this.replaceOne());
      $("#replaceAll").addEventListener("click", () => this.replaceAllMatches());
      $("#replaceToggle").addEventListener("click", () => {
        this.setReplace($("#replaceRow").hidden);
      });
    }
  };

  // src/editor/minimap.js
  var Minimap = class {
    /** Wire the canvas to a pane and listen for repaint / resize events. */
    constructor(pane) {
      this.pane = pane;
      this.el = $(".minimap", pane.el);
      this.cv = $("canvas", this.el);
      this.slider = $(".mm-slider", this.el);
      this.ctx = this.cv.getContext("2d");
      this.cache = /* @__PURE__ */ new Map();
      this.off = 0;
      this.schedule = rafOnce(() => this.draw());
      const ed = pane.editor;
      ed.renderer.on("afterRender", this.schedule);
      ed.renderer.on("themeLoaded", () => {
        this.cache.clear();
        this.schedule();
      });
      new ResizeObserver(() => this.schedule()).observe(this.el);
      this.el.addEventListener("pointerdown", (e) => {
        this.el.setPointerCapture(e.pointerId);
        this.seek(e);
        const mv = (ev) => this.seek(ev);
        const up = () => {
          this.el.removeEventListener("pointermove", mv);
          this.el.removeEventListener("pointerup", up);
        };
        this.el.addEventListener("pointermove", mv);
        this.el.addEventListener("pointerup", up);
      });
    }
    /** Drop cached theme colors and repaint after a scheme change. */
    themeChanged() {
      this.cache.clear();
      this.schedule();
    }
    /** Scroll the editor to the document row under the pointer. */
    seek(e) {
      const ed = this.pane.editor, rect = this.el.getBoundingClientRect();
      const row = clamp(Math.floor((e.clientY - rect.top + this.off) / 3), 0, ed.session.getLength() - 1);
      ed.scrollToLine(row, true, false);
    }
    /** Resolve a token type to the current theme's color via a hidden probe element. */
    color(type) {
      let c = this.cache.get(type);
      if (c) return c;
      const probe = document.createElement("span");
      probe.className = String(type).split(".").map((t) => "ace_" + t).join(" ");
      probe.style.display = "none";
      this.pane.editor.renderer.content.appendChild(probe);
      c = getComputedStyle(probe).color;
      probe.remove();
      this.cache.set(type, c);
      return c;
    }
    /** Paint the visible document as colored 2px bars and position the view slider. */
    draw() {
      if (!S.minimap || !this.el.offsetParent) return;
      const ed = this.pane.editor, s = ed.session, r = ed.renderer;
      const W = this.el.clientWidth, H = this.el.clientHeight;
      if (W < 10 || H < 10) return;
      const dpr = window.devicePixelRatio || 1, cv = this.cv;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        cv.style.width = W + "px";
        cv.style.height = H + "px";
      }
      const ctx = this.ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const LH = 3, n = s.getLength();
      const first = s.screenToDocumentRow(Math.max(0, r.getFirstVisibleRow()), 0);
      const last = Math.max(first, s.screenToDocumentRow(Math.max(0, r.getLastVisibleRow()), 0));
      const vis = last - first + 1;
      const maxOff = Math.max(0, n * LH - H);
      const frac = n > vis ? Math.min(1, first / (n - vis)) : 0;
      const off = this.off = maxOff * frac;
      const r0 = Math.floor(off / LH), r1 = Math.min(n - 1, Math.ceil((off + H) / LH));
      const tab = s.getTabSize();
      ctx.globalAlpha = 0.75;
      for (let row = r0; row <= r1; row++) {
        const y = row * LH - off;
        let x = 0;
        const toks = s.getTokens(row);
        for (const t of toks) {
          const v = t.value, color = this.color(t.type);
          let run = -1;
          for (let i = 0; i < v.length && x < W; i++) {
            const ch = v[i];
            if (ch === " " || ch === "	") {
              if (run >= 0) {
                ctx.fillStyle = color;
                ctx.fillRect(run, y, x - run, 2);
                run = -1;
              }
              x += ch === "	" ? tab : 1;
            } else {
              if (run < 0) run = x;
              x++;
            }
          }
          if (run >= 0) {
            ctx.fillStyle = color;
            ctx.fillRect(run, y, Math.min(x, W) - run, 2);
          }
          if (x >= W) break;
        }
      }
      ctx.globalAlpha = 1;
      this.slider.style.transform = `translateY(${first * LH - off}px)`;
      this.slider.style.height = Math.max(10, vis * LH) + "px";
    }
  };

  // src/editor/panes.js
  function makePane(idx) {
    const el = $("#pane" + idx);
    const editor = ace.edit($(".ed", el), {
      fontSize: S.fontSize,
      showPrintMargin: false,
      highlightActiveLine: true,
      highlightGutterLine: true,
      displayIndentGuides: true,
      showFoldWidgets: true,
      foldStyle: "markbegin",
      behavioursEnabled: true,
      wrapBehavioursEnabled: true,
      showInvisibles: S.whitespace,
      scrollPastEnd: 0.5,
      animatedScroll: false,
      fadeFoldWidgets: false,
      enableMultiselect: true,
      enableBlockSelect: true,
      highlightSelectedWord: true,
      copyWithEmptySelection: true,
      useWorker: false,
      indentedSoftWrap: true,
      enableAutoIndent: true,
      fontFamily: Fonts.stack(S.fontFamily)
    });
    editor.setTheme("ace/theme/" + Themes.aceName());
    editor.renderer.setScrollMargin(6, 6, 0, 0);
    const pane = { idx, el, editor, docId: null, mm: null };
    pane.mm = new Minimap(pane);
    App.panes[idx] = pane;
    editor.on("focus", () => App.setActive(idx));
    ["changeSelection", "multiSelect", "singleSelect", "changeSession", "change"].forEach((ev) => editor.on(ev, () => {
      if (App.active === idx) Status.schedule();
    }));
    editor.on("changeSelection", () => {
      if (App.active === idx) Find.onSelection();
    });
    editor.on("change", () => {
      if (App.active === idx) Find.onChange();
    });
    editor.on("copy", copyToast);
    editor.on("cut", () => toast("Cut", { icon: "bi-scissors", ms: 1e3 }));
    $(".pane-head", el).addEventListener("click", () => editor.focus());
    const hasTab = (e) => e.dataTransfer && [...e.dataTransfer.types || []].includes("text/x-tab");
    el.addEventListener("dragover", (e) => {
      if (hasTab(e)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        el.classList.add("drop-target");
      }
    }, true);
    el.addEventListener("dragleave", (e) => {
      if (!el.contains(e.relatedTarget)) el.classList.remove("drop-target");
    }, true);
    el.addEventListener("drop", (e) => {
      if (!hasTab(e)) return;
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("drop-target");
      const d = Docs.byId.get(e.dataTransfer.getData("text/x-tab"));
      if (d) Docs.activate(d, idx);
    }, true);
    return pane;
  }
  var Panes = {
    /** Refresh the filename / dirty dot shown above every visible pane. */
    renderHeads() {
      App.panes.forEach((p) => {
        const head = $(".pane-head", p.el), d = Docs.byId.get(p.docId);
        if (!d || !Layout.visible(p.idx)) {
          head.innerHTML = "";
          return;
        }
        head.innerHTML = `<i class="bi ${Langs.icon(d.lang)}" style="color:${Langs.color(d.lang)}" aria-hidden="true"></i><span class="nm">${esc(d.name)}</span>${isModified(d) ? '<span class="dot" aria-label="unsaved"></span>' : ""}<span class="pn">Pane ${p.idx + 1}</span>`;
      });
    }
  };

  // src/editor/tabs.js
  var Tabs = {
    bar: $("#tabs"),
    /** Renders all document tabs and marks the active, visible, and modified ones. */
    render() {
      const active = App.doc();
      const visibleDocs = new Set(App.panes.slice(0, Layout.count()).map((p) => p.docId));
      this.bar.innerHTML = "";
      Docs.list.forEach((d) => {
        const t = document.createElement("div");
        t.className = "tab" + (d === active ? " active" : "") + (visibleDocs.has(d.id) ? " shown" : "") + (isModified(d) ? " dirty" : "");
        t.setAttribute("role", "tab");
        t.setAttribute("aria-selected", String(d === active));
        t.tabIndex = d === active ? 0 : -1;
        t.draggable = true;
        t.dataset.id = d.id;
        t.title = d.name;
        t.innerHTML = `<i class="bi ${Langs.icon(d.lang)} tab-ico" style="color:${Langs.color(d.lang)}" aria-hidden="true"></i><span class="tab-name">${esc(d.name)}</span><button class="tab-x" tabindex="-1" aria-label="Close ${esc(d.name)}"><span class="dot"></span><i class="bi bi-x-lg" aria-hidden="true"></i></button>`;
        this.bar.appendChild(t);
      });
      const a = $(".tab.active", this.bar);
      if (a) a.scrollIntoView({ block: "nearest", inline: "nearest" });
      Panes.renderHeads();
    },
    /** Updates the modified indicator on the document's tab. */
    markDirty(doc) {
      const t = $(`.tab[data-id="${doc.id}"]`, this.bar);
      if (t) t.classList.toggle("dirty", isModified(doc));
      Panes.renderHeads();
    },
    /** Registers click, keyboard, and drag-and-drop handlers on the tab strip. */
    init() {
      const bar = this.bar, docOf = (el) => {
        const t = el.closest(".tab");
        return t && Docs.byId.get(t.dataset.id);
      };
      bar.addEventListener("click", (e) => {
        const d = docOf(e.target);
        if (!d) return;
        if (e.target.closest(".tab-x")) Docs.close(d);
        else Docs.activate(d);
      });
      bar.addEventListener("dblclick", (e) => {
        if (e.target === bar) Docs.newFile();
      });
      bar.addEventListener("mousedown", (e) => {
        if (e.button === 1) e.preventDefault();
      });
      bar.addEventListener("auxclick", (e) => {
        if (e.button === 1) {
          const d = docOf(e.target);
          if (d) {
            e.preventDefault();
            Docs.close(d);
          }
        }
      });
      bar.addEventListener("keydown", (e) => {
        const d = docOf(e.target);
        if (!d) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          Docs.activate(d);
        } else if (e.key === "Delete") {
          Docs.close(d);
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const i = Docs.list.indexOf(d) + (e.key === "ArrowRight" ? 1 : -1), n = Docs.list[(i + Docs.list.length) % Docs.list.length];
          const el = $(`.tab[data-id="${n.id}"]`, bar);
          el.tabIndex = 0;
          el.focus();
        }
      });
      let dragId = null;
      const clear = () => $$(".tab", bar).forEach((t) => t.classList.remove("drop-before", "drop-after", "dragging"));
      bar.addEventListener("dragstart", (e) => {
        const t = e.target.closest(".tab");
        if (!t) return;
        dragId = t.dataset.id;
        e.dataTransfer.setData("text/x-tab", dragId);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => t.classList.add("dragging"), 0);
      });
      bar.addEventListener("dragover", (e) => {
        if (!dragId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const t = e.target.closest(".tab");
        $$(".tab", bar).forEach((x) => x.classList.remove("drop-before", "drop-after"));
        if (!t || t.dataset.id === dragId) return;
        const r = t.getBoundingClientRect();
        t.classList.add(e.clientX > r.left + r.width / 2 ? "drop-after" : "drop-before");
      });
      bar.addEventListener("drop", (e) => {
        if (!dragId) return;
        e.preventDefault();
        const t = e.target.closest(".tab");
        if (t) {
          const r = t.getBoundingClientRect();
          Docs.move(dragId, t.dataset.id, e.clientX > r.left + r.width / 2);
        }
        dragId = null;
        clear();
      });
      bar.addEventListener("dragend", () => {
        dragId = null;
        clear();
        $$(".pane").forEach((p) => p.classList.remove("drop-target"));
      });
      $("#btnNewTab").addEventListener("click", () => Commands.exec("file.new"));
    }
  };

  // src/editor/dialog.js
  var Dialog = (() => {
    const el = $("#dlg"), modal = new bootstrap.Modal(el), input = $("#dlgInput"), foot = $("#dlgFoot");
    function show({ title, message = "", input: inputVal = null, buttons }) {
      return new Promise((resolve) => {
        let done = false;
        const finish = (v) => {
          if (!done) {
            done = true;
            resolve(v);
          }
        };
        $("#dlgTitle").textContent = title;
        $("#dlgMsg").textContent = message;
        input.hidden = inputVal === null;
        if (inputVal !== null) input.value = inputVal;
        foot.innerHTML = "";
        let primaryBtn = null;
        buttons.forEach((b) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-sx" + (b.primary ? " primary" : "") + (b.danger ? " danger" : "");
          btn.textContent = b.label;
          btn.addEventListener("click", () => {
            if (b.action) b.action();
            finish({ value: b.value, input: input.value });
            modal.hide();
          });
          if (b.primary) primaryBtn = btn;
          foot.appendChild(btn);
        });
        input.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            primaryBtn && primaryBtn.click();
          }
        };
        el.addEventListener("hidden.bs.modal", () => {
          finish(null);
          setTimeout(() => App.focus(), 0);
        }, { once: true });
        el.addEventListener("shown.bs.modal", () => {
          if (inputVal !== null) {
            input.focus();
            input.select();
          } else if (primaryBtn) primaryBtn.focus();
        }, { once: true });
        modal.show();
      });
    }
    return {
      show,
      /** Prompts for text and resolves with the entered value or null when cancelled. */
      async prompt(title, message, value) {
        const r = await show({ title, message, input: value, buttons: [{ label: "Cancel", value: null }, { label: "OK", value: "ok", primary: true }] });
        return r && r.value === "ok" ? r.input : null;
      }
    };
  })();

  // src/editor/files.js
  var Files = {
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
          if (e && e.name === "AbortError") return;
          console.warn("Native file picker unavailable, falling back to <input>", e);
          this.pickerOk = false;
          this.chooseDialog();
          return;
        }
      }
      $("#fileInput").click();
    },
    /** Prompts the user to choose files when the native picker is unavailable. */
    chooseDialog() {
      Dialog.show({
        title: "Open files",
        message: "The native file picker is blocked here. Choose files from your computer:",
        buttons: [{ label: "Cancel", value: null }, { label: "Choose files\u2026", value: "go", primary: true, action: () => $("#fileInput").click() }]
      });
    },
    /** Opens a file handle, focusing an already-open document when possible. */
    async openHandle(h) {
      try {
        for (const d of Docs.list) if (d.handle && d.handle.isSameEntry && await d.handle.isSameEntry(h)) {
          Docs.activate(d);
          return;
        }
        await this.openFile(await h.getFile(), h);
      } catch (e) {
        toast("Could not open file: " + e.message, { type: "error" });
      }
    },
    /** Reads a file into a new document, replacing a pristine empty tab. */
    async openFile(file, handle) {
      try {
        if (file.size > 20 * 1024 * 1024) {
          toast(`${file.name} is too large (>20 MB)`, { type: "warn" });
          return;
        }
        const text = await file.text();
        if (text.slice(0, 8e3).includes("\0")) {
          toast(`${file.name} looks like a binary file`, { type: "warn" });
          return;
        }
        const only = Docs.list.length === 1 ? Docs.list[0] : null;
        const doc = Docs.create({ name: file.name, text, handle, fromDisk: true });
        Docs.activate(doc);
        if (only && !only.fromDisk && !isModified(only) && !only.sessions[0].getValue()) Docs.close(only, { force: true });
        toast("Opened " + file.name, { icon: "bi-folder2-open", ms: 1200 });
        return doc;
      } catch (e) {
        toast("Could not read " + file.name, { type: "error" });
        return null;
      }
    },
    /** Suggests a filename with an extension matching the document's language. */
    suggest(doc) {
      if (/\.[^.]+$/.test(doc.name)) return doc.name;
      const l = Langs.byId.get(doc.lang);
      return doc.name + "." + (l && l.exts[0] || "txt");
    },
    /** Saves text to disk through a temporary download link. */
    download(name, text) {
      const a = document.createElement("a");
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2e3);
    },
    /** Save (or Save As). Returns true when the document was persisted. */
    async save(doc, as = false) {
      doc = doc || App.doc();
      const text = doc.sessions[0].getValue();
      if (isTopLevel && window.showSaveFilePicker) {
        try {
          let h = doc.handle;
          if (!h || as) {
            h = await window.showSaveFilePicker({ suggestedName: this.suggest(doc) });
          }
          const w = await h.createWritable();
          await w.write(text);
          await w.close();
          doc.handle = h;
          doc.fromDisk = true;
          if (h.name !== doc.name) Docs.rename(doc, h.name);
          Docs.markClean(doc);
          toast("Saved " + doc.name, { icon: "bi-floppy" });
          return true;
        } catch (e) {
          if (e && e.name === "AbortError") return false;
          console.warn("Falling back to download", e);
        }
      }
      let name = this.suggest(doc);
      if (as || !doc.fromDisk) {
        const r = await Dialog.prompt(as ? "Save As" : "Save File", "File name:", name);
        if (!r) return false;
        name = r.trim() || name;
      }
      this.download(name, text);
      if (name !== doc.name) Docs.rename(doc, name);
      doc.fromDisk = true;
      Docs.markClean(doc);
      toast("Saved " + name + " (downloaded)", { icon: "bi-download" });
      return true;
    }
  };
  $("#fileInput").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    for (const f of files) await Files.openFile(f, null);
  });
  var hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types || []].includes("Files");
  window.addEventListener("dragover", (e) => {
    if (hasFiles(e)) {
      e.preventDefault();
      document.body.classList.add("drag-file");
    }
  });
  window.addEventListener("dragleave", (e) => {
    if (e.relatedTarget === null) document.body.classList.remove("drag-file");
  });
  window.addEventListener("drop", async (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    document.body.classList.remove("drag-file");
    const entries = [...e.dataTransfer.items].filter((i) => i.kind === "file").map((i) => ({
      file: i.getAsFile(),
      hp: i.getAsFileSystemHandle && isTopLevel ? i.getAsFileSystemHandle() : null
    }));
    for (const en of entries) {
      try {
        const h = en.hp ? await en.hp.catch(() => null) : null;
        if (h && h.kind === "directory") {
          toast("Folders are not supported, drop files", { type: "warn" });
          continue;
        }
        if (h && h.kind === "file") await Files.openHandle(h);
        else if (en.file) await Files.openFile(en.file, null);
      } catch (err) {
        toast("Could not open dropped file", { type: "error" });
      }
    }
  });

  // src/editor/folders.js
  var MAX_FILES = 500;
  var MAX_DEPTH = 8;
  var SKIP = /* @__PURE__ */ new Set([".git", ".hg", ".svn", "node_modules", "dist", "build", ".cache"]);
  var Folders = (() => {
    let seq = 0;
    const roots = [];
    const changed = () => document.dispatchEvent(new Event("folders:change"));
    async function walk(dir, prefix, out, depth) {
      if (depth > MAX_DEPTH || out.length >= MAX_FILES) return;
      try {
        const iterator = dir.values ? dir.values() : dir.entries();
        for await (const item of iterator) {
          if (out.length >= MAX_FILES) break;
          const h = Array.isArray(item) ? item[1] : item;
          if (!h || SKIP.has(h.name) || h.name.startsWith(".")) continue;
          const path = prefix ? prefix + "/" + h.name : h.name;
          if (h.kind === "directory") await walk(h, path, out, depth + 1);
          else if (h.kind === "file") out.push({ path, name: h.name, handle: h, file: await h.getFile() });
        }
      } catch (e) {
        console.warn("Could not list folder", e);
      }
    }
    function add(name, entries) {
      if (!entries.length) {
        toast("No readable files found in that folder", { type: "warn" });
        return;
      }
      const first = entries[0].path;
      const old = roots.findIndex((r) => r.name === name && r.entries[0] && r.entries[0].path === first);
      if (old >= 0) roots.splice(old, 1);
      roots.unshift({ id: "f" + ++seq, name, entries, collapsed: /* @__PURE__ */ new Set() });
      changed();
      toast(`Opened folder ${name} (${entries.length} file${entries.length === 1 ? "" : "s"})`, { icon: "bi-folder2-open" });
    }
    async function open() {
      if (isTopLevel && window.showDirectoryPicker) {
        try {
          const dir = await window.showDirectoryPicker();
          const entries = [];
          await walk(dir, "", entries, 0);
          add(dir.name, entries);
          return;
        } catch (e) {
          if (e && e.name === "AbortError") return;
          console.warn("Native folder picker unavailable, falling back to <input>", e);
          Dialog.show({
            title: "Open folder",
            message: "The native folder picker is blocked here. Choose a folder from your computer:",
            buttons: [{ label: "Cancel", value: null }, { label: "Choose folder\u2026", value: "go", primary: true, action: () => $("#folderInput").click() }]
          });
          return;
        }
      }
      $("#folderInput").click();
    }
    function addFromInput(input) {
      const files = [...input.files];
      input.value = "";
      if (!files.length) return;
      const name = (files[0].webkitRelativePath || files[0].name).split("/")[0] || "Folder";
      add(name, files.map((f) => {
        const rel = f.webkitRelativePath || f.name;
        return { path: rel.startsWith(name + "/") ? rel.slice(name.length + 1) : rel, name: f.name, handle: null, file: f };
      }));
    }
    function close(id) {
      const i = roots.findIndex((r) => r.id === id);
      if (i >= 0) {
        roots.splice(i, 1);
        changed();
      }
    }
    function toggle(id, path) {
      const f = roots.find((r) => r.id === id);
      if (!f) return;
      f.collapsed.has(path) ? f.collapsed.delete(path) : f.collapsed.add(path);
      changed();
    }
    async function openFile(id, path) {
      const folder = roots.find((r) => r.id === id);
      const entry = folder && folder.entries.find((e) => e.path === path);
      if (!entry) return;
      for (const d of Docs.list) {
        if (d.folderId === id && d.folderPath === path) {
          Docs.activate(d);
          return;
        }
        if (entry.handle && d.handle && d.handle.isSameEntry && await d.handle.isSameEntry(entry.handle)) {
          Docs.activate(d);
          return;
        }
      }
      const doc = await Files.openFile(entry.file, entry.handle);
      if (doc) {
        doc.folderId = id;
        doc.folderPath = path;
        changed();
      }
    }
    function tree(entries) {
      const root = { dirs: /* @__PURE__ */ new Map(), files: [] };
      entries.forEach((e) => {
        const parts = e.path.split("/");
        let node = root;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!node.dirs.has(parts[i])) node.dirs.set(parts[i], { dirs: /* @__PURE__ */ new Map(), files: [] });
          node = node.dirs.get(parts[i]);
        }
        node.files.push(e);
      });
      return root;
    }
    function nodes(node, folder, prefix) {
      const dirs = [...node.dirs.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      const files = node.files.slice().sort((a, b) => a.name.localeCompare(b.name));
      const dirHtml = dirs.map(([name, child]) => {
        const path = prefix ? prefix + "/" + name : name;
        const open2 = !folder.collapsed.has(path);
        return `<li><button class="sb-folder sb-subfolder" data-folder-toggle="${folder.id}" data-path="${esc(path)}" aria-expanded="${open2}"><i class="bi bi-chevron-down" aria-hidden="true"></i><i class="bi bi-folder2" aria-hidden="true"></i>${esc(name)}</button><ul class="sb-list">${nodes(child, folder, path)}</ul></li>`;
      }).join("");
      const fileHtml = files.map((e) => {
        const doc = Docs.list.find((d) => d.folderId === folder.id && d.folderPath === e.path);
        const lang = Langs.detect(e.name);
        const dirty = doc && (doc.forceDirty || !doc.sessions[0].getUndoManager().isClean()) ? " dirty" : "";
        return `<li><button class="sb-file${dirty}" data-folder-file="${folder.id}" data-path="${esc(e.path)}"${doc ? ` data-id="${doc.id}"` : ""} aria-label="${esc(e.name)}"><i class="bi ${Langs.icon(lang)}" style="color:${Langs.color(lang)}" aria-hidden="true"></i><span class="nm">${esc(e.name)}</span><span class="dot" aria-hidden="true"></span></button></li>`;
      }).join("");
      return dirHtml + fileHtml;
    }
    function renderHTML() {
      return roots.map((f) => {
        const open2 = !f.collapsed.has("");
        return `<button class="sb-folder" data-folder-toggle="${f.id}" data-path="" aria-expanded="${open2}"><i class="bi bi-chevron-down" aria-hidden="true"></i><i class="bi bi-folder2-open" aria-hidden="true"></i>${esc(f.name)} <span style="font-weight:400;color:var(--faint)">${f.entries.length}</span><span class="sb-close" data-folder-close="${f.id}" role="button" aria-label="Close folder" title="Close folder">\xD7</span></button><ul class="sb-list">${nodes(tree(f.entries), f, "")}</ul>`;
      }).join("");
    }
    $("#folderInput").addEventListener("change", (e) => addFromInput(e.target));
    return { open, close, toggle, openFile, renderHTML, get count() {
      return roots.length;
    } };
  })();

  // src/editor/sidebar.js
  var Sidebar = {
    el: $("#sbTree"),
    collapsed: /* @__PURE__ */ new Set(),
    dragging: false,
    /** Renders the sidebar tree with local files and scratch documents. */
    render() {
      const active = App.doc();
      const groups = [["Local Files", Docs.list.filter((d) => d.fromDisk && !d.folderId)], ["Scratch", Docs.list.filter((d) => !d.fromDisk)]].filter((g) => g[1].length);
      this.el.innerHTML = Folders.renderHTML() + groups.map(([name, docs]) => {
        const open = !this.collapsed.has(name);
        return `<button class="sb-folder" role="treeitem" aria-expanded="${open}" data-group="${name}"><i class="bi bi-chevron-down" aria-hidden="true"></i><i class="bi bi-folder2-open" aria-hidden="true"></i>${name} <span style="font-weight:400;color:var(--faint)">${docs.length}</span></button><ul class="sb-list" role="group">${docs.map((d) => `<li><button class="sb-file${d === active ? " active" : ""}${isModified(d) ? " dirty" : ""}" role="treeitem" data-id="${d.id}" aria-label="${esc(d.name)}"><i class="bi ${Langs.icon(d.lang)}" style="color:${Langs.color(d.lang)}" aria-hidden="true"></i><span class="nm">${esc(d.name)}</span><span class="dot" aria-hidden="true"></span></button></li>`).join("")}</ul>`;
      }).join("");
    },
    /** Updates the modified indicator on the sidebar entry for a document. */
    markDirty(doc) {
      const b = $(`.sb-file[data-id="${doc.id}"]`, this.el);
      if (b) b.classList.toggle("dirty", isModified(doc));
    },
    /** Applies a new sidebar width in pixels without saving it. */
    setWidth(px) {
      S.sidebarWidth = clamp(Math.round(px) || 240, 160, 520);
      UI.applySidebarWidth();
    },
    /** Wires pointer and keyboard dragging on the sidebar's right edge. */
    initResize() {
      const handle = $("#sbResize"), sidebar = $("#sidebar");
      if (!handle || !sidebar) return;
      const stop = () => {
        if (!this.dragging) return;
        this.dragging = false;
        document.body.classList.remove("sb-resizing");
        saveSettings();
        UI.resize();
      };
      handle.addEventListener("pointerdown", (e) => {
        if (!document.body.classList.contains("sb-on") || e.button !== 0) return;
        e.preventDefault();
        this.dragging = true;
        document.body.classList.add("sb-resizing");
        try {
          handle.setPointerCapture(e.pointerId);
        } catch (err) {
        }
      });
      handle.addEventListener("pointermove", (e) => {
        if (this.dragging) this.setWidth(e.clientX - sidebar.getBoundingClientRect().left);
      });
      handle.addEventListener("pointerup", stop);
      handle.addEventListener("pointercancel", stop);
      handle.addEventListener("lostpointercapture", stop);
      handle.addEventListener("dblclick", () => {
        this.setWidth(240);
        saveSettings();
        UI.resize();
      });
      handle.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        this.setWidth(S.sidebarWidth + (e.key === "ArrowRight" ? e.shiftKey ? 40 : 16 : e.shiftKey ? -40 : -16));
        saveSettings();
        UI.resize();
      });
    },
    /** Registers click handlers for file selection and folder toggling. */
    init() {
      document.addEventListener("folders:change", () => this.render());
      this.el.addEventListener("click", (e) => {
        const fc = e.target.closest("[data-folder-close]"), ft = e.target.closest("[data-folder-toggle]"), ff = e.target.closest("[data-folder-file]");
        if (fc) {
          e.stopPropagation();
          Folders.close(fc.dataset.folderClose);
          return;
        }
        if (ft) {
          Folders.toggle(ft.dataset.folderToggle, ft.dataset.path || "");
          return;
        }
        if (ff) {
          Folders.openFile(ff.dataset.folderFile, ff.dataset.path);
          return;
        }
        const f = e.target.closest(".sb-file"), g = e.target.closest(".sb-folder");
        if (f) {
          Docs.activate(Docs.byId.get(f.dataset.id));
          if (window.innerWidth < 768) UI.setSidebar(false);
        } else if (g) {
          const n = g.dataset.group;
          this.collapsed.has(n) ? this.collapsed.delete(n) : this.collapsed.add(n);
          this.render();
        }
      });
      $("#scrim").addEventListener("click", () => UI.setSidebar(false));
      this.initResize();
    }
  };

  // src/editor/persist.js
  var Persist = {
    schedule: debounce(() => Persist.save(), 700),
    /** Saves documents, pane assignments, layout, and the active pane. */
    save() {
      try {
        const docs = Docs.list.map((d) => {
          const s = d.sessions[0], c = s.selection.getCursor();
          return { name: d.name, lang: d.lang, text: s.getValue(), dirty: isModified(d), fromDisk: d.fromDisk, cur: { row: c.row, column: c.column }, top: s.getScrollTop() };
        });
        const idx = (i) => Math.max(0, Docs.list.findIndex((d) => d.id === (App.panes[i] && App.panes[i].docId)));
        Store.setJSON("session", { docs, panes: App.panes.map((p, i) => idx(i)), layout: UIState.layout, active: App.active, untitled: Docs.untitled });
      } catch (e) {
      }
    },
    /** Rebuilds documents, panes, and layout from the saved session. */
    restore() {
      const data = Store.getJSON("session", null);
      if (!data || !Array.isArray(data.docs) || !data.docs.length) return false;
      Docs.untitled = data.untitled || 0;
      data.docs.forEach((d) => {
        const doc = Docs.create({ name: d.name, text: d.text, lang: d.lang, dirty: d.dirty, fromDisk: d.fromDisk });
        const s = doc.sessions[0];
        if (d.cur) s.selection.moveCursorTo(d.cur.row, d.cur.column);
        if (d.top) s.setScrollTop(d.top);
      });
      const layout = Layout.byId.has(data.layout) ? data.layout : data.split ? "cols2" : "single";
      const idxs = data.panes || [data.a0 || 0, data.a1 || 0];
      UIState.layout = layout;
      Layout.apply();
      for (let i = MAX_PANES - 1; i >= 0; i--) {
        Docs.showIn(App.panes[i], Docs.list[clamp(idxs[i] || 0, 0, Docs.list.length - 1)]);
      }
      const act = Layout.visible(data.active || 0) ? data.active || 0 : 0;
      App.panes[act].editor.focus();
      App.setActive(act);
      Docs.mru = [App.panes[act].docId];
      Tabs.render();
      Sidebar.render();
      Status.schedule();
      UI.updateTitle();
      return true;
    }
  };
  window.addEventListener("beforeunload", (e) => {
    Persist.save();
    if (Docs.list.some(isModified)) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) Persist.save();
  });

  // src/editor/layout.js
  var Layout = {
    byId: new Map(CONFIG.LAYOUTS.map((l) => [l.id, l])),
    /** Returns the current layout definition, falling back to a single pane. */
    get cur() {
      return this.byId.get(UIState.layout) || this.byId.get("single");
    },
    /** Returns the number of panes in the current layout. */
    count() {
      return this.cur.n;
    },
    /** Checks whether a pane index is visible in the current layout. */
    visible(i) {
      return i < this.count();
    },
    /** Tiny SVG thumbnail of a layout (used in the picker and the title bar). */
    icon(L) {
      const R = L.areas.length, C = L.areas[0].length, W = 16, H = 16;
      const rects = [...new Set(L.areas.flat())].map((p) => {
        let r0 = 99, r1 = -1, c0 = 99, c1 = -1;
        L.areas.forEach((row, r) => row.forEach((v, c) => {
          if (v === p) {
            r0 = Math.min(r0, r);
            r1 = Math.max(r1, r);
            c0 = Math.min(c0, c);
            c1 = Math.max(c1, c);
          }
        }));
        const cw = W / C, rh = H / R;
        return `<rect x="${(c0 * cw + 1).toFixed(2)}" y="${(r0 * rh + 1).toFixed(2)}" width="${((c1 - c0 + 1) * cw - 2).toFixed(2)}" height="${((r1 - r0 + 1) * rh - 2).toFixed(2)}" rx="1.5"/>`;
      }).join("");
      return `<svg class="lay-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">${rects}</svg>`;
    },
    /** Applies the current layout's grid areas to the editors container and resizes panes. */
    apply() {
      const L = this.cur, ed = $("#editors");
      ed.dataset.layout = L.id;
      ed.style.gridTemplateAreas = L.areas.map((r) => `"${r.join(" ")}"`).join(" ");
      ed.style.gridTemplateColumns = `repeat(${L.areas[0].length}, minmax(0, 1fr))`;
      ed.style.gridTemplateRows = `repeat(${L.areas.length}, minmax(0, 1fr))`;
      App.panes.forEach((p) => {
        p.el.style.gridArea = "p" + p.idx;
        p.el.classList.toggle("off", p.idx >= L.n);
      });
      document.body.classList.toggle("multi", L.n > 1);
      const b = $("#btnLayout");
      if (b) {
        b.classList.toggle("on", L.n > 1);
        b.title = "Pane Layout: " + L.name;
      }
      UI.resize();
    },
    /** Switches layouts, loading files into newly revealed panes and refreshing tabs. */
    set(id, { quiet = false } = {}) {
      const L = this.byId.get(id);
      if (!L) return;
      const prev = this.count();
      UIState.layout = L.id;
      this.apply();
      for (let i = prev; i < L.n; i++) {
        const p = App.panes[i];
        const cand = Docs.mruDocs().find((d) => !App.panes.slice(0, i).some((q) => q.docId === d.id)) || App.doc();
        Docs.showIn(p, cand);
      }
      if (App.active >= L.n) {
        App.setActive(0);
        App.panes[0].editor.focus();
      }
      Tabs.render();
      Panes.renderHeads();
      Persist.schedule();
      if (!quiet) toast("Layout: " + L.name, { icon: "bi-layout-split", ms: 1100 });
      if (L.n > prev && prev >= 1) App.panes[prev].editor.focus();
    },
    /** Moves focus to the next or previous visible pane. */
    focusStep(d) {
      const n = this.count();
      if (n < 2) return toast("Only one pane. Pick a layout first (Alt+Shift+2)", { type: "warn" });
      App.panes[(App.active + d + n) % n].editor.focus();
    },
    /** Focuses a specific pane if it is visible, otherwise shows a warning. */
    focusPane(i) {
      if (!this.visible(i)) return toast(`Pane ${i + 1} is not in this layout`, { type: "warn", ms: 1200 });
      App.panes[i].editor.focus();
    },
    /** Opens the active document in the next pane, creating a split if needed. */
    openInNext() {
      const n = this.count();
      if (n < 2) {
        this.set("cols2", { quiet: true });
      }
      const from = App.active, to = (from + 1) % this.count();
      Docs.activate(App.doc(), to);
    }
  };

  // src/editor/app.js
  var App = {
    active: 0,
    panes: [],
    /** Returns the editor belonging to the active pane. */
    editor() {
      return this.panes[this.active].editor;
    },
    /** Returns the document shown in the active pane. */
    doc() {
      return Docs.byId.get(this.panes[this.active].docId);
    },
    /** Focuses the active editor unless a modal is open. */
    focus() {
      try {
        if (!document.body.classList.contains("modal-open")) this.editor().focus();
      } catch (e) {
      }
    },
    /** Switches the active pane and refreshes the interface. */
    setActive(i) {
      if (!Layout.visible(i)) i = 0;
      if (this.active === i) return;
      this.active = i;
      $$(".pane").forEach((p) => p.classList.toggle("focused", +p.dataset.idx === i));
      Tabs.render();
      Sidebar.render();
      Status.schedule();
      UI.updateTitle();
      Find.onPaneChange();
    }
  };
  var E = () => App.editor();

  // src/editor/docs.js
  var Sessions = {
    /** Applies the configured wrap mode to an editor session. */
    applyWrap(s) {
      const m = S.wrap;
      if (m === "off") {
        s.setUseWrapMode(false);
        return;
      }
      s.setUseWrapMode(true);
      if (m === "window") s.setWrapLimitRange(null, null);
      else {
        const n = +m;
        s.setWrapLimitRange(n, n);
      }
    },
    /** Configures language mode, indentation, and wrapping on a session. */
    prep(s, lang) {
      s.setUseWorker(false);
      s.setTabSize(S.tabSize);
      s.setUseSoftTabs(S.softTabs);
      this.applyWrap(s);
      s.setMode(Langs.mode(lang));
    },
    /** Invokes a callback for every session across all documents. */
    each(fn) {
      Docs.list.forEach((d) => d.sessions.forEach((s) => s && fn(s, d)));
    }
  };
  var isModified = (d) => d.forceDirty || !d.sessions[0].getUndoManager().isClean();
  var Docs = {
    list: [],
    byId: /* @__PURE__ */ new Map(),
    mru: [],
    seq: 0,
    untitled: 0,
    /** Creates and registers a document with an initial editing session. */
    create(o) {
      const id = "d" + ++this.seq;
      const lang = o.lang || Langs.detect(o.name);
      const doc = { id, name: o.name, lang, handle: o.handle || null, fromDisk: !!o.fromDisk, forceDirty: !!o.dirty, sessions: Array(MAX_PANES).fill(null), _m: false };
      const s = new ace.EditSession(o.text || "");
      s.setUndoManager(new AceUndoManager());
      Sessions.prep(s, lang);
      doc.sessions[0] = s;
      doc._m = isModified(doc);
      s.on("change", () => Docs.onChange(doc));
      this.list.push(doc);
      this.byId.set(id, doc);
      return doc;
    },
    /** Secondary-pane sessions share the Document and undo stack with the primary one (independent cursor / scroll). */
    sessionFor(pane, doc) {
      if (pane.idx === 0) return doc.sessions[0];
      if (!doc.sessions[pane.idx]) {
        const s = new ace.EditSession(doc.sessions[0].getDocument());
        Sessions.prep(s, doc.lang);
        s.setUndoManager(doc.sessions[0].getUndoManager());
        doc.sessions[pane.idx] = s;
      }
      return doc.sessions[pane.idx];
    },
    /** Displays a document in the given pane's editor. */
    showIn(pane, doc) {
      pane.docId = doc.id;
      pane.editor.setSession(this.sessionFor(pane, doc));
      Panes.renderHeads();
    },
    /** Refreshes dirty indicators when a document's modified state changes. */
    recheck(doc) {
      if (!this.byId.has(doc.id)) return;
      const m = isModified(doc);
      if (m !== doc._m) {
        doc._m = m;
        Tabs.markDirty(doc);
        Sidebar.markDirty(doc);
        UI.updateTitle();
      }
    },
    /** Responds to content changes by rechecking state and scheduling persistence. */
    onChange(doc) {
      this.recheck(doc);
      setTimeout(() => this.recheck(doc), 0);
      Persist.schedule();
      Status.schedule();
    },
    /** Marks a document and its undo stack as saved. */
    markClean(doc) {
      doc.forceDirty = false;
      doc.sessions[0].getUndoManager().markClean();
      doc._m = false;
      Tabs.markDirty(doc);
      Sidebar.markDirty(doc);
      UI.updateTitle();
      Persist.schedule();
    },
    /** Displays a document in a pane and makes that pane active. */
    activate(doc, idx = App.active) {
      if (!doc) return;
      const pane = App.panes[idx];
      this.showIn(pane, doc);
      this.mru = [doc.id, ...this.mru.filter((x) => x !== doc.id)];
      if (idx !== App.active) App.setActive(idx);
      else {
        Tabs.render();
        Sidebar.render();
        Status.schedule();
        UI.updateTitle();
        Find.onPaneChange();
      }
      Persist.schedule();
      pane.editor.focus();
    },
    /** Lists documents ordered from most recently to least recently used. */
    mruDocs() {
      return this.mru.map((id) => this.byId.get(id)).filter(Boolean).concat(this.list.filter((d) => !this.mru.includes(d.id)));
    },
    /** Creates and activates a new untitled document. */
    newFile(opts = {}) {
      const doc = this.create({ name: opts.name || `Untitled-${++this.untitled}`, text: opts.text || "", lang: opts.lang || "text" });
      this.activate(doc);
      return doc;
    },
    /** Changes the language mode of a document across all its sessions. */
    setLang(doc, lang) {
      doc.lang = lang;
      doc.sessions.forEach((s) => s && s.setMode(Langs.mode(lang)));
      Tabs.render();
      Sidebar.render();
      Status.schedule();
      Persist.schedule();
      Panes.renderHeads();
    },
    /** Renames a document and refreshes its language, tabs, and title. */
    rename(doc, name) {
      doc.name = name;
      if (Langs.hasKnownExt(name)) this.setLang(doc, Langs.detect(name));
      else {
        Tabs.render();
        Sidebar.render();
      }
      UI.updateTitle();
      Persist.schedule();
      Panes.renderHeads();
    },
    /** Closes a document after resolving any unsaved changes. */
    async close(doc, { force = false } = {}) {
      if (!doc) return false;
      if (!force && isModified(doc)) {
        const r = await Dialog.show({
          title: "Unsaved changes",
          message: `Do you want to save the changes you made to "${doc.name}"? Your changes will be lost if you don't save them.`,
          buttons: [{ label: "Cancel", value: null }, { label: "Don't Save", value: "discard", danger: true }, { label: "Save", value: "save", primary: true }]
        });
        if (!r || !r.value) return false;
        if (r.value === "save" && !await Files.save(doc)) return false;
      }
      const idx = this.list.indexOf(doc);
      this.list.splice(idx, 1);
      this.byId.delete(doc.id);
      this.mru = this.mru.filter((x) => x !== doc.id);
      if (!this.list.length) this.create({ name: `Untitled-${++this.untitled}`, text: "", lang: "text" });
      App.panes.forEach((p) => {
        if (p.docId === doc.id) {
          const next = this.mruDocs()[0] || this.list[Math.min(idx, this.list.length - 1)];
          this.showIn(p, next);
        }
      });
      setTimeout(() => doc.sessions.forEach((s) => s && s.destroy()), 0);
      Tabs.render();
      Sidebar.render();
      Status.schedule();
      UI.updateTitle();
      Find.onPaneChange();
      Persist.schedule();
      Panes.renderHeads();
      return true;
    },
    /** Closes several documents in order, stopping if one is cancelled. */
    async closeMany(docs) {
      for (const d of docs) {
        if (!await this.close(d)) return false;
      }
      return true;
    },
    /** Moves a document to a new position in the tab order. */
    move(id, targetId, after) {
      const from = this.list.findIndex((d2) => d2.id === id);
      if (from < 0 || id === targetId) return;
      const [d] = this.list.splice(from, 1);
      let to = this.list.findIndex((x) => x.id === targetId);
      if (after) to++;
      this.list.splice(to, 0, d);
      Tabs.render();
      Persist.schedule();
    },
    /** Activates the next or previous document in the tab order. */
    cycle(dir) {
      const i = this.list.indexOf(App.doc());
      this.activate(this.list[(i + dir + this.list.length) % this.list.length]);
    }
  };

  // src/editor/fuzzy.js
  function fuzzy(query, text) {
    const q = query.toLowerCase().replace(/\s+/g, "");
    if (!q) return { score: 0, idx: [] };
    const t = text.toLowerCase();
    let best = null;
    const boundary = (i) => i === 0 || /[\s:_\-./(]/.test(text[i - 1]) || text[i - 1] === text[i - 1].toLowerCase() && text[i] !== text[i].toLowerCase();
    const p = t.indexOf(q);
    if (p >= 0) best = { score: 40 + q.length * 6 + (boundary(p) ? 10 : 0) - p * 0.2, idx: [...Array(q.length).keys()].map((i) => p + i) };
    let tries = 0;
    for (let start = t.indexOf(q[0]); start !== -1 && tries < 12; start = t.indexOf(q[0], start + 1), tries++) {
      let ti = start, qi = 0, score = 0, last = -2;
      const idx = [];
      while (qi < q.length && ti < t.length) {
        if (t[ti] === q[qi]) {
          score += 1 + (ti === last + 1 ? 5 : 0) + (boundary(ti) ? 4 : 0);
          idx.push(ti);
          last = ti;
          qi++;
        }
        ti++;
      }
      if (qi === q.length) {
        score -= start * 0.1 + t.length * 0.02;
        if (!best || score > best.score) best = { score, idx };
      }
    }
    return best;
  }
  function hlHtml(text, idx) {
    if (!idx || !idx.length) return esc(text);
    const set = new Set(idx);
    let out = "", open = false;
    for (let i = 0; i < text.length; i++) {
      const m = set.has(i);
      if (m && !open) {
        out += "<mark>";
        open = true;
      } else if (!m && open) {
        out += "</mark>";
        open = false;
      }
      out += esc(text[i]);
    }
    return out + (open ? "</mark>" : "");
  }

  // src/editor/palette.js
  var Palette = (() => {
    const el = $("#palette"), modal = new bootstrap.Modal(el, { backdrop: true, keyboard: false });
    const input = $("#palInput"), listEl = $("#palList"), foot = $("#palFoot"), iconEl = $("#palIcon");
    let items = [], active = 0, committed = false, isOpen = false, revertFn = null, scrollTop = 0;
    const HINTS = {
      cmd: ["<kbd>\u2191</kbd><kbd>\u2193</kbd> navigate", "<kbd>Enter</kbd> run", "<kbd>Esc</kbd> close", "<kbd>:</kbd> line \xB7 <kbd>@</kbd> symbol \xB7 clear for files"],
      line: ["Type a line number, e.g. <kbd>:120</kbd> or <kbd>:120:8</kbd>", "<kbd>Enter</kbd> go"],
      sym: ["<kbd>\u2191</kbd><kbd>\u2193</kbd> preview", "<kbd>Enter</kbd> jump"],
      file: ["<kbd>\u2191</kbd><kbd>\u2193</kbd> navigate", "<kbd>Enter</kbd> switch tab", "<kbd>&gt;</kbd> commands \xB7 <kbd>:</kbd> line \xB7 <kbd>@</kbd> symbol"]
    };
    function cmdItems(q) {
      const recents = Recent.get();
      let arr = Commands.list.map((c) => ({ c, label: Commands.label(c) }));
      if (!q.trim()) {
        const rank = (id) => {
          const i = recents.indexOf(id);
          return i < 0 ? 1e6 : i;
        };
        arr.sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.label.localeCompare(b.label));
      } else {
        arr = arr.map((a) => {
          const m = fuzzy(q, a.label);
          if (!m) return null;
          const r = recents.indexOf(a.c.id);
          return { ...a, idx: m.idx, score: m.score + (r >= 0 ? 6 - r * 0.2 : 0) };
        }).filter(Boolean).sort((a, b) => b.score - a.score);
      }
      return arr.slice(0, 120).map((a) => {
        const sc = Keys.effective(a.c.id), on = a.c.checked && a.c.checked();
        const ci = a.c.category ? a.c.category.length + 2 : 0;
        return {
          key: a.c.id,
          icon: "",
          cmdId: a.c.id,
          html: (a.c.category ? `<span class="cat">${hlHtml(a.label.slice(0, ci), (a.idx || []).filter((i) => i < ci))}</span>` : "") + hlHtml(a.label.slice(ci), (a.idx || []).filter((i) => i >= ci).map((i) => i - ci)),
          right: (on ? '<i class="bi bi-check-lg chk" aria-label="active"></i>' : "") + (!q.trim() && recents.includes(a.c.id) ? '<span class="badge-r">recent</span>' : "") + Keys.html(sc),
          preview: a.c.preview,
          revert: a.c.revert,
          run: () => Commands.exec(a.c.id, { recent: true })
        };
      });
    }
    function fileItems(q) {
      const arr = Docs.mruDocs().map((d) => {
        const m = fuzzy(q, d.name);
        return m ? { d, m } : null;
      }).filter(Boolean);
      if (q.trim()) arr.sort((a, b) => b.m.score - a.m.score);
      return arr.map(({ d, m }) => ({
        key: d.id,
        icon: `<i class="bi ${Langs.icon(d.lang)}" style="color:${Langs.color(d.lang)}"></i>`,
        html: hlHtml(d.name, q.trim() ? m.idx : []),
        right: `${isModified(d) ? '<span style="color:var(--accent)">\u25CF unsaved</span>' : ""}<span>${Langs.name(d.lang)}</span>${d === App.doc() ? '<span class="badge-r">current</span>' : ""}`,
        run: () => Docs.activate(d, App.active)
      }));
    }
    function symItems(q) {
      const ed = E(), doc = App.doc();
      const syms = extractSymbols(ed.session.getLines(0, ed.session.getLength() - 1), doc.lang);
      const arr = syms.map((s) => {
        const m = fuzzy(q, s.name);
        return m ? { s, m } : null;
      }).filter(Boolean);
      if (q.trim()) arr.sort((a, b) => b.m.score - a.m.score);
      const go = (row) => () => {
        ed.exitMultiSelectMode();
        ed.gotoLine(row + 1, 0, false);
        ed.scrollToLine(row, true, false);
        ed.focus();
      };
      return arr.slice(0, 200).map(({ s, m }) => ({
        key: "s" + s.row,
        icon: `<span class="sym-badge">${SYM_BADGE[s.kind] || "\xB7"}</span>`,
        html: `<span style="padding-left:${s.level * 12}px">${hlHtml(s.name, q.trim() ? m.idx : [])}</span>`,
        right: `<span>${s.kind}</span><span>:${s.row + 1}</span>`,
        preview: () => ed.scrollToLine(s.row, true, false),
        revert: () => ed.session.setScrollTop(scrollTop),
        run: go(s.row)
      }));
    }
    function lineItems(q) {
      const ed = E(), total = ed.session.getLength();
      const m = /^\s*(\d+)?(?::(\d+))?\s*$/.exec(q);
      if (!m || !m[1]) return [{ disabled: true, icon: '<i class="bi bi-hash"></i>', html: `Current line: ${ed.getCursorPosition().row + 1} of ${total}. Type a line number to jump.`, right: "", key: "x" }];
      const n = clamp(+m[1], 1, total), col = m[2] ? +m[2] : 1;
      return [{
        key: "line",
        icon: '<i class="bi bi-arrow-return-right"></i>',
        html: `Go to line ${n}${m[2] ? `, column ${col}` : ""}`,
        right: `of ${total}`,
        preview: () => ed.scrollToLine(n - 1, true, false),
        revert: () => ed.session.setScrollTop(scrollTop),
        run: () => {
          ed.exitMultiSelectMode();
          ed.gotoLine(n, col - 1, false);
          ed.scrollToLine(n - 1, true, false);
          ed.focus();
        }
      }];
    }
    function build() {
      const v = input.value, c = v[0];
      let mode, ic;
      if (c === ">") {
        mode = "cmd";
        items = cmdItems(v.slice(1));
        ic = "bi-terminal";
      } else if (c === ":") {
        mode = "line";
        items = lineItems(v.slice(1));
        ic = "bi-hash";
      } else if (c === "@") {
        mode = "sym";
        items = symItems(v.slice(1));
        ic = "bi-braces";
      } else {
        mode = "file";
        items = fileItems(v);
        ic = "bi-files";
      }
      iconEl.className = "bi " + ic;
      input.placeholder = "Go to file, > command, : line, @ symbol";
      foot.innerHTML = HINTS[mode].map((h) => `<span>${h}</span>`).join("");
      active = items.findIndex((i) => !i.disabled);
      if (active < 0) active = 0;
      render();
    }
    function render() {
      if (!items.length) {
        listEl.innerHTML = '<li class="pal-empty" role="presentation">No matching results</li>';
        input.removeAttribute("aria-activedescendant");
        applyPreview();
        return;
      }
      listEl.innerHTML = items.map((it, i) => `<li class="pal-item${i === active ? " active" : ""}${it.disabled ? " disabled" : ""}" role="option" id="pal-o${i}" aria-selected="${i === active}" data-i="${i}">${it.icon ? `<span class="pi">${it.icon}</span>` : ""}<span class="pl">${it.html}</span><span class="pr">${it.right || ""}</span></li>`).join("");
      input.setAttribute("aria-activedescendant", "pal-o" + active);
      scrollActive();
      applyPreview();
    }
    function scrollActive() {
      const a = $(".pal-item.active", listEl);
      if (a) a.scrollIntoView({ block: "nearest" });
    }
    function setActive(i) {
      if (!items.length) return;
      active = (i + items.length) % items.length;
      $$(".pal-item", listEl).forEach((li, k) => {
        li.classList.toggle("active", k === active);
        li.setAttribute("aria-selected", String(k === active));
      });
      input.setAttribute("aria-activedescendant", "pal-o" + active);
      scrollActive();
      applyPreview();
    }
    function applyPreview() {
      const it = items[active];
      if (revertFn && (!it || it.revert !== revertFn)) {
        revertFn();
        revertFn = null;
      }
      if (it && it.preview) {
        it.preview();
        revertFn = it.revert || null;
      }
    }
    function commit() {
      const it = items[active];
      if (!it || it.disabled) return;
      committed = true;
      revertFn = null;
      modal.hide();
      setTimeout(() => it.run(), 0);
    }
    function show(prefill = ">") {
      Pick.close(false);
      if (isOpen) {
        input.value = prefill;
        input.focus();
        build();
        return;
      }
      committed = false;
      revertFn = null;
      isOpen = true;
      scrollTop = E().session.getScrollTop();
      input.value = prefill;
      modal.show();
      build();
      input.focus();
      input.setSelectionRange(prefill.length, prefill.length);
    }
    el.addEventListener("shown.bs.modal", () => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    el.addEventListener("hidden.bs.modal", () => {
      if (!committed && revertFn) {
        revertFn();
      }
      revertFn = null;
      isOpen = false;
      if (!committed) setTimeout(() => App.focus(), 0);
      else setTimeout(() => App.focus(), 30);
    });
    input.addEventListener("input", build);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(active + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        setActive(Math.min(items.length - 1, active + 8));
      } else if (e.key === "PageUp") {
        e.preventDefault();
        setActive(Math.max(0, active - 8));
      } else if (e.key === "Enter") {
        e.preventDefault();
        commit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        modal.hide();
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    });
    listEl.addEventListener("mousemove", (e) => {
      const li = e.target.closest(".pal-item");
      if (li && +li.dataset.i !== active && !items[+li.dataset.i].disabled) setActive(+li.dataset.i);
    });
    listEl.addEventListener("click", (e) => {
      const li = e.target.closest(".pal-item");
      if (li) {
        active = +li.dataset.i;
        commit();
      }
    });
    return { show, get isOpen() {
      return isOpen;
    } };
  })();

  // src/editor/commands/file-commands.js
  cmd("file.new", "File", "New File", "Alt+N", () => Docs.newFile(), { aliases: ["Ctrl+N", "Ctrl+Alt+N"] });
  cmd("file.open", "File", "Open File\u2026", "Ctrl+O", () => Files.open());
  cmd("file.openFolder", "File", "Open Folder\u2026", "Alt+Shift+O", () => Folders.open());
  cmd("file.save", "File", "Save", "Ctrl+S", () => Files.save(App.doc()));
  cmd("file.saveAs", "File", "Save As\u2026", "Ctrl+Shift+S", () => Files.save(App.doc(), true));
  cmd("file.rename", "File", "Rename\u2026", "", async () => {
    const d = App.doc(), n = await Dialog.prompt("Rename file", "New name (the extension sets the syntax):", d.name);
    if (n && n.trim()) Docs.rename(d, n.trim());
  });
  cmd("file.close", "File", "Close Tab", "Shift+Alt+W", () => Docs.close(App.doc()), { aliases: ["Ctrl+W"] });
  cmd("file.closeOthers", "File", "Close Other Tabs", "", () => Docs.closeMany(Docs.list.filter((d) => d !== App.doc())));
  cmd("file.closeAll", "File", "Close All Tabs", "", () => Docs.closeMany([...Docs.list]));
  cmd("tab.next", "File", "Next Tab", "Alt+]", () => Docs.cycle(1), { aliases: ["Ctrl+PageDown"] });
  cmd("tab.prev", "File", "Previous Tab", "Alt+[", () => Docs.cycle(-1), { aliases: ["Ctrl+PageUp"] });
  cmd("file.copyName", "File", "Copy File Name", "", () => {
    const n = App.doc().name;
    const done = () => toast('Copied "' + n + '"', { icon: "bi-clipboard-check" });
    try {
      navigator.clipboard.writeText(n).then(done, () => toast("Clipboard unavailable", { type: "warn" }));
    } catch (e) {
      toast("Clipboard unavailable", { type: "warn" });
    }
  });
  cmd("palette.commands", "Goto", "Command Palette", "Ctrl+Shift+P", () => Palette.show(">"), { aliases: ["F1"] });
  cmd("goto.anything", "Goto", "Goto Anything (Switch File)", "Ctrl+P", () => Palette.show(""));
  cmd("goto.line", "Goto", "Go to Line\u2026", "Ctrl+G", () => Palette.show(":"));
  cmd("goto.symbol", "Goto", "Go to Symbol\u2026", "Ctrl+R", () => Palette.show("@"));

  // src/editor/ops.js
  var Ops = {
    /** Ctrl+L: select whole line(s); repeating extends one line at a time; works per cursor. */
    selectLine(ed) {
      const s = ed.session, last = s.getLength() - 1, lastLen = s.getLine(last).length;
      const spans = ed.selection.getAllRanges().map((r) => {
        let a = r.start.row, b = r.end.row;
        if (r.end.column === 0 && b > a) b--;
        const full = !r.isEmpty() && r.start.column === 0 && (r.end.column === 0 && r.end.row > r.start.row || r.end.row === last && r.end.column === lastLen);
        if (full) b = Math.min(b + 1, last);
        return [a, b];
      }).sort((x, y) => x[0] - y[0]);
      const merged = [];
      spans.forEach((sp) => {
        const m = merged[merged.length - 1];
        if (m && sp[0] <= m[1] + 1) m[1] = Math.max(m[1], sp[1]);
        else merged.push(sp.slice());
      });
      const ranges = merged.map(([a, b]) => b < last ? new AceRange(a, 0, b + 1, 0) : new AceRange(a, 0, last, lastLen));
      ed.selection.toSingleRange(ranges[0]);
      for (let i = 1; i < ranges.length; i++) ed.selection.addRange(ranges[i]);
      ed.renderer.scrollCursorIntoView();
    },
    /** Adds the next matching occurrence as an additional cursor. */
    addNextMatch(ed) {
      ed.selectMore(1, false, true);
      ed.renderer.scrollCursorIntoView();
    },
    /** Selects every occurrence of the current word or selection. */
    selectAllMatches(ed) {
      const r = ed.selection.getRange(), wasEmpty = r.isEmpty();
      const wr = wasEmpty ? ed.session.getWordRange(r.start.row, r.start.column) : r;
      const needle = ed.session.getTextRange(wr);
      if (!needle) return toast("Nothing to select", { type: "warn" });
      const n = ed.findAll(needle, { caseSensitive: true, wholeWord: wasEmpty, regExp: false });
      toast(`${n} match${n === 1 ? "" : "es"} selected`, { icon: "bi-cursor-text", ms: 1200 });
    },
    /** Exits multi-cursor mode, closes find, or clears the selection. */
    collapse(ed) {
      if (ed.inMultiSelectMode) ed.exitMultiSelectMode();
      else if (Find.isOpen) Find.close();
      else if (!ed.selection.isEmpty()) ed.selection.clearSelection();
    },
    /** Inserts a new line above or below each cursor with matching indentation. */
    insertLine(ed, below) {
      ed.forEachSelection(() => {
        const s = ed.session, row = ed.selection.getCursor().row, line = s.getLine(row);
        if (below) {
          ed.selection.moveCursorTo(row, line.length);
          ed.insert("\n");
        } else {
          const ind = /^\s*/.exec(line)[0];
          s.insert({ row, column: 0 }, ind + "\n");
          ed.selection.moveCursorTo(row, ind.length);
        }
      });
      ed.renderer.scrollCursorIntoView();
    },
    /** Joins the selected lines, or the current line with the next, for each cursor. */
    joinLines(ed) {
      ed.forEachSelection(() => {
        const s = ed.session, r = ed.getSelectionRange();
        const a = r.start.row;
        let b = r.end.row;
        if (r.end.column === 0 && b > a) b--;
        if (b === a) b = a + 1;
        if (b >= s.getLength()) return;
        let text = s.getLine(a).replace(/\s+$/, "");
        const col = text.length;
        for (let i = a + 1; i <= b; i++) {
          const t = s.getLine(i).trim();
          if (t) text += (text && !/[(\[{]$/.test(text) ? " " : "") + t;
        }
        s.replace(new AceRange(a, 0, b, s.getLine(b).length), text);
        ed.selection.moveCursorTo(a, col);
      });
    },
    /** Apply fn(lines)->lines to the selected rows (or the whole doc when nothing is selected). */
    transformLines(ed, fn) {
      const s = ed.session, ranges = ed.selection.getAllRanges();
      let spans;
      if (ranges.every((r) => r.isEmpty())) spans = [[0, s.getLength() - 1]];
      else {
        const raw = ranges.filter((r) => !r.isEmpty()).map((r) => [r.start.row, r.end.column === 0 && r.end.row > r.start.row ? r.end.row - 1 : r.end.row]).sort((x, y) => x[0] - y[0]);
        spans = [];
        raw.forEach((sp) => {
          const m = spans[spans.length - 1];
          if (m && sp[0] <= m[1]) m[1] = Math.max(m[1], sp[1]);
          else spans.push(sp.slice());
        });
      }
      const results = spans.map(([a, b]) => fn(s.getLines(a, b)));
      let changed = false;
      for (let i = spans.length - 1; i >= 0; i--) {
        const [a, b] = spans[i], old = s.getLines(a, b);
        if (old.join("\n") === results[i].join("\n")) continue;
        changed = true;
        s.replace(new AceRange(a, 0, b, s.getLine(b).length), results[i].join("\n"));
      }
      if (!changed) return toast("Nothing to change", { type: "warn", ms: 1200 });
      if (!ranges.every((r) => r.isEmpty())) {
        let shift = 0;
        const out = [];
        spans.forEach(([a, b], i) => {
          const na = a + shift, nb = na + results[i].length - 1;
          out.push(new AceRange(na, 0, nb, s.getLine(nb).length));
          shift += results[i].length - (b - a + 1);
        });
        ed.selection.toSingleRange(out[0]);
        for (let i = 1; i < out.length; i++) ed.selection.addRange(out[i]);
      }
    },
    /** Case transforms operate on each selection (or the word under an empty cursor). */
    transformText(ed, fn) {
      ed.forEachSelection(() => {
        const s = ed.session;
        let r = ed.getSelectionRange();
        const wasEmpty = r.isEmpty(), orig = ed.selection.getCursor();
        if (wasEmpty) {
          r = s.getWordRange(r.start.row, r.start.column);
          if (r.isEmpty()) return;
        }
        const t = s.getTextRange(r), n = fn(t);
        if (n === t) return;
        s.replace(r, n);
        if (wasEmpty) ed.selection.moveCursorToPosition(orig);
        else ed.selection.setSelectionRange(new AceRange(r.start.row, r.start.column, r.end.row, r.end.column));
      });
    },
    /** Toggles line or block comments using the current language syntax. */
    toggleComment(ed, block) {
      const m = ed.session.getMode();
      if (block ? !m.blockComment : !(m.lineCommentStart || m.blockComment)) return toast("No " + (block ? "block " : "") + "comment syntax for this language", { type: "warn" });
      ed.execCommand(block ? "toggleBlockComment" : "togglecomment");
    },
    /** Converts a string to title case. */
    title: (s) => s.toLowerCase().replace(/(^|[^\p{L}\p{N}'’])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()),
    /** Compares two strings for natural ascending order. */
    cmpAsc: (a, b) => a.localeCompare(b, void 0, { numeric: true })
  };

  // src/editor/commands/edit-commands.js
  cmd("sel.addCursorAbove", "Selection", "Add Cursor Above", "Ctrl+Alt+Up", () => E().selectMoreLines(-1), { scope: "editor" });
  cmd("sel.addCursorBelow", "Selection", "Add Cursor Below", "Ctrl+Alt+Down", () => E().selectMoreLines(1), { scope: "editor" });
  cmd("sel.addNext", "Selection", "Add Next Match as Cursor", "Ctrl+D", () => Ops.addNextMatch(E()), { scope: "editor" });
  cmd("sel.allMatches", "Selection", "Select All Matches", "Ctrl+Shift+L", () => Ops.selectAllMatches(E()), { scope: "editor" });
  cmd("sel.line", "Selection", "Select Line (repeat to extend)", "Ctrl+L", () => Ops.selectLine(E()), { scope: "editor" });
  cmd("sel.single", "Selection", "Single Cursor / Clear Selection", "Esc", () => Ops.collapse(E()), { scope: "editor" });
  cmd("sel.all", "Selection", "Select All", "Ctrl+A", () => E().selectAll(), { scope: "editor" });
  cmd("edit.undo", "Edit", "Undo", "Ctrl+Z", () => E().undo(), { scope: "editor" });
  cmd("edit.redo", "Edit", "Redo", "Ctrl+Y", () => E().redo(), { scope: "editor", aliases: ["Ctrl+Shift+Z"] });
  cmd("line.copyUp", "Line", "Copy Line Up", "Shift+Alt+Up", () => E().execCommand("copylinesup"), { scope: "editor" });
  cmd("line.copyDown", "Line", "Copy Line Down", "Shift+Alt+Down", () => E().execCommand("copylinesdown"), { scope: "editor" });
  cmd("line.moveUp", "Line", "Move Line Up", "Alt+Up", () => E().execCommand("movelinesup"), { scope: "editor" });
  cmd("line.moveDown", "Line", "Move Line Down", "Alt+Down", () => E().execCommand("movelinesdown"), { scope: "editor" });
  cmd("line.delete", "Line", "Delete Line", "Ctrl+Shift+K", () => E().execCommand("removeline"), { scope: "editor" });
  cmd("line.insertBelow", "Line", "Insert Line Below", "Ctrl+Enter", () => Ops.insertLine(E(), true), { scope: "editor" });
  cmd("line.insertAbove", "Line", "Insert Line Above", "Ctrl+Shift+Enter", () => Ops.insertLine(E(), false), { scope: "editor" });
  cmd("line.join", "Line", "Join Lines", "Ctrl+J", () => Ops.joinLines(E()), { scope: "editor" });
  cmd("edit.toggleComment", "Edit", "Toggle Line Comment", "Ctrl+/", () => Ops.toggleComment(E(), false), { scope: "editor" });
  cmd("edit.toggleBlockComment", "Edit", "Toggle Block Comment", "Ctrl+Shift+/", () => Ops.toggleComment(E(), true), { scope: "editor" });
  cmd("edit.indent", "Edit", "Indent", "Ctrl+]", () => E().execCommand("blockindent"), { scope: "editor" });
  cmd("edit.outdent", "Edit", "Outdent", "Ctrl+[", () => E().execCommand("blockoutdent"), { scope: "editor" });
  cmd("edit.fold", "Edit", "Fold", "Ctrl+Shift+[", () => E().execCommand("fold"), { scope: "editor" });
  cmd("edit.unfold", "Edit", "Unfold", "Ctrl+Shift+]", () => E().execCommand("unfold"), { scope: "editor" });
  cmd("edit.foldAll", "Edit", "Fold All", "Ctrl+K Ctrl+0", () => E().session.foldAll(), { scope: "editor" });
  cmd("edit.unfoldAll", "Edit", "Unfold All", "Ctrl+K Ctrl+J", () => E().session.unfold(), { scope: "editor" });
  cmd("text.sortAsc", "Edit", "Sort Lines", "", () => Ops.transformLines(E(), (l) => l.slice().sort(Ops.cmpAsc)), { scope: "editor" });
  cmd("text.sortDesc", "Edit", "Sort Lines (Descending)", "", () => Ops.transformLines(E(), (l) => l.slice().sort((a, b) => Ops.cmpAsc(b, a))), { scope: "editor" });
  cmd("text.reverse", "Edit", "Reverse Lines", "", () => Ops.transformLines(E(), (l) => l.slice().reverse()), { scope: "editor" });
  cmd("text.unique", "Edit", "Remove Duplicate Lines", "", () => Ops.transformLines(E(), (l) => [...new Set(l)]), { scope: "editor" });
  cmd("text.trim", "Edit", "Trim Trailing Whitespace", "", () => {
    const s = E().session;
    let n = 0;
    for (let r = 0; r < s.getLength(); r++) {
      const ln = s.getLine(r), t = ln.replace(/[ \t]+$/, "");
      if (t !== ln) {
        s.remove(new AceRange(r, t.length, r, ln.length));
        n++;
      }
    }
    toast(n ? `Trimmed ${n} line${n > 1 ? "s" : ""}` : "No trailing whitespace", { type: n ? "info" : "warn", ms: 1200 });
  }, { scope: "editor" });
  cmd("text.upper", "Edit", "Convert to Uppercase", "", () => Ops.transformText(E(), (t) => t.toUpperCase()), { scope: "editor" });
  cmd("text.lower", "Edit", "Convert to Lowercase", "", () => Ops.transformText(E(), (t) => t.toLowerCase()), { scope: "editor" });
  cmd("text.title", "Edit", "Convert to Title Case", "", () => Ops.transformText(E(), Ops.title), { scope: "editor" });

  // src/editor/commands/find-commands.js
  cmd("find.find", "Find", "Find\u2026", "Ctrl+F", () => Find.open(false));
  cmd("find.replace", "Find", "Replace\u2026", "Ctrl+H", () => Find.open(true));
  cmd("find.next", "Find", "Find Next", "F3", () => Find.jump(1));
  cmd("find.prev", "Find", "Find Previous", "Shift+F3", () => Find.jump(-1));
  cmd("find.useSelection", "Find", "Use Selection for Find", "Ctrl+E", () => Find.useSelection(), { scope: "editor" });
  cmd("find.regex", "Find", "Toggle Regular Expression", "Alt+R", () => Find.toggleOpt("regExp"), { checked: () => Find.opts.regExp });
  cmd("find.case", "Find", "Toggle Case Sensitive", "Alt+C", () => Find.toggleOpt("caseSensitive"), { checked: () => Find.opts.caseSensitive });
  cmd("find.word", "Find", "Toggle Whole Word", "Alt+W", () => Find.toggleOpt("wholeWord"), { checked: () => Find.opts.wholeWord });

  // src/editor/commands/view-commands.js
  cmd("view.sidebar", "View", "Toggle Sidebar", "Ctrl+K Ctrl+B", () => UI.setSidebar(!S.sidebar), { checked: () => S.sidebar });
  cmd("view.minimap", "View", "Toggle Minimap", "", () => {
    S.minimap = !S.minimap;
    saveSettings();
    UI.applyLayout();
    Settings.sync();
  }, { checked: () => S.minimap });
  cmd("view.statusbar", "View", "Toggle Status Bar", "", () => {
    S.statusbar = !S.statusbar;
    saveSettings();
    UI.applyLayout();
    Settings.sync();
  }, { checked: () => S.statusbar });
  cmd("view.header", "View", "Toggle Header", "Alt+H", () => {
    S.header = !S.header;
    saveSettings();
    UI.applyLayout();
  }, { checked: () => S.header });
  cmd("view.whitespace", "View", "Toggle Whitespace", "", () => UI.setWhitespace(!S.whitespace), { checked: () => S.whitespace });
  cmd("view.distraction", "View", "Toggle Distraction Free Mode", "Shift+F11", () => UI.toggleZen(), { checked: () => UIState.zen });
  cmd("view.zoomIn", "View", "Increase Font Size", "Ctrl+=", () => UI.setZoom(S.fontSize + 1), { aliases: ["Ctrl+Shift+=", "Ctrl++"] });
  cmd("view.zoomOut", "View", "Decrease Font Size", "Ctrl+-", () => UI.setZoom(S.fontSize - 1));
  cmd("view.zoomReset", "View", "Reset Font Size", "Ctrl+0", () => UI.setZoom(CONFIG.DEFAULTS.fontSize));
  cmd("view.ligatures", "View", "Toggle Font Ligatures", "", () => {
    S.ligatures = !S.ligatures;
    saveSettings();
    UI.applyFont();
  }, { checked: () => S.ligatures });
  cmd("view.wrap", "View", "Toggle Word Wrap", "Alt+Z", () => UI.setWrap(S.wrap === "off" ? S.lastWrap || "window" : "off"), { checked: () => S.wrap !== "off" });
  CONFIG.WRAPS.forEach(([id, name]) => cmd("wrap." + id, "Word Wrap", name, "", () => UI.setWrap(id), { checked: () => S.wrap === id }));

  // src/editor/commands/layout-commands.js
  CONFIG.LAYOUTS.forEach((L) => cmd("layout." + L.id, "Layout", L.name, L.key, () => Layout.set(L.id), { checked: () => UIState.layout === L.id }));
  cmd("view.split", "Layout", "Toggle Split View", "Ctrl+K Ctrl+\\", () => UI.toggleSplit(), { checked: () => UIState.layout !== "single" });
  cmd("view.focusNext", "Layout", "Focus Next Pane", "Ctrl+K Ctrl+Right", () => Layout.focusStep(1));
  cmd("view.focusPrev", "Layout", "Focus Previous Pane", "Ctrl+K Ctrl+Left", () => Layout.focusStep(-1));
  for (let i = 0; i < MAX_PANES; i++) cmd("pane.focus" + (i + 1), "Layout", `Focus Pane ${i + 1}`, `Ctrl+K Ctrl+${i + 1}`, () => Layout.focusPane(i));
  cmd("pane.openNext", "Layout", "Show Current File in Next Pane", "Ctrl+K Ctrl+O", () => Layout.openInNext());
  cmd("layout.pick", "Layout", "Choose Layout\u2026", "", () => $("#btnLayout").click());

  // src/editor/commands/prefs-commands.js
  cmd("prefs.open", "Preferences", "Settings: Font, Theme & Editor\u2026", "Ctrl+,", () => Settings.show());
  cmd("font.custom", "Font", "Custom Font\u2026", "", () => Settings.show(true));
  CONFIG.FONTS.forEach((f) => cmd("font." + f.id, "Font", f.id, "", () => UI.setFont(f.id), { checked: () => S.fontFamily === f.id }));
  cmd("font.lhUp", "Font", "Increase Line Height", "", () => UI.setLineHeight(+(S.lineHeight + 0.1).toFixed(2)));
  cmd("font.lhDown", "Font", "Decrease Line Height", "", () => UI.setLineHeight(+(S.lineHeight - 0.1).toFixed(2)));
  cmd("indent.spaces", "Indentation", "Indent Using Spaces", "", () => UI.setIndent({ soft: true }), { checked: () => S.softTabs });
  cmd("indent.tabs", "Indentation", "Indent Using Tabs", "", () => UI.setIndent({ soft: false }), { checked: () => !S.softTabs });
  [2, 4, 8].forEach((n) => cmd("indent.size" + n, "Indentation", `Tab Width: ${n}`, "", () => UI.setIndent({ size: n }), { checked: () => S.tabSize === n }));
  var setEol = (mode) => {
    const d = E().session.getDocument();
    d.setNewLineMode(mode);
    const doc = App.doc();
    doc.forceDirty = true;
    doc._m = true;
    Tabs.markDirty(doc);
    Sidebar.markDirty(doc);
    Status.schedule();
    toast("Line endings: " + (mode === "windows" ? "CRLF" : "LF"), { icon: "bi-arrow-return-left", ms: 1200 });
  };
  cmd("eol.lf", "Line Endings", "Unix (LF)", "", () => setEol("unix"), { checked: () => E().session.getDocument().getNewLineCharacter() === "\n" });
  cmd("eol.crlf", "Line Endings", "Windows (CRLF)", "", () => setEol("windows"), { checked: () => E().session.getDocument().getNewLineCharacter() === "\r\n" });
  Langs.list.forEach((l) => cmd("lang." + l.id, "Syntax", l.name, "", () => {
    Docs.setLang(App.doc(), l.id);
    toast("Syntax: " + l.name, { icon: "bi-code-slash", ms: 1100 });
  }, { checked: () => App.doc() && App.doc().lang === l.id }));
  CONFIG.THEMES.forEach((t) => cmd("theme." + t.id, "Color Scheme", t.name, "", () => Themes.set(t.id), {
    checked: () => Themes.current === t.id,
    preview: () => Themes.apply(t.id),
    revert: () => Themes.revert()
  }));
  cmd("theme.pick", "Preferences", "Select Color Scheme\u2026", "", () => Palette.show(">Color Scheme: "));

  // src/editor/sheet.js
  var Sheet = (() => {
    const el = $("#sheet"), modal = new bootstrap.Modal(el), body = $("#sheetBody"), filter = $("#sheetFilter");
    let rec = null;
    function render() {
      const q = filter.value.trim().toLowerCase();
      const cats = /* @__PURE__ */ new Map();
      Commands.list.forEach((c) => {
        if (q && !(Commands.label(c) + " " + Keys.pretty(Keys.effective(c.id))).toLowerCase().includes(q)) return;
        const k = c.category || "General";
        if (!cats.has(k)) cats.set(k, []);
        cats.get(k).push(c);
      });
      body.innerHTML = [...cats.entries()].map(([cat, cs]) => `<div class="sh-cat">${esc(cat)}</div>` + cs.map((c) => {
        const sc = Keys.effective(c.id), isRec = rec && rec.id === c.id;
        return `<div class="sh-row${isRec ? " rec" : ""}" data-id="${c.id}"><span class="t">${esc(c.title)}</span><span class="k">${isRec ? `<span class="rec-msg">${rec.keys.length ? esc(Keys.pretty(rec.keys.join(" "))) + " \u2026 " : ""}Press new shortcut (Esc cancels, Backspace unbinds)</span>` : sc ? Keys.html(sc) : '<span class="none">unbound</span>'}</span><button class="ib" data-edit="${c.id}" aria-label="Edit shortcut for ${esc(c.title)}" title="Edit shortcut"><i class="bi bi-pencil" aria-hidden="true"></i></button></div>`;
      }).join("")).join("") || '<div class="pal-empty">No matching commands</div>';
      const r = $(".sh-row.rec .ib", body);
      if (r) r.focus();
    }
    function endRec(save) {
      if (!rec) return;
      clearTimeout(rec.timer);
      const r = rec;
      rec = null;
      if (save && r.keys.length) {
        const replaced = Keys.setBinding(r.id, r.keys.join(" "));
        toast(replaced.length ? `Bound. Unbound "${replaced[0]}"` : "Shortcut updated", { icon: "bi-keyboard" });
      }
      render();
    }
    el.addEventListener("keydown", (e) => {
      if (!rec) return;
      e.preventDefault();
      e.stopPropagation();
      const cand = Keys.candidates(e)[0];
      if (!cand) return;
      if (cand === "Esc") return endRec(false);
      if (cand === "Backspace" || cand === "Delete") {
        Keys.setBinding(rec.id, "");
        toast("Shortcut removed", { icon: "bi-keyboard" });
        rec = null;
        return render();
      }
      if (cand === "Enter" && rec.keys.length) return endRec(true);
      clearTimeout(rec.timer);
      rec.keys.push(cand);
      if (rec.keys.length >= 2) return endRec(true);
      render();
      rec.timer = setTimeout(() => endRec(true), 1100);
    }, true);
    body.addEventListener("click", (e) => {
      const b = e.target.closest("[data-edit]");
      if (!b) return;
      if (rec) endRec(false);
      rec = { id: b.dataset.edit, keys: [], timer: 0 };
      render();
    });
    filter.addEventListener("input", render);
    $("#sheetReset").addEventListener("click", () => {
      Keys.reset();
      render();
      toast("Key bindings reset to defaults", { icon: "bi-arrow-counterclockwise" });
    });
    el.addEventListener("hidden.bs.modal", () => {
      rec = null;
      setTimeout(() => App.focus(), 0);
    });
    return {
      /** Shows the shortcut sheet with a cleared filter. */
      show() {
        filter.value = "";
        rec = null;
        render();
        modal.show();
        setTimeout(() => filter.focus(), 60);
      }
    };
  })();

  // src/editor/commands/help-commands.js
  cmd("help.shortcuts", "Help", "Keyboard Shortcuts", "Ctrl+K Ctrl+S", () => Sheet.show());
  cmd("keymap.reset", "Preferences", "Reset Key Bindings to Defaults", "", () => {
    Keys.reset();
    toast("Key bindings reset to defaults", { icon: "bi-arrow-counterclockwise" });
  });

  // src/editor/menus.js
  var Menus = {
    el: $("#menubar"),
    /** Builds the menu bar and wires dropdown, command, and focus restoration handlers. */
    init() {
      this.el.innerHTML = Object.keys(CONFIG.MENUS).map((name) => `<div class="dropdown"><button class="menu-btn" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true">${name}</button><ul class="dropdown-menu" data-menu="${name}" role="menu"></ul></div>`).join("");
      this.el.addEventListener("show.bs.dropdown", (e) => this.fill($(".dropdown-menu", e.target.closest(".dropdown"))));
      this.el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-cmd]");
        if (!b) return;
        if (b.dataset.cmd === "file.open") Commands.exec("file.open", { recent: true });
        else setTimeout(() => {
          Commands.exec(b.dataset.cmd, { recent: true });
        }, 0);
      });
      this.el.addEventListener("hidden.bs.dropdown", () => {
        setTimeout(() => {
          if (!Palette.isOpen && !Pick.isOpen && !document.body.classList.contains("modal-open")) App.focus();
        }, 0);
      });
    },
    /** Populates a dropdown with commands, shortcuts, and checked states from the registry. */
    fill(ul) {
      ul.innerHTML = CONFIG.MENUS[ul.dataset.menu].map((id) => {
        if (id === "-") return '<li><hr class="dropdown-divider"></li>';
        const c = Commands.byId.get(id);
        if (!c) return "";
        const on = c.checked && c.checked();
        return `<li><button class="dropdown-item" role="menuitem" data-cmd="${id}"><span class="chk">${on ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : ""}</span><span>${esc(c.title)}</span><span class="sc">${Keys.html(Keys.effective(id))}</span></button></li>`;
      }).join("");
    }
  };

  // src/editor/samples.js
  var SAMPLE_JS = `// Welcome to Sublime Web. Try the multi-cursor features on this file:
//   Ctrl+D          add the next match (try it on "item")
//   Ctrl+Shift+L    select all matches
//   Ctrl+L          select line (repeat to extend)
//   Ctrl+Alt+Up/Down add cursors above / below
//   Ctrl+Shift+P    command palette, Ctrl+P switch file, Ctrl+R symbols
//   Alt+Shift+2     two columns (Alt+Shift+1..8 pick other layouts)
class ShoppingCart {
  constructor() {
    this.items = [];
  }
  add(item, qty = 1) {
    this.items.push({ item, qty });
    return this;
  }
  total(prices) {
    return this.items.reduce((sum, { item, qty }) => sum + prices[item] * qty, 0);
  }
}
function formatPrice(value) {
  return '$' + value.toFixed(2);
}
const prices = { apple: 0.5, bread: 2.25, cheese: 7.9 };
const cart = new ShoppingCart().add('apple', 4).add('bread').add('cheese', 2);
console.log('Total:', formatPrice(cart.total(prices)));
`;
  var SAMPLE_MD = `# Sublime Web
A keyboard-driven code editor that runs in the browser.
## Getting started
- **Alt+N** (or the + button) creates a new tab. Ctrl+N works where the browser allows it.
- **Ctrl+O** (or the folder icon) opens files from your computer; drag & drop works too.
- **Ctrl+Shift+P** opens the command palette. Type \`:\` to jump to a line, \`@\` for symbols.
- **Ctrl+P** switches between open files.
- **Ctrl+K Ctrl+S** shows every shortcut, and lets you rebind them.
## Layouts
- Click the layout button in the title bar, or use **Alt+Shift+1\u20268**: columns, rows, a 2 x 2 grid and more.
- Drag a tab onto any pane to open it there. **Ctrl+K Ctrl+Right** moves focus between panes.
## Language & font
- Click the language name in the status bar to change the syntax mode.
- Click the font name in the status bar (or **Ctrl+,**) for font family, size, line height and ligatures.
## Multiple cursors
1. Ctrl+Click adds a cursor, Alt+Drag makes a column selection.
2. Ctrl+D selects the next occurrence of the current word.
3. Esc returns to a single cursor.
`;

  // src/editor/boot.js
  function boot() {
    Themes.init();
    Keys.rebuild();
    for (let i = 0; i < MAX_PANES; i++) makePane(i);
    UI.applyLayout();
    UI.applyFont();
    Tabs.init();
    Sidebar.init();
    Status.init();
    Menus.init();
    Find.init();
    Settings.init();
    Themes.apply(Themes.current);
    if (!Persist.restore()) {
      const a = Docs.create({ name: "demo.js", text: SAMPLE_JS });
      Docs.create({ name: "Welcome.md", text: SAMPLE_MD });
      Docs.activate(a, 0);
    }
    $("#btnSidebar").addEventListener("click", () => Commands.exec("view.sidebar"));
    $("#btnPalette").addEventListener("click", () => Commands.exec("palette.commands"));
    $("#btnNew").addEventListener("click", () => Commands.exec("file.new"));
    $("#btnOpen").addEventListener("click", () => Commands.exec("file.open"));
    $("#btnSave").addEventListener("click", () => Commands.exec("file.save"));
    $("#btnSettings").addEventListener("click", () => Commands.exec("prefs.open"));
    $("#btnLayout").addEventListener("click", (e) => Pick.open(e.currentTarget, {
      title: "Pane layout",
      filter: false,
      items: CONFIG.LAYOUTS.map((L) => ({ label: L.name, icon: Layout.icon(L), sc: Keys.effective("layout." + L.id), checked: UIState.layout === L.id, run: () => Commands.exec("layout." + L.id, { recent: true }) }))
    }));
    new ResizeObserver(() => App.panes.forEach((p) => p.editor.resize())).observe($("#editors"));
    if (document.fonts) document.fonts.addEventListener("loadingdone", () => App.panes.forEach((p) => {
      p.editor.renderer.updateFontSize();
      p.mm.schedule();
    }));
    window.addEventListener("resize", () => App.panes.forEach((p) => p.mm.schedule()));
    Status.update();
    App.panes[App.active].editor.focus();
  }

  // src/main.js
  boot();
})();
