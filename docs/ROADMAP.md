# Roadmap

**Now:** 4.5, our `theme.css`, light and dark.

**The goal:** Moneta is the source of truth for components. An app consumes final pieces and builds
its screens and regions from them, writing no class of its own. What it lacks is added here, not there.

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

The checks, for every group: `lint`, `types`, `test`, `stories` and `package`, fastest
first. `make check` runs them in that order, all of them even if one fails, and ends
with one line per check saying whether it passed. Continuous integration has one box
per check, with the same name, in parallel, so `make <box>` repeats a red box.

Done: 1.1, the floor. 1.2, containers. 1.3, static checks. 1.4, stories and browsers. 1.5,
build and package. 1.6, the audit and the workflows' test. The release's part is 3.3.

## 2. The base, as shadcn delivers it

shadcn's pieces and theme, untouched, as a package, with no choice of look yet.

Done: 2.1, the first `shadcn add`, 41 pieces, as `docs/decisions/base.md` and `docs/pieces.md` say.
2.3, shadcn's default theme, and the font apart, as the same file says.

## 3. First delivery

**Done when:** the package installs and works in a test consumer, with a version an app can pin.
What an app does with it happens in that app, and is not tracked here.

Done: 3.4, one import, with ready-made styles, as `docs/decisions/delivery.md` says.
3.5, a story for each of the 41 pieces, with what they measure in `docs/pieces.md`.
3.3, the release's part of the pipeline, as `docs/releasing.md` and `docs/decisions/delivery.md` say.
3.7, a rehearsal, `v0.0.1`, published on its second run, the first having stopped before spending the number.
3.6, what is written matches what exists, with the README's install, use and how far changing the look reaches.
3.2, release 0.1.0, published on 2026-11-06 with all 41 pieces raw.

Dropped: 3.1, `Sidebar`, `AppLayout` and providers, moved to 4.6, after a study of its own.

## 4. Final pieces

**Done when:** an app can build every screen from Moneta's pieces with no class of its own, and leaves
Tailwind for `styles.css`. Until then, it keeps Tailwind only for the classes it still writes.

**The measure:** the classes an app's screens write. On a real app on 2026-11-06, 1,683 uses in 47 of its
59 screen files: 606 of text, 548 of layout, 192 of space and size, 140 of colour and surface, and 197
others not sorted. Its own pieces beyond shadcn's also come here, as they hold no word of its domain.

From here on, each change is a version, and an app updates when it wants. The look comes first, as
it reaches every piece at once, and the order after it follows what is needed next. Each item goes
through the rule, with shadcn's name where it has one, and holds no word of any one app's domain. Where a reference
disagrees with this map, it is decided as the piece arrives. Stories that already state what must
hold come over with each family. No reviewed piece has a default text, so shadcn's written strings
become props.

**A piece is reviewed with:** its stories, its visual test and contrast in both modes, its
accessibility report, its section in the guidelines, the changelog, and its lint findings read again,
with what is a real fault fixed as a recorded edit.

