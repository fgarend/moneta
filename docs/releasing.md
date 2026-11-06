# Releasing

How a version is released. An app installs the tarball on the release's page, so the tag and that file are the release.
Continuous integration creates them, never a person, and GitHub then refuses to move or delete them.

## Steps

1. **Write the release.** Choose the number by the rules below, from what `Unreleased` lists in `CHANGELOG.md`. Move
   those entries to a new `## [X.Y.Z] - YYYY-MM-DD` section, with its link at the end, and move `version` in
   `package.json` to the same number.
2. **Compare with the previous release,** so the changelog tells every change an app receives:
   `git diff vA.B.C -- src`. The first release has no previous tag.
3. **Check and push.** `make check` and `make check-release` pass. Commit only the changelog and the version, as
   `chore: release vX.Y.Z`, and push. Nothing else is run by hand.
4. **Continuous integration releases it.** Once every box has passed, `ci.yml` calls `release.yml`, in the same run:
   - `verify` refuses a version with no X.Y.Z form, with a tag already, different from `package.json`, or with no
     changelog ready, and runs the audit.
   - `build` builds the gallery and writes the notes from the changelog.
   - `publish` creates the tag and the release, with the tarball the `package` box tested.
   - `pages` publishes the gallery at `https://fgarend.github.io/moneta/`, replacing the previous one.
5. **An app moves to the release,** in its own repository, when it wants, by the file on its page:
   `https://github.com/fgarend/moneta/releases/download/vX.Y.Z/fgarend-moneta-X.Y.Z.tgz`

`gh release verify vX.Y.Z` says whether a release is immutable, and `gh release verify-asset vX.Y.Z <file>` whether a
file is the one published.

## The number

The numbers follow [Semantic Versioning 2.0.0](https://semver.org/). Before 1.0, it lets anything change at any time, so
these are Moneta's rules for that phase, which the pipeline cannot check:

- **The middle number:** anything an app may have to adapt to, marked **Breaking:** in the changelog with its upgrade
  steps, and anything new, including a new look.
- **The last number:** only a fix.
- **The first number:** `1.0.0`, once, when the roadmap's milestone 6 says.

## When a release run fails

- **Before `publish`:** nothing was spent. Fix it in a new commit, whose message is again `chore: release vX.Y.Z`.
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
