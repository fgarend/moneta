import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { everyBrowser } from "../vitest.config.js";
import { root } from "./sources.js";

const checks = /^CHECKS := (?<names>.+)$/mu;
const boxes = /^ +check: \[(?<names>.+)\]$/mu;
const browsers = /^ +browser: \[(?<names>.+)\]$/mu;
const byBrowser = /^ +run: make stories BROWSER=\$\{\{ matrix\.browser \}\}$/mu;
const attachmentsByBrowser =
  /^ +name: vitest-attachments-\$\{\{ matrix\.browser \}\}$/mu;
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
const trigger = /^ {2}[\w-]+:$/gmu;
const alwaysRuns = /^ {4}if: \$\{\{ always\(\) \}\}$/mu;

async function namesIn(file: string, line: RegExp): Promise<string[]> {
  const text = await readFile(new URL(file, root), "utf8");
  const names = text.match(line)?.groups?.["names"];
  if (names === undefined) {
    throw new Error(`${file} has no line matching ${line}`);
  }
  return names.split(separator);
}

// The list is written twice, and a check missing from continuous integration turns nothing red. stories has a job of
// its own.
it("has one box per check of make check, in its order", async () => {
  expect(await namesIn(".github/workflows/ci.yml", boxes)).toEqual(
    (await namesIn("Makefile", checks)).filter((name) => name !== "stories"),
  );
});

// One box per browser, so a red box names its browser, and the same command repeats it on the machine.
it("has one stories box per browser the stories run in", async () => {
  const ci = await readFile(new URL(".github/workflows/ci.yml", root), "utf8");
  const job = ci.slice(ci.indexOf("\n  stories:\n"));

  expect(await namesIn(".github/workflows/ci.yml", browsers)).toEqual(
    everyBrowser,
  );
  expect(job).toMatch(byBrowser);
  // An artifact's name is one per run, so each box keeps its screenshots under a name of its own.
  expect(job).toMatch(attachmentsByBrowser);
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

// main takes only what a pull request tested, so the checks run on pull requests, and once.
it("checks pull requests only", async () => {
  const ci = await readFile(new URL(".github/workflows/ci.yml", root), "utf8");
  const triggers = ci.slice(
    ci.indexOf("\non:\n"),
    ci.indexOf("\npermissions:"),
  );

  expect(triggers.match(trigger)?.map((line) => line.trim())).toEqual([
    "pull_request:",
  ]);
});

// main's rule requires this one job, so a box renamed or added never leaves a pull request waiting, and a box skipped
// or cancelled, which GitHub would count as passed, fails it.
it("ends in one job that passes only when every other job passed", async () => {
  const ci = await readFile(new URL(".github/workflows/ci.yml", root), "utf8");
  const jobs = ci.slice(ci.indexOf("\njobs:\n"));
  const names = [...jobs.matchAll(jobHeading)].map(
    ({ groups }) => groups?.["job"],
  );
  const last = jobs.slice(jobs.indexOf("\n  checks:\n"));

  expect(names.at(-1)).toBe("checks");
  expect(last).toContain(`needs: [${names.slice(0, -1).join(", ")}]`);
  expect(last).toMatch(alwaysRuns);
  expect(last).toContain("join(needs.*.result, ' ')");
});

// The gallery is published with each release, so a pull request that breaks its build shows it before it merges.
it("builds the gallery in make check, and so in every pull request", async () => {
  expect(await namesIn("Makefile", checks)).toContain("storybook-build");
});

// A pull request that releases a version shows a wrong number or changelog before it merges.
it("checks a pending release's number and changelog in its pull request", async () => {
  const ci = await readFile(new URL(".github/workflows/ci.yml", root), "utf8");

  expect(ci).toContain("scripts/pending-version.sh");
  expect(ci).toContain("make check-release");
});

// A merge to main publishes the version package.json holds when it has no tag yet: the release's pull request, or the
// fix of one that failed. One at a time, so two merges never publish the same version.
it("releases on a merge to main, one at a time, without checking again", async () => {
  const release = await readFile(
    new URL(".github/workflows/release.yml", root),
    "utf8",
  );
  const triggers = release.slice(
    release.indexOf("\non:\n"),
    release.indexOf("\npermissions:"),
  );

  expect(triggers.match(trigger)?.map((line) => line.trim())).toEqual([
    "push:",
  ]);
  expect(triggers).toContain("branches: [main]");
  expect(release).toContain("scripts/pending-version.sh");
  expect(release).toContain("cancel-in-progress: false");
  expect(release).toContain("make package");
  expect(release).toContain("make audit");
  expect(release).not.toContain("make check-release");
});

// What the next release moves into its own section, and check-release looks for.
it("has a changelog ready for the next version", async () => {
  const changelog = await readFile(new URL("CHANGELOG.md", root), "utf8");

  expect(changelog).toContain("## [Unreleased]");
});
