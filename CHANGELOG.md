# Changelog

What changes for an app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and `docs/releasing.md` says how a version
gets its number.

## [Unreleased]

### Changed

- The theme's light colours and radius are Moneta's, in place of shadcn's default: warm paper, white cards, a graphite
  sidebar and one gold accent, as `--gold`. Dark is still shadcn's default.
- Controls are taller: `Button`, `Input`, `InputGroup`, `NativeSelect`, `Select`, `Tabs` and `Toggle` are 36 px by default,
  32 at `size="sm"`, and 40 at `size="lg"` where they have one. A screen with a height of its own may need adjusting.

### Added

- `Button`'s `variant="gold"`.

### Fixed

- `Avatar`'s fallback and `Kbd` reach WCAG's contrast in light, and `Tabs`' inactive text keeps it on the new colours.

## [0.1.0] - 2026-11-06

The first version for an app to use: shadcn's pieces as they come, on React Aria, with shadcn's default theme in light
and dark. `README.md` says how to install and use it.

### Added

- 41 of shadcn's pieces, each imported by its path, as `@fgarend/moneta/ui/button`. All are raw: they work, nobody has
  reviewed them, and they may fail WCAG 2.2 AA. [`docs/pieces.md`](https://github.com/fgarend/moneta/blob/main/docs/pieces.md)
  lists the gaps known so far.
- `styles.css`, the one import an app with no Tailwind needs, with ready-made styles and the font.
- `theme.css` and `fonts.css`, for an app that still writes Tailwind's classes.
- A [gallery](https://fgarend.github.io/moneta/) of the pieces, published with each release.

## [0.0.1] - 2026-11-06

A rehearsal of the release's path, not meant to be installed. Use a later version.

[Unreleased]: https://github.com/fgarend/moneta/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/fgarend/moneta/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/fgarend/moneta/tree/v0.0.1
