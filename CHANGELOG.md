# Changelog

What changes for an app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and `docs/releasing.md` says how a version
gets its number.

## [Unreleased]

### Added

- `hides` on `MonetaProvider`, the kinds `isHidden` hides: `amount`, `percent` and `quantity`, all three unless you
  say. `hides={["amount", "quantity"]}` keeps percents shown, with their sign and colour, in the pieces and the hooks,
  as a share or a change says nothing of size. A provider inside another keeps the outer's.

## [0.39.0] - 2026-11-17

Button, LinkButton and ButtonGroup reviewed: a solid destructive, words that wrap, a wait with your words, and a
group joined or apart.

### Added

- `Button`'s `isPending`, React Aria's, with `pendingLabel`, your words for the wait: the button keeps its focus and
  place, presses nothing, and shows a spinner in place of its icon, and a screen reader hears its name and your words.
- `ButtonGroup`'s `spacing`, the vocabulary's: 0, by default, joins the buttons in one box, and more lays them apart,
  wrapping, as a form's "Save" and "Cancel".
- `--destructive-foreground`, the words on a solid red, white in light and graphite in dark.
- Button's and ButtonGroup's pages, and the guidelines' Buttons.

### Changed

- **Breaking:** `destructive` is solid, the red under `--destructive-foreground`, readable at 4.5:1 on every surface at
  rest and on hover, where the tint fell below in dark. To upgrade, nothing to write; a quiet destructive action, as a
  row's "Remove", becomes a `ghost` or an `outline`.
- **Breaking:** a `Button` at `icon`, `icon-xs`, `icon-sm` or `icon-lg` asks for `aria-label` or `aria-labelledby`, and
  `isPending` for `pendingLabel`. To upgrade, give each its name in your words.
- **Breaking:** `LinkButton` takes no `link` variant, as a link drawn as text is a `Link`. To upgrade, write `Link`.
- **Breaking:** a button's words wrap when they do not fit, centred, its height a least one, so it never scrolls a
  narrow page sideways. To upgrade, nothing to write; a button given a height of its own keeps it over `min-h`, unless
  you write `min-h-0` with it.
- A disabled `LinkButton` dims to 50%, as a `Button`, and a button's hover follows React Aria, so it never sticks
  after a touch. `xs` and `icon-xs` take the theme's radius, as before.
- `Dialog`'s and `Sheet`'s close buttons are named by `aria-label`, from `closeLabel`, as before.
- In a joined `ButtonGroup`, the buttons share the width at one height, their words wrapping when narrow.

## [0.38.0] - 2026-11-17

Text, the app's own paragraph and note, and a card's content 12 px apart.

### Added

- `Text`: the app's own text outside the pieces, a paragraph at 14/24 and 65 characters at most, or with
  `variant="note"` a muted line in the place of something that did not come. Its page, and the guidelines' Text.

### Changed

- What a `CardContent` holds sits 12 px apart, as a section's content does 16. A gap of your own on it still wins,
  so `flex flex-col gap-3` written there can go. Content of one thing does not change.

## [0.37.0] - 2026-11-17

A paragraph's step in the scale, and interface text on the 4 px grid.

### Changed

- A paragraph's step in the scale, 14/24: the descriptions of `Alert`, `Timeline`, `Dialog`, `AlertDialog`, `Sheet`,
  `Empty` and `Popover`, read in lines, are a little more open, and a `TickerChip` or a `Badge` in them keeps the
  lines even.
- Interface text on the 4 px grid, at 20 px: `ItemTitle` and `ItemDescription`, `TimelineTitle`, and a field's
  label, content and description, from 19.25 and 21 px. A row with a title and a description is 1 px lower.

## [0.36.0] - 2026-11-17

TickerChip, an asset by its code.

### Added

- `TickerChip`: an asset by its traded code, in a pill, linking to its page, with an optional `IconTile` or `Avatar`
  as its mark and the company's name for screen readers. Its page, and the guidelines' Assets by code.

## [0.35.0] - 2026-11-17

Timeline, the history of one thing.

### Added

