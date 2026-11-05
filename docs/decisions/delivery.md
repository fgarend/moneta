# Delivery

Where the library lives, how it is received, and under what terms.

## What holds today

- **The repository is `fgarend/moneta`, and it is public.**
- **The package is `@fgarend/moneta`, delivered by a release's tarball,** which the
  `package.json` of whoever uses it points to on GitHub. It is not published to a
  registry. A local link is left out until the daily work needs it.
- **Pieces are imported by path,** as `@fgarend/moneta/ui/button`. There is no root entry.
- **An app brings the peers.** Today that is `react`, at `^19.0.0`. A peer enters when the
  code in the package first imports it.
- **The license is MIT,** for everything in this repository.
- **Code copied from shadcn keeps its notice.** shadcn/ui is MIT, which asks that its
  copyright and permission notice stay with copies of its code. We add that notice in
  the commit of the first `shadcn add`.

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

The Pages site is set up with the workflow that publishes it.

## Why

- **A tarball,** because it needs no registry, and it can be pinned by address. **What it
  costs:** `dist/` is not in git, so a commit or a branch cannot be installed from GitHub, only
  a release or a tarball built locally.
- **By path,** since there is no central file to keep with each new piece, and shadcn's files
  already import each other this way. **What it costs:** imports are longer, and a piece's path
  is part of the public API, so moving a file breaks whoever uses it.
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
- **A root entry.** Shorter imports, but one more file to keep, for every piece.
- **`^19.3.1`, only the version tested.** It would turn away earlier versions of React 19 with
  no reason today.
- **React 18 as well.** It passes today, with only a minimal `Button`, but every later piece
  would have to work on it.

## Not tested yet

The workflows, a release's tarball and the Pages site from this repository. They run
only on the owner's push.

## History

- 2026-11-04: Written, with the repository and its settings.
- 2026-11-05: Imports by path, and the first peer.
