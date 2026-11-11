# Changelog

What changes for an app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and `docs/releasing.md` says how a version
gets its number.

## [Unreleased]

### Changed

- **Breaking:** `Table` is a native `<table>`, no longer React Aria's grid, so screen readers read it as a table, a
  link in a cell is in Tab order, and its text can be selected. To upgrade:
  - give it a name: `aria-label`, `aria-labelledby`, or `caption`, which replaces `TableCaption`;
  - put the header's cells in a `TableRow` inside `TableHeader`;
  - title each row with `TableHead scope="row"` in place of `isRowHeader` on a column;
  - write `align="end"` on the header and the cells of a column of numbers, in place of `text-right`;
  - drop the classes that made a table run edge to edge in a card: alone in its `CardContent`, it does so itself;
  - in place of `selectionMode`, put a `TableSelect` in a cell before each row's title and a `TableSelectAll` in the
    header, with an `id` on each row;
  - `TableFooter`, selection, row actions and sorting come back later in this version.

### Added

- `hideBelow` on a table's cells, which hides a column when the table is narrow, by its own width.
- `hideCurrency` on `Amount`, which leaves its currency out, for a column of one currency whose header names it.
- `--surface`, the colour of the surface a piece sits on, which `Card`, `Sheet` and `Dialog` set.
- `TableGroupRow`, a group's title and subtotals, in a `TableBody` of its own, and `TableFooter` again, for a total
  under a double line.
- `--border-strong`, the line that marks a table's groups and total.
- `TableRowAction`, an action on a row, named by the app's one word and the row's title, and `hideHeader` on a
  `TableHead`, for a column of controls.
- A table's row opens the link in its title on a click anywhere empty in it.
- Child rows: a `TableRow` with `parentId` shows under its parent while that is open, by a button the table draws in
  the parent's title, with `expandedKeys`, `defaultExpandedKeys` and `onExpandedChange` on the `Table`.
- Selection: `TableSelect` in each row and `TableSelectAll` in the header, with `selectedKeys`,
  `defaultSelectedKeys` and `onSelectionChange` on the `Table`, Shift for a range, and `TableSelectionBar` over the
  table, with the app's count, heard as it changes, and its actions.
- A table's row with `aria-current="true"`, the one open beside it, is drawn with a bar of `--primary` at its start.
- Sorting: `allowsSorting` and an `id` on a `TableHead`, and `sortDescriptor` and `onSortChange` on the `Table`, which
  draws a button with a mark in each sortable header and sets `aria-sort` on the sorted one; the app sorts.

### Fixed

- `Checkbox` partly checked draws a dash on a filled box, no longer a check.

## [0.8.0] - 2026-11-10

Money values: `Amount`, `Percent` and `Quantity`, shown exactly, with a sign, a tone and a hidden mode, and the hooks
that give their text where no piece can go.

### Added

- `Amount`, an amount of money shown exactly, in its currency's decimals and the language React Aria speaks, with the
  minus sign, in a row or of note with `size="lg"`.
- `Money`, the type of an amount, an exact decimal string and its currency's code, and `useFormatMoney`, for an
  amount's text where no piece can go, from `@fgarend/moneta/money`.
- `MoneyProvider`, for the app's words for an amount with no value.
- `Percent`, a ratio given as a fraction of one, shown as a percent with exactly the decimals given, and
  `useFormatPercent`, for its text where no piece can go.
- `Quantity`, as shares or units, with exactly the decimals given, and `useFormatQuantity`.
- `sign` and `tone` on `Amount`, `Percent` and `Quantity`: `sign="always"` shows the plus of a change, and
  `tone="positive"` or `"negative"` colours good news or bad, which the app says. The hooks take `{ sign }`.
- `--positive` and `--negative`, the colours of a value's tone, which an app can change with the others.
- Hidden values: `isHidden` and `hiddenLabel` on `MoneyProvider` show every amount, percent and quantity as `••••••`,
  with nothing of the value in the page, and the hooks give the dots too.

## [0.7.0] - 2026-11-10

`Link`, for a link in text or in a cell.

### Added

- `Link`, a link in text or in a cell, underlined, or quiet with `isQuiet` for one that stands alone, through the app's
  router.

## [0.6.0] - 2026-11-10

The close button of `Dialog` and `Sheet` takes its name from the app, and `README.md` says what a raw piece is.

### Changed

- **Breaking:** `Dialog`, `Sheet` and `DialogFooter` take the name of the close button they show from `closeLabel`, in
  the app's own words, in place of the "Close" they wrote. TypeScript asks for it while the button shows. To upgrade,
  pass `closeLabel`, or `showCloseButton={false}`.

### Fixed

- `README.md` says what a raw piece is now: it meets the repository's checks, but nobody has reviewed it.

## [0.5.0] - 2026-11-09

Every piece under one rule, in one folder, with shadcn's updates merged three ways, and a few exports and utilities
no app needs gone.

### Added

- `--secondary-hover`, the fill of a secondary `Button` on hover, which an app can change with the others.

### Changed

- **Breaking:** `Button` no longer exports `buttonVariants`, as an app writes no class of its own. To upgrade, use
  `Button`, `LinkButton`, or `render` to change the element.
- `Button`'s text at `size="sm"` is 12 px, Tailwind's `text-xs`, in place of 12.8.
- `Tabs`'s triggers are as tall as their list, 1 px more than before.
- `Toggle`'s text at `size="sm"` is 12 px, as `Button`'s.
- **Breaking:** `Badge`, `ButtonGroup`, `Tabs` and `Toggle` no longer export `badgeVariants`, `buttonGroupVariants`,
  `tabsListVariants` and `toggleVariants`, and `Dialog` and `Sheet` no longer export React Aria's types under names of
  their own. To upgrade, use the pieces, and import `DialogProps` and `DialogTriggerProps` from `react-aria-components`.
