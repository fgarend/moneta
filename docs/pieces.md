# Pieces

The state of each piece, shadcn's and our own, as `test/pieces.test.ts` keeps it complete. A piece is shadcn's when
`upstream/shadcn/` holds it as last taken.

- **raw:** it meets the rule every piece meets, as `docs/decisions/components.md` says, but nobody has reviewed it, and
  it may fail WCAG 2.2 AA.
- **reviewed:** it has its stories, its visual test and contrast in both modes, its accessibility report, its section
  in the guidelines and its line in the changelog, and no default text. 1.0 needs every piece here.

Every piece has stories, run in light and in dark, which draw every part and branch of its code, as coverage asks.
A story passes axe, text spacing, forced colours and reflow unless its row says otherwise. Each of these was measured
on 2026-11-06, reflow on 2026-11-13, in the browsers that check runs in, and lets that story off that check until the
piece is reviewed:

- **axe:** the story keeps axe's `todo` mode, which warns.
- **forced colours:** the story has the tag `gap-forced-colors`.
- **reflow:** the story has the tag `gap-reflow`.

So a clean piece that gets worse turns a check red, and `test/pieces.test.ts` holds the stories and this table to the
same list. A pass says little here:

- Text spacing, forced colours and reflow do not run a story's `play`, and look only inside its own container. So they never
  see an open overlay's content, which axe does.
- Nothing checks the keyboard beyond where focus lands, closing an overlay, target size beyond axe, or a long
  text.

**Edited** marks a change to what a piece draws or does, beyond the rule every piece meets, which `make shadcn-update` keeps in its merge. The other marks are not measured by a check. **Code:** read from the piece. **Default text:** written in the piece,
with no prop or as a prop's default, read from the code. **To confirm:** from an earlier study, not measured again.
A piece with no gap listed may still have some.

| Piece | State | Known gaps |
| --- | --- | --- |
| `alert` | raw | **Edited:** `success`, `warning` and `info` variants, drawn as `destructive`. **Code:** every variant is `role="alert"`, which interrupts a screen reader even for news that can wait |
| `alert-dialog` | raw | |
| `amount` | reviewed | |
| `app-layout` | reviewed | |
| `aspect-ratio` | raw | |
| `avatar` | raw | |
| `badge` | raw | **Edited:** `badgeVariants` is not exported, and `success`, `warning` and `info` variants, drawn as `destructive` |
| `breadcrumb` | raw | **Edited:** the current page is React Aria's Link, marked and disabled. **Default text:** "breadcrumb" and "More" |
| `button` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40, the same for `icon`, `icon-sm` and `icon-lg`, with the variant `gold`. `sm`'s text is 12 px, `secondary`'s hover reads `--secondary-hover`, and `buttonVariants` is not exported |
| `button-group` | raw | **Edited:** React Aria's `Group`, and `buttonGroupVariants` is not exported |
| `card` | raw | **Edited:** `CardAction` lays several controls in a row, 8 px apart, wrapping, reads the scale of text, with 20 px around its content, sets `--surface`, and a content holding only a table, or a selection bar and a table, runs edge to edge |
| `checkbox` | raw | **Code:** does not grow for its children. **Edited:** on React Aria's `CheckboxField` and `CheckboxButton`, and a dash on a filled box when indeterminate |
| `collapsible` | raw | **Code:** its trigger has no style of its own |
| `context-menu` | raw | |
| `date-field` | reviewed | **Edited:** `lg` 40 px, beside 36 and `sm` 32 |
| `date-time` | reviewed | |
| `dialog` | raw | **Edited:** 16 px from each edge by `inset-x-4`, and React Aria's types are not exported, and its close button's name comes from `closeLabel`, and it sets `--surface` |
| `dropdown-menu` | raw | |
| `empty` | raw | |
| `field` | raw | **Code:** does not link its description or error, which its story does by hand. **Edited:** React Aria's `Group` |
| `hover-card` | raw | **Code:** its dialog has no name unless given `aria-label`. Opening by focus or hover is not checked |
| `input` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40, by a `size` in place of the input's own, its width in characters |
| `input-group` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40, its input as tall as the group, its addon is React Aria's `Group`, and pulls a button or `kbd` 4 or 2 px toward the edge |
| `item` | reviewed | **Edited:** `ItemMedia`'s icon tile takes a category's colour by `category={n}`. **Code:** `Item`'s `size` has `default` and `sm` the same, as shadcn's own file has them |
| `kbd` | raw | |
| `label` | raw | |
| `link` | reviewed | |
| `moneta-provider` | reviewed | |
| `native-select` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40 |
| `pagination` | reviewed | |
| `percent` | reviewed | |
| `popover` | raw | **Code:** its title does not name it |
| `progress` | raw | **Edited:** indeterminate, a part of the bar runs across it, still and dashed with less motion |
| `quantity` | reviewed | |
| `radio-group` | raw | **Code:** an item does not grow for its children. **Edited:** on React Aria's `RadioField` and `RadioButton` |
| `section` | reviewed | |
| `scroll-area` | raw | **axe:** takes no focus when nothing in it can, so the keyboard cannot scroll it. **reflow:** the same at 320 px, where its lines overflow |
| `select` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40, and its separator is hidden from screen readers. **forced colours:** the chevron keeps its own colour, in Chromium |
| `separator` | raw | |
| `sheet` | raw | **Edited:** React Aria's types are not exported, its close button's name comes from `closeLabel`, it sets `--surface`, and its `aria-label` or `aria-labelledby` names its dialog |
| `sidebar` | reviewed | |
| `skeleton` | raw | **Edited:** it pulses only when its reader has not asked for less motion |
| `skip-link` | reviewed | |
| `slider` | raw | **Code:** drops its children |
| `spinner` | raw | **Default text:** "Loading". **Code:** spins with no regard for reduced motion |
| `switch` | raw | **Edited:** on React Aria's `SwitchField` and `SwitchButton`, with an 18 px track. **Code:** does not grow for its children |
| `table` | reviewed | |
| `tabs` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40 on `TabsList`, and its inactive text reads `muted-foreground`, as `foreground/60` is 3.89:1 on our `muted`, its trigger is as tall as its list, and `tabsListVariants` is not exported |
| `textarea` | raw | |
| `toggle` | raw | **Edited:** default 36 px, `sm` 32 and `lg` 40, `sm`'s text is 12 px, and `toggleVariants` is not exported |
| `toggle-group` | raw | **Edited:** each item draws a `Toggle` |
| `tooltip` | raw | **Code:** its trigger breaks with a Fragment as a child. While open, React Aria stops Esc from reaching what is around it, so in an overlay the first Esc closes only the tooltip. **Edited:** appears in 100 ms, as the other overlays |
