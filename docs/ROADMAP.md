# Roadmap

**Now:** 2.1, the first `shadcn add`.

**The order:** first in use, then refined. Moneta starts as shadcn untouched, delivered as a
package, so an app can use it from the start. The look and the reviewed pieces arrive afterwards,
version by version.

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

The checks, for every group: `lint`, `types`, `test`, `stories` and `package`, fastest
first. `make check` runs them in that order, all of them even if one fails, and ends
with one line per check saying whether it passed. Continuous integration has one box
per check, with the same name, in parallel, so `make <box>` repeats a red box.

Done: 1.1, the floor. 1.2, containers. 1.3, static checks. 1.4, stories and browsers. 1.5,
build and package. 1.6, the audit and the workflows' test. The release's part is 3.3.

## 2. The base, as shadcn delivers it

shadcn's pieces and theme, untouched, as a package, with no choice of look yet.

- **2.1 · The first `shadcn add`: 41 pieces,** untouched, in commits named
  `chore(shadcn): add <piece>` with the CLI's version and the style in the body. There are no tags,
  since a tag named after a piece does not find the files that came with it.
  `git log -1 --grep='^chore(shadcn):' -- <file>` finds a file's last import, which was tried on
  simple files.
  - Two commits. First `button`, with `components.json`, the dependencies and the peers it uses,
    replacing the minimal one. Then the other 40.
  - Of the 62 in the registry on 2026-11-06, 21 stay out. `sidebar`, `combobox` and `calendar` wait
    for their study, under Deferred. `carousel`, `chart`, `drawer`, `input-otp`, `message-scroller`,
    `questionnaire`, `resizable` and `sonner` bring packages of their own. `attachment`, `bubble`,
    `code-block`, `marker`, `message` and `trace` are for conversations and code, though the registry
    does not describe `marker`, so that one is a guess. `accordion` and `command` are not to be built.
    `direction` fails the build, with TS2883, and `form` brings no file.
  - Each piece is listed as raw or reviewed, with its known gaps. Only `button` gets a story here,
    and the test of a story per file comes to mean one per reviewed piece.
  - Imports through `package.json#imports`, with `#components/*`, `#hooks/*` and `#lib/*` and a
    custom condition, `moneta-source`, which must not be called `source`. Without `#lib/*`, `add`
    wrote no piece, though nothing here needs it yet. `cn` is the npm package of that name, as
    shadcn delivers it, so it brings no code of ours to test.
  - Tried on a copy in 1.5, using an alias in the minimal `Button`. These passed: the types
    under `nodenext`, the build, Node on `dist/`, the stories with `resolve.conditions` at the
    root of `vitest.config.ts`, and the gallery with it in `.storybook/main.ts`. An alias to a
    missing file was refused. A test in Node importing by alias failed even with that setting,
    not yet diagnosed.
  - Tried on a copy on 2026-11-06, with shadcn 4.23.0 and `aria-nova`. `init` still refuses a
    library. `add` accepts the `#` aliases and installs only `cn`, so `react-aria-components`,
    `lucide-react` and `class-variance-authority` enter by command. With 44 pieces, a tarball of
    33 KB passed the 4 tests of `package`.
  - Tried behind a real app's own files on 2026-11-06, with 13 raw pieces in place of its copies and
    its own tokens: no type errors, and 487 of its 511 tests pass. The other 24 come from 3 differences
    in `Sheet`, `Table` and `Dialog`. Its CSS grew from 87 to 155 KB, as Tailwind reads every piece,
    and its JavaScript from 1,120 to 1,147 KB.
  - `components.json` is written by hand, as `init` refuses a library, on React Aria, recorded in
    `docs/decisions/base.md`. The style is `aria-nova`, chosen by the owner on shadcn/create. Registry
    code has no version or date, so the CLI is pinned and the date recorded, and `docs/updating.md`
    gains a hand check for the CLI and the registry. Lint is turned off on `ui/`, with one read of its
    findings per file.
  - React Aria, with its `react-dom`, and Lucide are peers, since a second copy silently loses their
    shared state: links in one, `LucideProvider` in the other. Their floor is the version installed
    then, the only one tested, as widening a range later breaks nobody, and `react-dom` follows
    `react`. `cn` and `class-variance-authority` are dependencies at exact versions, since two copies
    of them cost size and break nothing, and an app then receives what `package` tested.
  - `exactOptionalPropertyTypes` goes, here and in the app of `package`, which keeps
    `skipLibCheck` off. Measured on 2026-11-06 with all 61 of shadcn's pieces: on, 29 errors in 18
    files and 13 in the dependencies' types. Off, none of those in `src/`, and 1 in the dependencies'
    types, not identified, which the pieces of this item do not reach.
  - To ask: where shadcn's MIT notice goes (recommended: its copyright line in `LICENSE`, which is
    always packed). To ask: `noUnusedLocals` off, as `alert-dialog` and `label` fail it untouched
    (recommended: yes, if Biome's rule covers own pieces). To ask: where the list of raw and reviewed
    pieces lives (recommended: `docs/pieces.md`).
- **2.3 · `theme.css`, shadcn's default, untouched,** as `@fgarend/moneta/theme.css`, with the
  `@source` that lets an app's Tailwind read the package. Tailwind becomes a peer, and the gallery
  draws the pieces with it. `button`'s screenshot is approved again, and the checks of every story
  start to see real styles. shadcn's default for a new app is 129 lines. `shadcn/tailwind.css` is
  copied in (CLI 4.23.0 has `shadcn eject` for it, not tried), since importing it brings 226 packages.
  An app needs `@import "tailwindcss"` first, or the build passes and no class arrives. To ask:
  whether the default's Geist comes along (recommended: decided here, since it needs a dependency).

## 3. First delivery

**Done when:** the package installs and works in a test consumer, with a version an app can pin.
What an app does with it happens in that app, and is not tracked here.

- **3.3 · The release's part of the pipeline,** just before its first use. `check-release`,
  `extract-release-notes`, `docs/releasing.md` and the changelog. Local tests pass, and the rest
  is declared untested until the owner's push. To ask: whether the first release goes by hand, with
  `gh release create` on the tarball of `make package`, and all of this waits until releases repeat
  (recommended: yes).
  - **A release is automatic.** A push to `main` whose last commit starts with
    `chore: release v` calls `release.yml` from `ci.yml`, in the same run, only if every
    box passed: `verify`, `build`, `publish`, `pages`. Only `publish` and `pages` write.
    `verify` refuses a version that differs from `package.json`, already has a tag, or
    has no changelog ready, and runs the audit. The tag is created by `publish`, so a
    failed check spends no version.
  - Only pull requests cancel an earlier run, so a newer push never cuts a release.
  - Untested until the push: how GitHub draws a skipped reusable workflow, the
    expression that cancels only pull requests, and a failure halfway through `publish`.
- **3.2 · Release 0.1.0,** by the owner, with how to install and use it, and which pieces are raw. To
  ask: whether the gallery is published with it (recommended: not yet, as it has only `button`).

Dropped: 3.1, `Sidebar`, `AppLayout` and providers, moved to Deferred for a study of its own.

## 4. Refinement

From here on, each change is a version, and an app updates when it wants. The look comes first, as
it reaches every piece at once, and pieces follow as something needs them. Each item goes through
the rule, with shadcn's name, and holds no word of any one app's domain. Where a reference
disagrees with this map, it is decided as the piece arrives. Stories that already state what must
hold come over with each family. No reviewed piece has a default text, so shadcn's written strings
become props.

**A piece is reviewed with:** its stories, its visual test and contrast in both modes, its
accessibility report, its section in the guidelines, and the changelog.

- **4.5 (was 2.2) · Our `theme.css`, light and dark,** in shadcn's format, as a default that whoever
  uses Moneta can replace, with the sample page open in both, and `docs/guidelines.md` as
  an output of it. Dark is designed, and reviewed by the owner, not guessed. The gallery
  shows both, and the contrast, forced colours and visual checks run in both. It starts
  from shadcn's list, and adds a name only when a page fails without it.
  The radius is shadcn's `small`, `--radius: 0.45rem`, chosen by the owner on shadcn/create, and
  the font is decided here (Geist was what the owner tried it with). The sample page is the real
  test of `aria-nova`. The tests for contrast, fonts and the package's theme arrive here. A `type-*`
  style loses to a base `text-sm`, so that class comes out as a recorded edit. To ask:
  - How a mode is chosen (recommended: shadcn's `.dark` class, set by whoever uses Moneta,
    with no switch or provider of ours).
  - The default control at 40 px, against `nova`'s 32 (recommended: yes).
  - How many own text styles (recommended: the fewest a visual test justifies).
  - shadcn's focus rule, widened, with no gold halo (recommended: yes, after testing
    menus and options, mouse focus, and focus returning from a dialog).
