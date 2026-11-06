# Process

How decisions are kept, and how the work moves.

## What holds today

### Decisions

- **Only three things get in:** what deviates from shadcn, what is costly to reverse,
  and what cannot be read from the code. The rest is in the code and its history.
- **Files by topic, stating what holds today,** listed in `README.md`, each born when
  first needed. A file is edited in place when a choice changes, and says why, with the
  alternatives that were weighed when they matter.
- **Each file ends with a `History`:** one sentence per change. Past 10 lines it is
  condensed, and points to the file's older versions in git.

### Steps

- **One family of pieces is one roadmap item.** It may take several commits.
- **A release comes when something needs one,** not per component.
- **Moneta is the source of truth for components.** An app consumes final pieces, builds its screens and
  regions from them, and writes no class of its own in the end. What it lacks is added here. **What it
  costs:** own pieces shadcn does not have, such as layout and text, and less freedom in a screen.
- **First in use, then refined.** Moneta starts as shadcn untouched, as a package, and the look and
  the review of each piece arrive version by version.
- **A shadcn piece is raw until reviewed,** and listed with its known gaps. 1.0 needs every piece
  reviewed. **What it costs:** until then, the repository is public and a raw piece can be used,
  so the list warns and does not stop anyone.
- **Every `shadcn add` leaves its files untouched, in a commit under a fixed message,** `chore(shadcn): add …`,
  with the CLI's version and the style in its body. It may hold several pieces, and what they need to work.
  So that commit is the merge base for updates, and `git log` is the list of our edits. A file's last import is
  the last commit under that message to touch it.
- **The pipeline arrives in one step, by groups,** carried from what already works
  rather than decided tool by tool. Each group is one commit, and is run for real, as
  far as it reaches: planted failures, a minimal `Button` once there is code, and its
  story once there are stories. What is carried loses its old names and its citations
  of earlier decisions. A group's review shows: the unchanged files as a list, the
  edited ones as a diff against their origin, what stayed behind with its reason, and
  the commands' results.
- **The release's part of the pipeline waited until just before its first use,** the one
  exception to arriving in one step. A tag cannot be deleted, so it could only run for real by
  spending a version, and there was nothing to release before then.

## Why

Immutable records, one per decision, grow too fast, and spread the answer to "what
holds today?" across all of them. Files by topic answer it directly, and git keeps the
rest.

## Alternatives considered

- **One immutable record per decision.** It grows too fast.
- **A single file.** It would grow without a shape, and mix unrelated topics.
- **Deciding the pipeline tool by tool.** It would spend time on tools that have no
  opinion about the base.
- **An app with Tailwind for good.** It is what shadcn expects, and it needs no pieces of layout, but each
  screen decides its own spacing and colour.
- **The look before the first use.** The piece is finished sooner, but what fails is found last.
- **Reviewing the pieces an app needs before the first release.** Safer, but it delays first use
  by a theme, stories and edits per piece.
- **A tag per `shadcn add`.** A tag named after a piece does not find the files that came with it.
- **The release's part with the rest of the pipeline.** Complete sooner, but written months
  before it could run.

## History

- 2026-11-04: Written, with the repository.
- 2026-11-04: The list of files moved to `README.md`, the index of this folder.
- 2026-11-05: The release's part waits until just before its first use.
- 2026-11-06: Moneta as the source of truth for components.
- 2026-11-06: First in use, then refined. Raw pieces, and a fixed message in place of tags.
- 2026-11-06: The release's part arrived.
- 2026-11-06: An import may hold several pieces, as the second one did.
