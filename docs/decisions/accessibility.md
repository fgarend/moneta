# Accessibility

What Moneta aims for, and how far its checks reach. How each criterion is checked is in
[`../accessibility.md`](../accessibility.md).

## What holds today

- **The target is WCAG 2.2, level AA,** for a piece used as documented. The app answers for
  its names, titles, language and content. It is a target, not a claim of conformance.
- **Axe runs by that target,** on every story, in three browsers, and a violation fails it.
- **A raw piece's gap lets a story off one check,** by name, once it is measured and written in
  `docs/pieces.md`, until the piece is reviewed. Every other story keeps failing, so a clean piece
  that gets worse is noticed.
- **`docs/accessibility.md` answers for every criterion,** and a test holds it to all 55.
- **Every piece's proposal and report go through it,** saying what applies, what has a check
  and what does not.
- **Every story also goes through text spacing and forced colours,** so a piece gets those
  checks from having a story, except for what an overlay draws when open, which they do not
  see until the roadmap's Overlays. Forced colours run in Chromium and Firefox, since WebKit's
  emulation answers the media query but forces no colours.
- **Text spacing measures where each text sits,** with the spacing and without it, against the
  boxes around it that do not scroll. Only text counts, as that is what the criterion asks, so an
  icon cut by a fixed height goes unseen.
- **Every story also reflows at 320 px,** WCAG 1.4.10's width, in the three browsers, with the 1rem the gallery
  gives it: the page never scrolls sideways, axe's `scrollable-region-focusable` finds every area that scrolls
  reached by keyboard, and no text is cut by the narrow width alone, measured as text spacing measures, wide
  against narrow. A gap lets a story off as for the others, `gap-reflow`.

## Why

Reflow on every story, as a table's hidden header widened the whole page on a phone on 2026-11-13, a mistake any
piece can make and no story at 1280 px sees. The gallery's room, as with none, 30 stories failed by the 12 px a
table or a list of rows reaches past its edge on purpose, which a page's margin always holds.

WCAG 2.2 is the W3C's current Recommendation. The target has to be named in axe's settings:
the addon's default stops short of it, and two tiny controls side by side pass, since axe's
one rule for WCAG 2.2 AA, target size, does not run.

Axe finds on average 57% of issues, by its own count, and has no rule for 1.4.11 or 2.4.7. A
run that passes says little by itself, so a list has to say what is left unchecked.

## Alternatives considered

- **WCAG 2.1 AA.** The addon's default, but not the current Recommendation.
- **Level AAA.** More, but the W3C does not recommend it as a target for a whole site, since
  some of its criteria cannot be met by all content.
- **Trusting axe alone.** No list to keep, but most criteria are never looked at.
- **No stated level.** Nothing to check a piece against.
- **Every raw piece only warns.** Simple, but nothing would ever fail for 40 pieces, and a clean
  one could get worse unseen.
- **Checking that an element's content fits it.** It reported 9 pieces on 2026-11-06, none with text
  lost, since a touch area or a fixed height with padding overflows the same with no spacing.
- **Comparing that overflow with and without the spacing.** No false reports, but a text cut in a piece
  whose touch area already overflows further went unseen, as a plant showed.
- **Reflow only on the page,** that it never scrolls sideways. Shorter, but an area only a phone makes scroll could
  be out of a keyboard's reach, and a text cut by the width unseen. **Reflow in Chromium only,** as screenshots,
  though each browser lays out its own way. **A story with no room,** as text spacing renders it, which fails
  every piece that reaches past its edge on purpose.

## History

- 2026-11-05: Written, with the stories.
- 2026-11-06: Gaps of raw pieces let off by check, and text spacing measured on the text.
- 2026-11-13: Every story reflows at 320 px.