- **4.1 · Display.** Badge, deciding its finance colours on a dark surface, and its
  fixed height against text spacing. Card, Section, Table, weighing a `grid` role, Avatar
  with its group, Alert, Item, whose group has a list role with no list items, Separator,
  Stat and DescriptionList. Tables on phones are decided with the first table.
- **4.2 · Actions and forms.** Button's variants, PageHeader, Input, InputGroup, Textarea,
  Field, which does not link its description or error, Select, Checkbox, which draws a
  check when indeterminate, RadioGroup, Switch, Toggle, ToggleGroup, DateField, SearchField
  and ChoiceCard. Field decides the contrast of the control's border against the 3:1 of
  WCAG 1.4.11. ToggleGroup weighs a segmented control against a radio in line.
- **4.3 · Overlays.** Dialog, Sheet, Popover, DropdownMenu and Tooltip.
- **4.4 · The rest.** Tabs, whose inactive text fails contrast through opacity and whose
  fixed height fails text spacing. Progress, Empty, Skeleton, Spinner, Breadcrumb,
  Pagination, Collapsible, Calendar, IconTile, StatGroup and AllocationBar.

Not to build: Sparkline, BottomNav (recommended, to confirm when a page first needs a
bottom navigation), Accordion, Carousel, Command, Menubar, AI pieces and a TanStack table.

