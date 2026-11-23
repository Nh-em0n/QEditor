## QEditor

![screenshot_QEditor](https://i.imgur.com/pps33U9.png)

[QEditor](https://nh-em0n.github.io/QEditor/) a Sublime like web text editor — written in pure vanilla JS

A keyboard-driven, multi-pane code editor that runs in the browser. It uses **plain
JavaScript ES modules** — no framework, no TypeScript, no CSS utility build step.

### Project structure

```
index.html                 static UI shell, local vendor scripts, loads app.js
app.js                     generated double-click bundle (rebuild command above)
vendor/                    local Bootstrap, Bootstrap Icons and Ace libraries
src/main.js                ES-module entry point: calls boot()
src/editor/
  config.js                constants, Ace setup, themes/fonts/languages data
  util.js  state.js        DOM/storage helpers, persisted settings
  commands.js              command registry
  commands/*.js            command definitions grouped by feature
  keys.js                  keybinding + chord manager
  boot.js                  wires the shell, restores the session, starts the app
  app.js  docs.js          active pane state, documents, sessions, tab lifecycle
  files.js  folders.js     file I/O and the open-folder explorer
  persist.js               hot-exit session persistence
  panes.js  minimap.js     Ace panes and the canvas minimap
  find.js  ops.js          find/replace and multi-cursor editing operations
  ui.js  layout.js         chrome, fonts, panes-as-CSS-grid layouts
  tabs.js  sidebar.js  status.js  menus.js  settings.js  picker.js
  palette.js  fuzzy.js     command palette, file/line/symbol search
  dialog.js  toast.js  sheet.js  langs.js  themes.js  samples.js
  editor.css               all editor styles
```

Every function and method carries a one-line JSDoc comment describing its purpose.
