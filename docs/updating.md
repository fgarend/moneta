# Updating

When and how versions move.

## When

At the start of each roadmap item from milestone 2 on, before any of its work:

```sh
make outdated
```

It fails when it finds something to look at. The item's proposal says what it found.
Whatever it reports is updated first, in commits of its own, and the images and the actions
are checked by hand, below. Milestone 1 needs none of this, since each tool arrives at its
latest version past the release age.

A release does not wait for this: what is outdated in the tools does not reach whoever
uses Moneta. Vulnerabilities are a separate matter, for `make audit`.

## What a commit holds

- **One tool per commit,** with the packages that move with it: pnpm's image with
  `packageManager`.
- **Only versions past the release age.** pnpm refuses a younger package, and an image is
  checked by hand.
- **`make check` passes.** A small fix the update needs goes in the same commit. An update
  that needs more waits, with its reason in the roadmap.
- **A new major version is not a routine update.** It is raised as a step of its own, since
  it may change decisions.

The message is `build(deps): update <tool> to <version>`, with a body only for what the
diff does not show.

## How

**A dependency** always enters through pnpm's command line, never by editing
`package.json`. This takes the newest version past the release age, and saves it exact. Add
`@<version>` for a specific one. Then `make check`:

```sh
docker compose --env-file infra/settings.env -f infra/compose.yaml run --rm --build install \
  pnpm add -D <package>
```

**A dependency of the package,** which an app receives, enters the same way without `-D`, with a line in
`CHANGELOG.md`'s `Unreleased` in the same commit, even when nothing changes for an app, so the next release says so.

**A peer** is a range chosen here, which installs nothing, so it is set as it is written, and a new range takes a
line in the changelog too. Its version for development enters as above. `pnpm add --save-peer` is not used, since it
raises the range to the newest version and turns the exact development version into a range:

```sh
docker compose --env-file infra/settings.env -f infra/compose.yaml run --rm --build install \
  pnpm pkg set "peerDependencies.<package>=<range>"
```

**A pinned image,** in `infra/settings.env`, then `make check`. Take a version past the
release age, by its date on the package of the same name, and write its digest beside it:

```sh
docker compose --env-file infra/settings.env -f infra/compose.yaml run --rm --build install \
  pnpm view <package> time --json
docker buildx imagetools inspect <image>:<tag> --format '{{.Manifest.Digest}}'
```

For pnpm's image, `packageManager` in `package.json` moves to the same version, followed by
`make install`. Node moves only when Playwright's image does.

**A pinned action,** in `.github/workflows/`, then `make check`. Take a version past the
release age, by the date of its release, and write its tag's commit with the version in a
comment. These two need `gh`, GitHub's command line, on the machine:

```sh
gh api repos/<action>/releases/latest --jq '"\(.tag_name) \(.published_at)"'
gh api repos/<action>/commits/<tag> --jq .sha
```

## Checks made by hand

`make outdated` cannot see these.

- **The images in `infra/settings.env`,** at the same moments: a newer version, and a new
  digest under the same tag, which means the image was rebuilt.
- **shadcn's pieces and style sheet,** at the same moments. The registry has no version, so what changed is only
  seen by taking it again. `make shadcn-update` merges what shadcn changed since `upstream/shadcn/` into our files,
  three ways, one piece per call of the CLI, and ignores the `"use client"` line the CLI adds or drops at random.
  What both changed is left marked in the file, to settle by hand, and the commit says how each was settled. A
  newer CLI, past the release age, moves in `scripts/shadcn-update.sh`, which also takes its style sheet.

  ```sh
  make shadcn-update
  make shadcn-update PIECE=card
  ```

- **The actions in `.github/workflows/`,** at the same moments: a newer version. A pin is a
  commit, so a tag moved later changes nothing here.
- **The year of `target` and `lib` in `tsconfig.json`.** It moves up once all of that year's
  features are widely available in Baseline. For ES2024, two are still missing, and each
  prints `high` once it is:

  ```sh
  docker run --rm moneta:base node -e 'fetch("https://cdn.jsdelivr.net/npm/web-features/data.json").then((r) => r.json()).then(({ features }) => { for (const id of ["resizable-buffers", "atomics-wait-async"]) console.log(id, features[id].status.baseline); })'
  ```
