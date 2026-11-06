# Delivery

Where the library lives, how it is received, and under what terms.

## What holds today

- **The repository is `fgarend/moneta`, and it is public.**
- **The package is `@fgarend/moneta`, delivered by a release's tarball,** which the
  `package.json` of whoever uses it points to on GitHub. It is not published to a
  registry. A local link is left out until the daily work needs it.
- **A release is automatic,** from a commit `chore: release vX.Y.Z` on `main`, once every box has passed, as
  `docs/releasing.md` says. It publishes the tarball the `package` box tested, with no second build.
- **Each release publishes the gallery,** on GitHub Pages, around Storybook's own default look.
- **Pieces are imported by path,** as `@fgarend/moneta/ui/button`. There is no root entry.
- **The usual way is one import,** `import "@fgarend/moneta/styles.css";`, with ready-made styles and the
  font. An app needs no Tailwind and no settings, and changes the look by redefining the theme's variables.
- **An app that still writes Tailwind's classes** uses `@import "tailwindcss";` and then
  `@import "@fgarend/moneta/theme.css";`. Without Tailwind first, the build passes and no class arrives.
  `@fgarend/moneta/fonts.css` is optional there. The theme also sets the page's border colour, background, text
  colour and font, and the dark mode through a `.dark` class, as shadcn's does.
- **An app brings the peers,** whose second copy would silently lose shared state: `react` and
  `react-dom` at `^19.0.0`, `react-aria-components` at `^1.22.1`, `lucide-react` at `^1.65.0`, and `tailwindcss` at `^4.3.3`, optional, for the second way. A peer enters when the code in
  the package first imports it, with the version installed then as its floor.
- **Helpers come with the package, at exact versions:** `cn`, `class-variance-authority`,
  `tw-animate-css`, and the font, `@fontsource-variable/geist`, under OFL-1.1, whose license an app
  that publishes the font's files keeps with them.
- **The license is MIT,** for everything in this repository.
- **Code copied from shadcn keeps its notice.** shadcn/ui is MIT, which asks that its
  copyright and permission notice stay with copies of its code. `LICENSE` holds its copyright
  line beside ours, under the same permission text, and is always packed.

### GitHub settings

They cannot be read from the code, so they are written here. Read through GitHub's API
on 2026-11-04.

| Setting | Value |
| --- | --- |
| Issues, Wiki, Projects, Discussions | Off |
| Pull requests | No merge commit. Squash and rebase allowed |
| Ruleset `main` | The default branch cannot be deleted or rewritten, by anyone |
| Ruleset `release tags` | Tags `v*` cannot be deleted, moved or rewritten, by anyone |
| Immutable releases | On, since a release's tarball gets pinned |
| Workflows | Read-only by default, and they cannot approve pull requests |
| Security | Secret scanning, push protection, private vulnerability reporting and Dependabot alerts on |

Pages is turned on once, as `docs/releasing.md` says.

Dependabot alerts work today on behaviour GitHub does not promise. Its documentation says its
dependency graph does not read a lockfile written as two YAML documents, pnpm 12's default with
a pinned version, and that alerts may close. Ours is written that way, and on 2026-11-05 the graph
listed 357 packages against 370 entries, with 2 alerts on `pnpm-lock.yaml`. So `audit.yml` also
looks every week.

## Why

- **A tarball,** because it needs no registry, and it can be pinned by address. **What it
  costs:** `dist/` is not in git, so a commit or a branch cannot be installed from GitHub, only
  a release or a tarball built locally.
- **An automatic release from the first one,** since each change becomes a version from milestone 4 on. A rehearsal
  at `v0.0.1` spends a number that does not matter on what can only run for real. **What it costs:** a workflow
  written before it could run, and a `v0.0.1` that stays on the list of releases forever.
- **The tarball the box tested,** so what an app installs is what passed. **What it costs:** one more step in `ci.yml`,
  and the two workflows now share an artifact's name.
- **The gallery with each release,** so the pieces can be seen from a link, with no clone and no Docker. **What it
  costs:** one more job, two more actions and one more place to fail, after the version is already out.
- **One import,** since using Moneta should take the dependency and one line, as Radix Themes does.
  **What it costs:** a class that is not in the ready-made sheet does not exist, so an app composing with
  classes needs the second way, and an app with another font carries the Geist unless it does too.
- **By path,** since there is no central file to keep with each new piece, and shadcn's files
  already import each other this way. **What it costs:** imports are longer, and a piece's path
  is part of the public API, so moving a file breaks whoever uses it.
- **The tested version as the floor of other peers,** since only that one is tested, and widening a
  range later breaks nobody. **What it costs:** an app on an older version gets a warning, or a
  refusal in npm, though the pieces may work there.
- **Exact helpers,** since two copies cost size and break nothing, and an app then receives what
  `package` tested. **What it costs:** an app with another version carries two copies, and a fix in
  them needs a release of Moneta.
- **Any React 19,** so an app need not update React because of Moneta. **What it costs:**
  `package` tests only the version in `devDependencies`, so the floor is a promise, measured
  once. A range refuses nothing either: outside it, pnpm only warns.
- **MIT,** since the library is generic, meant to be reused, holds no data, and its
  base is MIT. One license keeps the repository simple. **What it costs:** the
  rights given for a published version cannot be taken back, and anyone may reuse the
  theme and its look. The owner accepted that.

## Alternatives considered

- **Publish to a registry.** More to set up, and not needed yet. The roadmap weighs it
  again when a tarball stops being enough.
- **All rights reserved for our code, and MIT on shadcn's files.** It keeps the choice
  open, but protects little, and mixes two terms.
- **A parent component that imports the styles.** It would need rendering, and a component importing CSS
  fails in Node. It may come if something other than styles needs it, such as a router.
- **The first release by hand,** with `gh release create` on the tarball of `make package`. Less to write before it
  could run, but nothing ties the file to a commit, and the work comes back at the second release.
- **Building the tarball again in the release.** The release stands apart, but runs everything twice, and what is
  published is not the file that was tested.
- **A root entry.** Shorter imports, but one more file to keep, for every piece.
- **`^19.3.1`, only the version tested.** It would turn away earlier versions of React 19 with
  no reason today.
- **React 18 as well.** It passes today, with only a minimal `Button`, but every later piece
  would have to work on it.

## Not tested yet

All of `release.yml`, which runs only on the owner's push of a release commit. In particular: how GitHub draws the
skipped job of a reusable workflow, a run's artifact read across that call, creating a `v*` tag under its ruleset, a
failure halfway through `publish`, and Pages. `actionlint` found nothing on 2026-11-06.

## History

- 2026-11-04: Written, with the repository and its settings.
- 2026-11-05: Imports by path, and the first peer.
- 2026-11-05: What the alerts rest on.
- 2026-11-06: shadcn's notice, React Aria as a peer, and the helpers.
- 2026-11-06: The theme, the font and Tailwind as a peer.
- 2026-11-06: One import, with ready-made styles.
- 2026-11-06: An automatic release, of the tested tarball, with the gallery.
