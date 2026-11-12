# Theme

The look Moneta has by default, which whoever uses it can replace. How an app replaces it is in
[`delivery.md`](delivery.md).

## What holds today

- **In light: the prototype's colours,** warm paper, white cards, a cool graphite sidebar and text, and one gold accent.
  The page is `#faf9f6`, the sidebar `#303338`, text `#23262b`, and gold `#f0bd2a`, in shadcn's token names, plus `--gold`
  and `--gold-foreground`, as shadcn has no slot for an accent that is neither `--primary` nor `--accent`.
- **Values are written in hex,** as shadcn's customization guide keeps them, and `test/theme.test.ts` holds the pairs
  every piece paints to 4.5:1 for text and 3:1 for the rest.
- **The radius is shadcn's `small`,** `0.45rem`, chosen by the owner on shadcn/create.
- **`--input` is stronger than the prototype's,** `#8e8c84`, to reach 3:1 against both the page and a card.
- **A piece is edited when the theme alone cannot reach it:** `tabs`, whose inactive text fails on our `muted`, and the heights.
- **Controls are 36 px by default, 40 for a page's main actions and 32 for dense ones,** by each piece's `cva`, with `xs` left
  as shadcn has it. `docs/pieces.md` marks each edit.
- **Gold is a variant of `Button`,** so an app names it and writes no colour.
- **`--positive` and `--negative` colour a value's tone,** good news and bad: a green of our own, `#157347` in light
  and `#74d19a` in dark, with as much contrast as the red, and `--negative` reads `--destructive`, so the theme keeps
  one red. A value that names another is declared again under `.dark`, as it is worked out where it is declared.
  `test/theme.test.ts` holds both to 4.5:1 on the page, a card and `--muted`, and holds each such value to `.dark`.
- **The font is Geist, in `--font`,** which `--font-sans` reads, so an app can change it. `--font-heading` stays as shadcn writes
  it, costing nothing unused, so a piece that reads it later still finds it.
- **A scale of text and of space,** so sizes are chosen once. Text, with line heights on a 4 px grid but the title's: 32/40 for a
  page's title, 24/32 for an amount of note, 18/24 for a section, 15/22 for a card's title, 14/20 for the body, 13/20 for a
  label and 12/16 for a caption. Space, in multiples of 4 px: 8 to 12 within a group, 16 to 20 in a card, 16 between cards,
  40 between sections, and 40 to 48 around a page. Inside is smaller than between, so what belongs together reads together.
- **One emphasis at each level.** 600 for titles and amounts of note, 500 for an amount in a row, 400 for the rest.
- **Five text styles, internal to the pieces:** `type-display`, `type-amount-lg`, `type-amount`, `type-title` and
  `type-label`. They are `@utility`, as shadcn's guide says, and Tailwind writes only those a piece uses, so an app on
  `styles.css` reaches them through a piece. The rest of the scale is Tailwind's own steps.
- **`Card` reads the scale, and has 20 px around its content.** **`Table` has a quiet header with no fill and 12 px
  rows, with a line under each but the last,** 20 px at each end in a card, so it lines up with the card's title, and
  12 px loose on a page, where its rows reach out as much, so its text lines up with the page.
- **`--surface` is the colour of the surface a piece sits on,** the page's background, which `Card`, `Sheet` and
  `Dialog` set to their own, so what sticks over a table's rows takes the right colour. It is declared again under
  `.dark`, as a value that names another is worked out where it is declared. **`scroll-shadows`** draws a shadow at
  each end of an area that scrolls sideways while there is more there, in `--scroll-shadow`. **`sticky-fill`** gives
  what sticks in a table the surface, with its row's state, `--row-fill`, drawn over it. **`progress-run`** runs a
  part of an indeterminate bar across its track, which stands still and dashed when less motion is asked for.
- **`--border-strong` marks structure,** under a group's title and over a total: warm, darker than `--border` in
  light and lighter in dark, which `test/theme.test.ts` holds.
- **Keyboard focus is a solid outline,** 2 px with 2 px of offset, in `--ring`, from one unlayered rule in the theme. It is
  shadcn's own rule, widened to fields, to what keeps focus on a hidden input, and to a date field's box, around the part
  that has it. An area on a dark surface sets its own `--ring`.
- **Motion is shadcn's, with no durations of our own:** 100 ms an overlay appearing and a row's hover, as Tooltip
  joins, Tailwind's 150 ms and `cubic-bezier(0.4, 0, 0.2, 1)` a change of state, and 200 ms the Sheet crossing the
  screen.
