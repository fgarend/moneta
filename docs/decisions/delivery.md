# Delivery

Where the library lives, how it is received, and under what terms.

## What holds today

- **The repository is `fgarend/moneta`, and it is public.**
- **The package is `@fgarend/moneta`, delivered by a release's tarball,** which the
  `package.json` of whoever uses it points to on GitHub. It is not published to a
  registry. A local link is left out until the daily work needs it.
- **Every change reaches `main` through a pull request,** whose job `checks` passed, up to date with `main`. It enters
  with a merge commit titled as the pull request, over its own commits rebased onto `main`, so each pull request is one
  group in the history. `ci.yml` checks pull requests only, as `main` then holds only what one tested.
- **A release is automatic,** on each merge to `main` while `package.json` holds a version with no tag, as
  `docs/releasing.md` says: the release's pull request, or the fix of one that failed before publishing. It builds and
  tests the tarball it publishes, in the same run, and checks nothing else again. One release runs at a time.
- **A release's number follows from its changelog,** as `docs/releasing.md` says: the one after the changelog's
  previous section, on the last number for only fixes and on the middle one otherwise. A section with no change is
  refused. The first number does not move before 1.0.
- **Each release publishes the gallery,** on GitHub Pages, in a frame with Moneta's name and the theme's colours, light or
  dark as the system prefers, in the system's font. `.storybook/themes.ts` repeats the colours, and a test keeps them the
  theme's.
- **Pieces are imported by path,** as `@fgarend/moneta/ui/button`. There is no root entry.
- **The usual way is one import,** `import "@fgarend/moneta/styles.css";`, with ready-made styles and the
  font, as `README.md` shows. An app needs no Tailwind and no settings.
- **An app changes the look by redefining the theme's variables,** after the import and outside any `@layer`, and
  again under `.dark`, measured on 2026-11-06. Before the import, or in a layer, nothing happens, and with `:root`
  alone the light value also holds in dark. The font is `--font`, as Tailwind writes
  `--font-sans` in place, and an app that changes it loads its own.
- **An app that still writes Tailwind's classes** uses `@import "tailwindcss";` and then
  `@import "@fgarend/moneta/theme.css";`. Without Tailwind first, the build passes and no class arrives.
  `@fgarend/moneta/fonts.css` is optional there. The theme also sets the page's border colour, background, text
  colour and font, and the dark mode through a `.dark` class, as shadcn's does.
- **An app installs the peers by name,** in the one command `README.md` gives, since on 2026-11-06 only npm put them
  in the app's `node_modules`, and pnpm, yarn 1 and yarn 4 did not. A second copy would silently lose shared state: `react` and
  `react-dom` at `^19.0.0`, `react-aria-components` at `^1.22.1`, `lucide-react` at `^1.65.0`, and `tailwindcss` at `^4.3.3`, optional, for the second way. A peer enters when the code in
  the package first imports it, with the version installed then as its floor.
- **Helpers come with the package, at exact versions:** `cn`, `class-variance-authority`,
  `tw-animate-css`, and the font, `@fontsource-variable/geist`, under OFL-1.1, whose license an app
  that publishes the font's files keeps with them.
- **The license is MIT,** for everything in this repository.
- **Code copied from shadcn keeps its notice.** shadcn/ui is MIT, which asks that its
  copyright and permission notice stay with copies of its code. `LICENSE` holds its copyright
  line beside ours, under the same permission text, and is always packed.
- **`docs/guidelines.md` goes in the package,** beside the README, and links only to the web.

### GitHub settings

They cannot be read from the code, so they are written here. Read through GitHub's API
on 2026-11-04.

| Setting | Value |
| --- | --- |
| Issues, Wiki, Projects, Discussions | Off |
| Pull requests | Merge commit only, titled as the pull request. A branch can be updated by rebase |
| Ruleset `main` | The default branch cannot be deleted or rewritten, and takes changes only through a pull request whose `checks` passed, up to date with it, by anyone |
| Ruleset `release tags` | Tags `v*` cannot be deleted, moved or rewritten, by anyone |
| Immutable releases | On, since a release's tarball gets pinned |
| Workflows | Read-only by default, and they cannot approve pull requests |
| Security | Secret scanning, push protection, private vulnerability reporting and Dependabot alerts on |
| Pages | From GitHub Actions, and only `main` may publish, at `https://fgarend.github.io/moneta/` |

