# Updating

When and how versions move.

## When

At the start of each roadmap item from milestone 2 on, before any of its work:

```sh
make outdated
```

It fails when it finds something to look at. The item's proposal says what it found.
Whatever it reports is updated first, in commits of its own, and the images are checked by
hand, below. Milestone 1 needs none of this, since each tool arrives at its latest version
past the release age.

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
make add PACKAGE=<package>
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

## Checks made by hand

`make outdated` cannot see these.

- **The images in `infra/settings.env`,** at the same moments: a newer version, and a new
  digest under the same tag, which means the image was rebuilt.
- **The year of `target` and `lib` in `tsconfig.json`.** It moves up once all of that year's
  features are widely available in Baseline. For ES2024, two are still missing, and each
  prints `high` once it is:

  ```sh
  docker run --rm moneta:base node -e 'fetch("https://cdn.jsdelivr.net/npm/web-features/data.json").then((r) => r.json()).then(({ features }) => { for (const id of ["resizable-buffers", "atomics-wait-async"]) console.log(id, features[id].status.baseline); })'
  ```
