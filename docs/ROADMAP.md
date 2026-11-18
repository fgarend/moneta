# Roadmap

Moneta is the source of truth for components: an app builds its screens from its pieces, writing no class of its
own. What it lacks is added here, in this order, which a new need can change. The details of each item, what is
known and what is still to ask, are in [`roadmap-notes.md`](roadmap-notes.md), read when the item starts.

**Now:** 1. Actions and forms, its step on Button, LinkButton and ButtonGroup, then 2. Hidden values by kind and 3. A
TickerChip that opens a panel, before the family goes on.

## Next, in order

1. **Actions and forms.** The pieces that act and take input, reviewed or made.
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
2. **Hidden values by kind.** The app says which values hiding hides, between Button's step and the rest of
   Actions and forms.
3. **A TickerChip that opens a panel.** A press the app handles, as a summary beside the list, its address kept
   for a new tab, before the rest of Actions and forms.
4. **Overlays.** The pieces that open over the page, reviewed or made.
    - Dialog, AlertDialog and Sheet
    - Popover, HoverCard, DropdownMenu, ContextMenu, Tooltip and Toggletip
    - text spacing and forced colours on what an overlay draws when open
5. **The rest.** The other pieces, reviewed or made.
    - Tabs, Progress, Meter, Empty, Skeleton and Spinner
    - Breadcrumb, Steps and Banner
    - Collapsible and AllocationBar
    - a bar of actions at the page's foot, a virtualised list, and Toast
    - `calendar`, after a study
6. **Charts.** Line, area, bars and donut, a ring and BarList, each with a table of its data.
7. **MoneyInput.** Entering an amount.
8. **CurrencySelect.** Choosing a currency.
9. **A stable API.** What each state promises after 1.0.
    - every piece reviewed
    - the accessibility script run by hand, with a screen reader and real zoom
    - a policy for deprecating
10. **Stricter checks.** `exactOptionalPropertyTypes`, if React Aria's types pass it.
11. **Release 1.0.0.**

## Later, in no order

Each becomes an item when its time comes.

- **A registry.** When a tarball stops being enough.
- **A local link.** When installing a build each time slows the work.
- **Stack and Inline.** If an app's screens still repeat a layout once the pieces lay their own.
- **An institution's logo.** An `Avatar` in a square form, when an app shows one.
- **A table's note.** What a table says of itself, under it, when its place is decided.
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
- **picomatch's accepted advisory.** When a fixed version is out.
- **The update command in `updating.md`.** It kept a package at its version once, found on 2026-11-13.
- **`actionlint`.** If a workflow fails on something it finds.
- **Biome's `noTailwindArbitraryValue`.** In place of our own scan of classes.
- **The gallery's own types.** TypeScript skips most of `.storybook/`, found on 2026-11-09.
- **The lowest version of each peer in `package`.** When there are more pieces.
- **More for a value, when a screen asks.** A unit, a tone kept, a spoken text.
- **A table's virtualisation, resized columns and rows dragged.** When a screen needs them.
- **Announcing a table's sort.** If `aria-sort` alone proves too little.
- **The pages a pagination draws, worked out.** If a second app needs it.
- **The sample page's text in the dark stories.** Light's colour, where its dark screenshot is right.
- **A less-motion test that stalled once in WebKit.** Opening and closing Dialog stopped the page past every wait,
  1 run in 7 after Playwright 1.65.0 on 2026-11-12, and never again alone or under load. If it returns.
- **A Firefox page that crashed once, out of memory.** In `make stories` on 2026-11-13, a run after reflow entered,
  with every test run passing, and not on the next run. Each browser's stories alone reach about 10 of Docker's
  11.7 GB. If it returns.
- **Sidebar's further functions.** Collapsed to icons with tooltips, counts, sections that open, nested items, a
  keyboard shortcut. When an app asks.
- **Skeleton's and Progress's less motion, asked of each browser.** As the overlays' is, in place of reading the
  style sheets.
- **An overlay stuck entering or leaving in WebKit and Chromium.** React Aria waits on a transition the browser
  cancels, as `duration-100` makes every property transition; found headless in WebKit on 2026-11-11, and in Chromium
  as a sidebar's sheet closed on 2026-11-12, and in WebKit as it opened, its focus left on the page, once on
  2026-11-16. Whether a browser with a window does it is unknown.
- **A table's area in the focus test.** It takes focus when it scrolls, as ScrollArea does, and the focus test
  does not draw it; found on 2026-11-16.
- **The Harbor theme.** A second look, in blue, light and dark, which an app chooses in place of the gold one.

## Done

- **Text.** The app's own sentences as a paragraph at 14/24, 65 characters at most, or a muted note at 14/20,
  with no margin, and a card's content 12 px apart. 0.38.0.
- **A paragraph's line height.** 14/24 for text written in sentences, the descriptions of seven pieces, and
  interface text's titles and details at 20 px, on the 4 px grid. 0.37.0.
- **TickerChip.** An asset by its traded code in a pill, linking to its page, with an optional logo or type in a
  circle concentric with it, and the company's name heard after the code. 0.36.0.
- **Timeline.** The history of one thing, each event that happened or is expected, its dot coloured by its
  meaning. 0.35.0.
