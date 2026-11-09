# Changelog

What changes for an app in each version. The format follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and `docs/releasing.md` says how a version
gets its number.

## [Unreleased]

### Added

- `Section`, a part of a page under one title, with no box: `SectionHeader`, `SectionTitle`, `SectionDescription` and
  `SectionAction`, imported from `@fgarend/moneta/section`. Its title's level comes from the sections it sits in.
- `docs/guidelines.md` says when to use `Section`, and how its title's level is set.

### Changed

- **Breaking:** every piece is imported by its name alone, with no `ui/`, as `@fgarend/moneta/button`. To upgrade,
  replace `@fgarend/moneta/ui/` with `@fgarend/moneta/` in the app's imports.

## [0.3.0] - 2026-11-09

Two rules of space and size in the guidelines, and keyboard focus on `Slider`'s thumb.

### Changed

- `cn` moves to 0.5.2, which changes nothing a piece draws or does.
- `docs/guidelines.md` puts 4 px between a label and what it names, as a value or a bar.
- `docs/guidelines.md` makes the controls in a row with a page's main action 40 px as well.

### Fixed

- `Slider`'s thumb shows keyboard focus, which it did not.
- `docs/guidelines.md` names `Pagination` and `ToggleGroup` among the controls on the scale of sizes.

## [0.2.0] - 2026-11-09

Moneta's own look, in light and dark, with taller controls and a visible keyboard focus.

### Changed

- The theme's light colours and radius are Moneta's, in place of shadcn's default: warm paper, white cards, a graphite
  sidebar and one gold accent, as `--gold`.
- The theme's dark colours are Moneta's: a graphite near-black page, a darker sidebar and lighter cards, with `color-scheme: dark`.
- **Breaking:** controls are taller. `Button`, `Input`, `InputGroup`, `NativeSelect`, `Pagination`, `Select`, `Tabs` and
  `Toggle` are 36 px by default, 32 at `size="sm"`, and 40 at `size="lg"` where they have one. To upgrade, check the screens
  that give a row or a bar a height of their own. A control that must keep its old 32 px takes `size="sm"`, where it has one.
- **Breaking:** `Card` has 20 px around its content, in place of 16, and its title and description follow a scale of text.
  `Table` has a quieter header, 12 px cells and 20 px at each end of a row. To upgrade, check the screens that line something
  up with a card's or a table's content.

### Added

- `Button`'s `variant="gold"`.
- `--font`, to change the font, which had no way to be changed. An app that changes it loads its own.
- `docs/guidelines.md`, in the package: how to use the theme's colours, sizes, text, space, focus and mode on a screen.

### Fixed

- Keyboard focus is a solid outline, which stays in forced colours and reaches 3:1. It also reaches an app's own controls.
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

[Unreleased]: https://github.com/fgarend/moneta/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/fgarend/moneta/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/fgarend/moneta/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/fgarend/moneta/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/fgarend/moneta/tree/v0.0.1
