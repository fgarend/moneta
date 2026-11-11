# Roadmap notes

What is known about each item of [`ROADMAP.md`](ROADMAP.md), and what is still to ask, by its title, in its order.
Read when the item starts. Open questions are asked then, and each shows what is recommended today, to be argued
again at that moment. When an item is done, its notes go, as what holds then is in `docs/decisions/`.

## How the list works

- The order is the numbering. A new item goes where it is needed, and the numbers after it move.
- A family of pieces is one item, and each piece in it a step of its own, unless they share one design, as Money
  values. A piece another item needs sooner moves there, and its family says so.
- A done item moves to `Done` with its version. A dropped one is written below, with its reason, so it is not
  raised again.

## Before Sidebar: what an app's screens wait on

The owner decided on 2026-11-09 that these come first, as an app keeps its own shell until Sidebar while these hold
its screens back: the close button's name, done in 0.6.0, Link, done in 0.7.0, Money values, done in 0.8.0, Table,
Lists of rows, Dates and DateField. Each is a step of its own, with what its family's item says of it. **What it
costs:** a piece made before Colours of meaning and One scale of sizes may need a touch when they arrive, and
Sidebar's study may change the space around Section. To ask later: a page that puts the pieces together, a
pre-release tried in an app before a version, and a review of the whole after each family.

## Table

Decided on 2026-11-10, one point at a time, after a study of an app's screens and prototypes, of other libraries, a
design review, screenshots of a throwaway lab in the real theme, and a final review by design skills and by sources.
What holds once built goes to `docs/decisions/`; this is the list to build from.

**What it is.** A native `<table>`, with real controls inside in Tab order, in place of React Aria's `grid`, as almost
every table seen is read to compare, which the APG's Table pattern serves: screen readers keep their table commands, a
link in a cell is in Tab order, and text can be selected and copied. Carbon, Primer, Polaris, GOV.UK and Ant do so.
**What it costs:** the selection's state is ours, each checkbox is a tab stop, and an app that uses `grid`,
`onRowAction`, `selectionMode` or `TableCaption` moves, as a breaking change. One step, a commit for each part.
Later, in the roadmap: virtualisation, resized columns and rows dragged, which React Aria gives only on its `grid`.

**Structure and API.**
- No `colSpan` anywhere: every row has a cell per column, groups and the total too, as Roselli advises against
  spanning headers, and so columns can hide.
- `align="start" | "end"` written on `TableHead` and each `TableCell`, as `text-start` and `text-end`, never centre.
- Every row has a title, `TableHead scope="row"`, a `<th>`. A row's controls take their names from it by
  `aria-labelledby`: a checkbox reads as the row's title, the disclosure too, and an action joins the app's one word,
  as "Edit", to it. A row with no title throws while the app builds.
- Groups: one `TableBody` per group, opened by a `TableGroupRow` whose title is a `<th scope="row">`, as
  `scope="rowgroup"` is not announced by today's screen readers, with the subtotals in their columns of that row.
- Total in `TableFooter`, a `<tfoot>`, its title a `<th scope="row">`.
- A cell with an icon, a title and a detail line uses `Item`'s parts, with the cell's padding over Item's own; titles
  wrap, never truncate.
- An action: the last column, under `TableHead hideHeader`, a ghost icon button of at least 32 px, a `DropdownMenu`
  for several.
- A row that opens: a click on an empty part of a row forwards to the link in its title, unless text is being
  selected or a control was clicked, by our own script, as a stretched pseudo-element over the row breaks in Safari
  26 and before and stops text from being selected. Ctrl, Cmd and the middle button are to be tried in the three
  browsers.
- Child rows: a disclosure button of 32 px in the parent's title, `aria-expanded` and `aria-controls`, children right
  after the parent, `hidden` when closed, indented by the button's slot, which rows with no children keep only when
  some row has them; one level; `expandedKeys`, `defaultExpandedKeys` and `onExpandedChange` on the table, by row `id`.
  A detail row is a child with its content in the first cell.
