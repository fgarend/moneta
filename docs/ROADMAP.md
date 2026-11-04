# Roadmap

**Now:** 1.3, the pipeline's third group: static checks.

What needs to be created, in order. The order follows what is needed next, so a new
need can change it. Open questions are asked when their step arrives, and each shows
what is recommended today, to be argued again at that moment.

## How items are numbered

- An item's ID is `milestone.item`. It is fixed, not a position: the order is the
  position in the list. A new item takes the next free number in its milestone.
- A finished item moves to its milestone's `Done:` line. A dropped item moves to its
  `Dropped:` line, with the reason, so it is not raised again.

## 1. Pipeline

Each group as in `docs/decisions/process.md`. `make check` runs only what exists, and
grows with each group.

The checks, for every group: `lint`, `types`, `test`, `stories` and `package`, fastest
first. `make check` runs them in that order, all of them even if one fails, and ends
with one line per check saying whether it passed. Continuous integration has one box
per check, with the same name, in parallel, so `make <box>` repeats a red box.

Done: 1.1, the floor. 1.2, containers.

- **1.3 · Static checks.** Biome and `tsconfig*`, formatting what exists, with a minimal
  `Button` as the first source file. `isolatedDeclarations` is off, as `cva` depends on
  inference. A planted type error and a planted lint error are refused. To ask: whether
  a `ci.yml` with only the checks arrives here, rather than in 1.6 (recommended: yes). To
  ask: whether `make lint` goes through a `package.json` script of the same name, or calls
  the tool itself, one layer fewer but with long commands in the `Makefile`; pnpm's own
  commands are already called directly. To ask: where the loop of `make check`'s summary
  lives, which runs on the machine, so not in Node. To ask: a `make add PACKAGE=…`, so
  `docs/updating.md` no longer sends anyone around the `Makefile` (recommended: yes). Time
  one `make lint` once dependencies are real: each run copies the image's `node_modules`
  into a temporary volume, and a read-only mount of the image's folder may avoid that.
- **1.4 · Stories and browsers.** `.storybook/`, `vitest.config.ts`, a story for `Button`,
  `update-screenshots`, `docs/accessibility.md`, which joins `Read first`, and
  `docs/accessibility-script.md`. Tests for the accessibility table and the workspace.
  Checks for forced colours, text spacing, a class scan on own pieces, and a story per
  file in `ui/`, with one place for the stories' list. A broken story and an axe failure,
  planted, are refused in 3 browsers, and each check fails on a planted story.
  - `test` runs the logic and the repository's checks, in Node. `stories` runs everything
    in a browser. Nothing runs twice.
  - Each measures its own coverage, at 100% on own pieces only: `test` the logic in
    `src/lib/` and the package's entry, `stories` everything else but `ui/`, so a new
    folder cannot go unmeasured. A check of the repository holds these rules, and each
    keeps its own report.
  - Planted, each fails one check only: a logic bug, a broken component, a line with no
    test in each area, a file nobody imports in each area, and a new folder. Tried on
    another codebase, not yet on this one. shadcn's `cn` needs a test of its own, and the
    entry must import in Node.
  - Coverage says a line ran, not that anything looked at it. A story checks what it
    shows in `play`. Own code stays out of `ui/`, which coverage does not see.
- **1.5 · Build and package.** `build-package`, `check-package`, and the tests of the
  build and the package. The layout shadcn's aliases expect: `src/components/ui/`,
  `src/components/`, `src/lib/`, `src/hooks/` and `src/styles/`. Imports through
  `package.json#imports` with a custom condition, which must not be called `source`. The
  package installs in a test consumer, and a broken export is refused. `package` keeps
  the tarball it tested, which is the file a release publishes. To ask: `dist/` out of
  git, since delivery is by tarball (recommended: yes).
- **1.6 · CI and release.** `ci.yml`, `audit.yml`, `check-release`, `extract-release-notes`,
  the workflows' test, `docs/releasing.md` and the changelog. Local tests pass, and the
  rest is declared untested until the owner's push. **`check-pins`, 912 lines, is
  questioned here:** it works as it is, and could be dropped (recommended: drop it, and
  check the pins by hand at the start of each item). To ask: whether the release part waits until just
  before 3.2, when it is first used (recommended: yes).
  - **A release is automatic.** A push to `main` whose last commit starts with
    `chore: release v` calls `release.yml` from `ci.yml`, in the same run, only if every
    box passed: `verify`, `build`, `publish`, `pages`. Only `publish` and `pages` write.
    `verify` refuses a version that differs from `package.json`, already has a tag, or
    has no changelog ready, and runs the audit. The tag is created by `publish`, so a
    failed check spends no version.
  - Only pull requests cancel an earlier run, so a newer push never cuts a release.
  - **`audit.yml` stays.** GitHub's documentation says its dependency graph does not read
    a lockfile written as two YAML documents, pnpm 12's default with a pinned version, so
    Dependabot alerts may not come. What `docs/decisions/delivery.md` says of them gets
    that caveat.
  - Untested until the push: how GitHub draws a skipped reusable workflow, the
    expression that cancels only pull requests, and a failure halfway through `publish`.

