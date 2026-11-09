# Roadmap

**Now:** 4.11, next a name for the close button of Sheet and Dialog.

**The goal:** Moneta is the source of truth for components. An app consumes final pieces and builds
its screens from them, writing no class of its own. What it lacks is added here, not there.

**The order:** first in use, then refined. Moneta starts as shadcn untouched, delivered as a
package, so an app can use it from the start. The look, the missing pieces and the reviews arrive
afterwards, version by version, and an app's classes shrink as they do.

What needs to be created, in order. The order follows what is needed next, so a new
need can change it. Open questions are asked when their step arrives, and each shows
what is recommended today, to be argued again at that moment.

## How items are numbered

- An item's ID is `milestone.item`. It is fixed, not a position: the order is the
  position in the list. A new item takes the next free number in its milestone.
- A finished item moves to its milestone's `Done:` line. A dropped item moves to its
  `Dropped:` line, with the reason, so it is not raised again.
- An item moved to another milestone takes a new ID there, and keeps the old one in parentheses.

## 1. Pipeline

Each group as in `docs/decisions/process.md`. `make check` runs only what exists, and
grows with each group.

The checks, for every group: `lint`, `types`, `test`, `stories`, `package` and `storybook-build`, fastest
first. `make check` runs them in that order, all of them even if one fails, and ends
with one line per check saying whether it passed. Continuous integration has one box
per check, with the same name, in parallel, so `make <box>` repeats a red box. `stories` has one
box per browser, repeated by `make stories BROWSER=<browser>`.

Done: 1.1, the floor. 1.2, containers. 1.3, static checks. 1.4, stories and browsers. 1.5,
build and package. 1.6, the audit and the workflows' test. 1.7, one `stories` box per browser. The release's part is 3.3.

## 2. The base, as shadcn delivers it

shadcn's pieces and theme, untouched, as a package, with no choice of look yet.

Done: 2.1, the first `shadcn add`, 41 pieces, as `docs/decisions/base.md` and `docs/pieces.md` say.
2.3, shadcn's default theme, and the font apart, as the same file says.

Dropped: 2.2, our `theme.css`, moved to 4.5.

## 3. First delivery

**Done when:** the package installs and works in a test consumer, with a version an app can pin.
What an app does with it happens in that app, and is not tracked here.

Done: 3.4, one import, with ready-made styles, as `docs/decisions/delivery.md` says.
3.5, a story for each of the 41 pieces, with what they measure in `docs/pieces.md`.
3.3, the release's part of the pipeline, as `docs/releasing.md` and `docs/decisions/delivery.md` say.
3.7, a rehearsal, `v0.0.1`, published on its second run, the first having stopped before spending the number.
3.6, what is written matches what exists, with the README's install, use and how far changing the look reaches.
3.2, release 0.1.0, published on 2026-11-06 with all 41 pieces raw.
3.8, a release's number follows from its changelog, as `docs/releasing.md` says.
3.9, pull requests to `main`, and a release on each merge of a version with no tag, as `docs/decisions/delivery.md` says.

Dropped: 3.1, `Sidebar`, `AppLayout` and providers, moved to 4.6, after a study of its own.

## 4. Final pieces

**Done when:** an app can build every screen from Moneta's pieces with no class of its own, and leaves
Tailwind for `styles.css`. Until then, it keeps Tailwind only for the classes it still writes.

**The measure:** the classes an app's screens write. On a real app on 2026-11-06, 1,683 uses in 47 of its
59 screen files: 606 of text, 548 of layout, 192 of space and size, 140 of colour and surface, and 197
others not sorted. Its own pieces beyond shadcn's also come here, as they hold no word of its domain.

**What it holds:** every piece a complete library for money would have, whether or not a page needs it
yet, as Moneta exists apart from any app. A page or a prototype only shows which comes first. The pieces
below came from a survey on 2026-11-08 of 16 component libraries, finance design systems, money libraries
and a prototype.

