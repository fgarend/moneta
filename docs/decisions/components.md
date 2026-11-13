# Components

How Moneta's pieces are shaped, those of its own and the rules that cross every piece. The state of each of shadcn's
pieces is in [`../pieces.md`](../pieces.md), and how a piece is analysed is in [`process.md`](process.md).

## What holds today

### Across pieces

- **Three levels, as shadcn names them.** A token is a value of the theme and depends on nothing. A piece takes its
  content from whoever uses it, shadcn's or our own, and uses tokens and other pieces. A block brings a structure of
  pieces in place, such as a sidebar or a login form, and uses pieces and tokens. Accessibility, language and
  formatting are rules across all three, not a level.
- **An app imports every piece by its name alone,** as `@fgarend/moneta/button` and `@fgarend/moneta/section`, as
  where a piece came from is the repository's business.
- **Every piece and block lives in `src/components/<name>.tsx`, shadcn's and our own, under one rule:** format, every
  lint finding fixed with none left as an exception, coverage at 100%, and no arbitrary spacing or colour but CSS's
  own words. A piece is shadcn's when `upstream/shadcn/` holds its base, which `make shadcn-update` merges from.
- **An own piece is made of parts,** as shadcn's are, and a piece that is only a value takes it as a prop. Its state
  and events take React Aria's names, such as `isDisabled`, `onPress`, and an `onChange` that gives the value.
- **The most semantic HTML and CSS.** Each piece draws the element HTML has for its meaning, such as `data` for a
  value, `time` for a date and `table` for a table, and ARIA only where HTML has none. Its CSS reads tokens named by
  meaning, styles a state through the attribute that states it, such as `aria-disabled` or `data-hovered`, and uses
  logical properties, such as `ms` and `pe`. An own piece follows this from its birth, and a shadcn piece at its
  review.
- **A piece changes its element only through `render`,** under React Aria's rule: the same type of element, one
  element, with its props and ref passed on. Never `asChild` or `as`. A piece offers it only when a need asks.
- **A title takes its level from where it sits.** A `Section` counts one level more for what it holds, a title
  outside any starts at 2, below the page's 1, it stops at 6, and `level` given by hand wins. React Aria's `Heading`
  draws it. Each piece with a title follows this at its review, and a `Dialog` or `Sheet` starts again at 2, as
  React's context crosses portals.
- **Moneta chooses no router.** A piece with a link passes `href`, `routerOptions` and `render` on to React Aria, so
  an app routes through `render` on each link or through `navigate` and `useHref` on `MonetaProvider` once at its
  root.
- **`MonetaProvider`, once at the app's root, holds what the app sets for every piece:** its language, `locale`, for
  React Aria's `I18nProvider`; its router, `navigate` and `useHref`, for React Aria's `RouterProvider`, under its own
  names; its time zone, `timeZone`, which a piece's own overrides; and its words and hidden values, as
  `docs/decisions/money.md` says. One inside another keeps what it is not given. What it holds for the pieces is
  `src/hooks/moneta.ts`, internal.
- **The gallery groups the pieces by purpose, under shadcn's own groups,** as its docs list its components: Form &
  Input, Layout & Navigation, Overlays & Dialogs, Feedback & Status, Display & Media, and Misc. Its first level is
  `Components`, then `Sample`, and blocks and foundations will be levels of their own. A piece of ours goes in the
  group of its purpose, beside shadcn's, and `test/pieces.test.ts` holds every story of a piece to one of them.

### Item

- **`ItemGroup` is a list of rows,** `<ul role="list">`, and an `Item` in it an `<li>`, a row with a `--border` line
  under it but the last and no box of its own, at a table's ends: 12 px loose, where it reaches as much out, and 20 px
  in a card, where a `CardContent` holding only a list loses its side padding and gains a line above. An `Item` alone
  stays a `<div>`, with its variants.
- **Titles and descriptions wrap,** never cut.
- **`ItemMedia variant="icon"` is a 40 px tile at `--muted`** with a 20 px icon, which Colours of meaning will tint.
- **An `ItemGroup` with a `title` is a group,** as a day's: its title a heading a level below its section's, which
  names its list, and its `total` at its end, as a table's groups: 12 px semibold muted, the total at 500 and the
  rows' size, a `--border-strong` line under it, 12 px above the first and 32 above the next. A `CardContent` holding
  only groups runs edge to edge.