- Selection: `selectedKeys`, `defaultSelectedKeys` and `onSelectionChange` on the table, by row `id`, and no
  `selectionMode`, decided on 2026-11-11, as boxes select many and the open row is `aria-current`;
  `TableSelectAll` in a header cell, named by the app once, tri-state over the rows shown, and `TableSelect` in each
  row; Shift+click selects a range; keys persist across pages, sorts and filters, so the bar shows the app's count;
  "select all 142" is the app's button. `TableSelectionBar` shows the count in a status the screen reader hears
  (4.1.3), the app's actions, and a copy button. The row open in a side panel is `aria-current`, not selected, whose
  announcement is to try by hand. `aria-selected` is allowed on a table's row but is for composite widgets, so a
  row's state is its checkbox's. Narrow, the boxes stick with the titles, and the bar goes over the table, in the
  page's flow, with `count` and the app's `label`, all decided on 2026-11-11.
- Sorting: `allowsSorting` and an `id` on a column, `sortDescriptor` and `onSortChange` on the table; a button with an
  arrow in the header; `aria-sort` on the sorted header only; the app sorts. Decided on 2026-11-11: every sortable
  header shows a quiet up and down mark, the sorted one its arrow in the text's colour, before the text in a column
  at the end; a press sorts ascending, then flips, with no unsorted state; the change is not announced but by
  `aria-sort`, in the roadmap to revise.
- Pagination: `Pagination`, reviewed in this step on 2026-11-11, its English words turned into props, composed below;
  "1–14 of 142" is the app's text, in `PaginationSummary`.
- `stickyHeader`: within the table's own scroll area, when its place limits the height, as a horizontal scroll area
  cannot stick to the page; `scroll-padding-top` on that area, for 2.4.11.
- `density="compact"`, rows of about 36 px, besides the default, about 44 px.
- Hidden columns: `hideBelow="sm" | "md" | "lg"` on each cell of a column, as `display: none`; a column the app does
  not want, it does not draw.
- Loading: the first load shows skeleton rows sized by the table's columns and alignment, `aria-busy`, and the app's
  words announced; a reload keeps the rows, with `aria-busy` and a thin indeterminate bar of `Progress` under the
  header, never dimmed rows. `Progress`'s indeterminate bar, drawn full today, and `Skeleton`'s pulse, which ignores
  reduced motion, are fixed here.
- Empty: the header stays, and `TableEmpty` holds the app's content in one row across the table.
- Copying: when a selection crosses cells, the table writes the copy itself, tab-separated text and HTML, with a
  hyphen for the minus of its values, hidden values as dots and hidden columns left out; a selection inside one cell
  stays the browser's, and one value keeps its own rule. The copy button builds the same from the selected rows.
  `money.md` and the guidelines change with it. Excel in pt-BR and Google Sheets are to be tried by hand.
- The name, required by TypeScript: `aria-label`, `aria-labelledby`, or `caption`, which draws a native `<caption>`.
- `Amount` gets `hideCurrency`, for a column of one currency whose header names it.

**Look.**
- Lines, space and type mark structure, and a fill is only for a state.
- A thin `--border` line under every row; the header has no fill, at 13 px muted.
- A group: 32 px above its title, 12 px for the first group, under the header; 20 and 8 in `compact`; the title at
  12 px, semibold, muted; its subtotals at the row's size; a `--border-strong` line under it.
- The total: 600, a double `--border-strong` line above it.
- Weights inside a table: the rows' values at 400, subtotals at 500, the total at 600, set by the table on the pieces
  of value inside it; `Amount` stays 500 elsewhere.
- `--border-strong`: a new token, warm, darker than `--border` in light and lighter in dark, held by the theme's test.
- States: hover at half `--muted`, on rows that select or open only; selected and current at `--muted`; the current
  row also has a 3 px bar at its start in `--primary`, drawn by its first cell's `::before`, as a border on the row
  moved its text, found on 2026-11-11.
- In a Card, the table runs edge to edge, with 20 px ends lined up with the card's title, when it is the only child of
  a `CardContent`, which then loses its side padding and gains a top line. Loose on a page, it reaches 12 px out on
  each side, by a negative margin, so its text lines up with the page and a fill has room.
- What sticks takes `--surface`: a new variable, the page's background in `:root` and again under `.dark`, which
  `Card`, `Sheet` and `Dialog` set to their own; a row's state is drawn over it.
- Phones: the guidelines lead with hiding all but the title and the value; by default, text wraps, a row's title
  keeps a minimum width, as on every text cell it squeezed a card's table, the table scrolls in its own area, its row titles stick at its start while it scrolls, a shadow at
  an edge shows there is more, and the area takes keyboard focus only when it overflows.