From here on, each step that changes what an app receives is a version, and an app updates when it wants. The
look comes first, as it reaches every piece at once, and the order after it follows what is needed next. Each
item goes through the rule, with shadcn's name where it has one, and holds no word of any one app's domain.
Where a reference disagrees with this map, it is decided as the piece arrives. Stories that already state what
must hold come over with each family. No reviewed piece has a default text, so shadcn's written strings become
props.

**A piece is reviewed with:** its stories, its visual test and contrast in both modes, its
accessibility report, its section in the guidelines and the changelog. Lint, coverage and the scale hold every
piece already, as 4.15 settled.

Done: 4.5 (was 2.2), our `theme.css`, light and dark, with the checks in both modes, the guidelines and the
gallery's frame, as `docs/decisions/theme.md` says. 4.12, what a review of the repository found on
2026-11-09: facts out of date, `Slider`'s focus, and the sample page against the guidelines, in 0.3.0. 4.13, the
conventions that cross pieces, with Section, the first of 4.11, in 0.4.0, as `docs/decisions/components.md` says.
4.15, every piece in one folder under one rule, with shadcn's updates merged three ways, in 0.5.0, as the same file
and `docs/decisions/base.md` say.

- **4.14 · Motion, layers and icons,** which cross every piece and no item holds: durations and easing, with
  reduced motion on every piece, as Spinner spins regardless, the order of layers, as shadcn writes `z-50` on
  every overlay, and the icon's sizes.
- **4.11 · What an app's screens wait on,** before 4.6, decided by the owner on 2026-11-09, as an app keeps
  its own shell until 4.6, while these hold its screens back: a name for the close button of Sheet and Dialog,
  given by whoever uses them in place of the written "Close", then Link, then 5.1, then Table, then 5.5, then
  DateField. Each is a step of its own, with what its family's item says of it. **What it costs:** a piece made
  before 4.9 and 4.10 may need a touch when they arrive, and 4.6's study may change the space around Section.
  To ask later: a page that puts the pieces together, a pre-release tried in an app before a version, and a
  review of the whole after each family.
- **4.6 (was 3.1) · `Sidebar`, `AppLayout` and providers,** starting with a study, which is what this
  item asks first: how each is defined, and where it lives. `sidebar` stayed out of the first delivery
  for this. Until then, an app keeps what it has for its shell. What is known so far:
  - shadcn's sidebar lacks `<nav>`, lists, `aria-current` and a skip link. Its trigger lacks
    `aria-expanded`, its count sits outside the link's name, and it writes a cookie it
    never reads. It loses the current page in forced colours.
  - Esc does not close its mobile sheet from a link with a `tooltip`, and the sheet stays
    open after navigating.
  - An empty navigation and a tooltip on a collapsed item are to be settled.
  - A check for reduced motion arrives with it, as shadcn's files have no `motion-reduce`.
  - `use-mobile` falls under the coverage of `stories`, so it needs a story, or an exclusion.
  - Its gradient and glow are to be asked (recommended: yes, by eye).
  - Links through whichever router an app uses, as `docs/decisions/components.md` says: the sidebar passes `href`, `routerOptions`
    and `render` on. `createLink` on a sidebar button reloaded the page on Enter, when it was tried.
  - To say: how an app gives React Aria its locale, through `I18nProvider`, as without it React Aria's own
    words follow the browser's language.
- **4.9 · Colours of meaning,** as `--destructive` is the only one today: success, warning, information, gain
  and loss, and a palette for categories and for the charts, in light and dark. To ask: which names, in
  shadcn's format. To ask: whether a meaning stays a value of `variant`, as shadcn's `destructive` is, or
  becomes a prop of its own, such as `tone`, beside a `variant` for the style, which would edit each piece
  with `destructive`. To ask: whether this and 4.10 come before the families, after 4.11's pieces, as they
  reach every piece. To ask: a base palette under the semantic names, as Material 3, Spectrum and Carbon tier
  their tokens, and the DTCG format reached a stable version, 2025.10.
