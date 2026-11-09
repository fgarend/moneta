import { readdir, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { root, sources } from "./sources.js";

const listRow =
  /^\| `(?<name>[a-z-]+)` \| (?<state>raw|reviewed) \|(?<gaps>.*)\|$/gmu;
// How a story is let off a check, and how docs/pieces.md names what that check found.
const exemptions = [
  { check: "axe", mark: /test: "todo"/u },
  { check: "forced colours", mark: /"gap-forced-colors"/u },
];
const extension = /\.tsx$/u;
const rawTag = /tags: \[[^\]]*"raw"/u;
const testOrStory = /\.(?:stories|test)\.tsx?$/u;
// Tailwind's arbitrary values, on the utilities that set spacing or colour.
const arbitrary =
  /(?<![\w-])-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|w|h|size|m(?:in|ax)-[wh]|indent|bg|text|border(?:-[xytblrse])?|ring|outline|fill|stroke|shadow|from|via|to|divide|decoration|accent|caret|placeholder)-\[[^\]\s]+\]/gu;

async function listedPieces(): Promise<
  { name?: string; state?: string; gaps?: string }[]
> {
  const list = await readFile(new URL("docs/pieces.md", root), "utf8");
  return [...list.matchAll(listRow)].map(({ groups }) => ({ ...groups }));
}

// CSS's own words, the parent's value and the system's colours, which no scale could hold.
const cssWords = new Set([
  "inherit",
  "initial",
  "unset",
  "revert",
  "Canvas",
  "CanvasText",
  "Field",
  "FieldText",
  "Highlight",
  "HighlightText",
  "GrayText",
  "ButtonFace",
  "ButtonText",
  "LinkText",
]);
const bracketed = /\[(?<value>[^\]]+)\]$/u;

function arbitraryClasses(code: string): string[] {
  return [...code.matchAll(arbitrary)]
    .map(([match]) => match)
    .filter(
      (match) => !cssWords.has(match.match(bracketed)?.groups?.["value"] ?? ""),
    );
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
    // A word of CSS's own, as the parent's value or a colour of the system, is no value made up.
    ['className="max-h-[inherit]"', []],
    ['className="bg-[Canvas] text-[CanvasText]"', []],
    ['className="max-h-[inheritance]"', ["max-h-[inheritance]"]],
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

// Every piece, shadcn's or our own, by its name, with its file.
const anyPiece = /^\/src\/components\/(?:ui\/)?(?<name>[^/.]+)\.tsx$/u;
const pieces = new Map(
  Object.keys(sources)
    .filter((path) => !testOrStory.test(path))
    .flatMap((path) => {
      const name = path.match(anyPiece)?.groups?.["name"];
      return name === undefined ? [] : [[name, path] as const];
    }),
);

function storyOf(name = ""): string {
  const path = pieces.get(name) ?? "";
  return sources[path.replace(extension, ".stories.tsx")] ?? "";
}

// The list says what state each piece is in, so none may enter or stay unlisted.
it("lists every piece, and only those, in docs/pieces.md", async () => {
  const listed = (await listedPieces()).map(({ name }) => name);

  expect(new Set(listed)).toEqual(new Set(pieces.keys()));
});

// A story is what says each piece draws, raw or reviewed.
it("has a story for each piece", () => {
  const missing = [...pieces.keys()].filter((name) => storyOf(name) === "");

  expect(missing).toEqual([]);
});

// A piece is shadcn's when upstream/shadcn/ holds it as last taken, the base of make shadcn-update.
it("keeps shadcn's base only for a piece of that name", async () => {
  const bases = (await readdir(new URL("upstream/shadcn/", root)))
    .filter((file) => extension.test(file))
    .map((file) => file.replace(extension, ""));

  expect(bases.length).toBeGreaterThan(0);
  expect(bases.filter((name) => !pieces.has(name))).toEqual([]);
});

// An app imports every piece by its name alone, so one of ours named as one of shadcn's would hide it.
it("names no own piece as one of shadcn's", () => {
  const names = Object.keys(sources)
    .filter((path) => !testOrStory.test(path))
    .map((path) => path.match(anyPiece)?.groups?.["name"])
    .filter((name) => name !== undefined);

  expect(names.length).toBeGreaterThan(0);
  expect(new Set(names).size).toBe(names.length);
});

// The gallery files each piece, shadcn's or our own, under shadcn's own groups, in the order its preview sorts them.
const preview = await readFile(new URL(".storybook/preview.ts", root), "utf8");
const sortedGroups = /"Components",\s*(?<groups>\[[^\]]*\])/u;
const categories = JSON.parse(
  (preview.match(sortedGroups)?.groups?.["groups"] ?? "[]").replace(
    /,\s*\]/u,
    "]",
  ),
) as string[];
const storyTitle = /^ {2}title: "(?<title>[^"]+)",$/mu;
const pieceStory = /^\/src\/components\/(?:ui\/)?[^/]+\.stories\.tsx$/u;

it("files the story of each piece under one of shadcn's groups", () => {
  expect(categories).toHaveLength(6);
  const wrong = Object.entries(sources)
    .filter(([path]) => pieceStory.test(path))
    .map(([path, story]) => [path, story.match(storyTitle)?.groups?.["title"]])
    .filter(([, title = ""]) => {
      const [level, category, name, ...rest] = title.split("/");
      return (
        level !== "Components" ||
        !categories.includes(category ?? "") ||
        name === undefined ||
        rest.length > 0
      );
    });

  expect(wrong).toEqual([]);
});

// The gallery and the list say the same of each piece.
it("tags the story of each raw piece as raw, and of no other", async () => {
  const wrong = (await listedPieces())
    .filter(({ name, state }) => {
      const story = storyOf(name);
      return rawTag.test(story) !== (state === "raw");
    })
    .map(({ name }) => name);

  expect(wrong).toEqual([]);
});

// A check lets a story off only for a gap written down, and a reviewed piece has none.
it.each(exemptions)(
  "says the same of $check in the stories and in docs/pieces.md",
  async ({ check, mark }) => {
    const wrong = (await listedPieces())
      .filter(({ name, state, gaps = "" }) => {
        const story = storyOf(name);
        const exempt = mark.test(story);
        return (
          exempt !== gaps.includes(`**${check}:`) || (exempt && state !== "raw")
        );
      })
      .map(({ name }) => name);

    expect(wrong).toEqual([]);
  },
);
