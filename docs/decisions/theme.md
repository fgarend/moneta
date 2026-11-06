# Theme

The look Moneta has by default, which whoever uses it can replace. How an app replaces it is in
[`delivery.md`](delivery.md).

## What holds today

- **In light: warm paper, white cards, a graphite sidebar and one gold accent.** The page is `#faf9f6`, the sidebar
  `#303338`, and gold `#f0bd2a`, in shadcn's token names, plus `--gold` and `--gold-foreground`, as shadcn has no slot for
  an accent that is neither `--primary` nor `--accent`.
- **Values are written in hex,** as shadcn's customization guide keeps them, and `test/theme.test.ts` holds the pairs
  every piece paints to 4.5:1 for text and 3:1 for the rest.
- **The radius is shadcn's `small`,** `0.45rem`, chosen by the owner on shadcn/create.
- **`--input` is stronger than the prototype's,** `#8e8c84`, to reach 3:1 against both the page and a card.
- **A piece is edited when the theme alone cannot reach it:** `tabs`, whose inactive text fails on our `muted`, and the heights.
- **Controls are 36 px by default, 40 for a page's main actions and 32 for dense ones,** by each piece's `cva`, with `xs` left
  as shadcn has it. `docs/pieces.md` marks each edit.
- **Gold is a variant of `Button`,** so an app names it and writes no colour.
- **Dark is still shadcn's default,** until the roadmap's 4.5 designs it.

## Why

- **Graphite and paper,** since the dark sidebar beside light content is what gives a screen its identity, and a white
  sidebar reads as any app on shadcn. An app that wants one changes `--sidebar-*`.
- **One gold,** kept for little, so it still means something. It fails as text on paper, at 1.66:1, so it is a fill.
- **Three heights.** **What it costs:** 8 edited files to merge when shadcn updates them, and an app has to ask for `lg` until a
  `PageHeader` does it.
- **A stronger `--input`.** **What it costs:** a control's border is more marked than the prototype's, and `Switch`'s
  track, which also reads it, is darker.

## Alternatives considered

- **40 px for everything.** As the prototype's top actions, but a form's fields feel too large for a card, measured on the
  sample page on 2026-11-06.
- **32 px, `aria-nova`'s default.** No edit, but a page's main action loses its presence.
- **`--spacing`.** No edit, but the whole screen grew 14% taller, with rows and icons too.

- **shadcn's neutrals with gold alone.** No work, but it still reads as shadcn.
- **A white sidebar by default.** Calmer, but with less identity.
- **`oklch`, as shadcn's default writes it.** Natural for its own palette, but ours was chosen in hex, and the contrast test
  would have to convert it.

## History

- 2026-11-06: Written, with the light colours.
- 2026-11-06: Control heights and the gold variant.
