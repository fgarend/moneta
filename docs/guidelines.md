# Guidelines

How to use Moneta's look when building a screen. It comes with the package, so the copy in `node_modules` is the one for
the version installed. It holds only what exists, and each reviewed piece adds its section. Why each rule is so is in
[the theme's decisions](https://github.com/fgarend/moneta/blob/main/docs/decisions/theme.md).

## Colour

- **The page is `--background`, a card is `--card`, and a menu or dialog is `--popover`.** A card stands out by its edge,
  not by a strong fill.
- **Text is `--foreground`, and secondary text, such as a label, a date or a hint, is `--muted-foreground`.** Both reach
  4.5:1 on the page, a card and `--muted`.
- **`--primary` is for a screen's main action and for what is selected.** `--secondary` and `--accent` are quiet fills,
  for a secondary action and for hover.
- **`--border` is for a divider and the lines between rows, and `--input` for a control's edge,** which reaches 3:1
  against the page and a card, so a field's edge is seen.
- **`--destructive` is for an error and for an action that deletes.** A word says it too, never colour alone.
- **Gold is for little.** `Button`'s `variant="gold"`, at most once per screen, with `--gold-foreground` on it. Never a
  page's or a card's background, and never text, as it reaches only 1.66:1 on the page.
- **The sidebar is the one dark surface in light,** `--sidebar`, and what sits on it reads `--sidebar-foreground`,
  `--sidebar-accent`, `--sidebar-border` and `--sidebar-ring`. Moneta has no `Sidebar` yet, so an app's own reads them.
- **`--chart-1` to `--chart-5` are still shadcn's greys,** until charts are reviewed.

## Size

- **Controls are 36 px tall by default, 40 at `size="lg"` for a page's main action, and 32 at `size="sm"` for a dense
  place,** such as a table's row. That holds for `Button`, `Input`, `InputGroup`, `NativeSelect`, `Pagination`, `Select`,
  `Tabs`, `Toggle` and `ToggleGroup`, where each has the size. `xs` is shadcn's, outside this scale.
- **The controls in a row with a page's main action are 40 px as well,** so the row lines up.
- **The radius is `--radius`,** and every piece takes its corners from it.

## Text

- **The font is Geist, in `--font`,** with tabular figures in amounts, so digits line up in a column.
- **The scale,** in px of size and line height: 32/40 for a page's title, 24/32 for an amount of note, 18/24 for a
  section, 15/22 for a card's title, 14/20 for the body, 13/20 for a label and 12/16 for a caption.
- **One emphasis at each level:** 600 for titles and amounts of note, 500 for an amount in a row, 400 for the rest.
- **An app gets the scale through the pieces,** with no class of its own: `Card`'s title and description and `Table`'s
  header already read it. A page's title and an amount have no piece yet.

## Space

- **In multiples of 4 px:** 4 between a label and what it names, as a value or a bar, and between `Card`'s title and
  description, 8 to 12 within a group, 16 to 20 in a card, 16 between cards, 40 between sections, and 40 to 48 around a
  page. Inside is smaller than between, so what belongs together reads together.
- **`Card` has 20 px around its content, and `Table` 12 px in a cell, with 20 at each end of a row,** so a table in a
  card lines up with the card's title.

## Focus

- **Keyboard focus is a solid outline,** 2 px with 2 px of offset, in `--ring`. The theme draws it on every control of
  the page, an app's own too, so it is never removed.
- **An area with a dark surface of its own sets `--ring` there,** as the sidebar does with `--sidebar-ring`, so the
  outline still shows on it.

## Dark

- **Put the class `dark` on the page's root, or on any part of the page,** before the first paint, or the page flashes
  light. Gold is the same in both modes.

## Changing the look

- **Redefine the variables after Moneta's import, outside any `@layer`, and again under `.dark`.** Before the import, or
  in a layer, nothing changes, and with `:root` alone the light value also holds in dark.
- **Keep the contrast:** 4.5:1 for text on every surface it sits on, and 3:1 for `--input` and `--ring` against the page
  and a card.
- **`--font` changes the font,** and the app loads its own.
