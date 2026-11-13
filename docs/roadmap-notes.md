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
done in 0.9.0, Lists of rows, done in 0.10.0, Dates, done in 0.11.0, and DateField, done in 0.12.0. Each is a step of
its own, with what its family's item says of it. **What it costs:** a piece made before Colours of meaning and One
scale of sizes may need a touch when they arrive, and Sidebar's study may change the space around Section. To ask
later: a page that puts the pieces together, a pre-release tried in an app before a version, and a review of the whole
after each family.

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

Each piece, at its step, follows the gallery's guide, as `docs/decisions/components.md` says: its page by `autodocs`,
its and its props' comments as JSDoc, its stories exported where written in the order they teach, a story that only
checks by `!autodocs`, and its data from `.storybook/data.ts`, added rather than changed.

- Stat and StatGroup next, StatGroup moved here from The rest, its icon an IconTile written in Stat, a solid circle
  of 48 px left of its label and value by default, as the prototype's overview, gold for the headline, analysed on 2026-11-12 and 2026-11-13, one point at a
  time, before the vocabulary of variants and the guide came first. Decided:
  - StatGroup is a `dl`, each Stat a `div` in it, its label a `dt`, its value a `dd`, as Chakra's: read together,
    the count announced, no ARIA, and no landmark to jump between numbers, as the group's section title is one.
  - Its parts: `StatGroup`, `Stat`, `StatLabel`, `StatValue` and `StatDescription`, the note under the number, a
    `dd`, the word Card, Section and Item use for the muted text under the main one.
  - `StatValue` carries `type-amount-lg`, 24/32 at 600 with tabular figures, so plain text, a " + " between amounts
    or a count match; the formatting stays with `Amount`, `Percent` and `Quantity`, given `size="lg"`, which a story
    checks. To weigh again by the rule that came with IconTile: `StatValue` giving them their size.
  - A change goes in `StatDescription`, a value with `sign="always"` and its tone beside the app's words, as
    `money.md` refused a Delta piece; a badge comes by composition.
  - Its boxes by the vocabulary: `spacing={0}`, its default, one box with lines between, as the sample page's totals;
    more, a box each; `variant="muted"` for soft boxes; `variant="ghost"` for none. Each drawn before it is built.
  - `StatAction`, a quiet icon button beside the label, as `ItemAction`: 32 px to touch, taking no more height than
    the label's line, its name the app's one word joined to the label, as "Open Invested", and an error with no
    label, as an app opens what a number is made of from it.
  - Loading as `ItemGroup` and `Table`: `isLoading` and `loadingLabel` on `StatGroup`; the first time, the labels
    stay and a shape takes each value's place; on a reload, the values stay; either way the group is busy and the
    app's words are heard. No value is `Amount`'s dash, with the app's words, so nothing new.
  - The model of the guide: its page by `autodocs`, JSDoc on its parts and props, examples in the order they teach,
    checks off the page, and the household's totals from `.storybook/data.ts`.
  - WCAG: 1.3.1, the list read as terms and values, by a story; 1.4.1, a change said by its sign and the app's words;
    1.4.3, the muted label on the card; 1.4.10, the boxes wrapping at 320 px, by the reflow check; 2.5.8, the action's
    32 px; 4.1.2, the action's name; 4.1.3, the load heard, by a story.
  - The sample page's totals then use it, and its `CardAction className="flex gap-1"` goes, now redundant.
  - A new piece, so a version of its own.
- Badge, deciding its finance colours on a dark surface, with tones for success, warning, danger and information, a
  dot, and a count beside a section's title. With it, whether `--negative` gets a red of its own, close to
  `--destructive` and told apart from it in both themes, as an app asked on 2026-11-13: a position down 3% wears a
  failed import's red on the same screen. `theme.md` chose one red, so the theme keeps one; asked again. With them, whether
  `--positive` stays green or turns blue, raised on 2026-11-13, as one decision for values, changes, charts and
  badges; an IconTile takes no meaning's colour, decided the same day.
- Card, whose title is a `div`, to take a heading's level as `docs/decisions/components.md` says, deciding where
  code shared by pieces lives, and whether an app gets a `Heading` that reads the level. Two second forms an app
  builds by classes today: a card with no padding, its content to the edges, for a table or a group of numbers; and
  a title at a section's size, for a card that is a part of the page.
- Section came early, before Sidebar, and Table comes there too.
- Avatar with its group, AvatarGroup, whose fallback's text an app measured at 4.34:1. Drawn as a `span`, keeping its
  `flex`, as an app asked on 2026-11-13: it sits beside a name inside a `p` or a `span`, as an `ItemDescription`, where
  a `div` is not allowed and React warns.
- Alert. Item moved to Lists of rows. Separator, Stat, DescriptionList, Kbd, AspectRatio, ScrollArea,
  Timeline and TickerChip.
- ScrollArea takes no focus, so a keyboard cannot scroll it when what it holds overflows, as axe says at 1280 px and
  the reflow check at 320 px; both let its story off, `gap-reflow` since 2026-11-13. Its review gives it focus and a
  name only when it overflows, as `Table` measures its area, and drops both tags.

## The local checks' time