- **4.10 · One scale of sizes,** 4.5's 32, 36 and 40 px, on every piece, as only 9 follow it today. Badge,
  Avatar, Item, Checkbox, Switch and Table's rows do not, and Item's `default` and `sm` are the same.
  Input has no `lg`, so a field in a row with a page's main action takes `h-10` by hand, as the sample page does.
  To ask: the names of the sizes for every piece, as Button has `xs`, `sm`, `default`, `lg` and `icon-*`.
- **4.7 · Layout and text,** which shadcn does not have and most of an app's classes do: what replaces
  `flex`, `gap-*` and `text-*`. Own code, the rule's third step, so a page shows the need first. To ask:
  which pieces and their names, and how far their props go (recommended: the fewest that remove the most
  classes, against a mini-language of layout to maintain). Against it: most libraries take layout pieces for
  bloat beside Tailwind, and Spectrum 2 dropped its own, so the question includes whether an app keeps
  Tailwind for layout alone.
- **4.1 · Display.** Badge, deciding its finance colours on a dark surface, with tones for success, warning,
  danger and information, and a dot, and a count beside a section's title. Card, whose title is a `div`, to take a heading's level as
  `docs/decisions/components.md` says, deciding where code shared by pieces lives, and whether an app gets a
  `Heading` that reads the level. Section, which came in 4.11, and Table, which comes in it, Table weighing a `grid` role, with a column of numbers
  aligned right, a total row, group rows with a subtotal, "—" for a missing value, a header that stays in
  view, rows selected, with a checkbox for all in the header, indeterminate when only some are, an action
  per row, child rows that open under their parent, a compact density and a container with a border. Avatar with its group, AvatarGroup, whose fallback's text an app measured at 4.34:1. Alert. Item, whose
  group has a list role with no list items, also as a list's row with an amount. Separator, Stat,
  DescriptionList, Kbd, AspectRatio, ScrollArea, Timeline and TickerChip. Tables on phones are decided with
  the first table.
- **4.2 · Actions and forms.** Button's variants, ButtonGroup, PageHeader, Input, InputGroup, whose addon, such
  as a currency's symbol, a screen reader does not read as part of the field's name, Textarea, Label,
  NativeSelect, Slider,
  Field, which does not link its description or error, Select, Checkbox, which draws a
  check when indeterminate, RadioGroup, in a row as well, Checkbox and RadioGroup's items growing for their
  label, which today they do not, Switch, Toggle, ToggleGroup, DateField, which comes in 4.11, SearchField,
  FilePicker, ChoiceCard, and `combobox` after a study like 4.6's. Field decides the contrast of the control's border against the 3:1 of
  WCAG 1.4.11. ToggleGroup weighs a segmented control, SegmentedControl, against a radio in line. Also
  NumberField, DatePicker, DateRangePicker with presets such as the last 30 days, TimeField, a choice of
  many with removable chips, on React Aria's `TagGroup`, InputOTP, as `input-otp`, which brings a package of
  its own, CopyButton, which says it copied in a status message, Toolbar, a bar of actions on what is
  selected, a period switcher, previous and next around a label such as a month, and React Aria's
  `ColorSwatchPicker`. Select and NativeSelect say when to use each. To ask: forms, on React Aria's `Form`,
  with a server's errors through `validationErrors`, and how an app's form library connects, as Adobe documents
  React Hook Form and Zod. A form's states, such as dirty or touched, stay with that library or the app.
- **4.3 · Overlays.** Dialog, AlertDialog, Sheet, whose `aria-label` stops at the layer behind and does not
  name its dialog, Dialog and Sheet starting their title's level again at 2, as `docs/decisions/components.md` says, Popover, HoverCard, DropdownMenu, ContextMenu and Tooltip. Text
  spacing and forced colours reach what an overlay draws when open, in these and in Select, as today they
  see only the closed trigger. Forced colours' `:popover-open` finds nothing, as React Aria does not use the
  `popover` attribute. Toggletip, which opens on a click and on touch, as Tooltip does not open on touch,
  so it is never the only place of a piece of information. The name of Sheet's and Dialog's close button
  comes before, in 4.11, and its review may change it.