- Controls' columns, selection, disclosure and action, are as narrow as their content.

**Guidelines to write.** Subtotals and the total follow their rows' `sign` and take no `tone`. A cell is blank when a
value does not apply, and "—" with the app's words when it is missing. A total that counts more rows than are shown
says so in its title. A table in a Card is alone in its `CardContent`. Confirm an action on rows selected but not shown.

**Found on the way.** `Checkbox` draws a check when indeterminate, which select-all needs fixed. Safari 26 is the floor
to try against: Safari 27 fixed a table row as a containing block, `visibility: collapse` on columns, and Tab inside
an area with scroll padding. React Aria sets `aria-sort="none"` on every sortable column but the sorted one, which this
table does not. The lab's fictitious sums were wrong once, so the stories' totals are checked by a test.

## Lists of rows

Decided on 2026-11-10, while studying Table: a list of rows is not a table. In a table one compares down the columns,
under headers; in a list each row is one thing, read across, as an icon, a title, a line of detail and its value at
the end, with no header. An app's own rule says the same, "a few things with a few numbers are cards or a list; many,
or a comparison of columns, a table", and its prototypes keep a transaction row apart from their tables. Polaris
keeps `ResourceList` apart from `IndexTable`, Carbon `StructuredList` from `DataTable`, and Spectrum `ListView` from
`TableView`. The same data may be a table on one screen and a list on another, which the screen chooses.

On shadcn's `Item`, which Display held as "also as a list's row with an amount", moved here: a list's semantics, as
`ItemGroup` today is a `div`, groups with a heading and a total, decided with Table's groups so both look and read
alike, a row as a link or with one action, and `Amount` at its end. Uses seen: a day's transactions with that day's
balance, savings, a person's accounts, the last operations in a side panel, followed assets, rules, and bills due.
A thing's attributes, key and value, are DescriptionList, and a ranking or share in bars is BarList, AllocationBar
or Meter, each in its own item. It shares Table's look by construction, not by copy: the group's title and total, the
line under a row, the hover and the current row's bar, as a list's row can be open in a side panel too.

## Dates

They come with money, as they share how a value is held, formatted and shown. Shown and entered, on
`@internationalized/date`, which React Aria's date pieces use. It comes before DateField.

- To ask: which type holds a date, `CalendarDate` for a day with no time or `ZonedDateTime` for a moment in a place.
- To ask: a hook on its `DateFormatter`, beside `useFormatMoney`, with the same provider or its own.

## DateField

Entering a date, of Actions and forms' family, moved here.

## Motion, layers and icons

They cross every piece and no item holds them: durations and easing, with reduced motion on every piece, as Spinner
spins regardless, the order of layers, as shadcn writes `z-50` on every overlay, and the icons' sizes.

## Sidebar, AppLayout and providers

Starting with a study, which is what this item asks first: how each is defined, and where it lives. `sidebar`
stayed out of the first delivery for this. Until then, an app keeps what it has for its shell. What is known so far:

- shadcn's sidebar lacks `<nav>`, lists, `aria-current` and a skip link. Its trigger lacks `aria-expanded`, its
  count sits outside the link's name, and it writes a cookie it never reads. It loses the current page in forced
  colours.
- Esc does not close its mobile sheet from a link with a `tooltip`, and the sheet stays open after navigating.
- An empty navigation and a tooltip on a collapsed item are to be settled.
- A check for reduced motion arrives with it, as shadcn's files have no `motion-reduce`.
- `use-mobile` falls under the coverage of `stories`, so it needs a story, or an exclusion.
- Its gradient and glow are to be asked (recommended: yes, by eye).
- Links through whichever router an app uses: the sidebar passes `href`, `routerOptions` and `render` on.
  `createLink` on a sidebar button reloaded the page on Enter, when it was tried.
- To say: how an app gives React Aria its locale, through `I18nProvider`, as without it React Aria's own words
  follow the browser's language.

## Colours of meaning

`--destructive` is the only one today: success, warning and information, and a palette for categories and for the
charts, in light and dark. Gain and loss came first, with Money values, as `--positive` and `--negative`, which a
value's `tone` reads, and these are chosen beside them, as `tone` already names good news or bad.