- **DescriptionList.** The details of one thing, side by side with the value at the end, one above the other below
  288 px. 0.34.0.
- **Light's neutrals in a true grey.** The paper and its lines with red, green and blue equal, each at its own
  lightness. 0.34.0.
- **The gold theme revised.** Cool paper on the graphite's hue in light, a lighter graphite in dark, the sidebar's own
  gradient with no gold, tints of 10% and fields with no fill in both modes. 0.33.0.
- **ScrollArea.** An area that fills what is left of its place and scrolls there, a named region that takes focus
  only when it scrolls, with the browser's scrollbar and a shadow where it goes on. 0.32.0.
- **AspectRatio.** A box of one shape that a picture fills, cropped, on `--muted` with the corners of an alert, and a
  card's cover as its first child, edge to edge. 0.31.0.
- **A card's ends at every size.** A table, a list of rows and the selection bar run to a card's edges at its spacing,
  12, 20 or 24 px, lined up with its title. 0.30.1.
- **Kbd.** A key, or several pressed together, side by side, on `--muted`, a symbol's name in words heard in its
  place. 0.30.0.
- **Separator.** A line between two groups, heard as a separator, across or upright, in `--border`, with no space of
  its own. 0.29.0.
- **Avatar and AvatarGroup.** A person's picture or initials beside their name, hidden from screen readers, a `span`
  that sits in a sentence, a row's size in a list, its initials while the picture loads, a state by an icon and words,
  and a joint account's holders named by the app's words. 0.28.0.
- **A card with no title.** Under a section's title, a table, a list of rows or joined numbers start at its top, with
  no line above. 0.27.1.
- **Alert.** A message heard by its meaning, `alert` when something went wrong and `status` for the rest, named by
  its title, with its meaning's icon and tint, its action at its end and under its words when narrow, and lists laid
  out in its description. 0.27.0.
- **Card.** A titled surface at its level: its title a heading one level below where it sits and what it holds one
  below that, `size="lg"` for a part of the page, and numbers joined in one box running edge to edge, lined up with
  its title. 0.26.0.
- **The pieces' pages.** Every reviewed piece's page opens with what it is, what it is for and what is not
  recommended. 0.25.0.
- **Badge.** A label that only shows: a state with its meaning and an icon of its own shape, a kind in `secondary`,
  words that wrap, the colours of meaning at 4.5:1 on their own tint, and a page that says what not to do. 0.24.0.
- **Stat and StatGroup.** Numbers of note read together, as a list of terms and values: a label, a value at 24/32
  that gives its size to the Amount in it, and a note under it, its icon a circle in its label, its boxes by
  `spacing` and `variant`, its columns by its own width in shadcn's steps, and its loading. 0.23.0.
- **The local checks' time.** `make check` takes 4 min when it runs alone; before each commit lint, types and
  test, with Chromium's stories when `src/` or a story changes, and a second stories run stops at once. No version of
  its own.
- **IconTile.** An icon on a square or a circle, soft, solid or gold, at 32, 40 or 48 px, which takes its defaults
  from where it sits, as in an Item, in place of ItemMedia's icon variant. 0.22.0.
- **The gallery as a guide.** A page per piece, from its comment and its stories, every example checked, one
  fictitious household's data, Item as the model, and the sample page on AppLayout and Sidebar. No version of its
  own; it goes out with the next.
- **Reflow at 320 px.** A table's hidden header no longer widens the page, and every story is checked at 320 px in
  each browser: no sideways scroll, every area that scrolls reached by keyboard, no text cut. 0.21.1.
- **One vocabulary of variants.** A name means one look in every piece, by shadcn's names: a control's, a surface's
  and a meaning's, and a group's boxes joined or parted by `spacing`. No piece changed. 0.21.0.
- **Layout and text.** No layout pieces of our own: `SectionTitle`, `SectionAction` and `CardAction` lay what they
  hold, and the guidelines give muted text and counts. 0.20.0.
- **One scale of sizes.** Every control a row holds at 32, 36 or 40 px by shadcn's `sm`, `default` and `lg`, the
  fields gaining what they lacked, with a `Sizes` story in each. 0.19.0.
- **The palette of categories.** `--category-1` to `--category-8`, which tell apart and say nothing, with shadcn's
  chart colours reading the first five, and the list's icon tile coloured by `category`. 0.18.0.
- **Colours of meaning.** `--success`, `--warning` and `--info`, one token each, readable as text in both modes, and
  Badge's and Alert's variants. 0.17.0.
- **AppLayout.** The app's shell: `SkipLink`, `AppLayout`, `AppMain`, `AppHeader` and `AppContent`, each with one
  responsibility, a sticky bar and content up to 1440 px or the full width. 0.16.0.
- **Sidebar.** The app's main navigation, our own: sections of links, the current page, and a Sheet on a phone.
  0.15.0.
- **Providers.** `MonetaProvider`, once at the app's root, with the language, the router, the time zone and the
  app's words, in place of `MoneyProvider`. 0.14.0.
- **Layers.** Today's order as a rule, from the page to what floats, held by a test in each browser, with no
  layer tokens. No version of its own; its guideline comes with the next.
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
