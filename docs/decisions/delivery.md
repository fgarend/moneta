# Delivery

Where the library lives, how it is received, and under what terms.

## What holds today

- **The repository is `fgarend/moneta`, and it is public.**
- **The package is `@fgarend/moneta`, delivered by a release's tarball,** which the
  `package.json` of whoever uses it points to on GitHub. It is not published to a
  registry. A local link is left out until the daily work needs it.
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

- **A tarball,** because it needs no registry, and it can be pinned by address.
- **MIT,** since the library is generic, meant to be reused, holds no data, and its
  base is MIT. One license keeps the repository simple. **What it costs:** the
  rights given for a published version cannot be taken back, and anyone may reuse the
  theme and its look. The owner accepted that.

## Alternatives considered

- **Publish to a registry.** More to set up, and not needed yet. The roadmap weighs it
  again when a tarball stops being enough.
- **All rights reserved for our code, and MIT on shadcn's files.** It keeps the choice
  open, but protects little, and mixes two terms.

## Not tested yet

The workflows, a release's tarball and the Pages site from this repository. They run
only on the owner's push.

## History

- 2026-11-04: Written, with the repository and its settings.