- To ask: which names, in shadcn's format.
- To ask: whether a meaning stays a value of `variant`, as shadcn's `destructive` is, or becomes a prop of its own,
  such as `tone`, beside a `variant` for the style, which would edit each piece with `destructive`.
- To ask: whether this and One scale of sizes come before the families, as they reach every piece.
- To ask: a base palette under the semantic names, as Material 3, Spectrum and Carbon tier their tokens, and the
  DTCG format reached a stable version, 2025.10.

## One scale of sizes

The look's 32, 36 and 40 px, on every piece, as only 9 follow it today. Badge, Avatar, Item, Checkbox, Switch and
Table's rows do not, and Item's `default` and `sm` are the same. Input has no `lg`, so a field in a row with a page's
main action takes `h-10` by hand, as the sample page does. Table chose its own first, rows of about 44 px and
`density="compact"` of about 36 px, which this item may rename.

- To ask: the names of the sizes for every piece, as Button has `xs`, `sm`, `default`, `lg` and `icon-*`.

## Layout and text

What replaces `flex`, `gap-*` and `text-*`, which shadcn does not have and most of an app's classes are. Own code,
the rule's third step, so a page shows the need first.

- To ask: which pieces and their names, and how far their props go (recommended: the fewest that remove the most
  classes, against a mini-language of layout to maintain). Against it: most libraries take layout pieces for bloat
  beside Tailwind, and Spectrum 2 dropped its own, so the question includes whether an app keeps Tailwind for
  layout alone.

The measure of the final pieces is the classes an app's screens write. On a real app on 2026-11-06: 1,683 uses in
47 of its 59 screen files, 606 of text, 548 of layout, 192 of space and size, 140 of colour and surface, and 197
others not sorted.

## The families

The final pieces: every piece a complete library for money would have, whether or not a page needs it yet, as
Moneta exists apart from any app. A page or a prototype only shows which comes first. They came from a survey on
2026-11-08 of 16 component libraries, finance design systems, money libraries and a prototype. Each goes through
the rule, with shadcn's name where it has one, and holds no word of any one app's domain. Where a reference
disagrees with this map, it is decided as the piece arrives. Moneta's own pieces beyond shadcn's come here too, as they
hold no word of any app's domain. Stories that already state what must hold come over
with each family. No reviewed piece has a default text, so shadcn's written strings become props.

**Done when:** an app can build every screen from Moneta's pieces with no class of its own, and leaves Tailwind for
`styles.css`. Until then, it keeps Tailwind only for the classes it still writes.

## Display

- Badge, deciding its finance colours on a dark surface, with tones for success, warning, danger and information, a
  dot, and a count beside a section's title.
- Card, whose title is a `div`, to take a heading's level as `docs/decisions/components.md` says, deciding where
  code shared by pieces lives, and whether an app gets a `Heading` that reads the level.
- Section came early, before Sidebar, and Table comes there too.
- Avatar with its group, AvatarGroup, whose fallback's text an app measured at 4.34:1.
- Alert. Item moved to Lists of rows. Separator, Stat, DescriptionList, Kbd, AspectRatio, ScrollArea,
  Timeline and TickerChip.

## Actions and forms

- Button's variants, ButtonGroup, PageHeader, Input, InputGroup, whose addon, such as a currency's symbol, a screen
  reader does not read as part of the field's name, Textarea, Label, NativeSelect and Slider.
- Field, which does not link its description or error, and decides the contrast of the control's border against
  the 3:1 of WCAG 1.4.11.
- Select, and when to use it or NativeSelect.
- Checkbox, which draws a check when indeterminate, and RadioGroup, in a row as well, their items growing for their
  label, which today they do not. Switch, Toggle, and ToggleGroup, weighing a segmented control, SegmentedControl,
  against a radio in line.
- DateField came early, before Sidebar. SearchField, FilePicker, ChoiceCard, and `combobox` after a study like
  Sidebar's.
- NumberField, DatePicker, DateRangePicker with presets such as the last 30 days, TimeField, a choice of many with
  removable chips, on React Aria's `TagGroup`, InputOTP, as `input-otp`, which brings a package of its own,
  CopyButton, which says it copied in a status message, and copies an amount through the way Money values takes,
  Toolbar, a bar of actions on what is selected, a period switcher, previous and next around a label such as a
  month, and React Aria's `ColorSwatchPicker`.
