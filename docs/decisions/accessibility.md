# Accessibility

What Moneta aims for, and how far its checks reach. How each criterion is checked is in
[`../accessibility.md`](../accessibility.md).

## What holds today

- **The target is WCAG 2.2, level AA,** for a piece used as documented. The app answers for
  its names, titles, language and content. It is a target, not a claim of conformance.
- **Axe runs by that target,** on every story, in three browsers, and a violation fails it.
- **`docs/accessibility.md` answers for every criterion,** and a test holds it to all 55.
- **Every piece's proposal and report go through it,** saying what applies, what has a check
  and what does not.
- **Every story also goes through text spacing and forced colours,** so a piece gets those
  checks from having a story. Forced colours run in Chromium and Firefox, since WebKit's
  emulation answers the media query but forces no colours.

## Why

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

## History

- 2026-11-05: Written, with the stories.
