# Roadmap

Moneta is the source of truth for components: an app builds its screens from its pieces, writing no class of its
own. What it lacks is added here, in this order, which a new need can change. The details of each item, what is
known and what is still to ask, are in [`roadmap-notes.md`](roadmap-notes.md), read when the item starts.

**Now:** 1. Layers.

## Next, in order

1. **Layers.** The order of what sits above what, as shadcn writes `z-50` on every overlay.
   - today's order as a rule, held by a test, with no layer tokens
2. **Icons.** Their sizes, which may join One scale of sizes.
3. **Sidebar, AppLayout and providers.** The app's shell, starting with a study.
   - Sidebar, with navigation, a skip link and the current page
   - AppLayout
   - providers, with the language React Aria speaks
4. **Colours of meaning.** Success, warning and information, in light and dark, beside gain and loss.
   - their names, and `variant` or `tone`
   - the palette of categories and of the charts
5. **One scale of sizes.** 32, 36 and 40 px on every piece, with one set of names.
6. **Layout and text.** What replaces the `flex`, `gap` and `text` classes an app writes.
7. **Display.** The pieces that show, reviewed or made.
    - Badge, Card, Avatar and AvatarGroup, Alert and Separator
    - Stat, DescriptionList, Kbd, AspectRatio, ScrollArea, Timeline and TickerChip
8. **Actions and forms.** The pieces that act and take input, reviewed or made.
    - Button, ButtonGroup and PageHeader
    - Input, InputGroup, Textarea, Label, Field, NativeSelect, Select and SearchField
    - Checkbox, RadioGroup, Switch, Toggle, ToggleGroup and Slider
    - NumberField, DatePicker, DateRangePicker and TimeField
    - FilePicker, ChoiceCard, a choice of many with chips, InputOTP, CopyButton, Toolbar, a period switcher and
      ColorSwatchPicker
    - CopyButton in Table's selection bar, copying the rows selected as Table's own copy builds them
    - how a form connects, with a server's errors
    - `combobox`, after a study
    - Button's `link` variant beside Link, and a disabled `LinkButton`, which is not dimmed
9. **Overlays.** The pieces that open over the page, reviewed or made.
    - Dialog, AlertDialog and Sheet
    - Popover, HoverCard, DropdownMenu, ContextMenu, Tooltip and Toggletip
    - text spacing and forced colours on what an overlay draws when open
10. **The rest.** The other pieces, reviewed or made.
    - Tabs, Progress, Meter, Empty, Skeleton and Spinner
    - Breadcrumb, Steps and Banner
    - Collapsible, IconTile, StatGroup and AllocationBar
    - a bar of actions at the page's foot, a virtualised list, and Toast
    - `calendar`, after a study
11. **Charts.** Line, area, bars and donut, a ring and BarList, each with a table of its data.
12. **MoneyInput.** Entering an amount.
13. **CurrencySelect.** Choosing a currency.
14. **A stable API.** What each state promises after 1.0.
    - every piece reviewed
    - the accessibility script run by hand, with a screen reader and real zoom
    - a policy for deprecating
15. **Stricter checks.** `exactOptionalPropertyTypes`, if React Aria's types pass it.
16. **Release 1.0.0.**

## Later, in no order

Each becomes an item when its time comes.

- **A registry.** When a tarball stops being enough.
- **A local link.** When installing a build each time slows the work.
- **The scale of the whole system.** A preference for larger text, for every piece at once.
- **Screenshots below the medium breakpoint, and below 800 px.**
- **A top bar that stays in view.** When something needs it.
- **A note at a section's foot.** When a page needs it.
- **Right-to-left.** When an app needs it.
- **Layers in the gallery.** Foundations and blocks, beside `Components`.
- **The tooltip's width, and the name of its text.**
- **Drawings beyond Lucide.** When something needs its own SVG.
- **The browsers Moneta supports.**
- **A module of composed components, and application patterns.**
- **Help for an app's agent.** Weighed with the registry.
- **An image vulnerability scan.**
- **An update bot.**
- **Storybook's accepted advisories and deprecated loader.** When Storybook moves.
- **`make watch`.** When running every story to check one slows the work.
- **`actionlint`.** If a workflow fails on something it finds.
- **Biome's `noTailwindArbitraryValue`.** In place of our own scan of classes.
- **The gallery's own types.** TypeScript skips most of `.storybook/`, found on 2026-11-09.
- **The lowest version of each peer in `package`.** When there are more pieces.
- **More for a value, when a screen asks.** A unit, a value shown while hidden, a tone kept, a spoken text.
- **A table's virtualisation, resized columns and rows dragged.** When a screen needs them.
- **Announcing a table's sort.** If `aria-sort` alone proves too little.
- **The pages a pagination draws, worked out.** If a second app needs it.
- **The sample page's text in the dark stories.** Light's colour, where its dark screenshot is right.
- **Skeleton's and Progress's less motion, asked of each browser.** As the overlays' is, in place of reading the
  style sheets.
- **An overlay stuck entering or leaving in WebKit.** React Aria waits on a transition the browser cancels, as
  `duration-100` makes every property transition; found headless on 2026-11-11, and whether Safari does it is unknown.

## Done

- **Motion.** shadcn's durations as a rule, and with less motion nothing on the pieces moves or changes size,
  the Spinner aside, tested in each browser. 0.13.0.
- **DateField.** Entering a day, from and to an ISO string, with the app's label, description and error, in 36
  or 32 px. 0.12.0.
- **Dates.** `DateTime` and `useFormatDate`, from an ISO day or moment, in four formats, with today and yesterday
  as words. 0.11.0.
- **Lists of rows.** Item reviewed as a list of rows: groups with a title and a total, a row as a link or with an
  action, an icon tile, a value at the end, empty, loading and density. 0.10.0.
- **Table.** A native table to compare amounts by column: groups and a total, selection, sorting, child rows,
  actions, a header in view, density, loading, empty, copying, and Pagination reviewed. 0.9.0.
- **Money values.** Amount, Percent and Quantity, exact, with a sign, a tone and a hidden mode. 0.8.0.
- **Link.** A link in text or in a cell, underlined, or quiet where it stands alone. 0.7.0.
- **The close button's name.** Dialog and Sheet take it from the app, by `closeLabel`. 0.6.0.
- **Every piece under one rule.** One folder, the same checks for shadcn's pieces and ours, and shadcn's updates
  merged three ways. 0.5.0.
- **Section, and the conventions across pieces.** Levels, `render`, a title's level, and no router chosen. 0.4.0.
- **What a review of the repository found.** Facts out of date, `Slider`'s focus, and the sample page. 0.3.0.
- **Moneta's look.** Its colours in light and dark, controls of 36 px, a visible focus, and the guidelines. 0.2.0.
- **First delivery.** One import, a story per piece, and releases from the changelog. 0.1.0.
- **The base.** shadcn's 41 pieces and theme, as a package.
- **The pipeline.** Containers, static checks, stories in three browsers, the build and the package's test.

## Not yet checked

A table's copy pasted into Excel in Portuguese and Google Sheets, a table's or a list's row clicked with Ctrl, Cmd or
the middle button, and its current row heard. Screen readers and real Windows High Contrast, the look beyond rest
states, this map of pieces, and a peer out of range.
