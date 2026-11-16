import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { dark, light } from "../.storybook/themes.js";
import { root } from "./sources.js";

const lightBlock = /^:root \{(?<body>[^}]*)\}/mu;
const darkBlock = /^\.dark \{(?<body>[^}]*)\}/mu;
const declaration = /--(?<name>[\w-]+):\s*(?<value>[^;]+);/gu;

const theme = await readFile(new URL("src/styles/theme.css", root), "utf8");

function values(block: RegExp): Record<string, string> {
  const body = theme.match(block)?.groups?.["body"] ?? "";
  return Object.fromEntries(
    [...body.matchAll(declaration)].map(({ groups }) => [
      groups?.["name"],
      groups?.["value"],
    ]),
  );
}

// Dark holds only what it changes, and takes the rest from light.
const inLight = values(lightBlock);
const inDark = { ...inLight, ...values(darkBlock) };

// The gallery's frame cannot read the theme's variables, so it repeats them, and so it may not drift from them.
it.each([
  ["light", light, inLight],
  ["dark", dark, inDark],
])(
  "paints the gallery's frame in %s with the theme's colours",
  (_, palette, colours) => {
    const differing = Object.entries(palette).filter(
      ([name, value]) => colours[name] !== value,
    );

    expect(Object.keys(palette)).not.toEqual([]);
    expect(differing).toEqual([]);
  },
);

// A reviewed piece's page opens with what it is, then what it is for and what is not recommended, in the comment of
// the piece whose page it is, which the page shows first. A raw piece gets its own at its review.
const pages: Record<string, string> = {
  alert: "Alert",
  amount: "Amount",
  "app-layout": "AppLayout",
  "aspect-ratio": "AspectRatio",
  avatar: "Avatar",
  badge: "Badge",
  card: "Card",
  "date-field": "DateField",
  "date-time": "DateTime",
  "description-list": "DescriptionList",
  "icon-tile": "IconTile",
  item: "ItemGroup",
  kbd: "Kbd",
  link: "Link",
  "moneta-provider": "MonetaProvider",
  pagination: "Pagination",
  percent: "Percent",
  quantity: "Quantity",
  "scroll-area": "ScrollArea",
  section: "Section",
  separator: "Separator",
  sidebar: "Sidebar",
  "skip-link": "SkipLink",
  stat: "StatGroup",
  table: "Table",
};
const reviewedRow = /^\| `(?<name>[a-z-]+)` \| reviewed \|/gmu;
const explained = Object.entries(pages);
const anyText = /\S/u;

it("names the piece of every reviewed page", async () => {
  const list = await readFile(new URL("docs/pieces.md", root), "utf8");
  const reviewed = [...list.matchAll(reviewedRow)].map(
    ({ groups }) => groups?.["name"],
  );

  expect(new Set(Object.keys(pages))).toEqual(new Set(reviewed));
});

it.each(explained)(
  "explains on %s's page what it is for and what is not recommended",
  async (file, piece) => {
    const source = await readFile(
      new URL(`src/components/${file}.tsx`, root),
      "utf8",
    );
    const comment =
      source.match(
        new RegExp(
          String.raw`/\*\*((?:(?!\*/)[\s\S])*)\*/\s*function ${piece}\b`,
          "u",
        ),
      )?.[1] ?? "";

    expect(comment).toMatch(anyText);
    expect(comment).toContain("Use it for");
    expect(comment).toContain("Not recommended");
  },
);