## 2. Base and theme

- **2.1 · The first `shadcn add`: `button` and `sidebar`,** with what they bring, untouched
  and tagged. shadcn's `Button` replaces the minimal one, and each file gets its story.
  `components.json` is written by hand, as `init` refuses a library, on React Aria,
  recorded in `docs/decisions/base.md`, with shadcn's MIT notice. React Aria, Lucide and
  Tailwind are peers. Lint is turned off on `ui/`, with one read of its findings per
  file. Registry code has no version or date, so the CLI is pinned and the date recorded,
  and `docs/updating.md` gains a hand check for the CLI and the registry. To ask: which
  style (recommended: `nova`, compared on a sample page in a story). To ask:
  `exactOptionalPropertyTypes` kept on, with the edits and `skipLibCheck` it needs
  (recommended: yes).
- **2.2 · `theme.css`, light and dark,** in shadcn's format, as a default that whoever
  uses Moneta can replace, with the sample page open in both, and `docs/guidelines.md` as
  an output of it. Dark is designed, and reviewed by the owner, not guessed. The gallery
  shows both, and the contrast, forced colours and visual checks run in both. It starts
  from shadcn's list, and adds a name only when a page fails without it.
  `shadcn/tailwind.css` is copied in, since importing it brings 226 packages. The tests
  for contrast, fonts and the package's theme arrive here. A `type-*` style loses to a
  base `text-sm`, so that class comes out as a recorded edit. To ask:
  - How a mode is chosen (recommended: shadcn's `.dark` class, set by whoever uses Moneta,
    with no switch or provider of ours).
  - The default control at 40 px, against `nova`'s 32 (recommended: yes).
  - How many own text styles (recommended: the fewest a visual test justifies).
  - The sidebar's gradient and glow (recommended: yes, by eye).
  - shadcn's focus rule, widened, with no gold halo (recommended: yes, after testing
    menus and options, mouse focus, and focus returning from a dialog).

## 3. Application structure

**Done when:** axe has run on it, keyboard, Esc and the sheet are checked, visual tests
are approved by the owner in both modes, and the package installs and works in a test consumer.

- **3.1 · `Sidebar`, `AppLayout` and providers,** with their stories.
  - shadcn's sidebar lacks `<nav>`, lists, `aria-current` and a skip link. Its trigger lacks
    `aria-expanded`, its count sits outside the link's name, and it writes a cookie it
    never reads. It loses the current page in forced colours.
  - Esc does not close its mobile sheet from a link with a `tooltip`, and the sheet stays
    open after navigating.
  - An empty navigation and a tooltip on a collapsed item are settled here.
  - A check for reduced motion arrives, as shadcn's files have no `motion-reduce`.
  - React Aria stays a peer, as a duplicate silently breaks links. To ask: links through
    whichever router is used (recommended: `RouterProvider`, after trying `RouterConfig`,
    as `createLink` on a sidebar button reloaded the page on Enter).
- **3.2 · Release 0.1.0,** by the owner, with the gallery and how to install and use it.
  An app needs `@import "tailwindcss"` first, or the build passes and no class arrives.

## 4. Pieces

Each family is one item, through the rule, with shadcn's name. A piece is added when
something needs it, and holds no word of any one app's domain. Where a reference
disagrees with this map, it is decided as the piece arrives. Stories that already state
what must hold come over with each family. No piece has a default text, so shadcn's
written strings become props.

**A family is done with:** its stories, its visual test and contrast in both modes, its
accessibility report, its section in the guidelines, and the changelog.

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

- **6.1 · A stable API,** with the accessibility script's first run, by the owner, with
  a screen reader and real zoom.
- **6.2 · Release 1.0.0.**

## Deferred

No order between them. Each becomes an item when its time comes.

- **A registry.** Delivery is by tarball. Weighed when that stops being enough.
- **A local link.** Installing a build each time may slow the daily work. Weighed when
  it does.
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
- **Storybook's accepted advisories.** Check whether they still apply when carried.
- **Storybook's deprecated loader.** It goes when Storybook moves.
- **pnpm's update notice.** `updateNotifier` turns it off.

Dropped: tokens for what is written by hand, the `body`'s margin and repeated hidden
titles, since Tailwind's utilities, preflight and `sr-only` dissolve them.

## Not yet checked

To be checked when each arrives: screen readers and real Windows High Contrast, the look
beyond rest states, this map of pieces, a real upstream release merged, and a peer out
of range.
