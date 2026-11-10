# Base

What the library starts from.

## What holds today

- **shadcn is the base,** on **React Aria,** in the style **`aria-nova`.**
- **`components.json` is written by hand,** since `init` refuses a library: "We could not detect a
  supported framework".
- **A piece enters through the CLI, at a pinned version,** today 4.23.0, into `src/components/` beside every
  other piece, and its file as it came is kept in `upstream/shadcn/`, the base of each update. The registry has no
  version, so the commit's date says when:

  ```sh
  docker compose --env-file infra/settings.env -f infra/compose.yaml run --rm --build install \
    pnpm dlx shadcn@4.23.0 add <piece> --yes
  ```

- **An update is never `--overwrite`,** which would replace our edits, but `make shadcn-update`.
- **`cn` is the npm package of that name,** as shadcn delivers it.
- **The theme's shape is shadcn's,** in `src/styles/theme.css`, and its values are Moneta's, as `theme.md` says.
  A `@source` lets the app's Tailwind read the pieces, as it skips `node_modules`.
- **`shadcn/tailwind.css` is copied to `src/styles/shadcn.css`,** with its base in `upstream/shadcn/` too. Our
  values go in `theme.css`, and it keeps only what the pieces use: its `scroll-fade-*`, `shimmer-*` and `no-scrollbar`
  utilities went, which no piece used, as an app writes no class of its own.
- **The font is apart, in `src/styles/fonts.css`,** starting with shadcn's Geist, which Moneta's look kept, as
  `theme.md` says.
- **Every piece meets the same rule, shadcn's too:** format, lint, coverage and no arbitrary class, as
  `docs/decisions/components.md` says. An update from shadcn is a three-way merge, by `make shadcn-update`.
- **The aliases are `#components/*`, `#hooks/*` and `#lib/*`, in `package.json#imports`,** with a custom
  condition, `moneta-source`, which must not be called `source`: sources here, `dist/` once built.
  `add` wrote no piece without `#lib/*`, though nothing uses it yet.
- **41 of the registry's 62 pieces entered,** as they came, on 2026-11-06. Their state is in
  `docs/pieces.md`. These stayed out:
  - `sidebar`, `combobox` and `calendar`, for a study of their own, in the roadmap's Sidebar, Actions and forms, and The rest.
  - `carousel`, `chart`, `drawer`, `input-otp`, `message-scroller`, `questionnaire`, `resizable` and
    `sonner`, which bring packages of their own.
  - `attachment`, `bubble`, `code-block`, `marker`, `message` and `trace`, for conversations and code.
    The registry does not describe `marker`, so that one is a guess.
  - `accordion` and `command`, which the roadmap did not build then, and now asks again.
  - `direction`, which fails the build with TS2883, and `form`, which brings no file.
- **`add` installs only `cn`** under a hand-written `components.json`, so the other packages enter by
  command.
- **`add` does not always write the same bytes.** Run again with `--overwrite` on 2026-11-06, it changed
  24 of the 41 files, and only their `"use client"` line, added to 12 and removed from 12. So a diff
  against the registry should ignore that line.

### Read of findings on arrival

On the 41 files, with lint turned on for the read, on 2026-11-06. What looked like a gap went into `docs/pieces.md`.
Since 0.5.0, lint holds every piece, and all of these were fixed or no longer apply.

| Rule | Findings | Reading |
| --- | --- | --- |
| `noSecrets` | 40 | Class strings. No fault |
| `noNamespaceImport`, `useImportType`, `noExportedImports` | 48 | Import style |
| `noShadow` | 14 | A parameter named as an import. No fault seen |
| `noUnresolvedImports` | 13 | The aliases, which the read's settings did not resolve |
| `useComponentExportOnlyModules` | 9 | A piece that also exports its variants |
| `noLeakedRender` | 7 | Might draw a stray value. To read in each review |
| `noJsxLiterals` | 5 | Default text, which a review turns into props |
| `noDeprecatedImports` | 3 | React Aria's `Checkbox`, `Radio` and `Switch` |
| `noUnusedImports` | 2 | `alert-dialog` and `label` |
| `noArrayIndexKey` | 2 | `field` and `slider` |
| Style rules, one to three each | 15 | No fault seen |

### Measured on 2026-11-06

- **The package:** 44 pieces, as tried before three stayed out, gave a tarball of 33 KB, and passed the 4
  tests of `package`.
- **Behind a real app's own files,** on a copy, with 13 raw pieces in place of its copies and its own
  tokens: no type errors, and 487 of its 511 tests pass. The other 24 come from 3 differences, in
  `Sheet`, `Table` and `Dialog`. Its CSS grew from 87 to 155 KB, as Tailwind reads every piece, and its
  JavaScript from 1,120 to 1,147 KB. Its photos could not be compared in that image.
- **Not diagnosed, from 1.5:** a test in Node importing by alias failed, even with `resolve.conditions`.
  No test does that today.

## Why

- **shadcn,** so the library starts from what already works, and adds its own only when that makes sense.
- **React Aria,** the owner's choice on 2026-11-04, though shadcn's default is Base UI.
- **`aria-nova`,** chosen by the owner on shadcn/create. Its real test is the sample page.
- **The CLI through `pnpm dlx`,** since it is used only to bring files, and installing it brings about
  200 packages.
- **A copy of `shadcn/tailwind.css`,** since importing it brings the `shadcn` package, 163 more packages
  in an app on 2026-11-06. **What it costs:** an update by hand, which `docs/updating.md` lists.
- **The font apart,** since Moneta is generic, and an app with another font should not carry ours.
  **What it costs:** one more import, and an app that forgets it falls back to a system font, silently.
- **One rule, and a merge for updates,** since where a piece came from is the repository's business, and shadcn's
  pieces had 91 lint findings and 31 arbitrary classes, which no read on arrival fixed. **What it costs:** every update
  is a merge, and what both changed is settled by hand.

## Alternatives considered

- **Base UI or Radix.** Both supported by shadcn, and neither was the owner's choice.
- **`clsx` and `tailwind-merge` in a `lib/utils.ts`.** More mature than `cn`, but every piece would need
  an edited import, again at each `add`.
- **Tags on each import.** See `docs/decisions/process.md`.
- **`shadcn eject`.** It works, but puts the file inside the main style sheet, mixing shadcn's with ours,
  and leaves an `@import` in the middle of it.
- **The font inside the theme,** as shadcn's default does. Simpler, but every app carries it.
- **shadcn's files as they came, with lint off,** as until 2026-11-09. An update replaced a file whole, but real findings
  stayed, and an app saw where each piece came from.
- **Keeping shadcn's utilities, with the features past Baseline allowed in lint.** Ready for a piece that wants them,
  but against the browsers lint holds today, for what nothing used.

## History

- 2026-11-06: Written, with the first `shadcn add`.
- 2026-11-06: The other 40 pieces.
- 2026-11-06: The default theme, the copy of shadcn's style sheet and the font.
- 2026-11-06: The theme's values moved to `theme.md`.
- 2026-11-09: Every piece under one rule, in one folder, with shadcn's updates merged three ways.