- **4.4 · The rest.** Tabs, with a count in a tab and tools to the right of its list. Progress, Empty,
  Skeleton, with one pattern for loading, error and empty, Spinner, Breadcrumb,
  Pagination, with a summary such as "1–20 of 142", Collapsible, IconTile, StatGroup, as the sample page's summary strip draws it, which is also
  what KpiStrip meant, and AllocationBar, and `calendar` after a study like
  4.6's. Also Link, which comes in 4.11, a link in text or a cell, known without colour alone, through the router's link, as
  Button's `link` variant is a button. Steps, Banner, Meter, which says how much of a limit is used, unlike
  Progress, with a target's mark, a bar of actions fixed at the foot of the page, a list
  virtualised for thousands of rows, on React Aria's `Virtualizer`, and Toast. To ask for Toast: React
  Aria's is still `UNSTABLE_`, and shadcn's was announced for Base UI.
- **4.8 · Charts.** Chart, as line, area, bars and donut, with a tooltip and a crosshair, and a reference
  line such as an average, a ring for one value, and BarList, a ranking in bars, with shadcn's
  `chart-1` to `chart-5`, whose marks need 3:1 against the surface, under WCAG 1.4.11, and a table of the
  data beside each. To ask: where `recharts` goes (recommended: an entry of its own).

Not to build: BottomNav (recommended, to confirm when a page first needs a
bottom navigation), Carousel, Menubar, AI pieces and a TanStack table.

To ask again, as a complete library would have them: Sparkline, Accordion and Command.

The registry's other pieces that stayed out, in `docs/decisions/base.md`, are weighed the same way.

## 5. Money and other values

The library's reason, and the hardest test of the look: exact values, a real minus,
stepped cents. It comes whether or not a page needs it yet, and a need can bring it
before the families above. Dates come here too, as they share how a value is held, formatted and shown.

- **5.1 · `formatMoney`, Amount and Delta,** with `formatPercent` and `formatQuantity`, "—" for no value,
  and each currency's decimal places from one table of ISO 4217, as `Intl`'s differ from it in 15
  currencies. `Intl` keeps every digit of a decimal string, in the 3 engines tried on 2026-11-08. Their
  stories check the exact text in the 3
  browsers, since coverage counts `formatMoney` in Node, where formatting may differ. To
  ask: money as a decimal string (recommended: yes). To ask: whether Amount colours gain and loss by default or by
  choice of who uses it (recommended: by choice). To ask: which minus, U+2212, as an earlier library wrote it,
  or the hyphen `Intl` writes in pt-BR. It comes in 4.11, before Stat, Table and AllocationBar, which show
  amounts.
- **5.2 · MoneyInput,** on React Aria's `NumberField`. To ask: how its value leaves as a decimal string, as
  `NumberField` holds a `number`, and a paste of `1234.56` in pt-BR reads 123456.
- **5.3 · CurrencySelect,** to choose a currency.
- **5.5 · Dates,** shown and entered, on `@internationalized/date`, which React Aria's date pieces use. To ask:
  which type holds a date, `CalendarDate` for a day with no time or `ZonedDateTime` for a moment in a place,
  and a `formatDate` on its `DateFormatter`, beside `formatMoney`. It comes in 4.11, before DateField.
- **5.4 · Hidden values,** a mode in which every Amount shows "••••••", by replacing its text, as a blur
  leaves the value on the page and in a copy. To ask: where the mode is set.

## 6. 1.0

