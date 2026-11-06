# Base

What the library starts from.

## What holds today

- **shadcn is the base,** on **React Aria,** in the style **`aria-nova`.**
- **`components.json` is written by hand,** since `init` refuses a library: "We could not detect a
  supported framework".
- **A piece enters through the CLI, at a pinned version,** today 4.23.0, in a commit of its own with
  nothing edited, as `docs/decisions/process.md` says. The registry has no version, so the commit's
  date says when:

  ```sh
  docker compose --env-file infra/settings.env -f infra/compose.yaml run --rm --build install \
    pnpm dlx shadcn@4.23.0 add <piece> --overwrite --yes
  ```

- **`--overwrite` only when nothing there is edited,** as it replaces the file. Without it, an edit stays.
- **`cn` is the npm package of that name,** as shadcn delivers it.
- **Lint, format and import sorting are off on `src/components/ui/`,** with one read of each file's
  findings when it arrives. Their stories keep them on.
- **The aliases are `#components/*`, `#hooks/*` and `#lib/*`, in `package.json#imports`,** with a custom
  condition, `moneta-source`, which must not be called `source`: sources here, `dist/` once built.
  `add` wrote no piece without `#lib/*`, though nothing uses it yet.
- **41 of the registry's 62 pieces entered,** as they came, on 2026-11-06. Their state is in
  `docs/pieces.md`. These stayed out:
  - `sidebar`, `combobox` and `calendar`, for a study of their own, under the roadmap's Deferred.
  - `carousel`, `chart`, `drawer`, `input-otp`, `message-scroller`, `questionnaire`, `resizable` and
    `sonner`, which bring packages of their own.
  - `attachment`, `bubble`, `code-block`, `marker`, `message` and `trace`, for conversations and code.
    The registry does not describe `marker`, so that one is a guess.
  - `accordion` and `command`, which the roadmap does not build.
  - `direction`, which fails the build with TS2883, and `form`, which brings no file.
- **`add` installs only `cn`** under a hand-written `components.json`, so the other packages enter by
  command.
- **`add` does not always write the same bytes.** Run again with `--overwrite` on 2026-11-06, it changed
  24 of the 41 files, and only their `"use client"` line, added to 12 and removed from 12. So a diff
  against the registry should ignore that line.

### Read of findings on arrival

On the 41 files, with lint turned on for the read. What looks like a gap went into `docs/pieces.md`.

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
- **Lint off,** since a file that stays as it came merges cleanly. **What it costs:** real findings in
  shadcn's code show only in that one read.

## Alternatives considered

- **Base UI or Radix.** Both supported by shadcn, and neither was the owner's choice.
- **`clsx` and `tailwind-merge` in a `lib/utils.ts`.** More mature than `cn`, but every piece would need
  an edited import, again at each `add`.
- **Tags on each import.** See `docs/decisions/process.md`.

## History

- 2026-11-06: Written, with the first `shadcn add`.
- 2026-11-06: The other 40 pieces.