- Button's `link` variant, a button drawn as a link, and `LinkButton`'s, nearly a `Link` but 36 px tall and
  padded, now that `Link` exists: whether each stays, changes or goes. `LinkButton`'s `disabled:` classes do not match
  a disabled link, which React Aria draws as a `span`, so it is not dimmed.
- To ask: forms, on React Aria's `Form`, with a server's errors through `validationErrors`, and how an app's form
  library connects, as Adobe documents React Hook Form and Zod. A form's states, such as dirty or touched, stay with
  that library or the app.

## Overlays

- Dialog, AlertDialog, and Sheet, whose `aria-label` stops at the layer behind and does not name its dialog. Dialog
  and Sheet start their title's level again at 2, as `docs/decisions/components.md` says. Popover, HoverCard,
  DropdownMenu, ContextMenu and Tooltip.
- Text spacing and forced colours reach what an overlay draws when open, in these and in Select, as today they see
  only the closed trigger. Forced colours' `:popover-open` finds nothing, as React Aria does not use the `popover`
  attribute.
- The close button's name came before, in 0.6.0, and this review may change it.
- Toggletip, which opens on a click and on touch, as Tooltip does not open on touch, so it is never the only place
  of a piece of information.

## The rest

- Tabs, with a count in a tab and tools to the right of its list. Progress, Empty, and Skeleton, with one pattern
  for loading, error and empty. Spinner and Breadcrumb. Pagination moved to Table.
- Collapsible, IconTile, StatGroup, as the sample page's summary strip draws it, which is also what KpiStrip meant,
  and AllocationBar. `calendar` after
  a study like Sidebar's.
- Link came early, before Sidebar.
- Steps, Banner, and Meter, which says how much of a limit is used, unlike Progress, with a target's mark.
- A bar of actions fixed at the foot of the page, a list virtualised for thousands of rows, on React Aria's
  `Virtualizer`, and Toast. To ask for Toast: React Aria's is still `UNSTABLE_`, and shadcn's was announced for
  Base UI.

## Charts

Line, area, bars and donut, with a tooltip and a crosshair, and a reference line such as an average, a ring for one
value, and BarList, a ranking in bars, with shadcn's `chart-1` to `chart-5`, whose marks need 3:1 against the
surface, under WCAG 1.4.11, and a table of the data beside each.

- To ask: where `recharts` goes (recommended: an entry of its own).

## Not to build, and to ask again

- Not to build: BottomNav (recommended, to confirm when a page first needs a bottom navigation), Carousel, Menubar,
  AI pieces and a TanStack table.
- To ask again, as a complete library would have them: Sparkline, Accordion and Command.
- The registry's other pieces that stayed out, in `docs/decisions/base.md`, are weighed the same way.

## MoneyInput

On React Aria's `NumberField`.

- To ask: how its value leaves as a decimal string, as `NumberField` holds a `number`, and a paste of `1234.56` in
  pt-BR reads 123456.

## CurrencySelect

To choose a currency.

## A stable API

Every piece reviewed, and the accessibility script's first run, by the owner, with a screen reader and real zoom.
With it, what a piece's state promises after 1.0, as Primer's Experimental, Ready and Deprecated do, a policy for
deprecating, and a note in the changelog on how to move for each change that breaks.

## Stricter checks

Since by then every piece has been read: `exactOptionalPropertyTypes`, if React Aria's types pass it.
`noUnusedLocals` came back on 2026-11-09.

## Release 1.0.0

With `check-release`'s rules for the numbers after it, as a change that breaks then moves the first number.

## Later

- **A registry.** Delivery is by tarball. Weighed when that stops being enough.
- **A local link.** Installing a build each time may slow the daily work. A tarball installed in 1 to 2 seconds on
  2026-11-06, and it also catches packaging errors. Weighed when that slows it.
- **The scale of the whole system.** A preference for larger text belongs to the whole system. Tailwind's spacing in
  `rem` answers part of it.
- **Below the medium breakpoint in the screenshots.** They run at one width.
- **Below 800 px in the screenshots.** A screenshot draws only the viewport's 800 px and leaves the rest of a taller
  story white, so nothing below them is compared, as a block added to the sample page showed on 2026-11-09.
