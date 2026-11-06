import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { root, sources } from "./sources.js";

const inUi = /^\/src\/components\/ui\/(?<name>[^/]+)\.tsx$/u;
const listRow = /^\| `(?<name>[a-z-]+)` \| (?<state>raw|reviewed) \|/gmu;
const testOrStory = /\.(?:stories|test)\.tsx?$/u;
// Tailwind's arbitrary values, on the utilities that set spacing or colour.
const arbitrary =
  /(?<![\w-])-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|w|h|size|m(?:in|ax)-[wh]|indent|bg|text|border(?:-[xytblrse])?|ring|outline|fill|stroke|shadow|from|via|to|divide|decoration|accent|caret|placeholder)-\[[^\]\s]+\]/gu;

async function listedPieces(): Promise<{ name?: string; state?: string }[]> {
  const list = await readFile(new URL("docs/pieces.md", root), "utf8");
  return [...list.matchAll(listRow)].map(({ groups }) => ({ ...groups }));
}

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

// The list says what state each of shadcn's pieces is in, so none may enter or stay unlisted.
it("lists each file in ui/, and only those, in docs/pieces.md", async () => {
  const files = Object.keys(sources)
    .filter((path) => inUi.test(path) && !testOrStory.test(path))
    .map((path) => path.match(inUi)?.groups?.["name"]);
  const listed = (await listedPieces()).map(({ name }) => name);

  expect(new Set(listed)).toEqual(new Set(files));
});

// Coverage does not see ui/, so a story is what says a reviewed piece draws.
it("has a story for each reviewed piece", async () => {
  const missing = (await listedPieces())
    .filter(({ state }) => state === "reviewed")
    .map(({ name }) => `/src/components/ui/${name}.stories.tsx`)
    .filter((path) => !Object.keys(sources).includes(path));

  expect(missing).toEqual([]);
});
