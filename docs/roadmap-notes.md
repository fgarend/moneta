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
its screens back: the close button's name, done in 0.6.0, Link, done in 0.7.0, Money values, Table, Dates and
DateField. Each is a step of its own, with what its family's item says of it. **What it costs:** a piece made before
Colours of meaning and One scale of sizes may need a touch when they arrive, and Sidebar's study may change the
space around Section. To ask later: a page that puts the pieces together, a pre-release tried in an app before a
version, and a review of the whole after each family.

## Money values

What holds is in `docs/decisions/money.md`, decided on 2026-11-10 for the whole item: one `Money` type, shown
exactly, the browser's decimals, the minus sign, the app's words and meaning, and one path from an amount to its
text. One step, as its pieces share that design, with a commit for each, in this order. It comes before Stat, Table
and AllocationBar, which show amounts.

- **Amount,** with `Money`, `MoneyProvider` and `useFormatMoney`. Done in this step's first commit.
- **Percent,** given as a ratio, `"0.459"` for 45.9%, with `useFormatPercent`. Done in this step's second commit.
- **Quantity,** as shares and units, with as many decimals as given, and no unit. Done in this step's third commit.
- **`sign` and `tone` on all three,** for a change, as `+3.2%`, with no piece of its own: `sign="always"` shows the
  plus, and zero takes no sign. The tone is the app's, never read from the sign, as a debt that falls is good news,
  and its colours are the theme's, which pulls gain and loss from Colours of meaning. Colour is never alone, as the
  sign says it.
- **Hidden values,** in which every amount shows "••••••", by replacing its text, as a blur leaves the value on the
  page and in a copy, and no `data` with the value. `MoneyProvider` holds `isHidden` and `hiddenLabel`, and the app
  its toggle. `useFormatMoney` follows it.
  - To ask: whether a percent hides too, as a share says little and a return more.
  - To ask: what `useFormatMoney` gives a text only screen readers hear, as an `aria-label`, where the dots read as
    "bullet".

Dropped on the way: a table of ISO 4217 of our own, `formatMoney` as a public function, Delta, and cents raised or
smaller, which VoiceOver on iOS stops at.

## Table

Weighing a `grid` role, with a column of numbers aligned right, a total row, group rows with a subtotal, "—" for a
missing value, a header that stays in view, rows selected, with a checkbox for all in the header, indeterminate when
only some are, an action per row, child rows that open under their parent, a compact density and a container with
a border. Tables on phones are decided with it. A scroll fade at the edges was shadcn's, and left with 0.5.0, so it
comes back here if wanted, with what it asks of the browsers. Its caption is a `figcaption` with no `figure`.
Copying rows is an action of its own, which builds their text and HTML, with amounts a spreadsheet reads: a hyphen for
their minus, or the number alone, as the browser's copy of a row keeps the minus sign, which Excel and LibreOffice
take as text.

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
charts, in light and dark. Gain and loss come first, with Money values, and these are chosen beside them.

- To ask: which names, in shadcn's format.
- To ask: whether a meaning stays a value of `variant`, as shadcn's `destructive` is, or becomes a prop of its own,
  such as `tone`, beside a `variant` for the style, which would edit each piece with `destructive`.
- To ask: whether this and One scale of sizes come before the families, as they reach every piece.
- To ask: a base palette under the semantic names, as Material 3, Spectrum and Carbon tier their tokens, and the
  DTCG format reached a stable version, 2025.10.

## One scale of sizes

The look's 32, 36 and 40 px, on every piece, as only 9 follow it today. Badge, Avatar, Item, Checkbox, Switch and
Table's rows do not, and Item's `default` and `sm` are the same. Input has no `lg`, so a field in a row with a page's
main action takes `h-10` by hand, as the sample page does.

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
- Alert. Item, also as a list's row with an amount. Separator, Stat, DescriptionList, Kbd, AspectRatio, ScrollArea,
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
  CopyButton, which says it copied in a status message, and copies an amount through the way Money values takes, Toolbar, a bar of actions on what is selected, a period
  switcher, previous and next around a label such as a month, and React Aria's `ColorSwatchPicker`.
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
  for loading, error and empty. Spinner, Breadcrumb, and Pagination, with a summary such as "1–20 of 142".
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
  widely available in Baseline.
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
- **The gallery's own types.** TypeScript skips a folder whose name starts with a dot when `include` names the folder
  alone, so of `.storybook/` it checks only what another file imports. With `.storybook/**/*`, it read 12 files on
  2026-11-09 and found 15 errors in four tests of the gallery, all from the typing of `.storybook/stories.ts`.
- **The lowest version of each peer in `package`.** It tests only the version in `devDependencies`, so the floor of
  a range is a promise. `react` 19.0.0 was tried once, on 2026-11-05, with only the minimal `Button`. Weighed when
  there are more pieces.

## Done, in detail

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