- `Timeline`, with `TimelineItem`, `TimelineTitle`, `TimelineTime` and `TimelineDescription`: the history of one
  thing, each event that happened or is expected, its dot coloured by its meaning. Its page, and the guidelines'
  History of one thing.

## [0.34.0] - 2026-11-16

DescriptionList, the details of one thing, and light's paper and lines in a true grey.

### Added

- `DescriptionList`, with `DescriptionItem`, `DescriptionTerm` and `DescriptionDetails`: the details of one thing,
  each a term and its value, side by side with the value at the end, and one above the other below 288 px. Its page,
  and the guidelines' Details of one thing.

### Changed

- In light, the paper and its lines are a true grey, red, green and blue equal, each at its own lightness, where they
  read slightly bluish: the page `#f9f9f9`, `--secondary` and `--accent` `#f0f0f0`, `--muted` `#f3f3f3`, `--border`
  `#e6e6e6`, `--border-strong` `#c8c8c8` and `--input` `#8a8a8a`. Every contrast holds; dark does not change.

## [0.33.0] - 2026-11-16

The gold theme revised: cool paper in light, a lighter graphite in dark, and the sidebar's own gradient.

### Changed

- The gold theme revised. In light, the paper and the neutrals are cool, on the graphite's hue: the page `#f8f9fa`,
  and `--secondary`, `--muted`, `--accent`, `--border`, `--border-strong` and `--input` with it. In dark, a lighter
  graphite: the page `#2f3133`, a card `#3a3c3f`, the sidebar `#262829` and its item marked `#3a3c3f`, the text and
  `--primary` `#f1f3f5`, and the scroll shadow lighter. The text, the sidebar in light and the gold stay.
- The tints of a badge, an alert and an icon tile are 10% in dark too, as in light, and in dark the colours of
  meaning and categories 1, 4, 5 and 8 are a little paler, so each keeps its contrast on the lighter graphite.
- In dark, a field, a checkbox, a radio and an `outline` button have no fill, as in light, so their placeholder and
  border keep their contrast on the lighter graphite.
- **Breaking:** the sidebar's surface is `sidebar-gradient`, its own graphite darker at the top, with no glow of gold;
  `sidebar-glow` is gone. To upgrade, write `sidebar-gradient` where `sidebar-glow` was.

## [0.32.0] - 2026-11-16

ScrollArea reviewed: a named area that scrolls in its place, reached by the keyboard when it scrolls.

### Added

- `ScrollArea` reviewed: its page, the guidelines' Areas that scroll, and a shadow at each end where it goes on.

### Changed

- **Breaking:** `ScrollArea` takes its name, `aria-label` or `aria-labelledby`, as `Table`, which a screen reader
  hears when it takes focus. When what it holds overflows, it is a region that takes focus, so the keyboard scrolls
  it. To upgrade, give it your words, or the title's id.
- **Breaking:** `ScrollArea` fills what is left of its place, which sets its height, and shows the browser's
  scrollbar. To upgrade, drop the height written on it, and give its place one.

## [0.31.0] - 2026-11-16

AspectRatio reviewed: a picture that fills its shape, cropped, and a card's cover.

### Added

- `AspectRatio` reviewed: its page, the guidelines' Pictures, and a card's cover: as a `Card`'s first child it reaches
  the card's edge, with the card's corners.

### Changed

- **Breaking:** what an `AspectRatio` holds fills it, cropped, as a picture covers it, on `--muted` and with the
  corners of an alert. To upgrade, drop the classes written to fill it, as `size-full object-cover`, and a background
  or corners of your own.

## [0.30.1] - 2026-11-15

A card's table and list line up with its title at every size.

### Fixed

- In a `Card` of `size="sm"` or `size="lg"`, a table, a list of rows, its group's header and the selection bar running
  edge to edge start at the card's spacing, 12 or 24 px, lined up with its title, where they kept 20 px.

## [0.30.0] - 2026-11-15

Kbd reviewed: a key, or several pressed together, a symbol's name in words.

### Added

- `Kbd` reviewed: its page, the guidelines' Keys, and `label`, a symbol's name in words, as "Command" for ⌘, which a
  screen reader hears in its place.

## [0.29.0] - 2026-11-15