- **With less motion, nothing on the pieces moves or changes size, and the Spinner spins,** from one unlayered rule in
  the theme on what has a `data-slot`: tw-animate-css's entrance and exit keep their fade and lose their slide and
  zoom, and a transition keeps colour, opacity and a ring's shadow. `.storybook/less-motion.test.tsx` asks each browser
  for less motion and watches every animation as a piece opens, closes or changes.
- **Layers, from the bottom:** the page; what sticks inside a piece, as Table's header and first column, at `z-10` to
  `z-30`; the modal overlays, Dialog, AlertDialog and Sheet, at shadcn's `z-50`; and what floats, Popover, Tooltip,
  HoverCard, the menus and Select, at React Aria's own `z-index: 100000`, set on the element, which beats shadcn's
  `z-50` there. No layer tokens. `.storybook/layers.test.tsx` checks in each browser what is drawn over what.
- **In dark: the prototype's graphite, near black, in small steps.** The page is `#1a1b1e`, the sidebar a step darker at
  `#121316`, and a card a step lighter at `#232529`, so what is nearer is lighter. Text is `#f4f4f2`, as on the prototype's
  sidebar. Gold stays the same in both, and `color-scheme: dark` darkens the
  browser's own controls.
- **An app sets the mode, with the class `.dark`,** as shadcn does, with no switch or provider of ours.
- **`docs/guidelines.md` says how to use the look,** in short rules for whoever builds a screen, with only what exists,
  and a section for each reviewed piece. `test/guidelines.test.ts` checks that each variable it names is declared.

## Why

- **A cool dark,** since the prototypes have no dark, and their graphite and the light text on it are what they have of one,
  so both modes read as one product. **What it costs:** it is the dark many apps have, so gold carries the identity, the
  paper's warmth is gone in dark, and the sidebar is only 1.08:1 from the page, so the item marked and the text set it apart.
- **The prototype's light, as it is,** since warm paper against cool graphite is what keeps it from reading yellow.
- **Graphite and paper,** since the dark sidebar beside light content is what gives a screen its identity, and a white
  sidebar reads as any app on shadcn. An app that wants one changes `--sidebar-*`.
- **One gold,** kept for little, so it still means something. It fails as text on paper, at 1.66:1, so it is a fill.
- **A scale, and not sizes chosen one by one.** An earlier version of this page had an amount at 30 px above a 28 px title, and
  spaces all alike, and read as unprofessional. **What it costs:** two edited pieces, and 13 and 15 px, which Tailwind has no
  steps for.
- **Internal text styles,** since an app is to end with no class of its own, and a name an app writes is a name to keep. **What
  it costs:** an app on `styles.css` has no page title or amount in these styles until `PageHeader` and `Amount` arrive.
- **Three heights.** **What it costs:** 8 edited files to merge when shadcn updates them, and an app has to ask for `lg` until a
  `PageHeader` does it.
- **The solid outline,** since shadcn's ring is a shadow, gone in forced colours, and 2.96:1 at 50% on white. **What it costs:** a
  rule on every page, which also reaches an app's own controls, and a more marked focus than a soft ring.
- **A stronger `--input`.** **What it costs:** a control's border is more marked than the prototype's, and `Switch`'s
  track, which also reads it, is darker.
- **A guide apart from this page,** since this page is for whoever keeps Moneta, with reasons and history, and whoever
  builds a screen needs the rules alone. **What it costs:** the scale and the space are written twice, and a value changed
  here is changed there by hand, as the test only catches a name.
- **Shadcn's durations as a rule,** as they agree: near Primer's 100 ms for a hover and 200 ms for a change, and
  Atlassian's 150 ms for a menu. **What it costs:** a theme cannot slow or speed all motion in one place, which
  Carbon's, Primer's and Atlassian's named durations allow.
- **Fades and colours kept with less motion,** as WCAG 2.3.3 counts neither as motion, and movement and changes of
  size are what unsettle a reader's balance, as Spectrum's Toast fades. **The Spinner kept spinning,** as every system
  studied keeps its own, and Primer says a still one looks frozen: a loading state where nothing else can be done.
  **What it costs:** Carbon and Atlassian remove all motion, in one rule with no exception, and Material and Polaris
  keep a control's small motion, so a switch's thumb that jumps may feel abrupt.
- **One rule in the theme, on the pieces by their `data-slot`,** the second step of the rule, beside the focus
  outline's: a new piece is covered, shadcn's updates weigh nothing, and an app's own motion is left alone. **What it
  costs:** a piece's file does not show it, and an animated property shadcn adds would escape it, which the test
  catches.