- **An action is an `ItemAction`,** as `TableRowAction`: a quiet icon button of 32 px, whose name joins the app's one
  word to the item's title, which `ItemTitle` takes an id for, and which takes less than a line's height, so a row
  keeps its own. An item with no title makes it throw. A row with one shows the hover.
- **`density="compact"` on `ItemGroup`:** rows with 8 px above and below in place of 12, a 32 px tile in place of
  40, and groups 20 px apart, 8 under the first's top; the loading shapes as close, each as tall as a row. `size` on
  `Item` stays for one alone.
- **`ItemEmpty` holds the app's words for no rows,** centred and muted, under the group's title, as `TableEmpty`.
- **Loading as a table's:** `isLoading` with the app's `loadingLabel`, which TypeScript asks for, makes the list busy
  and says the words in a status; with no rows it draws `loadingRows` shapes of a row, 5 unless the app says, which a
  screen reader skips, and with rows it keeps them under a 2 px running `Progress` along the list's top.
- **`ItemValue` holds the value at a row's end,** aligned to it, at the text's weight, never wrapping while the title
  gives way, with `detail` under it, small and muted, as a date or a badge.
- **An item that opens has a `Link` in its `ItemTitle`,** which a click anywhere empty in the row, or in the item
  alone, follows with its keys, as a table's row; it shows a pointer and, in a list, a hover at half `--muted`. A
  row with `aria-current="true"` is drawn at `--muted` with a 3 px bar of `--primary`. Both share
  `src/hooks/row.ts` with Table.

### Section

- **A titled part of a page, with no box,** whose parts follow `Card`'s header: `Section`, `SectionHeader`,
  `SectionTitle`, `SectionDescription` and `SectionAction`, with its content as children.
- **No landmark.** A `<section>` with no name, which is no `region`, as its title gives the structure.
- **Its title is Tailwind's `text-lg/6 font-semibold`,** the 18/24 the guidelines give a section, with 4 px to its
  description and 16 px between its header and its content.
- **Its action moves under the title when the header is narrower than 384 px,** by a container query on the header,
  so it holds wherever the section sits.
- **Its title lays what it holds in a row,** centred, 8 px apart, so a count beside its words takes no class; **its
  action lays several controls in a row,** 8 px apart, which wraps where they do not fit, as `CardAction` and
  `AppHeaderActions` do.

### Link

- **A link in text or in a cell, on React Aria's `Link`,** with Tailwind's classes, as shadcn has none. It takes
  `isQuiet` and React Aria's props, with no variant and no size.
- **Underlined, 4 px below its text, in the theme's primary,** in the text's size and weight, with nothing more on
  hover.
- **`isQuiet` shows the underline only on hover and keyboard focus,** for a link alone where its place says it is one.
- **Disabled, it is dimmed to 50%,** as `Button` is, and React Aria draws it as a `span` out of the tab order.
- **Its type asks for what it holds,** and it adds no icon and no words for a new tab, which are the app's.

### Pagination

- **shadcn's links to pages, named by the app,** as TypeScript asks: `aria-label` or `aria-labelledby` on its `nav`.
- **`PaginationSummary`, the app's words for the rows shown,** as "15–28 of 142", at the start, in a status heard
  when the page changes and focus stays; the pages at the end, with or without it.
- **The current page is outlined in `--input`,** as a field is, at 3:1 against the page in both modes.
- **Previous and Next take the app's words as their children,** which name them, and an arrow that turns when the
  page reads from the right.
- **A link that goes nowhere, as Previous on the first page, stays in place, `isDisabled`,** dimmed, with no
  address.
- **The gap between pages is silent,** as it cannot be pressed.
- **Narrow, by its own width,** below `sm`, only Previous, the current page and Next stay, as arrows that keep
  their names.
- **The app draws the pages,** by the rule in the guidelines.

### Table

- **A native `<table>`, our own piece,** in place of shadcn's, which is React Aria's `grid`, following the structure of
  shadcn's native tables: `TableHeader`, `TableBody`, `TableRow`, `TableHead` and `TableCell`.
