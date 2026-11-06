import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { root } from "./sources.js";

const checks = /^CHECKS := (?<names>.+)$/mu;
const boxes = /^ +check: \[(?<names>.+)\]$/mu;
const separator = /[ ,]+/u;
const usesLine = /^\s+(?:- )?uses: (?<action>\S+)(?<rest>.*)$/gmu;
const pinned = /^[\w./-]+@[0-9a-f]{40}$/u;
const local = /^\.\//u;
const versionNote = /^ # v\d/u;
const jobHeading = /^ {2}(?<job>[\w-]+):$/gmu;
const writes = /^\s+[\w-]+: write$/mu;
const workflows = ["audit", "ci", "release"];
const uploadStep =
  /uses: actions\/upload-artifact@[\s\S]*?(?=\n\s*- name:|\n\n|$)/gu;
const hiddenPath = /^\s+path: \./mu;
const keepsHidden = /^\s+include-hidden-files: true$/mu;

async function namesIn(file: string, line: RegExp): Promise<string[]> {
  const text = await readFile(new URL(file, root), "utf8");
  const names = text.match(line)?.groups?.["names"];
  if (names === undefined) {
    throw new Error(`${file} has no line matching ${line}`);
  }
  return names.split(separator);
}

// The list is written twice, and a check missing from continuous integration turns nothing red.
it("has one box per check of make check, in its order", async () => {
  expect(await namesIn(".github/workflows/ci.yml", boxes)).toEqual(
    await namesIn("Makefile", checks),
  );
});

// A tag can move, and a commit cannot, so what a workflow runs stays what was read.
it.each(workflows)("pins each action of %s to a commit", async (name) => {
  const text = await readFile(
    new URL(`.github/workflows/${name}.yml`, root),
    "utf8",
  );
  const loose = [...text.matchAll(usesLine)]
    .map(({ groups }) => groups ?? {})
    .filter(({ action = "" }) => !local.test(action))
    .filter(
      ({ action = "", rest = "" }) =>
        !(pinned.test(action) && versionNote.test(rest)),
    )
    .map(({ action }) => action);

  expect(loose).toEqual([]);
});

// By default the action leaves out any folder starting with a dot, and stops the run or, set to ignore, says nothing.
it.each(workflows)("keeps a hidden folder that %s uploads", async (name) => {
  const text = await readFile(
    new URL(`.github/workflows/${name}.yml`, root),
    "utf8",
  );
  const lost = [...text.matchAll(uploadStep)]
    .map(([step]) => step)
    .filter((step) => hiddenPath.test(step) && !keepsHidden.test(step));

  expect(lost).toEqual([]);
});

// Publishing runs none of the project's code, and everything else runs with no right to write.
it("lets only the release's publish and pages write", async () => {
  const text = await readFile(
    new URL(".github/workflows/release.yml", root),
    "utf8",
  );
  const jobs = text.slice(text.indexOf("\njobs:\n"));
  const headings = [...jobs.matchAll(jobHeading)];
  const writing = headings
    .filter(({ index }, position) =>
      writes.test(jobs.slice(index, headings[position + 1]?.index)),
    )
    .map(({ groups }) => groups?.["job"]);

  expect(writing).toEqual(["publish", "pages"]);
});

// A release is only what every box passed, so its job has to wait for them.
it("releases from ci only after the checks, on a release commit", async () => {
  const text = await readFile(
    new URL(".github/workflows/ci.yml", root),
    "utf8",
  );
  const job = text.slice(text.indexOf("\n  release:\n"));

  expect(job).toContain("needs: check");
  expect(job).toContain(
    "startsWith(github.event.head_commit.message, 'chore: release v')",
  );
  expect(job).toContain("uses: ./.github/workflows/release.yml");
});

// What the next release moves into its own section, and check-release looks for.
it("has a changelog ready for the next version", async () => {
  const changelog = await readFile(new URL("CHANGELOG.md", root), "utf8");

  expect(changelog).toContain("## [Unreleased]");
});