- **A top bar that stays in view.** When something needs it.
- **A note at a section's foot,** for what holds for the whole section. When a page needs it.
- **Right-to-left.** No piece has a rule for it, so chevrons do not flip. When an app needs it.
- **Layers in the gallery.** Foundations and blocks, beside `Components`, whose groups are shadcn's, as
  `docs/decisions/components.md` says. The name `gold`.
- **Sizes and names to settle.** The tooltip's width and the name of its text.
- **Drawings beyond Lucide.** When something needs its own SVG.
- **The browsers Moneta supports.** Nothing states them. Tailwind 4 sets a floor, and lint holds the CSS to what is
  widely available in Baseline. Table found Safari 26 a floor worth naming, as Safari 27 fixed several table bugs.
- **A module of composed components.** shadcn's blocks and `sidebar` are the start.
- **Application patterns.** A list page, a detail page, filters and a wizard, with no word of any app's domain,
  beside the module of composed components.
- **Help for an app's agent.** shadcn's MCP server works with any registry, and shadcn has skills and serves its docs
  in Markdown. Weighed with the registry.
- **Image vulnerability scan.** The system packages inside the images.
- **Update bot.** Left out for now, as `docs/decisions/tooling.md` says.
- **Storybook's accepted advisories.** Through a docgen plugin Storybook installs and our settings never load. They
  go when Storybook takes the plugin 0.9.1 or later, which has no `glob`, as `pnpm-workspace.yaml` says.
- **Storybook's deprecated loader.** Every test run warns `DEP0205`, and it goes when Storybook moves. Vitest also
  warns of 11 `SIGTERM` listeners, with this many browser projects.
- **`make watch`.** Repeats the tests on each saved file. Weighed when running all of `make stories` to check one
  test slows the work, with the time measured.
- **`actionlint`.** Biome reads a workflow's YAML, but not GitHub's rules. It ran once by hand on 2026-11-06, with
  nothing found, and would be one more image to keep. Weighed if a workflow fails on something it finds.
- **Biome's `noTailwindArbitraryValue`.** It may replace the class scan in `test/pieces.test.ts`, which is a long
  regular expression of our own. It is a nursery rule today, and whether it finds the same classes was not tried.
  Weighed with the first own piece that has classes.
- **pnpm's update notice.** `updateNotifier` turns it off.
- **More for a value, when a screen asks.** Each comes with nothing broken, and was left out on 2026-11-10 as no
  screen needed it: a `unit` on `Quantity`, joined by a space that does not break, as in a sentence a quantity and
  its unit may wrap apart; a value that stays shown while the rest are hidden, as "45% of the budget" says little;
  the tone's colour kept while hidden, which says which way a value went, so only as the app's explicit choice; and a
  hook's `{ spoken: true }`, giving `hiddenLabel` in place of the dots for a text only screen readers hear.
- **A table's virtualisation, resized columns and rows dragged.** Left out of Table on 2026-11-10: React Aria gives
  them only on its `grid`, and Table is a native `<table>`, so each would be code of our own or a dependency, as
  `@tanstack/react-virtual` for thousands of rows. Table's API is drawn so they can come with nothing broken.
- **Announcing a table's sort.** Left out of Table on 2026-11-11, for the simpler `aria-sort` alone, as the APG,
  Carbon and Inclusive Components have it. Roselli's tests, updated in October 2026, have NVDA, JAWS, Narrator and
  VoiceOver on iOS announce a sort by it, and VoiceOver on macOS and TalkBack silent. To revise: a `status` on the
  table, the app's words kept in a hidden polite status, as "Sorted by Amount, ascending", which a load or a
  filter's count could share; MoJ's sortable table and React Aria's own table announce so, Primer too, staying
  silent when content comes within 750 ms. What it costs: NVDA and JAWS say it twice, as Roselli heard in JAWS.
- **The pages a pagination draws, worked out.** Left to the app on 2026-11-11, as shadcn has it: the first, the
  last, the current and one on each side, with gaps, by the guidelines. MUI and Mantine give it as
  `usePagination`. To add if a second app writes the same loop.
