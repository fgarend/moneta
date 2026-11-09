// Checks that the repository is ready to release its version: package.json holds a version X.Y.Z, the changelog has its
// dated section and link, with at least one change, and nothing is left under Unreleased. The version is the one after
// the changelog's previous section: the last number when the section lists only fixes, and the middle one otherwise, as
// docs/releasing.md says before 1.0. Run by make check-release, before pushing a release
// commit, and by ci.yml's version job, which passes the version scripts/pending-version.sh reads as the argument.
import { readFile } from "node:fs/promises";
import process from "node:process";

const version = /^\d+\.\d+\.\d+$/u;
const unreleasedHeading = "## [Unreleased]";
const nextHeading = /^## \[/mu;
const changeLine = /^(?:###|-)/mu;
const entry = /^- /mu;
const kindHeading = "### ";
const releasedHeading = /^## \[(\d+\.\d+\.\d+)\]/mu;
// What a security notice closes is a fix too.
const fixes = new Set(["Fixed", "Security"]);

function escaped(text: string): string {
  return text.replaceAll(".", "\\.");
}

// The section a heading starts, up to the next one, and the version of the release before it, if any.
function sectionOf(
  changelog: string,
  at: number,
): { body: string; previous: string | undefined } {
  const after = changelog.slice(at);
  const next = after.slice(1).search(nextHeading);
  const body = next === -1 ? after : after.slice(0, next + 1);
  return {
    body,
    previous: after.slice(body.length).match(releasedHeading)?.[1],
  };
}

// What keeps the section from releasing this version: no change, or a version other than the one after the previous.
function checkSection(
  current: string,
  body: string,
  previous?: string,
): string[] {
  if (!entry.test(body)) {
    return [`CHANGELOG.md lists no change under ## [${current}]`];
  }
  if (previous === undefined) {
    return [];
  }
  const onlyFixes = body
    .split("\n")
    .filter((line) => line.startsWith(kindHeading))
    .every((line) => fixes.has(line.slice(kindHeading.length)));
  const [major, minor, patch] = previous.split(".");
  const next = onlyFixes
    ? `${major}.${minor}.${Number(patch) + 1}`
    : `${major}.${Number(minor) + 1}.0`;
  if (current === next) {
    return [];
  }
  const lists = onlyFixes ? "only fixes" : "more than fixes";
  return [
    `${current} should be ${next}, the version after ${previous} whose section lists ${lists}`,
  ];
}

// What keeps the package's version from being released, if anything.
function checkRelease(
  current: string,
  changelog: string,
  asked: string | undefined,
): string[] {
  if (!version.test(current)) {
    return [`${current} is not a version X.Y.Z`];
  }
  const problems: string[] = [];
  if (asked !== undefined && asked !== current) {
    problems.push(`package.json is at ${current}, not ${asked}`);
  }
  const section = new RegExp(
    `^## \\[${escaped(current)}\\] - \\d{4}-\\d{2}-\\d{2}$`,
    "mu",
  );
  const link = new RegExp(`^\\[${escaped(current)}\\]: \\S+$`, "mu");
  const sectionAt = changelog.search(section);
  const unreleasedAt = changelog.indexOf(unreleasedHeading);
  if (sectionAt === -1) {
    problems.push(`CHANGELOG.md has no section ## [${current}] - YYYY-MM-DD`);
  } else {
    const { body, previous } = sectionOf(changelog, sectionAt);
    problems.push(...checkSection(current, body, previous));
  }
  if (!link.test(changelog)) {
    problems.push(`CHANGELOG.md has no link [${current}]: …`);
  }
  if (unreleasedAt === -1 || (sectionAt !== -1 && unreleasedAt > sectionAt)) {
    problems.push(
      `CHANGELOG.md has no ${unreleasedHeading} above ## [${current}]`,
    );
  } else {
    const after = changelog.slice(unreleasedAt + unreleasedHeading.length);
    const next = after.search(nextHeading);
    const pending = next === -1 ? after : after.slice(0, next);
    if (changeLine.test(pending)) {
      problems.push(
        `CHANGELOG.md still lists changes under ${unreleasedHeading}`,
      );
    }
  }
  return problems;
}

/* istanbul ignore start -- @preserve: what runs from the command line, which make check-release and the release run. */
async function main(): Promise<void> {
  const manifest: unknown = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const current =
    typeof manifest === "object" &&
    manifest !== null &&
    "version" in manifest &&
    typeof manifest.version === "string"
      ? manifest.version
      : "";
  const changelog = await readFile(
    new URL("../CHANGELOG.md", import.meta.url),
    "utf8",
  );
  const [asked] = process.argv.slice(2);
  const problems = checkRelease(current, changelog, asked);
  for (const problem of problems) {
    console.error(problem);
  }
  process.exitCode = problems.length > 0 ? 1 : 0;
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

/* istanbul ignore stop -- @preserve */

export { checkRelease };