- **Breaking:** `Checkbox`, `RadioGroupItem` and `Switch` draw on React Aria's `CheckboxField` and `CheckboxButton`,
  `RadioField` and `RadioButton`, and `SwitchField` and `SwitchButton`, as the older ones are deprecated. They take the
  field's props, so `className` is a string and hover handlers are gone. To upgrade, compute a class before passing it,
  and move a hover handler to an element around the piece.
- `Switch`'s track is 18 px tall, from 18.4.
- `InputGroupAddon` pulls a button or `kbd` 4 or 2 px toward the edge, from 4.8 and 2.4.
- **Breaking:** the theme no longer brings shadcn's `scroll-fade-*`, `shimmer-*` and `no-scrollbar` utilities, which no
  piece uses, as an app writes no class of its own. To upgrade, write the effect in the app's own style sheet.
- The package keeps every piece in `dist/components/`, from `dist/components/ui/`, with no import changing.
- The titles of `AlertDialog`, `Card`, `Dialog`, `Empty` and `Sheet` read `--font-heading`, as shadcn's now do. It is
  the body's font, so nothing is drawn differently.

### Fixed

- `ItemGroup` no longer claims a list role, which its items did not fill, as axe found.
- `SelectSeparator` is a line to see only, as a list of options may hold only options and groups, as axe found.

## [0.4.0] - 2026-11-09

`Section`, the first piece of Moneta's own, and every piece imported by its name alone.

### Added

- `Section`, a part of a page under one title, with no box: `SectionHeader`, `SectionTitle`, `SectionDescription` and
  `SectionAction`, imported from `@fgarend/moneta/section`. Its title's level comes from the sections it sits in.
- `docs/guidelines.md` says when to use `Section`, and how its title's level is set.

### Changed

- **Breaking:** every piece is imported by its name alone, with no `ui/`, as `@fgarend/moneta/button`. To upgrade,
  replace `@fgarend/moneta/ui/` with `@fgarend/moneta/` in the app's imports.

## [0.3.0] - 2026-11-09

Two rules of space and size in the guidelines, and keyboard focus on `Slider`'s thumb.

### Changed

- `cn` moves to 0.5.2, which changes nothing a piece draws or does.
- `docs/guidelines.md` puts 4 px between a label and what it names, as a value or a bar.
- `docs/guidelines.md` makes the controls in a row with a page's main action 40 px as well.

### Fixed

- `Slider`'s thumb shows keyboard focus, which it did not.
- `docs/guidelines.md` names `Pagination` and `ToggleGroup` among the controls on the scale of sizes.

## [0.2.0] - 2026-11-09

Moneta's own look, in light and dark, with taller controls and a visible keyboard focus.

### Changed

- The theme's light colours and radius are Moneta's, in place of shadcn's default: warm paper, white cards, a graphite
  sidebar and one gold accent, as `--gold`.
- The theme's dark colours are Moneta's: a graphite near-black page, a darker sidebar and lighter cards, with `color-scheme: dark`.
- **Breaking:** controls are taller. `Button`, `Input`, `InputGroup`, `NativeSelect`, `Pagination`, `Select`, `Tabs` and
  `Toggle` are 36 px by default, 32 at `size="sm"`, and 40 at `size="lg"` where they have one. To upgrade, check the screens
  that give a row or a bar a height of their own. A control that must keep its old 32 px takes `size="sm"`, where it has one.
- **Breaking:** `Card` has 20 px around its content, in place of 16, and its title and description follow a scale of text.
  `Table` has a quieter header, 12 px cells and 20 px at each end of a row. To upgrade, check the screens that line something
  up with a card's or a table's content.

### Added

- `Button`'s `variant="gold"`.
- `--font`, to change the font, which had no way to be changed. An app that changes it loads its own.
- `docs/guidelines.md`, in the package: how to use the theme's colours, sizes, text, space, focus and mode on a screen.

### Fixed

- Keyboard focus is a solid outline, which stays in forced colours and reaches 3:1. It also reaches an app's own controls.
- `Avatar`'s fallback and `Kbd` reach WCAG's contrast in light, and `Tabs`' inactive text keeps it on the new colours.

## [0.1.0] - 2026-11-06

The first version for an app to use: shadcn's pieces as they come, on React Aria, with shadcn's default theme in light
and dark. `README.md` says how to install and use it.

### Added

- 41 of shadcn's pieces, each imported by its path, as `@fgarend/moneta/ui/button`. All are raw: they work, nobody has
  reviewed them, and they may fail WCAG 2.2 AA. [`docs/pieces.md`](https://github.com/fgarend/moneta/blob/main/docs/pieces.md)
  lists the gaps known so far.
- `styles.css`, the one import an app with no Tailwind needs, with ready-made styles and the font.
- `theme.css` and `fonts.css`, for an app that still writes Tailwind's classes.
- A [gallery](https://fgarend.github.io/moneta/) of the pieces, published with each release.

## [0.0.1] - 2026-11-06

A rehearsal of the release's path, not meant to be installed. Use a later version.

[Unreleased]: https://github.com/fgarend/moneta/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/fgarend/moneta/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/fgarend/moneta/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/fgarend/moneta/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/fgarend/moneta/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/fgarend/moneta/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/fgarend/moneta/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/fgarend/moneta/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/fgarend/moneta/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/fgarend/moneta/tree/v0.0.1