- **`LinkButton` disabled draws no dimming.** Found on 2026-11-11: `buttonVariants` dims by `disabled:`, which a
  link, drawn by React Aria as a `span` with `data-disabled`, never matches. Pagination dims its own links.
- **The sample page's text in the dark stories.** On 2026-11-10, in the `storybook-dark` project, a cell of the sample
  page's table read `rgb(35, 38, 43)`, light's `--foreground`, while `var(--foreground)` on a probe appended to the
  story's canvas read `rgb(244, 244, 242)`, dark's, and the `visual-dark` screenshot draws the page dark. Its check
  compares a value with the text of its own row instead. Whether the dark stories put `.dark` where the page reads it,
  and whether a check elsewhere passes only for that, is to find out.
- **The gallery's own types.** TypeScript skips a folder whose name starts with a dot when `include` names the folder
  alone, so of `.storybook/` it checks only what another file imports. With `.storybook/**/*`, it read 12 files on
  2026-11-09 and found 15 errors in four tests of the gallery, all from the typing of `.storybook/stories.ts`.
- **The lowest version of each peer in `package`.** It tests only the version in `devDependencies`, so the floor of
  a range is a promise. `react` 19.0.0 was tried once, on 2026-11-05, with only the minimal `Button`. Weighed when
  there are more pieces.

## Done, in detail

- **Money values,** in 0.8.0: `Amount`, `Percent` and `Quantity`, with `Money`, `MoneyProvider` and the hooks,
  exact, with the minus sign, a sign and a tone, and a hidden mode, as `docs/decisions/money.md` says.
- **Link,** in 0.7.0: underlined in the theme's primary, quiet with `isQuiet` where it stands alone, dimmed when
  disabled, and asking for what it holds, as `docs/decisions/components.md` says.
- **The close button's name,** in 0.6.0: Dialog, Sheet and DialogFooter take it from the app by `closeLabel`, which
  TypeScript asks for while the button shows, as `test/close-label.test.ts` checks.
- **Every piece under one rule,** in 0.5.0: every piece in `src/components/`, under the same format, lint, coverage
  and scale, shadcn's base kept in `upstream/shadcn/` and its updates merged three ways by `make shadcn-update`, as
  `docs/decisions/components.md` and `docs/decisions/base.md` say.
- **Section, and the conventions across pieces,** in 0.4.0, as `docs/decisions/components.md` says.
- **What a review of the repository found,** on 2026-11-09, in 0.3.0: facts out of date, `Slider`'s focus, and the
  sample page against the guidelines.
- **Moneta's look,** in 0.2.0: our `theme.css`, light and dark, with the checks in both modes, the guidelines and the
  gallery's frame, as `docs/decisions/theme.md` says.
- **First delivery,** done when the package installs and works in a test consumer, with a version an app can pin.
  What an app does with it happens in that app, and is not tracked here. One import, with ready-made styles, as
  `docs/decisions/delivery.md` says. A story for each of the 41 pieces, with what they measure in `docs/pieces.md`.
  The release's part of the pipeline, as `docs/releasing.md` and `docs/decisions/delivery.md` say. A rehearsal,
  `v0.0.1`, published on its second run, the first having stopped before spending the number. What is written
  matching what exists, with the README's install, use and how far changing the look reaches. Release 0.1.0,
  published on 2026-11-06 with all 41 pieces raw. A release's number following from its changelog, as
  `docs/releasing.md` says. Pull requests to `main`, and a release on each merge of a version with no tag.
- **The base,** shadcn's pieces and theme, as a package, with no choice of look yet: the first `shadcn add`, 41
  pieces, as `docs/decisions/base.md` and `docs/pieces.md` say, and shadcn's default theme, with the font apart.
- **The pipeline,** each group as in `docs/decisions/process.md`: the floor, containers, static checks, stories and
  browsers, build and package, the audit and the workflows' test, and one `stories` box per browser. The checks are
  `lint`, `types`, `test`, `stories`, `package` and `storybook-build`, fastest first, as
  `docs/decisions/tooling.md` says.

## Dropped

- Tokens for what is written by hand, the `body`'s margin and repeated hidden titles, since Tailwind's utilities,
  preflight and `sr-only` dissolve them.
- Our own `theme.css` at the base, before the look: it came with Moneta's look instead.
- `Sidebar`, `AppLayout` and providers in the first delivery: they wait for a study of their own.
