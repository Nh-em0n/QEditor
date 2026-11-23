/* Find and replace commands. */
import { cmd } from "../commands.js";
import { Find } from "../find.js";

/** Open the find panel. */
cmd('find.find', 'Find', 'Find…', 'Ctrl+F', () => Find.open(false));
/** Open the find panel with the replace row visible. */
cmd('find.replace', 'Find', 'Replace…', 'Ctrl+H', () => Find.open(true));
/** Jump to the next match. */
cmd('find.next', 'Find', 'Find Next', 'F3', () => Find.jump(1));
/** Jump to the previous match. */
cmd('find.prev', 'Find', 'Find Previous', 'Shift+F3', () => Find.jump(-1));
/** Use the current selection (or word) as the search query. */
cmd('find.useSelection', 'Find', 'Use Selection for Find', 'Ctrl+E', () => Find.useSelection(), { scope: 'editor' });
/** Toggle regular-expression search. */
cmd('find.regex', 'Find', 'Toggle Regular Expression', 'Alt+R', () => Find.toggleOpt('regExp'), { checked: () => Find.opts.regExp });
/** Toggle case-sensitive search. */
cmd('find.case', 'Find', 'Toggle Case Sensitive', 'Alt+C', () => Find.toggleOpt('caseSensitive'), { checked: () => Find.opts.caseSensitive });
/** Toggle whole-word search. */
cmd('find.word', 'Find', 'Toggle Whole Word', 'Alt+W', () => Find.toggleOpt('wholeWord'), { checked: () => Find.opts.wholeWord });
