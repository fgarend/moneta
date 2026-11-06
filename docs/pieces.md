# Pieces

The state of each of shadcn's pieces in `src/components/ui/`, as `test/pieces.test.ts` keeps it complete.

- **raw:** as shadcn delivers it. It works, nobody has reviewed it, and it may fail WCAG 2.2 AA.
- **reviewed:** it has what the roadmap's milestone 4 asks of a reviewed piece. 1.0 needs every piece here.

Everything raw is also unchecked for contrast, focus and target size until the package has CSS, so the table does
not repeat that. Gaps marked **lint** were read from Biome on 2026-11-06. Those marked **to confirm** come from an
earlier study, and were not measured again. A piece with no gap listed has simply not been looked at.

| Piece | State | Known gaps |
| --- | --- | --- |
| `alert` | raw | |
| `alert-dialog` | raw | **lint:** an unused import |
| `aspect-ratio` | raw | |
| `avatar` | raw | |
| `badge` | raw | **to confirm:** its fixed height against text spacing |
| `breadcrumb` | raw | **lint:** default text, "More" |
| `button` | raw | |
| `button-group` | raw | |
| `card` | raw | |
| `checkbox` | raw | **lint:** a deprecated React Aria import. **To confirm:** draws a check when indeterminate |
| `collapsible` | raw | |
| `context-menu` | raw | |
| `dialog` | raw | **lint:** default text, "Close" |
| `dropdown-menu` | raw | |
| `empty` | raw | |
| `field` | raw | **lint:** an array index as a key. **To confirm:** does not link its description or error |
| `hover-card` | raw | |
| `input` | raw | |
| `input-group` | raw | |
| `item` | raw | **to confirm:** its group has a list role with no list items |
| `kbd` | raw | |
| `label` | raw | **lint:** an unused import |
| `native-select` | raw | |
| `pagination` | raw | **lint:** default text, "Previous", "Next", "Go to previous page", "Go to next page" and "More pages" |
| `popover` | raw | |
| `progress` | raw | |
| `radio-group` | raw | **lint:** a deprecated React Aria import |
| `scroll-area` | raw | |
| `select` | raw | |
| `separator` | raw | |
| `sheet` | raw | **lint:** default text, "Close". **To confirm:** Esc from a link with a `tooltip` |
| `skeleton` | raw | |
| `slider` | raw | **lint:** an array index as a key |
| `spinner` | raw | Default text, "Loading" |
| `switch` | raw | **lint:** a deprecated React Aria import |
| `table` | raw | |
| `tabs` | raw | **to confirm:** inactive text fails contrast through opacity, and its fixed height fails text spacing |
| `textarea` | raw | |
| `toggle` | raw | |
| `toggle-group` | raw | |
| `tooltip` | raw | |