- **Named, as TypeScript asks:** `aria-label`, `aria-labelledby`, or `caption`, a native `<caption>`.
- **Each row is titled by `TableHead scope="row"`,** a `<th>`.
- **`align="start" | "end"` on each header and cell,** as `text-start` and `text-end`, with no centre and no `colSpan`
  but `TableEmpty`'s.
- **`hideBelow="sm" | "md" | "lg"` on each cell of a column hides it** by the width of the table's own area, a
  container, with `display: none`.
- **Its ends follow its place:** 20 px in a card, where a `CardContent` holding only a table loses its side padding
  and gains a line above, and 12 px loose, where its area reaches 12 px out on each side.
- **Narrow, it scrolls in its own area,** with row titles that stick at its start, `scroll-shadows` at the end that has
  more, row titles of at least 128 px, and the area takes focus, its role and the table's name only while it overflows.
- **Values in its rows are at 400,** set by the table on the pieces of value in its bodies.
- **A group is a `TableBody` of its own, opened by a `TableGroupRow`:** its title a `<th scope="row">`, small,
  semibold and muted, its subtotals at 500 in their columns, 32 px above it, 12 under the header, and a
  `--border-strong` line under it, with no fill.
- **The total is a `TableFooter`,** a `<tfoot>`, at 600, under a double `--border-strong` line.
- **An action is a `TableRowAction`,** a quiet icon button of 32 px in the last column, as narrow as its content,
  under a `TableHead hideHeader`, whose name joins the app's one word to the row's title by `aria-labelledby`. A row
  with no title makes it throw.
- **A row with a link in its title opens by a click anywhere empty in it,** which the row forwards to that link with
  its keys, unless the click is on a control or text is selected; it shows a pointer and a hover fill.
- **A row's children are rows with its key as their `parentId`,** right after it, `hidden` while it is closed, one
  level deep. The table draws a 32 px button in the parent's title, named by it, with `aria-expanded` and
  `aria-controls`, keeps the button's room in every title once a row has children, and in the titles' header, so it
  stands over their text, and sets a child in by as much again. `expandedKeys`, `defaultExpandedKeys` and
  `onExpandedChange` on the table hold which rows are open, as React Aria's `Tree` names them. A part outside a
  `Table` throws.
- **Rows are selected by a box each,** `TableSelect`, in a cell of its own before the row's title, named by it, and
  `TableSelectAll` in the header, named by the app once, checked when every row shown is and partly when some are.
  `selectedKeys`, `defaultSelectedKeys` and `onSelectionChange` on the table hold them, by row `id`, and keep keys
  the table does not show, as from another page. Shift on a click selects or clears from the last box clicked. A
  selected row is drawn at `--muted`, and a row with a box at half of it on hover. A box in a row with no title or
  no `id` throws.
- **Narrow, the boxes stick at the table's start too,** and the titles right after them.
- **`isLoading` with the app's `loadingLabel`, which TypeScript asks for, makes the table busy and says the words**
  in a status. With no rows yet, it draws `loadingRows` rows of shapes, 5 unless the app says, one per column
  where its text sits and hidden with it, which a screen reader skips; with rows, it keeps them as they are, under a
  2 px running `Progress` along the header's foot, which stays in view.
- **`TableEmpty` holds the app's words for no rows** in one row whose cell spans every column, centred, under the
  header.
- **A selection across a table's cells is copied by the table:** the whole rows it reaches, visible and not of
  controls, as text with tabs and as an HTML table, each cell as it is seen, the words only screen readers hear left
  out and a minus as a hyphen. Inside one cell, or reaching past the table, the copy is the browser's.
- **Rows are 44 px, or 36 with `density="compact"`,** with their line under them, whatever they hold: a row's
  controls of 32 px take less than its text's height, by a negative margin. In compact, groups are 20 px apart and 8
  under the header, and the header stays 36 px.
- **`stickyHeader` keeps the header in view in a place that limits the table's height,** as a panel: the table
  fills it and scrolls in its own area, whose header stays at the top, over the rows and their titles, with a line
  of its own, and a row focused under it scrolls clear of its 36 px. Without it, the table grows with its rows.
- **A column sorts by `allowsSorting` and its key, `id`, on its `TableHead`,** with `sortDescriptor` and
  `onSortChange` on the table, React Aria's `SortDescriptor`; the app sorts the rows. Its header is a button named by
  its text, at least 24 px tall, with a quiet up and down mark, or the sorted column's arrow in the text's colour,
  before the text in a column at the end. A press sorts ascending, then flips. `aria-sort` is on the sorted header
  only. A sortable header in a table with no `onSortChange` throws.
