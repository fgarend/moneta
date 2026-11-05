import { describe, expect, it } from "vitest";
import { sources } from "./sources.js";

const inUi = /^\/src\/components\/ui\/(?<name>[^/]+)\.tsx$/u;
const extension = /\.tsx$/u;
const testOrStory = /\.(?:stories|test)\.tsx?$/u;
// Tailwind's arbitrary values, on the utilities that set spacing or colour.
const arbitrary =
  /(?<![\w-])-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|w|h|size|m(?:in|ax)-[wh]|indent|bg|text|border(?:-[xytblrse])?|ring|outline|fill|stroke|shadow|from|via|to|divide|decoration|accent|caret|placeholder)-\[[^\]\s]+\]/gu;

function arbitraryClasses(code: string): string[] {
  return [...code.matchAll(arbitrary)].map(([match]) => match);
}

describe("arbitraryClasses", () => {
  it.each([
    ['className="p-[3px]"', ["p-[3px]"]],
    ['className="hover:bg-[#fff] gap-2"', ["bg-[#fff]"]],
    ['className="-mt-[2px]"', ["-mt-[2px]"]],
    ['className="text-[var(--ink)]"', ["text-[var(--ink)]"]],
    ['className="p-2 bg-primary text-sm"', []],
    // Neither spacing nor colour.
    ['className="grid-cols-[1fr_auto]"', []],
  ])("in %s finds %j", (code, found) => {
    expect(arbitraryClasses(code)).toEqual(found);
  });
});

// Own pieces take spacing and colour from the theme. What comes from shadcn is left as it comes.
it("uses no arbitrary spacing or colour in own pieces", () => {
  const found = Object.entries(sources)
    .filter(
      ([path]) =>
        !(path.startsWith("/src/components/ui/") || testOrStory.test(path)),
    )
    .flatMap(([path, code]) =>
      arbitraryClasses(code).map((name) => `${path}: ${name}`),
    );

  expect(found).toEqual([]);
});

// Coverage does not see ui/, so a story is what says each of its files draws.
it("has a story for each file in ui/", () => {
  const paths = Object.keys(sources);
  const missing = paths
    .filter((path) => inUi.test(path) && !testOrStory.test(path))
    .filter((path) => !paths.includes(path.replace(extension, ".stories.tsx")));

  expect(missing).toEqual([]);
});