- **6.1 · A stable API,** with every piece reviewed, and the accessibility script's first run, by the owner, with
  a screen reader and real zoom. With it, what a piece's state promises after 1.0, as Primer's Experimental,
  Ready and Deprecated do, a policy for deprecating, and a note in the changelog on how to move for each change
  that breaks.
- **6.3 · The stricter checks back,** since by then every piece has been read. `noUnusedLocals` returns,
  as lint already holds every piece. To weigh again: `exactOptionalPropertyTypes`, if React Aria's types pass it.
- **6.2 · Release 1.0.0,** with `check-release`'s rules for the numbers after it, as a change that breaks then
  moves the first number.

## Deferred

No order between them. Each becomes an item when its time comes.

- **A registry.** Delivery is by tarball. Weighed when that stops being enough.
- **A local link.** Installing a build each time may slow the daily work. A tarball installed in 1
  to 2 seconds on 2026-11-06, and it also catches packaging errors. Weighed when that slows it.
- **The scale of the whole system.** A preference for larger text belongs to the whole
  system. Tailwind's spacing in `rem` answers part of it.
- **Below the medium breakpoint in the screenshots.** They run at one width.
- **Below 800 px in the screenshots.** A screenshot draws only the viewport's 800 px and leaves the rest of a
  taller story white, so nothing below them is compared, as a block added to the sample page showed on 2026-11-09.
- **A top bar that stays in view.** When something needs it.
- **A note at a section's foot,** for what holds for the whole section. When a page needs it.
- **Right-to-left.** No piece has a rule for it, so chevrons do not flip. When an app needs it.
- **Layers in the gallery.** Foundations and blocks, beside `Components`, whose groups are shadcn's, as
  `docs/decisions/components.md` says. The name `gold`.
- **Sizes and names to settle.** The tooltip's width and the name of its text.
- **Drawings beyond Lucide.** When something needs its own SVG.
- **The browsers Moneta supports.** Nothing states them. Tailwind 4 sets a floor.
- **A module of composed components.** shadcn's blocks and `sidebar` are the start.
- **Application patterns.** A list page, a detail page, filters and a wizard, with no word of any app's domain,
  beside the module of composed components.
- **Help for an app's agent.** shadcn's MCP server works with any registry, and shadcn has skills and serves its
  docs in Markdown. Weighed with the registry.
- **Image vulnerability scan.** The system packages inside the images.
- **Update bot.** Left out for now, as `docs/decisions/tooling.md` says.
- **Storybook's accepted advisories.** They go when its docgen plugin moves to `glob` 14.0.2
  or later, as `pnpm-workspace.yaml` says.
- **Storybook's deprecated loader.** Every test run warns `DEP0205`, and it goes when Storybook
  moves. Vitest also warns of 11 `SIGTERM` listeners, with this many browser projects.
- **`make watch`.** Repeats the tests on each saved file. Weighed when running all of
  `make stories` to check one test slows the work, with the time measured.
- **`actionlint`.** Biome reads a workflow's YAML, but not GitHub's rules. It ran once by hand on 2026-11-06, with
  nothing found, and would be one more image to keep. Weighed if a workflow fails on something it finds.
- **Biome's `noTailwindArbitraryValue`.** It may replace the class scan in `test/pieces.test.ts`,
  which is a long regular expression of our own. It is a nursery rule today, and whether it finds the
  same classes was not tried. Weighed with the first own piece that has classes.
- **pnpm's update notice.** `updateNotifier` turns it off.
- **The lowest version of each peer in `package`.** It tests only the version in
  `devDependencies`, so the floor of a range is a promise. `react` 19.0.0 was tried once, on
  2026-11-05, with only the minimal `Button`. Weighed when there are more pieces.

Dropped: tokens for what is written by hand, the `body`'s margin and repeated hidden
titles, since Tailwind's utilities, preflight and `sr-only` dissolve them.

## Not yet checked

To be checked when each arrives: screen readers and real Windows High Contrast, the look
beyond rest states, this map of pieces, a real upstream release merged, and a peer out
of range.