Separator reviewed: a line between two groups, heard as a separator.

### Added

- `Separator` reviewed: its page, the guidelines' Separators, and stories across and upright. It draws as before.

## [0.28.0] - 2026-11-15

Avatar reviewed: a person beside their name, hidden from screen readers, its state and its group in the app's words.

### Added

- `Avatar` reviewed: its page, the guidelines' Avatars, a row's size in an `Item`, and its initials while the picture
  loads.

### Changed

- **Breaking:** an `Avatar` is hidden from screen readers, so the name beside it is what is heard: `AvatarImage` takes
  no `alt`, and its initials are hidden. To upgrade, drop `alt` and any `aria-hidden` written on it.
- **Breaking:** `AvatarBadge` takes `label`, the state in your words, which a screen reader hears, and is not drawn at
  24 px. `AvatarGroup` takes `aria-label`, who they are in your words, as "Ana, Bruno and 3 more", and its count is
  hidden. To upgrade, give both their words.
- **Breaking:** every part of `Avatar` is a `span`, so it sits inside a sentence. CSS that targets its parts as `div`
  changes to their `data-slot`.
- The rings of `AvatarGroup` and `AvatarBadge` are the colour of the surface they sit on, as a card's.

### Fixed

- A picture changed after one that failed is tried again, where the initials stayed for good.

## [0.27.1] - 2026-11-15

A card with no title, under a section's, starts its table at its top.

### Fixed

- A `Card` with no header, under a section's title, starts a table, a list of rows or numbers joined in one box at
  its top, with no padding and no line above. An app that closed the gap by its own classes, as `py-0` on `Card` and
  `border-t-0` on `CardContent`, can drop them.

## [0.27.0] - 2026-11-15

Alert reviewed: a message heard by its meaning, with its icon and tint, named by its title.

### Added

- `Alert` reviewed: its page, an icon by its meaning, a tint of its meaning with its description in the text's
  colour, its name from its `AlertTitle`, its action at its end and under its words when narrow, and paragraphs and
  lists laid out in its description.
- The guidelines' Alerts.

### Changed

- **Breaking:** an `Alert` is `role="alert"` only when `destructive`; `success`, `warning`, `info` and its default
  are `role="status"`, heard once a screen reader finishes. To upgrade, find those by the role `status`. An
  `aria-labelledby` written to its title can go, as it now gives itself one.
- `AlertAction` is a column at the alert's end, no longer placed over its corner.

## [0.26.0] - 2026-11-15

Card reviewed: a titled surface at its level, a size for a part of the page, and numbers edge to edge.

### Added

- `Card` reviewed: its page, `size="lg"` for a card that is a part of the page, with a section's title and 24 px
  around, and numbers joined in one box, alone in its content, running edge to edge.
- The guidelines' Cards.

### Changed

- **Breaking:** `CardTitle` is a heading, `h2` at the page's top and one level below where the card sits, and takes
  `level`; what a titled card holds sits one level below it. Its look is the same. To upgrade, write the words alone
  in it, with no heading of your own inside or around it.

## [0.25.0] - 2026-11-14

The pieces' pages: each reviewed piece says what it is, what it is for and what is not recommended.

### Added

- Every reviewed piece's page, and its comment in an editor, opens with what it is, what it is for and what is not
  recommended, each with what to use instead: `Amount`, `Percent`, `Quantity`, `DateTime`, `DateField`,
  `MonetaProvider`, `AppLayout`, `Sidebar`, `SkipLink`, `Section`, `Link`, `ItemGroup`, `Table`, `Pagination`,
  `IconTile` and `StatGroup`.

## [0.24.0] - 2026-11-14

Badge reviewed: a label that only shows, a state with an icon of its own shape.

### Added

- `Badge` reviewed: a state in its meaning's variant with an icon of its own shape, written with
  `data-icon="inline-start"`; a kind in `secondary` or `outline`; `default` for the one thing that should stand out.
- A piece's page opens with what it is, what it is for and what is not recommended, Badge's first.
- The guidelines' Badges.

### Changed