- **Today's layers as a rule,** the first step of the rule: the order is the one Chakra, MUI and Primer name, a menu or
  a tooltip over the dialog it opens in, and React Aria's portal and its inline `z-index` already give it. **What it
  costs:** the `z-50` that does nothing on what floats stays in shadcn's files, and a piece to come, as a toast above a
  dialog or the sidebar, picks its number among these, where Primer, Chakra and MUI name each layer.

## Alternatives considered

- **40 px for everything.** As the prototype's top actions, but a form's fields feel too large for a card, measured on the
  sample page on 2026-11-06.
- **32 px, `aria-nova`'s default.** No edit, but a page's main action loses its presence.
- **`--spacing`.** No edit, but the whole screen grew 14% taller, with rows and icons too.
- **`DM Sans` or `Raleway`,** among shadcn's fonts. On 2026-11-06 they had no tabular figures, and the others did.
- **Twelve text styles,** as an earlier library had. Most of them only repeated Tailwind's steps.
- **`type-overline`, capitals with wide tracking, for a group's title.** The prototype has it, but it reads as a template, so a plain
  caption does the job.
- **The text styles forced into `styles.css`.** 111 bytes, measured, but they would be names to keep forever.

- **shadcn's neutrals with gold alone.** No work, but it still reads as shadcn.
- **A white sidebar by default.** Calmer, but with less identity.
- **A gold halo for focus.** An earlier library had one, but it reaches 1.75:1 on white.
- **Warm text, dark button and sidebar in light,** so both modes were one warm family. Tried on 2026-11-07, and the owner
  found it too yellow and too far from the prototypes.
- **A graphite page in dark, `#303338`, with a near-black sidebar.** The light sidebar's colour, but the two darks did not
  read as one family, a mid grey dulled the content, and `--input` was at 3.14:1.
- **A warm near-black, `#1b1a18`,** the paper's family. Adopted on 2026-11-07, and dropped the same day, with the warm light,
  as too yellow and too far from the prototypes.
- **The sidebar the same as the page, with a line between.** The calmest, but the sidebar is no longer a surface of its own.
- **A provider of ours for the mode.** An app writes less, but it is code to keep, for each framework.
- **The guide as a page in the gallery.** Beside the pieces and already published, but harder for an agent to read.
- **The planned rules in the guide too,** as the prototype's brand book has them: money's colours, amounts, writing and
  icons. Direction sooner, but rules that no decision or piece holds yet.
- **The guide with no test.** Simpler, but a renamed variable would live on in every app's copy.
- **`oklch`, as shadcn's default writes it.** Natural for its own palette, but ours was chosen in hex, and the contrast test
  would have to convert it.


- **Named durations,** as Carbon's six, Primer's four and Atlassian's eight, which would change every piece that moves.
- **No motion at all with less motion,** as Carbon and Atlassian, simpler, but an overlay would appear with no sign.
- **A `motion-reduce:` class on each piece,** visible where it acts, but an edit to a dozen of shadcn's files.
- **Less motion read from the style sheets,** as `.storybook/reduced-motion.ts` does for Progress and Skeleton, with no
  browser asked, which misses what the browser makes of the rules.

- **Layer tokens,** as `--z-index-*`, which Tailwind reads but does not document, or named as Primer's, Chakra's and
  MUI's, which would edit every overlay of shadcn's.
- **The native top layer,** with `popover` and `<dialog>`, as Atlassian is moving to, which React Aria does not use.

## History

- 2026-11-06: Written, with the light colours.
- 2026-11-06: Control heights and the gold variant.
- 2026-11-06: The font as a variable, and the scale of text and space.
- 2026-11-06: Keyboard focus.
- 2026-11-07: The dark colours.
- 2026-11-07: Light made warm, and back to the prototype's the same day.
- 2026-11-07: Dark from warm to the prototype's graphite.
- 2026-11-08: The guidelines.
- 2026-11-10: `--positive` and `--negative`.
- 2026-11-10: `--surface`, `--scroll-shadow`, `scroll-shadows` and `--border-strong`, for Table.
- 2026-11-11: `sticky-fill`, for a table's selected rows.
- 2026-11-11: `progress-run`, for Progress with no value.
- 2026-11-11: The focus outline around a date field's box.
- 2026-11-11: Motion, and less motion on the pieces.
- 2026-11-12: Layers.
