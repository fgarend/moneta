# Roadmap

Moneta is the source of truth for components: an app builds its screens from its pieces, writing no class of its
own. What it lacks is added here, in this order, which a new need can change. The details of each item, what is
known and what is still to ask, are in [`roadmap-notes.md`](roadmap-notes.md), read when the item starts.

**Now:** 1. Money values.

## Next, in order

1. **Money values.** Amounts shown exactly, in each currency's own decimals.
   - `formatMoney`, `formatPercent` and `formatQuantity`
   - Amount and Delta
2. **Table.** The table reviewed, for lists of amounts.
   - a column of numbers, totals and groups with subtotals
   - selection, an action per row, and child rows
   - tables on phones
3. **Dates.** Showing a date, with `formatDate` beside `formatMoney`.
4. **DateField.** Entering a date.
5. **Motion, layers and icons.** What crosses every piece and no item holds.
   - durations and easing, with reduced motion
   - the order of layers
   - the icons' sizes
6. **Sidebar, AppLayout and providers.** The app's shell, starting with a study.
   - Sidebar, with navigation, a skip link and the current page
   - AppLayout
   - providers, with the language React Aria speaks
7. **Colours of meaning.** Success, warning, information, gain and loss, in light and dark.
   - their names, and `variant` or `tone`
   - the palette of categories and of the charts
8. **One scale of sizes.** 32, 36 and 40 px on every piece, with one set of names.
9. **Layout and text.** What replaces the `flex`, `gap` and `text` classes an app writes.
10. **Display.** The pieces that show, reviewed or made.
    - Badge, Card, Avatar and AvatarGroup, Alert, Item and Separator
    - Stat, DescriptionList, Kbd, AspectRatio, ScrollArea, Timeline and TickerChip
11. **Actions and forms.** The pieces that act and take input, reviewed or made.
    - Button, ButtonGroup and PageHeader
    - Input, InputGroup, Textarea, Label, Field, NativeSelect, Select and SearchField
    - Checkbox, RadioGroup, Switch, Toggle, ToggleGroup and Slider
    - NumberField, DatePicker, DateRangePicker and TimeField
    - FilePicker, ChoiceCard, a choice of many with chips, InputOTP, CopyButton, Toolbar, a period switcher and
      ColorSwatchPicker
    - how a form connects, with a server's errors
    - `combobox`, after a study
    - Button's `link` variant beside Link, and a disabled `LinkButton`, which is not dimmed
12. **Overlays.** The pieces that open over the page, reviewed or made.
    - Dialog, AlertDialog and Sheet
    - Popover, HoverCard, DropdownMenu, ContextMenu, Tooltip and Toggletip
    - text spacing and forced colours on what an overlay draws when open
13. **The rest.** The other pieces, reviewed or made.
    - Tabs, Progress, Meter, Empty, Skeleton and Spinner
    - Breadcrumb, Pagination, Steps and Banner
    - Collapsible, IconTile, StatGroup and AllocationBar
    - a bar of actions at the page's foot, a virtualised list, and Toast
    - `calendar`, after a study
14. **Charts.** Line, area, bars and donut, a ring and BarList, each with a table of its data.
15. **MoneyInput.** Entering an amount.
16. **CurrencySelect.** Choosing a currency.
17. **Hidden values.** A mode in which every amount shows "••••••".
18. **A stable API.** What each state promises after 1.0.
    - every piece reviewed
    - the accessibility script run by hand, with a screen reader and real zoom
    - a policy for deprecating
19. **Stricter checks.** `exactOptionalPropertyTypes`, if React Aria's types pass it.
20. **Release 1.0.0.**

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

## Done

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

Screen readers and real Windows High Contrast, the look beyond rest states, this map of pieces, and a peer out of
range.