- **Breaking:** `Badge` only shows. It loses `render`, its `ghost` and `link` variants, its hover and its focus. To
  upgrade, put the link in the row's title, and write a `secondary` or `outline` badge in place of `ghost` or `link`.
- `Badge`'s words wrap, line under line, rather than leave a narrow column, and its corners are the theme's `xl`.
- The colours of meaning move a little, so each reads at 4.5:1 as a badge's words on its own tint over every
  surface: `--destructive` `#bb1c12` and `#ffad9d`, `--positive` and `--success` `#107044` and `#77d49d`, `--warning`
  `#9c4b00` in light, and `--info` `#1b5dbd` and `#97c6ff`. A value's tones move with them.

## [0.23.0] - 2026-11-14

Stat and StatGroup: numbers of note read together, as a month's totals.

### Added

- `StatGroup` and `Stat`, numbers of note read together, as a month's totals: a list of terms and values, each
  `Stat` a `StatLabel`, a `StatValue` at 24/32 and 600, and a `StatDescription` under it, as a change beside your
  words. Its boxes by `spacing`, one box with lines between by default or a box each, and by `variant`, `muted` or
  `ghost`; its columns by its own width, one, two from 576 px, and all on one line from 1024. An `IconTile` written in the `StatLabel` is a solid
  circle of 48 px left of the label and the value, and a `StatAction` there a quiet button named by its word and the
  label. `isLoading` and `loadingLabel` draw a shape in place of each empty value, and say the words.
- The guidelines' Numbers.

### Changed

- `Amount`, `Percent` and `Quantity` with no `size` take the one of where they sit, `lg` in a `StatValue`, and the
  text's otherwise, as before.

## [0.22.0] - 2026-11-13

IconTile: an icon on a square or a circle, which takes its shape and size from where it sits.

### Added

- `IconTile`, an icon on a square or a circle, where the eye starts a row or a number: `default`, soft, neutral or a
  category's tint by `category`, `solid` in the text's colour, or `gold` for the screen's headline, at 32, 40 or 48 px
  by `size`, by `shape` a square or a circle. Always hidden from screen readers. Written in an `Item`, it is a square
  at the row's start, 40 px or 32 in a compact list, unless its props say otherwise.
- The guidelines' Icon tiles, and gold for a screen's headline beside its main action.
- Comments on `Item`'s parts and props, which an editor shows on hover.

### Changed

- **Breaking:** `ItemMedia` loses `variant="icon"` and `category`, as an icon in an item is now an `IconTile`. To
  upgrade, write `<IconTile category={n}><Icon /></IconTile>` straight in the `Item`, in place of
  `<ItemMedia variant="icon" category={n}><Icon /></ItemMedia>`. `ItemMedia` keeps images and avatars.

## [0.21.1] - 2026-11-13

A table's hidden header no longer widens the page on a narrow screen.

### Fixed

- A table's hidden header no longer widens the page on a narrow screen: its words, kept for screen readers, stay in
  the table's own area, which now scrolls them with it.

## [0.21.0] - 2026-11-13

One vocabulary of variants: a variant's name means one look in every piece, which the guidelines now say.

### Added

- The guidelines' Variants: a variant's name means one look in every piece, a control's, a surface's or a
  meaning's, and a group joins or parts its items by `spacing`. No piece changes.

## [0.20.0] - 2026-11-12

Layout and text: a section's title lays a count beside its words, and a section's or a card's action lays several
controls in a row.

### Changed

- `SectionTitle` lays what it holds in a row, centred and 8 px apart, so a count beside its words, a
  `Badge variant="secondary"`, takes no class.
- `SectionAction` and `CardAction` lay several controls in a row, 8 px apart, which wraps where they do not fit.

## [0.19.0] - 2026-11-12

One scale of sizes: every control a row holds side by side at 32, 36 or 40 px, by `sm`, `default` or `lg`.

### Added

- `size` on `Input`, `InputGroup` and `TabsList`, and `lg` on `Select`'s trigger, `NativeSelect` and `DateField`, so
  every control a row holds side by side is 32, 36 or 40 px by `sm`, `default` or `lg`, as `Button` is. `Input`'s
  `size` replaces the input's own, its width in characters.

## [0.18.0] - 2026-11-12

