/* First-run sample documents. */

export const SAMPLE_JS = `// Welcome to Sublime Web. Try the multi-cursor features on this file:
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
export const SAMPLE_MD = `# Sublime Web
A keyboard-driven code editor that runs in the browser.
## Getting started
- **Alt+N** (or the + button) creates a new tab. Ctrl+N works where the browser allows it.
- **Ctrl+O** (or the folder icon) opens files from your computer; drag & drop works too.
- **Ctrl+Shift+P** opens the command palette. Type \`:\` to jump to a line, \`@\` for symbols.
- **Ctrl+P** switches between open files.
- **Ctrl+K Ctrl+S** shows every shortcut, and lets you rebind them.
## Layouts
- Click the layout button in the title bar, or use **Alt+Shift+1…8**: columns, rows, a 2 x 2 grid and more.
- Drag a tab onto any pane to open it there. **Ctrl+K Ctrl+Right** moves focus between panes.
## Language & font
- Click the language name in the status bar to change the syntax mode.
- Click the font name in the status bar (or **Ctrl+,**) for font family, size, line height and ligatures.
## Multiple cursors
1. Ctrl+Click adds a cursor, Alt+Drag makes a column selection.
2. Ctrl+D selects the next occurrence of the current word.
3. Esc returns to a single cursor.
`;