A step of the pipeline, before Stat, as the owner asked on 2026-11-13, when `make check` had grown slow
on the machine. Measured that day, each check alone, each with 8 to 12 s to start its container: lint 29 s, types
34 s, test 49 s, of which Vitest itself 7 s, stories 2 min 8 s in Chromium, 3 min 7 s in Firefox and 2 min 31 s in
WebKit, package 1 min 22 s, and storybook-build 34 s. About 11 min, nearly 8 of them in the stories, which go through
every story 29 times, 12 in Chromium, 10 in Firefox and 7 in WebKit, one browser after another, where continuous
integration runs the three together. The stories' times are high, as another `make stories` ran at the same moment:
both failed, as a browser closed, a click waited 12 s and the coverage's temporary file went missing. One run used
9.9 of the 11.7 GB Docker had.

To ask, one at a time, each measured:

- **Which checks at which moment:** while making a piece, before a commit, before a pull request. Recommended today:
  lint, types and test before each commit, with Chromium's stories when the look changes, and everything before the
  pull request.
- **One piece's stories alone,** in Chromium with no coverage, as the 100% threshold fails on a part. The storybook
  projects' tests come from the story files, and the other projects' from one file per check, which names each test
  by its story's id, so one filter may not reach both. `make watch`, repeating the tests on each saved file, moved
  here from Later, is weighed with it.
- **Firefox's and WebKit's stories left to continuous integration before a pull request,** which runs them together
  and is main's rule anyway. **What it costs:** a failure in one browser alone, as WebKit's on v0.2.0, shows a round
  later, and `CLAUDE.md`'s rhythm, where `make check` passes before the pull request opens, changes.
- **Memory:** fewer projects at once in Vitest, or more memory for Docker, which is the machine's setting, not the
  repository's. Two runs at once fail, and the Firefox page that crashed out of memory, in Later, may share the cause.

## Actions and forms

- Button's variants, ButtonGroup, PageHeader, as an app's own draws it, its context, title and actions each in a row
  that wraps, Input, InputGroup, whose addon, such as a currency's symbol, a screen
  reader does not read as part of the field's name, Textarea, Label, NativeSelect and Slider.
- Field, which does not link its description or error, and decides the contrast of the control's border against
  the 3:1 of WCAG 1.4.11.
- Select, and when to use it or NativeSelect.
- Checkbox, which draws a check when indeterminate, and RadioGroup, in a row as well, their items growing for their
  label, which today they do not. A visible label that is also their name and what a click takes, written in the
  guidelines, as a `FieldLabel` around the box and its words: an app asked on 2026-11-13, as it names each by
  `aria-label` and hides the words beside it, so a click on them checks nothing. Switch, Toggle, and ToggleGroup, weighing a segmented control, SegmentedControl,
  against a radio in line.
- DateField came early, before Sidebar. SearchField, FilePicker, ChoiceCard, and `combobox` after a study like
  Sidebar's.
- NumberField, DatePicker, DateRangePicker with presets such as the last 30 days, TimeField, a choice of many with
  removable chips, on React Aria's `TagGroup`, InputOTP, as `input-otp`, which brings a package of its own,
  CopyButton, which says it copied in a status message, and copies an amount through the way Money values takes,
  and in `TableSelectionBar` copies the rows selected, as Table's copy of a selection across cells builds them,
  text and HTML, left there on 2026-11-11 so the bar's button comes with CopyButton's status rather than before it;
  rows selected on other pages are not on the screen to copy, which its words must say,
  Toolbar, a bar of actions on what is selected, a period switcher, previous and next around a label such as a
  month, and React Aria's `ColorSwatchPicker`.
- Button's `link` variant, a button drawn as a link, and `LinkButton`'s, nearly a `Link` but 36 px tall and
  padded, now that `Link` exists: whether each stays, changes or goes. `LinkButton`'s `disabled:` classes do not match
  a disabled link, which React Aria draws as a `span`, so it is not dimmed; Pagination dims its own links since
  2026-11-11.
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
- Collapsible and AllocationBar. StatGroup and IconTile moved to Display. `calendar` after a study like Sidebar's.
- Link came early, before Sidebar.
- Steps, Banner, and Meter, which says how much of a limit is used, unlike Progress, with a target's mark.
- A bar of actions fixed at the foot of the page, a list virtualised for thousands of rows, on React Aria's
  `Virtualizer`, and Toast. To ask for Toast: React Aria's is still `UNSTABLE_`, and shadcn's was announced for
  Base UI; and its layer, above a dialog's `z-50`, and below or above what floats at `100000`, as Layers left it.

## Charts

Line, area, bars and donut, with a tooltip and a crosshair, and a reference line such as an average, a ring for one
value, and BarList, a ranking in bars, with `--category-1` to `--category-8`, whose marks need 3:1 against the
surface, under WCAG 1.4.11, and a table of the data beside each.

- To ask: where `recharts` goes (recommended: an entry of its own).
- To ask: a chart of one series, which the prototype draws in graphite rather than the first category; and past five
  or six series, the rest grouped into one, as Atlassian advises, drawn in a neutral.

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
- **The update command in `updating.md`.** On 2026-11-13, `pnpm add -D lucide-react` with no version said the
  lockfile was up to date and kept 1.69.0, though 1.70.0 was past the release age; `lucide-react@1.70.0` moved it.
  Whether the command should name the version, or `pnpm update --latest` serves.
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