The palette of categories: eight colours that tell apart and say nothing, in light and dark, on the list's icon tile
and for the charts to come.

### Added

- `--category-1` to `--category-8` in the theme, the colours of categories, which tell apart and say nothing, in light
  and dark, with `--chart-1` to `--chart-5` reading the first five, and `category` on `ItemMedia`, which colours an
  icon's tile, repeating past eight.

## [0.17.0] - 2026-11-12

Colours of meaning: success, warning and information beside destructive, in light and dark, on Badge and Alert.

### Added

- `--success`, `--warning` and `--info` in the theme, the colours of meaning beside `--destructive`, in light and dark,
  and `success`, `warning` and `info` variants on `Badge` and `Alert`.

## [0.16.0] - 2026-11-12

AppLayout: the app's shell, the sidebar beside the page's main, a sticky bar, content up to 1440 px or the full
width, and a skip link first.

### Added

- `AppLayout`, the app's shell, which arranges the sidebar beside `AppMain`, the page's `<main>`, the sidebar sticky
  at full height and the page's bar at the top; `AppHeader` and `AppHeaderActions`, the bar; and `AppContent`, the
  content, up to 1440 px or the full width, centred with the bar. With `tall` and the page's scroll padding in the theme.
- `SkipLink`, a link past what repeats to the page's content, first, out of sight until the keyboard reaches it,
  moving focus to its target.

## [0.15.0] - 2026-11-12

Sidebar: the app's main navigation, sections of links through its router, the current page marked for every reader,
and a sheet on a phone.

### Added

- `Sidebar`, the app's main navigation: a named `nav` of sections, each a list of links through the app's router, the
  current page marked by a bar, a bolder text and a gold icon, and on a phone a sheet that `SidebarTrigger` opens and
  a followed link closes. With `--sidebar-muted-foreground` and the `sidebar-glow` surface in the theme.

### Fixed

- `Sheet`'s `aria-label` or `aria-labelledby` names its dialog, where it stopped at the layer behind.

## [0.14.0] - 2026-11-12

Providers: `MonetaProvider`, once at the app's root, with its language, router, time zone and words, in place of
`MoneyProvider`.

### Added

- The guidelines' Layers: the pieces stack themselves, a menu or a tooltip over the dialog it opens in, as they
  already did.
- `MonetaProvider`, once at the app's root, with the app's language in `locale`, its router in `navigate` and
  `useHref`, its time zone in `timeZone`, which a date's own still overrides, and its words, as `MoneyProvider` had.

### Changed

- **Breaking:** `MoneyProvider` is now `MonetaProvider`, with the same props. To upgrade:
  - rename it, and its import from `@fgarend/moneta/moneta-provider`;
  - move `I18nProvider`'s `locale` and `RouterProvider`'s `navigate` and `useHref` onto it, if the app used them;
  - a piece's error that named `MoneyProvider` now names `MonetaProvider`.

## [0.13.0] - 2026-11-11

Motion: with less motion asked for, the pieces stop moving and keep their fades, and the Spinner keeps turning.

### Changed

- With less motion asked for, the pieces no longer move or change size: overlays and `Sheet` fade in and out with no
  slide or zoom, `Switch`'s thumb jumps, and `Progress`'s bar goes straight to its value. `Spinner` keeps turning.
- `Tooltip` appears in 100 ms, as the other overlays, instead of 150.

## [0.12.0] - 2026-11-11

DateField: a day typed in, part by part in the language's order, from and to an ISO string, with the app's label,
description and error, in 36 or 32 px.

### Added

- `DateField`, a day typed in, part by part in the language's order, from and to an ISO string, with the app's
  label, description and error, in 36 or 32 px.

### Changed

- `@internationalized/date` 3.12.4 is a dependency of the package, the version `react-aria-components` already
  brings, for `DateField`.

## [0.11.0] - 2026-11-11

Dates: `DateTime` and `useFormatDate`, a date from an ISO day or moment, in four formats, with today and yesterday as
words, and a day that never moves.

### Added

- `DateTime`, a date from an ISO day or moment, in four formats, with today, yesterday and tomorrow as words, and
  `useFormatDate`, its text for a sentence.

