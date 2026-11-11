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
  an app routes through `render` on each link or through `RouterProvider` once at its root.
- **The gallery groups the pieces by purpose, under shadcn's own groups,** as its docs list its components: Form &
  Input, Layout & Navigation, Overlays & Dialogs, Feedback & Status, Display & Media, and Misc. Its first level is
  `Components`, then `Sample`, and blocks and foundations will be levels of their own. A piece of ours goes in the
  group of its purpose, beside shadcn's, and `test/pieces.test.ts` holds every story of a piece to one of them.

### Section

- **A titled part of a page, with no box,** whose parts follow `Card`'s header: `Section`, `SectionHeader`,
  `SectionTitle`, `SectionDescription` and `SectionAction`, with its content as children.
- **No landmark.** A `<section>` with no name, which is no `region`, as its title gives the structure.
- **Its title is Tailwind's `text-lg/6 font-semibold`,** the 18/24 the guidelines give a section, with 4 px to its
  description and 16 px between its header and its content.
- **Its action moves under the title when the header is narrower than 384 px,** by a container query on the header,
  so it holds wherever the section sits.

### Link

- **A link in text or in a cell, on React Aria's `Link`,** with Tailwind's classes, as shadcn has none. It takes
  `isQuiet` and React Aria's props, with no variant and no size.
- **Underlined, 4 px below its text, in the theme's primary,** in the text's size and weight, with nothing more on
  hover.
- **`isQuiet` shows the underline only on hover and keyboard focus,** for a link alone where its place says it is one.
- **Disabled, it is dimmed to 50%,** as `Button` is, and React Aria draws it as a `span` out of the tab order.
- **Its type asks for what it holds,** and it adds no icon and no words for a new tab, which are the app's.

### Table

- **A native `<table>`, our own piece,** in place of shadcn's, which is React Aria's `grid`, following the structure of
  shadcn's native tables: `TableHeader`, `TableBody`, `TableRow`, `TableHead` and `TableCell`.
- **Named, as TypeScript asks:** `aria-label`, `aria-labelledby`, or `caption`, a native `<caption>`.
- **Each row is titled by `TableHead scope="row"`,** a `<th>`.
- **`align="start" | "end"` on each header and cell,** as `text-start` and `text-end`, with no centre and no `colSpan`
  anywhere.
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
  `aria-controls`, keeps the button's room in every title once a row has children, and sets a child in by as much
  again. `expandedKeys`, `defaultExpandedKeys` and `onExpandedChange` on the table hold which rows are open, as React
  Aria's `Tree` names them. A part outside a `Table` throws.
- **Rows are selected by a box each,** `TableSelect`, in a cell of its own before the row's title, named by it, and
  `TableSelectAll` in the header, named by the app once, checked when every row shown is and partly when some are.
  `selectedKeys`, `defaultSelectedKeys` and `onSelectionChange` on the table hold them, by row `id`, and keep keys
  the table does not show, as from another page. Shift on a click selects or clears from the last box clicked. A
  selected row is drawn at `--muted`, and a row with a box at half of it on hover. A box in a row with no title or
  no `id` throws.
- **Narrow, the boxes stick at the table's start too,** and the titles right after them.
- **The row open beside the table is `aria-current="true"`,** drawn at `--muted`, as a selected row, with a 3 px bar
  of `--primary` at its start, the first cell's `::before`. A row's state, selected or current, wins over its hover.
- **`TableSelectionBar` goes over the table,** with the app's count and words, `count` and `label`, in a status a
  screen reader hears, and the app's actions, in a `--muted` fill lined up with the table's ends. With nothing
  selected it shows nothing, but its status stays. In a card, a bar and a table alone in a `CardContent` run edge
  to edge together.

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
  `section.tsx` until a second piece reads it.
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
- **No `colSpan`,** as screen readers announce spanning headers badly, as Roselli found, and a column can then hide
  by its cells with nothing misaligned. **What it costs:** `align` and `hideBelow` are written on each cell, and a
  long title stays in its column.
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
- **The current row's bar in its first cell,** not a border on the row, as a table's collapsed borders give a
  row's border half its width inside, which moves that row's text about 1.5 px off the others'.
- **The bar over the table, in the page's flow,** as Carbon has it, so it covers nothing and a screen reader meets
  it before the rows. **The count the app's,** as only the app knows the rows selected on other pages. **What it
  costs:** in a long table it scrolls out of sight, which a bar fixed at the page's foot, in the roadmap, can hold.
- **A control named by its row's title,** as Primer asks an action to say which row it acts on, so the app writes one
  word, once, and no name is repeated or stale. **What it costs:** every row needs a title.
- **Lines, space and type for a group and a total, and no fill,** as a fill is kept for a row's state, as white
  space is the least visible way to group, as Stephen Few has it, and as screenshots of both showed the group and a
  selected row fighting when both were filled. **A double line over the total,** which reads as a total at once;
  accounts draw it under the total, which in a card stacks with the card's edge.

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

## History

- 2026-11-09: Written, with the conventions that cross pieces, and Section.
- 2026-11-09: Every piece in one folder, under one rule, imported by its name alone.
- 2026-11-10: Link.
- 2026-11-10: The most semantic HTML and CSS.
- 2026-11-10: Table, a native table of our own.
