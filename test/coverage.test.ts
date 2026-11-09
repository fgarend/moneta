import { matchesGlob } from "node:path";
import { describe, expect, it } from "vitest";
import { coverageAreas } from "../vitest.config.js";
import { sources } from "./sources.js";

const hintPattern = /istanbul ignore[^*]*\*\//gu;
// The end of a range needs none: its start says why.
const explained =
  /^istanbul ignore (?:(?:if|else|next|start) -- @preserve: \S.*|stop -- @preserve )\*\/$/u;

function measuredBy(path: string): string[] {
  return Object.entries(coverageAreas)
    .filter(
      ([, area]) =>
        area.include.some((glob) => matchesGlob(path, glob)) &&
        !area.exclude.some((glob) => matchesGlob(path, glob)),
    )
    .map(([name]) => name);
}

describe("what each check's coverage measures", () => {
  it.each([
    ["src/lib/format.ts", ["test"]],
    ["scripts/check-release.ts", ["test"]],
    ["scripts/check-release.test.ts", []],
    ["src/components/amount.tsx", ["stories"]],
    ["src/hooks/use-thing.ts", ["stories"]],
    // A folder nobody has thought of yet still counts.
    ["src/new-folder/thing.ts", ["stories"]],
    ["src/components/amount.stories.tsx", []],
    ["src/lib/format.test.ts", []],
    ["src/css.d.ts", []],
  ])("%s is measured by %j", (path, checks) => {
    expect(measuredBy(path)).toEqual(checks);
  });
});

// A line no test can reach is left out of the coverage only with the reason beside it, in a comment esbuild keeps.
it("says why each line left out of the coverage needs no test", () => {
  const unexplained = Object.entries(sources).flatMap(([path, code]) =>
    [...code.matchAll(hintPattern)]
      .map(([hint]) => hint)
      .filter((hint) => !explained.test(hint))
      .map((hint) => `${path}: ${hint}`),
  );

  expect(unexplained).toEqual([]);
});
