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
- **The aliases are `#components/*`, `#hooks/*` and `#lib/*`, in `package.json#imports`,** since `add`
  writes no piece when an alias of `components.json` does not resolve.

### Read of findings on arrival

| File | Findings |
| --- | --- |
| `button.tsx` | 4 `noSecrets`, on class strings, and 1 `useComponentExportOnlyModules`, as it also exports `buttonVariants`. No fault |

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