- **The row open beside the table is `aria-current="true"`,** drawn at `--muted`, as a selected row, with a 3 px bar
  of `--primary` at its start, the first cell's `::before`. A row's state, selected or current, wins over its hover.
- **`TableSelectionBar` goes over the table,** with the app's count and words, `count` and `label`, in a status a
  screen reader hears, and the app's actions, in a `--muted` fill lined up with the table's ends. With nothing
  selected it shows nothing, but its status stays. In a card, a bar and a table alone in a `CardContent` run edge
  to edge together.

### Sidebar

- **Our own, under shadcn's part names:** `SidebarProvider` around `Sidebar` and `SidebarTrigger`; `Sidebar` a `<nav>`
  named in the app's words, with `SidebarHeader`, `SidebarContent`, which scrolls on its own, and `SidebarFooter`; a
  section a `SidebarGroup` whose `SidebarGroupLabel` names its `SidebarMenu`, a `<ul>` of `SidebarMenuItem`s, each a
  `<li>`; and a link a `SidebarMenuButton`, React Aria's `Link`, through the app's router.
- **The current page, `isActive`,** is said to screen readers by `aria-current="page"`, and drawn on `--sidebar-accent`
  with a bolder text, a gold icon and a 4 px bar at its start, a border, so forced colours keep it; its padding gives
  up the bar's width. Hover takes the background alone.
- **256 px wide, items of 36 px and icons of 16,** on the theme's `sidebar-glow`, its sections' labels in
  `--sidebar-muted-foreground`; a long label wraps.
- **On a phone, below 768 px,** it leaves the screen, and `SidebarTrigger`, out of sight on a wider one, opens it in a
  `Sheet` from the start, named as the `nav` is, with `closeLabel` on its close button. A followed link closes it.
- **TypeScript asks for its name, its trigger's and `closeLabel`.** An empty section is the app's to leave out.

### AppLayout and SkipLink

- **One responsibility per piece:** `AppLayout` arranges, and the others draw themselves, whatever the arrangement.
  `AppLayout` puts the sidebar's column beside the `<main>`'s, sticks the sidebar at full height and the page's bar at
  the top at `z-40`, where the screen is at least 480 px tall; `AppMain` is the `<main>`, with the `id` a `SkipLink`
  goes to, `"main"` by default; `AppHeader` draws the bar inside it, 56 px, on the page's solid background over a line,
  with `AppHeaderActions` at its end; and `AppContent` draws the content, 16 px of margin on a phone and 40 from 768 px,
  40 px between its sections, up to 1440 px or `width="full"`. The page scrolls, the document.
- **The bar and the content centred together,** the bar's row as wide as the content, which `width="full"` opens too,
  by `:has()` on the `<main>`, through `--app-width`.
- **`SkipLink`, a piece of its own,** the page's first element, out of sight until the keyboard reaches it, then shown
  at the top corner; pressed, it moves focus to its target, which takes `tabindex="-1"` while it holds it. A plain
  link, so no router takes its fragment, and its `href` an `#id`, which TypeScript holds.
- **`SidebarProvider` around the shell,** the app's to place, as the sidebar's trigger sits in the bar.

## Why

- **Three levels and not four,** as a composed piece's line with a piece is vague, Atomic Design's best known
  problem, and changes no rule: neither where a file lives, how it is imported, nor what tests it needs.
- **By name alone, from one folder,** as an app uses one library, whoever wrote each piece, and the rule is the same
  for every piece, so nothing in the repository needs to know where one came from but its updates. **What it costs:**
  an app that imported `ui/<name>` changes its imports once, and shadcn's updates come by a merge.
- **The most semantic HTML and CSS,** as what a page means is read by machines too, such as screen readers,
  translators and tests, and a state named by its attribute cannot drift from it. Logical properties hold when a
  language reads from the right. **What it costs:** shadcn's pieces use `ml-`, `mr-` and classes of state, so each
  review edits more of them, which `make shadcn-update` then merges.
- **`render`,** as React Aria has it on every component and shadcn's pieces use it, and its rule keeps the element's
  meaning, so a button cannot become a `div` unnoticed.
