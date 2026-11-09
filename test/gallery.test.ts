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