Dependabot alerts work today on behaviour GitHub does not promise. Its documentation says its
dependency graph does not read a lockfile written as two YAML documents, pnpm 12's default with
a pinned version, and that alerts may close. Ours is written that way, and on 2026-11-05 the graph
listed 357 packages against 370 entries, with 2 alerts on `pnpm-lock.yaml`. So `audit.yml` also
looks every week.

## Why

- **The guidelines in the package,** so whoever uses Moneta, or an agent working for them, reads them in
  `node_modules` with no network, and the copy is the one for the version installed. **What it costs:** a rule changed there
  reaches an app, so it takes a line in the changelog.
- **A tarball,** because it needs no registry, and it can be pinned by address. **What it
  costs:** `dist/` is not in git, so a commit or a branch cannot be installed from GitHub, only
  a release or a tarball built locally.
- **An automatic release from the first one,** since each change becomes a version from milestone 4 on. A rehearsal
  at `v0.0.1` spends a number that does not matter on what can only run for real. **What it costs:** a workflow
  written before it could run, and a `v0.0.1` that stays on the list of releases forever.
- **The number checked against the changelog,** so a number too small, too large or out of order is refused before it
  is spent, and the changelog must say what each step holds. The previous version is the changelog's previous section,
  so the check needs no tags and runs the same on the machine. **What it costs:** a rule of our own to keep, which
  6.2 changes with 1.0, and the check trusts that section, while the tags are only checked for the new number.
- **Pull requests to `main`,** so `main` never holds what failed, each check runs once, and a session's work never
  leaves with another's. Vite and Vitest check pull requests and publish on the merge of a release commit, as here.
  **What it costs:** a branch, a pull request and a wait for each step, and two pull requests open together often
  conflict in the roadmap and the changelog, so one is updated and checked again.
- **One job that the rule requires,** so renaming or adding a box never leaves a pull request waiting. It always runs,
  as GitHub counts a skipped job as passed. **What it costs:** one more job, a few seconds long.
- **Merge commits over rebased commits,** so each pull request is one group, `git log --first-parent` lists one line
  per pull request, and its own commits stay as the user approved them. **What it costs:** one more commit per pull
  request, and a branch updated by merge rather than rebase would cross the history, which no rule refuses.
- **A release on a version with no tag,** so one rule says whether a pull request and a merge release, and trying
  again after a fix is that fix's merge, with no second release commit and no command. `check-release` refuses a
  release while `Unreleased` lists anything, so what reaches an app cannot slip in unlisted. **What it costs:** the
  rule is not written in the history, and a release left failed is tried by each merge after it, red until it is fixed.
- **The tarball built and tested in the release,** so what an app installs is what was tested, in the same run, with no
  file taken from another run. **What it costs:** `make package` runs twice per version, in the pull request and here.
- **The gallery with each release,** so the pieces can be seen from a link, with no clone and no Docker. **What it
  costs:** one more job, two more actions and one more place to fail, after the version is already out.
- **One import,** since using Moneta should take the dependency and one line, as Radix Themes does.
  **What it costs:** a class that is not in the ready-made sheet does not exist, so an app composing with
  classes needs the second way, and an app with another font carries the Geist unless it does too. Its reset
  also reaches the whole page, so an app's own `h1` loses its size and weight.
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
- **Moneta's look on the gallery's frame,** as it is Moneta's public face. **What it costs:** the colours are written
  twice, the browser's tab still reads Storybook, which its code fixes, and in dark the accent is the field's edge, as
  Storybook writes white on it, and the light graphite gave 1.65:1.

## Alternatives considered

- **Storybook's own look on the gallery.** No code, but it reads as any Storybook.
- **The frame in light only.** Half the code, but a system in dark gets a light frame, which Storybook's own does not do.
- **Geist in the frame.** One font with the stories, but the frame does not load Moneta's fonts, and the colours carry
  the identity.
