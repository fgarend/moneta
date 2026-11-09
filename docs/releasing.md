# Releasing

How a version is released. An app installs the tarball on the release's page, so the tag and that file are the release.
Continuous integration creates them, never a person, and GitHub then refuses to move or delete them.

## Steps

1. **Write the release.** Choose the number by the rules below, from what `Unreleased` lists in `CHANGELOG.md`. Move
   those entries to a new `## [X.Y.Z] - YYYY-MM-DD` section, with its link at the end, and move `version` in
   `package.json` to the same number.
2. **Compare with the previous release,** so the changelog tells every change an app receives, in what the
   package holds: `git diff vA.B.C -- src package.json docs/guidelines.md README.md LICENSE`. In `package.json`, an
   app receives `dependencies`, `peerDependencies` and `exports`, not `devDependencies`. The first release has no
   previous tag.
3. **Check and open the pull request.** `make check` and `make check-release` pass. Commit only the changelog and the
   version, as `chore: release vX.Y.Z`, on a branch of its own, and open its pull request under the same title. Its
   `version` job runs `make check-release`, as `package.json` holds a version with no tag.
4. **Merge it.** `release.yml` runs on every merge to `main`, and goes on only while the version has no tag:
   - `pending` reads the version, and stops the run once it has a tag.
   - `build` runs the audit, builds and tests the tarball with `make package`, builds the gallery and writes the notes
     from the changelog. Nothing else is checked again, as the pull request was.
   - `publish` creates the tag and the release, with that tarball.
   - `pages` publishes the gallery at `https://fgarend.github.io/moneta/`, replacing the previous one.
5. **An app moves to the release,** in its own repository, when it wants, by the file on its page:
   `https://github.com/fgarend/moneta/releases/download/vX.Y.Z/fgarend-moneta-X.Y.Z.tgz`

`gh release verify vX.Y.Z` says whether a release is immutable, and `gh release verify-asset vX.Y.Z <file>` whether a
file is the one published.

## The number

The numbers follow [Semantic Versioning 2.0.0](https://semver.org/). Before 1.0, it lets anything change at any time, so
these are Moneta's rules for that phase:

- **The middle number:** anything an app may have to adapt to, marked **Breaking:** in the changelog with its upgrade
  steps, and anything new, including a new look.
- **The last number:** only a fix, under **Fixed** or **Security**.
- **The first number:** `1.0.0`, once, when the roadmap's milestone 6 says, which also sets the rules after it.

`make check-release` holds the changelog to them: the version is the one after the previous section, one step on the
last number when the new section lists only fixes, and on the middle one otherwise. It cannot tell whether the
changelog lists every change, or files a change under the right heading. That is step 2's, and a person's.

## When a release run fails

- **Before `publish`:** nothing was spent, and the version stays free. A failure that passes on its own, as a network
  error, takes a re-run of the failed jobs. One that needs a fix takes a pull request, whose merge releases the version
  again, as it still has no tag.
- **In `publish`:** with no tag, re-run the failed jobs of the run, and delete the draft left behind on the releases page.
- **In `pages`:** the release is out. Re-run the failed job, within a day, while the gallery's artifact lasts. After
  that, the next release publishes the gallery.

## A release that breaks by mistake

A new version undoes the break, as soon as possible. The broken version stays, marked `[YANKED]` in its changelog
heading, so an app skips it. A change that was wanted comes back later, with its upgrade steps.

## Once: turning Pages on

Pages takes its site from GitHub Actions, a setting of the repository that a workflow cannot change, so the owner runs
this once, before the first release:

```sh
gh api -X POST repos/fgarend/moneta/pages -f build_type=workflow
```