- **4.5 (was 2.2) · Our `theme.css`, light and dark,** in shadcn's format, as a default that whoever
  uses Moneta can replace, with the sample page open in both, and `docs/guidelines.md` as
  an output of it. Dark is designed, and reviewed by the owner, not guessed. The gallery
  shows both, and the contrast, forced colours and visual checks run in both. It starts
  from shadcn's list, and adds a name only when a page fails without it.
  The radius is shadcn's `small`, `--radius: 0.45rem`, chosen by the owner on shadcn/create, and
  the font is Geist, in `--font`. On 2026-11-06, of shadcn's fonts, `DM
  Sans` and `Raleway` had no tabular figures, and the others did. The sample page is the real
  test of `aria-nova`. The tests for contrast, fonts and the package's theme arrive here. A `type-*`
  style reads as a recorded edit in the piece that uses it. Decided with the owner on 2026-11-06:
  - **The look:** in light, warm paper, white cards, a graphite sidebar and one gold accent. In dark, decided on
    2026-11-07 after a graphite draft looked like two unrelated darks, a warm near-black page, a darker sidebar and lighter
    cards. Gold stays the same in both. On 2026-11-07 the light text, dark button and sidebar were made warm too, so both
    modes are one family. The same day the owner found the warm colours too yellow, above all in light, and too far
    from the prototypes, so both modes are reviewed again against them before 4.5 closes.
  - **The font:** Geist stays.
  - **Control heights:** 36 px by default, 40 for a page's main actions, 32 for dense ones. By editing each piece's
    `cva`, as `--spacing` made a whole screen 14% taller on 2026-11-06.
  - **The mode:** shadcn's `.dark` class, set by whoever uses Moneta, with `color-scheme: dark` in it, and no switch or
    provider of ours. The README warns of a flash when the class comes late. The gallery switches it with
    `@storybook/addon-themes`, and axe, screenshots and forced colours run in both, since 2026-11-07.
  - **Focus:** shadcn's solid outline, widened, with no gold halo, as `docs/decisions/theme.md` says.
  - **Text and space:** a scale, in `docs/decisions/theme.md`, with five styles internal to the pieces.
  - **The order:** the sample page, the light theme with font and sizes, the dark theme, then the checks in both modes.
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
  - To ask: links through whichever router is used (recommended: `RouterProvider`, after trying
    `RouterConfig`, as `createLink` on a sidebar button reloaded the page on Enter).
- **4.7 · Layout and text,** which shadcn does not have and most of an app's classes do: what replaces
  `flex`, `gap-*` and `text-*`. Own code, the rule's third step, so a page shows the need first. To ask:
  which pieces and their names, and how far their props go (recommended: the fewest that remove the most
  classes, against a mini-language of layout to maintain).
- **4.1 · Display.** Badge, deciding its finance colours on a dark surface. Card, Section, Table, weighing
  a `grid` role, Avatar with its group, Alert, Item, whose group has a list role with no list items, Separator,
  Stat, DescriptionList, Kbd, AspectRatio and ScrollArea. Tables on phones are decided with the first table.
- **4.2 · Actions and forms.** Button's variants, ButtonGroup, PageHeader, Input, InputGroup, Textarea, Label,
  NativeSelect, Slider,
  Field, which does not link its description or error, Select, Checkbox, which draws a
  check when indeterminate, RadioGroup, Switch, Toggle, ToggleGroup, DateField, SearchField,
  FilePicker, ChoiceCard, and `combobox` after a study like 4.6's. Field decides the contrast of the control's border against the 3:1 of
  WCAG 1.4.11. ToggleGroup weighs a segmented control against a radio in line.
- **4.3 · Overlays.** Dialog, AlertDialog, Sheet, Popover, HoverCard, DropdownMenu, ContextMenu and Tooltip. Text
  spacing and forced colours reach what an overlay draws when open, in these and in Select, as today they
  see only the closed trigger. Forced colours' `:popover-open` finds nothing, as React Aria does not use the
  `popover` attribute.
- **4.4 · The rest.** Tabs. Progress, Empty, Skeleton, Spinner, Breadcrumb,
  Pagination, Collapsible, IconTile, StatGroup, as the sample page's summary strip draws it, and AllocationBar, and `calendar` after a study like
  4.6's.
- **4.8 · Charts.** Chart, with shadcn's `chart-1` to `chart-5`, whose marks need 3:1 against the surface,
  under WCAG 1.4.11. To ask: where `recharts` goes (recommended: an entry of its own).

Not to build: Sparkline, BottomNav (recommended, to confirm when a page first needs a
bottom navigation), Accordion, Carousel, Command, Menubar, AI pieces and a TanStack table.

Not placed yet, weighed if something needs them: KpiStrip and TickerChip. The registry's other pieces
that stayed out, in `docs/decisions/base.md`, enter the same way.

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
- **6.3 · The stricter checks back,** since by then every piece has been read. `noUnusedLocals` returns,
  and `alert-dialog` and `label` lose what they leave unused, in their reviews or here. To weigh again:
  `exactOptionalPropertyTypes`, if React Aria's types pass it, and lint on `ui/`, against how much it
  costs each update. Formatting stays off there, as it would rewrite every file shadcn sends.
- **6.2 · Release 1.0.0.**

## Deferred

No order between them. Each becomes an item when its time comes.

- **A registry.** Delivery is by tarball. Weighed when that stops being enough.
- **A local link.** Installing a build each time may slow the daily work. A tarball installed in 1
  to 2 seconds on 2026-11-06, and it also catches packaging errors. Weighed when that slows it.
- **The scale of the whole system.** A preference for larger text belongs to the whole
  system. Tailwind's spacing in `rem` answers part of it.
- **Below the medium breakpoint in the screenshots.** They run at one width.
- **A top bar that stays in view.** When something needs it.
- **Right-to-left.** No piece in `ui/` has a rule for it, so chevrons do not flip. When an app needs it.
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
- **The look of Storybook's own interface.** The colours, fonts and mark around the stories. The gallery
  goes out with Storybook's default, and this is weighed again with the theme, in 4.5.
- **The screenshots' tolerance.** Vitest's default let `--primary` move from `#2b2e33` to `#5a2b33` unseen on 2026-11-06,
  while a stronger change fails. Contrast has its own test, but a small change of colour has none. Weighed if it bites.
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