- **A level from where it sits,** as a fixed default per piece is wrong once a `Card` sits in a `Section`, as the
  sample page has. **What it costs:** a level is not seen in the code that uses the piece. The context is internal to
  `src/hooks/level.ts`, which Section and ItemGroup read.
- **No router,** as Moneta knows no app, React Aria's docs recommended `render` on 2026-11-09, and `RouterProvider`
  still works. Table and GridList rows cannot be an `<a>`, so with a router they navigate through `onAction`.
- **Groups by purpose,** as whoever builds a screen looks for something for a form or an overlay, not for where a
  piece came from or its level, which are rules for this repository. shadcn's groups, as they are, as its users know
  them. **What it costs:** some are odd, as Button in Form & Input and Toggle in Misc, and they differ from the
  roadmap's families.
- **No landmark,** as a page of sections would fill the list of landmarks, which the W3C asks to keep for what
  matters, and a screen reader's user moves by headings.
- **A link underlined,** as the theme's primary is close to the text in light and the same in dark, so in a sentence
  colour alone cannot tell it, which WCAG 1.4.1 asks and its failure F73 names. **Quiet as an option,** as a column of
  underlined names weighs on a screen and a link alone has no text around it to stand apart from, as React Spectrum
  has it. Underlined unless asked, as a forgotten `isQuiet` only weighs, while a forgotten `inline`, Primer's and
  Carbon's way, fails WCAG. **What it costs:** an app can make a link in a sentence quiet, which only the guidelines
  catch.
- **The theme's primary,** as libraries colour a link with their accent, so a theme that changes it changes its links.
  **What it costs:** in coloured text, as a muted description or an alert, the link stands apart from it.
- **The text's weight,** as the underline already marks a link, and a fixed one would thin a link in a bolder title.
- **Disabled at 50%,** as `Button` and `LinkButton` have that state, React Aria gives it the right meaning, and a link
  with no style for it looked active.

- **A native table,** as almost every table seen is read to compare, which the APG's Table pattern serves and
  "strongly encourages" native for: screen readers keep their table commands, a link in a cell is in Tab order, and
  text can be selected and copied. Carbon, Primer, Polaris, GOV.UK and Ant do so. **Our own,** as merging the updates
  of shadcn's `grid` into a native table would only conflict. **What it costs:** an app on the `grid` moves, the
  selection's state is ours, and each control is a tab stop.
- **Its name asked for,** as every table an app had already carried one, and a table with none is announced bare.
- **A list of rows apart from a table,** as Polaris keeps `ResourceList` apart from `IndexTable`, Carbon its
  contained list and Spectrum `ListView`: a row is one thing read across, with no header. **`ul` and `li`, not a
  grid,** as rows are read, as Sarah Higley advises, and `role="list"` kept, as Safari drops a list's meaning with
  its markers, as Carbon notes. **A table's look,** lines and ends, so a list and a table side by side read alike.
  **What it costs:** `ItemGroup`'s gaps and boxes go, and the lint's rule on redundant roles is set aside there.
- **The link in the title, not the whole row as one,** as Roselli advises, so its name is the title alone and a
  control can sit in the row. **What it costs:** `href` on `Item` goes.
- **No `colSpan`,** as screen readers announce spanning headers badly, as Roselli found, and a column can then hide by
  its cells with nothing misaligned. **But for `TableEmpty`,** a row with nothing to compare, as shadcn's data table
  and Carbon draw it, which keeps the empty words in the table. **What it costs:** `align` and `hideBelow` are written
  on each cell, and a long title stays in its column.
- **A container's width, not the screen's,** as a table in a narrow panel on a wide screen needs the same as one on a
  phone, as `Section` already does. **What it costs:** Tailwind's container sizes, 384, 448 and 512 px, are not its
  screen sizes of the same names.
- **Focus only while it overflows,** as an area that fits would be a stop for nothing, and Chrome does not make an
  area focusable when it holds controls, nor Safari ever. **What it costs:** a `ResizeObserver` of our own.
- **Values at 400 in rows,** as a table is mostly numbers, and at 500 nothing would stand out, a total least.
- **A group's title as `scope="row"`,** as today's screen readers do not announce `scope="rowgroup"`, as Roselli
  and Zell Liew found, while a row's header names its subtotals. **What it costs:** a cell in the middle of a group
  is not heard with the group's name; reading in order, the group comes first.
