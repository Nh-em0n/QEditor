/* Help and keybinding commands. */
import { cmd } from "../commands.js";
import { Keys } from "../keys.js";
import { Sheet } from "../sheet.js";
import { toast } from "../toast.js";

/** Show the keyboard shortcut cheat sheet / keybinding editor. */
cmd('help.shortcuts', 'Help', 'Keyboard Shortcuts', 'Ctrl+K Ctrl+S', () => Sheet.show());
/** Reset all key bindings to their defaults. */
cmd('keymap.reset', 'Preferences', 'Reset Key Bindings to Defaults', '', () => { Keys.reset(); toast('Key bindings reset to defaults', { icon: 'bi-arrow-counterclockwise' }); });
