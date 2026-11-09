import { describe, expect, it } from "vitest";
import { checkRelease } from "./check-release.js";

// A fictitious changelog, in Keep a Changelog's format.
const changelog = `# Changelog

## [Unreleased]

## [0.3.0] - 2030-06-01

### Added

- A fictional thing.

## [0.2.0] - 2030-05-01

### Changed

- **Breaking:** another fictional thing.

[Unreleased]: https://example.com/compare/v0.3.0...HEAD
[0.3.0]: https://example.com/tree/v0.3.0
[0.2.0]: https://example.com/tree/v0.2.0
`;

// The fictitious changelog, with the section of 0.3.0 replaced by one of the version given, holding the text given.
function withSection(version: string, text: string): string {
  return changelog
    .replace(
      "## [0.3.0] - 2030-06-01\n\n### Added\n\n- A fictional thing.",
      `## [${version}] - 2030-06-01\n\n${text}`,
    )
    .replace("[0.3.0]: ", `[${version}]: `);
}

describe("checkRelease", () => {
  it("passes a version whose changelog section is dated and linked", () => {
    expect(checkRelease("0.3.0", changelog, undefined)).toEqual([]);
  });

  it("passes when the version asked for is the package's", () => {
    expect(checkRelease("0.3.0", changelog, "0.3.0")).toEqual([]);
  });

  it("fails when the version asked for is not the package's", () => {
    expect(checkRelease("0.3.0", changelog, "0.4.0")).toEqual([
      "package.json is at 0.3.0, not 0.4.0",
    ]);
  });

  it("fails on a version that is not X.Y.Z", () => {
    expect(checkRelease("0.3", changelog, undefined)).toEqual([
      "0.3 is not a version X.Y.Z",
    ]);
  });

  it("fails when the changelog has no section for the version", () => {
    expect(checkRelease("0.4.0", changelog, undefined)).toEqual([
      "CHANGELOG.md has no section ## [0.4.0] - YYYY-MM-DD",
      "CHANGELOG.md has no link [0.4.0]: …",
    ]);
  });

  it("fails on a first release with only Unreleased in the changelog", () => {
    expect(checkRelease("0.3.0", "## [Unreleased]\n", undefined)).toEqual([
      "CHANGELOG.md has no section ## [0.3.0] - YYYY-MM-DD",
      "CHANGELOG.md has no link [0.3.0]: …",
    ]);
  });

  it("fails on a section with no date", () => {
    const undated = changelog.replace("## [0.3.0] - 2030-06-01", "## [0.3.0]");

    expect(checkRelease("0.3.0", undated, undefined)).toEqual([
      "CHANGELOG.md has no section ## [0.3.0] - YYYY-MM-DD",
    ]);
  });

  it("fails when Unreleased is missing above the release", () => {
    const noUnreleased = changelog.replace("## [Unreleased]\n\n", "");

    expect(checkRelease("0.3.0", noUnreleased, undefined)).toEqual([
      "CHANGELOG.md has no ## [Unreleased] above ## [0.3.0]",
    ]);
  });

  it("fails while Unreleased still lists changes", () => {
    const pending = changelog.replace(
      "## [Unreleased]\n",
      "## [Unreleased]\n\n### Fixed\n\n- A fictional fix.\n",
    );

    expect(checkRelease("0.3.0", pending, undefined)).toEqual([
      "CHANGELOG.md still lists changes under ## [Unreleased]",
    ]);
  });

  it("passes the first release, with no section before it", () => {
    const first = changelog.slice(0, changelog.indexOf("## [0.2.0]"));

    expect(checkRelease("0.3.0", `${first}[0.3.0]: x\n`, undefined)).toEqual(
      [],
    );
  });

  it("passes a section of only fixes on the next last number", () => {
    const fixes = withSection("0.2.1", "### Fixed\n\n- A fictional fix.");

    expect(checkRelease("0.2.1", fixes, undefined)).toEqual([]);
  });

  it("counts a security fix as a fix", () => {
    const security = withSection(
      "0.2.1",
      "### Fixed\n\n- A fictional fix.\n\n### Security\n\n- A fictional hole closed.",
    );

    expect(checkRelease("0.2.1", security, undefined)).toEqual([]);
  });

  it("fails on a section of only fixes on the middle number", () => {
    const fixes = withSection("0.3.0", "### Fixed\n\n- A fictional fix.");

    expect(checkRelease("0.3.0", fixes, undefined)).toEqual([
      "0.3.0 should be 0.2.1, the version after 0.2.0 whose section lists only fixes",
    ]);
  });

  it("fails on more than fixes on the last number", () => {
    const added = withSection("0.2.1", "### Added\n\n- A fictional thing.");

    expect(checkRelease("0.2.1", added, undefined)).toEqual([
      "0.2.1 should be 0.3.0, the version after 0.2.0 whose section lists more than fixes",
    ]);
  });

  it.each(["0.1.9", "0.2.0", "0.5.0", "1.0.0"])(
    "fails on %s, which is not the next version after 0.2.0",
    (version) => {
      const added = withSection(version, "### Added\n\n- A fictional thing.");

      expect(checkRelease(version, added, undefined)).toEqual([
        `${version} should be 0.3.0, the version after 0.2.0 whose section lists more than fixes`,
      ]);
    },
  );

  it("fails on a section with no change", () => {
    const empty = withSection("0.3.0", "");

    expect(checkRelease("0.3.0", empty, undefined)).toEqual([
      "CHANGELOG.md lists no change under ## [0.3.0]",
    ]);
  });
});