- **A row opened by our own script,** as a link stretched over the row by a pseudo-element needs the row to hold it,
  which Safari did only from 27, and stops text in the row from being selected. **What it costs:** code of our own,
  and a key held with the click reaches the link by an event the browser did not make.
- **Children as rows after their parent, with a disclosure button,** as Carbon has it and Roselli's expando rows, as
  a treegrid would serve only a grid. **The button drawn by the table,** which knows a row has children, so the app
  writes no part for it. **What it costs:** a screen reader hears no level for a child, as `aria-level` belongs to
  a treegrid, only the button that points at the children.
- **A box per row, and the state the table's,** as Carbon, Polaris and Primer select rows, as `aria-selected`
  belongs to a grid's rows, so a row's state is its checkbox's. **No `selectionMode`,** as boxes select many, and
  the row open beside the table is `aria-current`, not selected. **The boxes stick with the titles,** as MUI's and
  AG Grid's pinned columns keep theirs, so a row can be selected while the table scrolls. **What it costs:** about
  40 px of a narrow screen.
- **Loading drawn by the table,** which knows its columns and whether it has rows, so the app only says when: shapes
  the first time, as a table with no rows would jump, and the rows themselves on a reload, never dimmed, as their
  values stay true until the new ones come. **What it costs:** the table reads its own header and bodies after each
  draw.
- **Whole rows in a copy,** as a spreadsheet pastes rows of cells, which text cut mid-cell would break. **Cells as
  they are seen,** currency and all, so a copy holds what was read, and a table of several currencies keeps them.
  **What it costs:** whether Excel in Portuguese and Google Sheets read `-R$ 286,40` as a number is to be tried by
  hand; the bar's copy button waits for CopyButton.
- **Controls of 32 px in rows of 36,** as Primer sets a row's icon buttons in by a negative margin, so an action is
  the same size in every table and rows are even. **What it costs:** in compact, a button's fill on hover nearly
  meets the lines above and below. Rows that held a control were 57 px before 2026-11-11.
- **A sticky header within the table's own area,** as an area that scrolls sideways is the one its header sticks to,
  never the page. **Its own line,** as a collapsed border belongs to the table and stays behind. **Scroll padding of
  the header's height,** for WCAG 2.4.11, **and a script of ours that scrolls a focused row clear,** as Safari 26 and
  before ignore that padding when focus moves in an area. **What it costs:** a long table on a page scrolls with the
  page, its header out of sight, unless the app puts it in a place of limited height.
- **A mark on every header that sorts,** as MoJ's sortable table and Ant draw one, so a touch screen, which has no
  hover, shows what sorts. **Two directions, with no unsorted state,** as React Aria has it, as an app's first order
  is a sort too. **`aria-sort` alone,** as the APG and Carbon have it: NVDA, JAWS, Narrator and VoiceOver on iOS say
  the change, by Roselli's tests of 2026. **What it costs:** VoiceOver on macOS and TalkBack stay silent, which a
  status of the app's words, in the roadmap, would cover; and React Aria's table announced a sort, so one moving from
  it loses that.
- **The current row's bar in its first cell,** not a border on the row, as a table's collapsed borders give a
  row's border half its width inside, which moves that row's text about 1.5 px off the others'.
- **Pagination's current page in a field's outline,** the least change to shadcn's that shows a state at 3:1, where
  its `--border` gave 1.2:1 in light, as WCAG 1.4.11 asks. **A summary in a status,** as Primer asks pagination
  to announce its range, and as its words are seen, nothing is said twice. **Previous kept in place when it goes
  nowhere,** as Primer, Polaris and Carbon have it, so Next stays under the pointer. **Narrow, the arrows alone,**
  as Polaris has it on a phone, as nine links of 36 px do not fit in 320. **The pages the app's,** as shadcn has
  them. **What it costs:** on a phone no page can be skipped to, and each app writes the loop that picks the pages,
  which MUI and Mantine give as `usePagination`, in the roadmap if a second app needs it. GOV.UK hides Previous on
  the first page.