Not placed yet, weighed if something needs them: FilePicker, KpiStrip and TickerChip.

## 5. Money

The library's reason, and the hardest test of the look: exact values, a real minus,
stepped cents. It comes when something needs it, like any piece, so a need can bring it
before the families above.

- **5.1 · `formatMoney`, Amount and Delta.** Their stories check the exact text in the 3
  browsers, since coverage counts `formatMoney` in Node, where formatting may differ. To
  ask: money as a decimal string (recommended: yes). To ask: whether Amount colours gain and loss by default or by
  choice of who uses it (recommended: by choice).

## 6. 1.0

- **6.1 · A stable API,** with every piece reviewed, and the accessibility script's first run, by the owner, with
  a screen reader and real zoom.
- **6.2 · Release 1.0.0.**

## Deferred

No order between them. Each becomes an item when its time comes.

- **A registry.** Delivery is by tarball. Weighed when that stops being enough.
- **A local link.** Installing a build each time may slow the daily work. A tarball installed in 1
  to 2 seconds on 2026-11-06, and it also catches packaging errors. Weighed when that slows it.
- **The scale of the whole system.** A preference for larger text belongs to the whole
  system. Tailwind's spacing in `rem` answers part of it.
- **Below the medium breakpoint in the screenshots.** They run at one width.
- **Charts' colours and Chart.** shadcn has `chart-1` to `chart-5`, and their marks need
  3:1 against the surface, under WCAG 1.4.11. To ask, with the first chart: where
  `recharts` goes (recommended: an entry of its own).
- **A top bar that stays in view.** When something needs it.
- **Layers in the gallery.** Foundations, and groups beyond components. The name `gold`.
- **Sizes and names to settle.** The icon's numeric size, and the tooltip's width and
  the name of its text.
- **Drawings beyond Lucide.** When something needs its own SVG.
- **The browsers Moneta supports.** Nothing states them. Tailwind 4 sets a floor.
- **A module of composed components.** shadcn's blocks and `sidebar` are the start.
- **Image vulnerability scan.** The system packages inside the images.
- **Update bot.** Left out for now, as `docs/decisions/tooling.md` says.
- **Storybook's accepted advisories.** They go when its docgen plugin moves to `glob` 14.0.2
  or later, as `pnpm-workspace.yaml` says.
- **Storybook's deprecated loader.** Every test run warns `DEP0205`, and it goes when Storybook
  moves. Vitest also warns of 11 `SIGTERM` listeners, with this many browser projects.
- **`make watch`.** Repeats the tests on each saved file. Weighed when running all of
  `make stories` to check one test slows the work, with the time measured.
- **The look of Storybook's own interface.** The colours, fonts and mark around the stories.
  Weighed before the gallery is published, in 3.2.
- **Biome's `noTailwindArbitraryValue`.** It may replace the class scan in `test/pieces.test.ts`,
  which is a long regular expression of our own. It is a nursery rule today, and whether it finds the
  same classes was not tried. Weighed with the first own piece that has classes.
- **pnpm's update notice.** `updateNotifier` turns it off.
- **`sidebar`, `combobox` and `calendar`.** They stay out of the first delivery, to be studied with
  time: how each is defined, and where it lives. Until then, an app composes what it needs locally
  from the base pieces. `AppLayout` and the providers go with them. What is known so far:
  - shadcn's sidebar lacks `<nav>`, lists, `aria-current` and a skip link. Its trigger lacks
    `aria-expanded`, its count sits outside the link's name, and it writes a cookie it
    never reads. It loses the current page in forced colours.
  - Esc does not close its mobile sheet from a link with a `tooltip`, and the sheet stays
    open after navigating.
  - An empty navigation and a tooltip on a collapsed item are to be settled.
  - A check for reduced motion arrives with it, as shadcn's files have no `motion-reduce`.
  - `use-mobile` falls under the coverage of `stories`, so it needs a story, or an exclusion.
  - Its gradient and glow are to be asked (recommended: yes, by eye).
  - To ask: links through whichever router is used (recommended: `RouterProvider`, after trying
    `RouterConfig`, as `createLink` on a sidebar button reloaded the page on Enter).
- **The lowest version of each peer in `package`.** It tests only the version in
  `devDependencies`, so the floor of a range is a promise. `react` 19.0.0 was tried once, on
  2026-11-05, with only the minimal `Button`. Weighed when there are more pieces.

Dropped: tokens for what is written by hand, the `body`'s margin and repeated hidden
titles, since Tailwind's utilities, preflight and `sr-only` dissolve them.

## Not yet checked

To be checked when each arrives: screen readers and real Windows High Contrast, the look
beyond rest states, this map of pieces, a real upstream release merged, and a peer out
of range.
