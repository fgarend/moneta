# Pieces

The state of each of shadcn's pieces in `src/components/ui/`, as `test/pieces.test.ts` keeps it complete.

- **raw:** as shadcn delivers it. It works, nobody has reviewed it, and it may fail WCAG 2.2 AA.
- **reviewed:** it has what the roadmap's milestone 4 asks of a reviewed piece. 1.0 needs every piece here.

Every piece has a story, in the light theme, mostly in its default variant, and many of its parts are not drawn.
A story passes axe, text spacing and forced colours unless its row says otherwise. Each of these was measured on
2026-11-06, in the browsers that check runs in, and lets that story off that check until the piece is reviewed:

- **axe:** the story keeps axe's `todo` mode, which warns.
- **forced colours:** the story has the tag `gap-forced-colors`.

So a clean piece that gets worse turns a check red, and `test/pieces.test.ts` holds the stories and this table to the
same list. A pass says little here:

- Text spacing and forced colours do not run a story's `play`, and look only inside its own container. So they never
  see an open overlay's content, which axe does.
- Nothing checks the keyboard beyond where focus lands, closing an overlay, the dark theme, target size beyond axe, or a long
  text.

**Edited** marks a change made to a raw piece, which an update of it has to keep. The other marks are not measured by a check. **Code:** read from the piece. **Default text:** written in the piece,
with no prop, read from the code. **Lint:** read from Biome. **To confirm:** from an earlier study, not measured again.
A piece with no gap listed may still have some.

| Piece | State | Known gaps |
| --- | --- | --- |
| `alert` | raw | |
| `alert-dialog` | raw | **lint:** an unused import |
| `aspect-ratio` | raw | |
| `avatar` | raw | |
| `badge` | raw | |
| `breadcrumb` | raw | **Default text:** "breadcrumb" and "More" |
| `button` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40, with the variant `gold` |
| `button-group` | raw | |
| `card` | raw | **Edited:** reads the scale of text, with 20 px around its content |
| `checkbox` | raw | **Code:** draws a check when indeterminate, and does not grow for its children. **Lint:** a deprecated React Aria import |
| `collapsible` | raw | **Code:** its trigger has no style of its own |
| `context-menu` | raw | |
| `dialog` | raw | **Default text:** "Close" |
| `dropdown-menu` | raw | |
| `empty` | raw | |
| `field` | raw | **Code:** does not link its description or error, which its story does by hand. **Lint:** an array index as a key |
| `hover-card` | raw | **Code:** its dialog has no name unless given `aria-label`. Opening by focus or hover is not checked |
| `input` | raw | **Edited:** 36 px |
| `input-group` | raw | **Edited:** 36 px. A click on an addon focusing the input is not checked, as that story failed at random in Firefox |
| `item` | raw | **axe:** its group has a list role, with links and buttons and no list items |
| `kbd` | raw | |
| `label` | raw | **lint:** an unused import |
| `native-select` | raw | **Edited:** 36 px, and `sm` 32 |
| `pagination` | raw | **Edited:** its ellipsis follows the 36 px of a button. **Default text:** "pagination", "Previous", "Next", "Go to previous page", "Go to next page" and "More pages" |
| `popover` | raw | **Code:** its title does not name it |
| `progress` | raw | **Code:** indeterminate draws the bar at 100%, as complete |
| `radio-group` | raw | **Code:** an item does not grow for its children. **Lint:** a deprecated React Aria import |
| `scroll-area` | raw | **axe:** takes no focus when nothing in it can, so the keyboard cannot scroll it |
| `select` | raw | **Edited:** default 36 px, and `sm` 32. **forced colours:** the chevron keeps its own colour, in Chromium |
| `separator` | raw | |
| `sheet` | raw | **Default text:** "Close" |
| `skeleton` | raw | |
| `slider` | raw | **Code:** drops its children. **Lint:** an array index as a key |
| `spinner` | raw | **Default text:** "Loading". **Code:** spins with no regard for reduced motion |
| `switch` | raw | **Code:** does not grow for its children. **Lint:** a deprecated React Aria import |
| `table` | raw | **Edited:** a quiet header and 12 px rows, with 20 px at each end. **Code:** its caption is a `figcaption` with no `figure` |
| `tabs` | raw | **Edited:** 36 px, and its inactive text reads `muted-foreground`, as `foreground/60` is 3.89:1 on our `muted` |
| `textarea` | raw | |
| `toggle` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40 |
| `toggle-group` | raw | |
| `tooltip` | raw | **Code:** its trigger breaks with a Fragment as a child. While open, React Aria stops Esc from reaching what is around it, so in an overlay the first Esc closes only the tooltip |