- **The bar over the table, in the page's flow,** as Carbon has it, so it covers nothing and a screen reader meets
  it before the rows. **The count the app's,** as only the app knows the rows selected on other pages. **What it
  costs:** in a long table it scrolls out of sight, which a bar fixed at the page's foot, in the roadmap, can hold.
- **A control named by its row's title,** as Primer asks an action to say which row it acts on, so the app writes one
  word, once, and no name is repeated or stale. **What it costs:** every row needs a title.
- **Lines, space and type for a group and a total, and no fill,** as a fill is kept for a row's state, as white
  space is the least visible way to group, as Stephen Few has it, and as screenshots of both showed the group and a
  selected row fighting when both were filled. **A double line over the total,** which reads as a total at once;
  accounts draw it under the total, which in a card stacks with the card's edge.
- **One provider of Moneta's,** as Polaris's `AppProvider` and React Spectrum's `Provider` take the language and the
  router, so an app sets the pieces in one place, and imports nothing of React Aria's. Named for Moneta, as
  `MantineProvider`, so it never meets an app's own `AppProvider`. React Aria's names for what it passes on, so its
  guides for each router hold. **What it costs:** an API of our own around React Aria's providers; `useHref` reads as a
  hook; and `isHidden`, which the app switches, lives with settings that stay.
- **Sidebar our own,** as Table, since shadcn's would change in nearly every part: it has no `nav`, no lists, no
  `aria-current` and no skip link, a trigger without `aria-expanded`, a count outside the link's name, a cookie it
  never reads, a current page forced colours lose, a phone's sheet that stays open, English words of its own and a
  shortcut that fires in a field. shadcn's names kept, for whoever knows them. As Primer, Carbon, GOV.UK and the APG
  build a navigation. **What it costs:** its code is ours, shadcn's improvements no longer come by themselves, and its
  names with another behaviour, as no rail and no collapse, may surprise.
- **The essentials first,** as the app that guides it uses them; collapsed to icons, counts, sections that open,
  nested items and a shortcut wait in the roadmap. **What it costs:** the prototype shows some, so Sidebar changes
  again.
- **A bar, a bolder text and one gold icon for the current page,** as the critique asked for a mark forced colours
  keep and frontend-design one gold per item; the background alone is 1.36:1. **What it costs:** a light bar draws
  less than a gold one.
- **The skip link with AppLayout,** which knows where the content starts, as Polaris's and Carbon's frames. **What it
  costs:** keyboard users wait for it.
- **One responsibility per piece in the shell,** as the owner asked for blocks well assembled and apart, so a new
  arrangement is a prop of `AppLayout` and the others keep their look. **What it costs:** seven pieces to write; a
  forgotten `SkipLink` leaves none; it and `AppMain` are tied by an `id`; `AppHeader` and `AppContent` are names an app
  often has, solved on import; a landmark follows the DOM, so moving the bar out of `<main>` is the app's change.
- **The bar inside `<main>`, as shadcn's,** as it holds the page's breadcrumb and tools, which the skip link would jump
  past from a banner. **What it costs:** search or an account at the top would ask for a banner, as Carbon's and
  Atlassian's.
- **The page scrolling,** as every system studied, so the browser keeps back's position, find, pull to refresh and
  the phone's address bar. **The bar sticking,** with the theme's scroll padding so focus is never under it, and let go
  on a short screen. **What it costs:** the padding knows the bar's 56 px.
- **1440 px by default, and the full width when a page asks,** as a row read across is lost at 2000 px, as Polaris
  and GOV.UK stop near 1000, and a wide table wants every column, as Primer's `containerWidth`. **What it costs:** the
  bar is tied to the content's width by CSS.
- **`SkipLink` moving focus,** as GOV.UK and Atlassian, since Safari and VoiceOver may only scroll otherwise. **What it
  costs:** `AppMain` hides its own outline, as a landmark is not a control.

- **No layout pieces of our own,** after a count of a real app's classes on its 41 screens built on Moneta: of 168
  `className`, a third were four patterns, each owned by a piece, a page's sections, which `AppContent` lays, a
  title's count, several actions, and muted text, which is the theme's class. Each pattern became a fix in its piece,
  and an app's own layout stays Tailwind, as shadcn and Catalyst have it and Spectrum 2 chose when it dropped its Flex
  and Grid. **What it costs:** an app still writes classes for its own layout, off any scale of ours; a title's
  inline emphasis is spaced as an item of its row.