## [0.10.0] - 2026-11-11

Lists of rows: `Item` reviewed as one thing per row, read across, with groups and a total, a row as a link or with an
action, an icon tile, a value at the end, empty, loading and density, drawn as a table.

### Changed

- **Breaking:** `ItemGroup` is a list of rows, a `<ul>` whose items are `<li>`, with a line between rows and no box
  around each, at a table's ends: 12 px loose, reaching as much out, and edge to edge in a card, alone in its
  `CardContent`. To upgrade:
  - drop an `ItemSeparator` between the items of a group, which draws its own lines;
  - an `Item` that should keep its box, as `variant="outline"`, stands alone, out of a group;
  - in place of `href` on an `Item`, put a `Link` in its `ItemTitle`, which a click anywhere empty in the item follows.
- `ItemTitle` and `ItemDescription` wrap, no longer cut at one and two lines.
- `ItemMedia variant="icon"` draws its icon at 20 px on a tile of 40 px, at `--muted`.

### Added

- `Item` reviewed, as a list of rows.
- `title` and `total` on `ItemGroup`, which make it a group, as a day's, with its title a heading that names the
  list and its total at its end, drawn as a table's groups.
- `ItemEmpty`, the app's words for no rows, and loading on `ItemGroup`, `isLoading`, `loadingLabel` and `loadingRows`,
  as a table's.
- `density="compact"` on `ItemGroup`, with rows and their tiles closer.
- `ItemAction`, an action on an item, named by the app's one word and the item's title.
- `ItemValue`, the value at a row's end, at the text's weight, with an optional `detail` under it, as a date or a
  badge.
- A list's row with `aria-current="true"`, the one open beside it, is drawn with a bar of `--primary` at its start,
  as a table's.

### Fixed

- A click on a switch in a table's row no longer opens the row's link.

## [0.9.0] - 2026-11-11

Table: a native table to compare amounts by column, with groups and a total, selection, sorting, child rows, actions,
a header in view, density, loading, empty and copying, and Pagination reviewed.

### Changed

- **Breaking:** `Table` is a native `<table>`, no longer React Aria's grid, so screen readers read it as a table, a
  link in a cell is in Tab order, and its text can be selected. To upgrade:
  - give it a name: `aria-label`, `aria-labelledby`, or `caption`, which replaces `TableCaption`;
  - put the header's cells in a `TableRow` inside `TableHeader`;
  - title each row with `TableHead scope="row"` in place of `isRowHeader` on a column;
  - write `align="end"` on the header and the cells of a column of numbers, in place of `text-right`;
  - drop the classes that made a table run edge to edge in a card: alone in its `CardContent`, it does so itself;
  - in place of `selectionMode`, put a `TableSelect` in a cell before each row's title and a `TableSelectAll` in the
    header, with an `id` on each row; `selectedKeys` and `onSelectionChange` hold a `Set` of those ids;
  - in place of `onRowAction`, put a `Link` in the row's title, which a click anywhere empty in the row follows;
  - sort by `allowsSorting` and an `id` on a `TableHead`, with `sortDescriptor` and `onSortChange` on the `Table`, as
    before on a column.

- **Breaking:** `Pagination` has no words of its own. To upgrade:
  - name it, with `aria-label` or `aria-labelledby`, in place of its "pagination";
  - give `PaginationPrevious` and `PaginationNext` their words as children, in place of `text` and of "Go to
    previous page" and "Go to next page";
  - its pages now sit at the end, and its current page has a stronger outline.

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
- `PaginationSummary`, the rows shown, as "15–28 of 142", heard when the page changes; `isDisabled` on a
  pagination's links, which keeps Previous in place on the first page; and a pagination narrow by its own width
  keeps only Previous, the current page and Next.
- Loading: `isLoading`, `loadingLabel` and `loadingRows` on a `Table`, which draws rows of shapes the first time and
  a running bar under the header on a reload, and says the app's words.
- `TableEmpty`, the app's words for no rows, across the table.
- A selection across a table's cells copies as a spreadsheet takes it: text with tabs and an HTML table, minus as a
  hyphen, hidden columns and controls left out.