- **Gold as the frame's accent.** The theme's mark, but Storybook writes white on it, at 1.7:1.
- **The guidelines only on GitHub.** Nothing more to pack, but the page shows `main`'s rules, not the installed version's.
- **Publish to a registry.** More to set up, and not needed yet. The roadmap weighs it
  again when a tarball stops being enough.
- **All rights reserved for our code, and MIT on shadcn's files.** It keeps the choice
  open, but protects little, and mixes two terms.
- **A parent component that imports the styles.** It would need rendering, and a component importing CSS
  fails in Node. It may come if something other than styles needs it, such as a router.
- **The first release by hand,** with `gh release create` on the tarball of `make package`. Less to write before it
  could run, but nothing ties the file to a commit, and the work comes back at the second release.
- **Pushing straight to `main`,** checked after, as until 2026-11-09. Fewer steps, but `main` turned red, a retry ran
  every check again, and twice another session's commit left with a push.
- **Squash, or rebase with no merge commit.** Squash makes each pull request one commit, so an update and its step
  would need two pull requests. Rebase alone keeps the commits but loses the groups.
- **`ci.yml` on `main` too,** as a net if a merge went wrong. It would run every check twice.
- **The release apart from the checks, and only by hand,** proposed the same day. It ran nothing twice, but needed the
  result and the tarball of another run, and one more command per version.
- **The tarball the pull request's run kept.** No second `make package`, but the release must find that run, read its
  artifacts with more permissions, and the file expires.
- **A release tried again by hand,** with `gh workflow run`, used once, for `v0.2.0`. It ran every check again.
- **A second, empty release commit,** as `v0.0.1` was tried again. Nothing to add to the workflows, but two commits of
  the same name confuse the history.
- **Releasing whenever `package.json` holds a version with no tag.** Any push tries again on its own, but the rule is
  hidden, and a push after a failure would publish what the changelog does not list.
- **The previous version from the last tag.** The real source, but it needs the tags fetched in continuous
  integration and git in the container, and differs from the changelog only on a section never released.
- **Only a step too small refused,** leaving a release of only fixes free to move the middle number. Looser, and it
  misses the error the other way.
- **Security apart from fixes,** on the middle number. It would oversize a release that only closes a hole.
- **Re-running the failed jobs.** No commit and no new trigger, but the run checks out the old commit and its old
  workflows, so a fix never reaches it.
- **Building the tarball again in the release.** The release stands apart, but runs everything twice, and what is
  published is not the file that was tested.
- **A root entry.** Shorter imports, but one more file to keep, for every piece.
- **`^19.3.1`, only the version tested.** It would turn away earlier versions of React 19 with
  no reason today.
- **React 18 as well.** It passes today, with only a minimal `Button`, but every later piece
  would have to work on it.

## Not tested yet

`v0.0.1` ran the whole path on 2026-11-06: the tag, the immutable release, its tarball installed from its address and
imported in Node, and the gallery on Pages. `v0.1.0` ran it again the same day. `v0.2.0` was the first tried again by
hand, on 2026-11-09, after its checks failed. Still not tested: a release on a merge to `main`, a failure halfway
through `publish`, a pull request cancelling an earlier run, and an app drawing a piece from a release's tarball.

## History

- 2026-11-04: Written, with the repository and its settings.
- 2026-11-05: Imports by path, and the first peer.
- 2026-11-05: What the alerts rest on.
- 2026-11-06: shadcn's notice, React Aria as a peer, and the helpers.
- 2026-11-06: The theme, the font and Tailwind as a peer.
- 2026-11-06: One import, with ready-made styles.
- 2026-11-06: An automatic release, of the tested tarball, with the gallery.
- 2026-11-06: The rehearsal, `v0.0.1`.
- 2026-11-06: The peers by name, and how far changing the look reaches.
- 2026-11-06: The font as a variable.
- 2026-11-08: The guidelines in the package.
- 2026-11-08: Moneta's look on the gallery's frame.
- 2026-11-09: A release tried again by hand.
- 2026-11-09: The number checked against the changelog.
- 2026-11-09: Pull requests to `main`, and a release on each merge of a version with no tag.