## Alternatives considered

- **Token, piece, composed piece and region.** The roadmap's first proposal.
- **The gallery by origin, `UI` and our own,** as its first stories had it from the folder's name, by level alone,
  or by whether a piece is reviewed, which moves it, and its link, at its review.
- **`ui/<name>` for every piece,** with our pieces exported there too. Nothing breaks, but `ui` says little to an
  app, and inside it would mean shadcn's folder.
- **Own pieces by name and shadcn's under `ui/`.** The first proposal, which told an app where each came from.
- **Folders by origin, as `shadcn/` and `moneta/`.** Clear names, but only shadcn's would have kept another rule.
- **`asChild` or `as`.** Any element for any other, which loses its meaning.
- **A fixed level per piece, or one always given by hand.** Simpler, but wrong or verbose once pieces nest.
- **Section as a `region`,** as a prototype has, or with a prop to make it one.
- **A count beside a section's title and a note at its foot,** as a prototype has. The count waits for Badge,
  in the roadmap's Display, and the note for a use.
- **Button's `link` variant for a link,** which is 36 px tall, padded and does not wrap, so it cannot sit in a
  sentence.
- **A link always underlined,** or with a softer line until hover, which still draws a line under each name of a
  column.
- **A link in the colour of its text,** which suits any text but leaves a theme no way to colour its links.
- **A link in `font-medium`,** as a prototype and an app had.
- **A link with no `isDisabled`,** which leaves the app a choice between a link and its text, but no way to say a link
  is there and not available.

- **React Aria's `grid`, as shadcn has it,** which gives selection, sorting and arrow keys, but reads as a grid,
  keeps a link out of Tab order, and blocks selecting text in rows that can be selected.
- **A native table for reading and the `grid` once rows are selected,** two engines behind one look, whose line moves
  as soon as a read-only table gains an action.
- **`visibility: collapse` on a `<col>`,** which hides a column once, but leaves its cells to screen readers and to
  Tab in every engine, and reached Safari only in 27.
- **The screen's width for hiding columns,** which a test cannot try, as the tests' screen is always 1280 px wide.
- **React Aria's `I18nProvider` and `RouterProvider` in the app, beside `MoneyProvider`,** as it was, with nothing of
  ours to keep, but three providers to learn, and none for the time zone.
- **`AppProvider`,** as Polaris names it, which an app often has already.
- **`MoneyProvider` kept a version beside it,** which gives an app time, but holds two names until the policy for
  deprecating comes.
- **shadcn's sidebar edited,** which would change nearly every part.
- **React Aria's `NavigationTree`,** as Spectrum's SideNav, a `treegrid`, which Primer says never replaces navigation.
- **The app's strip on top on a phone,** which shows every link, but hides the sections' names and scrolls away.
- **A label cut with an ellipsis,** as shadcn and the prototype, every item one height, but a word lost.
- **A banner above all,** as Carbon and Atlassian, with search and an account.
- **An inner scroller,** as Atlassian's option, each area's position its own.
- **No limit to the content,** as shadcn and Carbon; and **content aligned to the start,** which needs no tie to the
  bar.
- **A translucent bar with a blur,** lighter, as an app's.
- **`sidebar` as a prop of `AppLayout`,** which would draw the `<main>` itself, unlike every other piece's children.

- **Stack and Inline,** as Primer, Atlassian, Polaris and Mantine keep them, which would duplicate Tailwind for the few
  rows left once the pieces lay their own; **a `Text` piece,** for a colour the theme's class already gives; **a
  `count` on `SectionTitle`,** which Tabs and tables would each want again.

## History

- 2026-11-09: Written, with the conventions that cross pieces, and Section.
- 2026-11-09: Every piece in one folder, under one rule, imported by its name alone.
- 2026-11-10: Link.
- 2026-11-10: The most semantic HTML and CSS.
- 2026-11-10: Table, a native table of our own.
- 2026-11-11: Pagination.
- 2026-11-12: `MonetaProvider`, in place of `MoneyProvider`.
- 2026-11-12: Sidebar, our own.
- 2026-11-12: AppLayout and SkipLink.
- 2026-11-12: Layout and text: what a title and an action hold, and no layout pieces.