- `density="compact"` on a `Table`, rows of 36 px in place of 44.
- `stickyHeader` on a `Table`, which keeps its header in view while its rows scroll, in a place that limits its
  height.
- Sorting: `allowsSorting` and an `id` on a `TableHead`, and `sortDescriptor` and `onSortChange` on the `Table`, which
  draws a button with a mark in each sortable header and sets `aria-sort` on the sorted one; the app sorts.

### Fixed

- `Checkbox` partly checked draws a dash on a filled box, no longer a check.
- `Progress` with no value runs a part of its bar across it, no longer drawn full as if done, and stands still,
  dashed, when less motion is asked for.
- `Skeleton` no longer pulses when less motion is asked for.
- A table's row holding an action or a disclosure keeps its 44 px, no longer 57.
- The header of a table's titles stands over their text once rows have children.
- `Pagination`'s Previous and Next keep their names on a phone, and their arrows turn when the page reads from the
  right.

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

[Unreleased]: https://github.com/fgarend/moneta/compare/v0.39.0...HEAD
[0.39.0]: https://github.com/fgarend/moneta/compare/v0.38.0...v0.39.0
[0.38.0]: https://github.com/fgarend/moneta/compare/v0.37.0...v0.38.0
[0.37.0]: https://github.com/fgarend/moneta/compare/v0.36.0...v0.37.0
[0.36.0]: https://github.com/fgarend/moneta/compare/v0.35.0...v0.36.0
[0.35.0]: https://github.com/fgarend/moneta/compare/v0.34.0...v0.35.0
[0.34.0]: https://github.com/fgarend/moneta/compare/v0.33.0...v0.34.0
[0.33.0]: https://github.com/fgarend/moneta/compare/v0.32.0...v0.33.0
[0.32.0]: https://github.com/fgarend/moneta/compare/v0.31.0...v0.32.0
[0.31.0]: https://github.com/fgarend/moneta/compare/v0.30.1...v0.31.0
[0.30.1]: https://github.com/fgarend/moneta/compare/v0.30.0...v0.30.1
[0.30.0]: https://github.com/fgarend/moneta/compare/v0.29.0...v0.30.0
[0.29.0]: https://github.com/fgarend/moneta/compare/v0.28.0...v0.29.0
[0.28.0]: https://github.com/fgarend/moneta/compare/v0.27.1...v0.28.0
[0.27.1]: https://github.com/fgarend/moneta/compare/v0.27.0...v0.27.1
[0.27.0]: https://github.com/fgarend/moneta/compare/v0.26.0...v0.27.0
[0.26.0]: https://github.com/fgarend/moneta/compare/v0.25.0...v0.26.0
[0.25.0]: https://github.com/fgarend/moneta/compare/v0.24.0...v0.25.0
[0.24.0]: https://github.com/fgarend/moneta/compare/v0.23.0...v0.24.0
[0.23.0]: https://github.com/fgarend/moneta/compare/v0.22.0...v0.23.0
[0.22.0]: https://github.com/fgarend/moneta/compare/v0.21.1...v0.22.0
[0.21.1]: https://github.com/fgarend/moneta/compare/v0.21.0...v0.21.1
[0.21.0]: https://github.com/fgarend/moneta/compare/v0.20.0...v0.21.0
[0.20.0]: https://github.com/fgarend/moneta/compare/v0.19.0...v0.20.0
[0.19.0]: https://github.com/fgarend/moneta/compare/v0.18.0...v0.19.0
[0.18.0]: https://github.com/fgarend/moneta/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/fgarend/moneta/compare/v0.16.0...v0.17.0
[0.16.0]: https://github.com/fgarend/moneta/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/fgarend/moneta/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/fgarend/moneta/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/fgarend/moneta/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/fgarend/moneta/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/fgarend/moneta/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/fgarend/moneta/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/fgarend/moneta/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/fgarend/moneta/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/fgarend/moneta/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/fgarend/moneta/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/fgarend/moneta/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/fgarend/moneta/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/fgarend/moneta/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/fgarend/moneta/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/fgarend/moneta/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/fgarend/moneta/tree/v0.0.1
