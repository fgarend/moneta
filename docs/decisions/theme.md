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
- **`Card` reads the scale, and has 20 px around its content.** **`Table` has a quiet header and 12 px rows,** with 20 px at each
  end, so a table in a card lines up with the card's title.
- **Keyboard focus is a solid outline,** 2 px with 2 px of offset, in `--ring`, from one unlayered rule in the theme. It is
  shadcn's own rule, widened to fields and to what keeps focus on a hidden input. An area on a dark surface sets its own `--ring`.
- **In dark: a warm near-black, in small steps.** The page is `#1b1a18`, the sidebar a step darker at `#131210`, and a card a
  step lighter at `#25241f`, so what is nearer is lighter. Gold stays the same in both, and `color-scheme: dark` darkens the
  browser's own controls.
- **An app sets the mode, with the class `.dark`,** as shadcn does, with no switch or provider of ours.

## Why

- **A warm dark,** since it is the paper's family, so both modes read as one product, and gold sits naturally on it.
  **What it costs:** the light sidebar `#303338` is still cool, a warm tone may look brown on some screens, and the sidebar is
  only 1.08:1 from the page, so the item marked and the text are what set it apart.
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

## Alternatives considered

- **40 px for everything.** As the prototype's top actions, but a form's fields feel too large for a card, measured on the
  sample page on 2026-11-06.
- **32 px, `aria-nova`'s default.** No edit, but a page's main action loses its presence.
- **`--spacing`.** No edit, but the whole screen grew 14% taller, with rows and icons too.
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
- **A neutral near-black, `#1a1b1e`.** The same steps without warmth, but it is the dark many apps have, and colder than the paper.
- **The sidebar the same as the page, with a line between.** The calmest, but the sidebar is no longer a surface of its own.
- **A provider of ours for the mode.** An app writes less, but it is code to keep, for each framework.
- **`oklch`, as shadcn's default writes it.** Natural for its own palette, but ours was chosen in hex, and the contrast test
  would have to convert it.


## History

- 2026-11-06: Written, with the light colours.
- 2026-11-06: Control heights and the gold variant.
- 2026-11-06: The font as a variable, and the scale of text and space.
- 2026-11-06: Keyboard focus.
- 2026-11-07: The dark colours.
- 2026-11-07: Light made warm, and back to the prototype's the same day.
