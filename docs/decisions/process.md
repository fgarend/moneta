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
- **Every `shadcn add` is committed untouched and tagged,** so that commit is the merge
  base for updates, and `git log` is the list of our edits.
- **The pipeline arrives in one step, by groups,** carried from what already works
  rather than decided tool by tool. Each group is one commit, and is run for real, as
  far as it reaches: planted failures, a minimal `Button` once there is code, and its
  story once there are stories. What is carried loses its old names and its citations
  of earlier decisions. A group's review shows: the unchanged files as a list, the
  edited ones as a diff against their origin, what stayed behind with its reason, and
  the commands' results.
- **The release's part of the pipeline waits until just before its first use,** the one
  exception to arriving in one step. A tag cannot be deleted, so it could only run for real by
  spending a version, and there is nothing to release before then. **What it costs:** the
  pipeline is incomplete until then, and its design waits in the roadmap.

## Why

Immutable records, one per decision, grow too fast, and spread the answer to "what
holds today?" across all of them. Files by topic answer it directly, and git keeps the
rest.

## Alternatives considered

- **One immutable record per decision.** It grows too fast.
- **A single file.** It would grow without a shape, and mix unrelated topics.
- **Deciding the pipeline tool by tool.** It would spend time on tools that have no
  opinion about the base.
- **The release's part with the rest of the pipeline.** Complete sooner, but written months
  before it could run.

## History

- 2026-11-04: Written, with the repository.
- 2026-11-04: The list of files moved to `README.md`, the index of this folder.
- 2026-11-05: The release's part waits until just before its first use.
