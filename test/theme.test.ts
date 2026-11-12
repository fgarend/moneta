import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { root } from "./sources.js";

const text = 4.5;
const nonText = 3;
const hexColour = /^#[0-9a-f]{6}$/u;
const lightBlock = /^:root \{(?<body>[^}]*)\}/mu;
const darkBlock = /^\.dark \{(?<body>[^}]*)\}/mu;
const declaration = /--(?<name>[\w-]+):\s*(?<value>[^;]+);/gu;
const reference = /^var\(--(?<name>[\w-]+)\)$/u;

const lowChannel = 0.039_28;
const lowDivisor = 12.92;
const offset = 0.055;
const scale = 1.055;
const power = 2.4;
const redWeight = 0.2126;
const greenWeight = 0.7152;
const blueWeight = 0.0722;
const ambient = 0.05;
const channelMax = 255;
const hexBase = 16;

function channel(value: number): number {
  return value <= lowChannel
    ? value / lowDivisor
    : ((value + offset) / scale) ** power;
}

// WCAG's relative luminance, of a colour written #rrggbb.
function luminance(colour: string): number {
  const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((start) =>
    channel(
      Number.parseInt(colour.slice(start, start + 2), hexBase) / channelMax,
    ),
  );
  return redWeight * red + greenWeight * green + blueWeight * blue;
}

function contrast(one: string, other: string): number {
  const [lighter = 0, darker = 0] = [luminance(one), luminance(other)].sort(
    (a, b) => b - a,
  );
  return (lighter + ambient) / (darker + ambient);
}

function declared(theme: string, block: RegExp): Record<string, string> {
  const body = theme.match(block)?.groups?.["body"] ?? "";
  return Object.fromEntries(
    [...body.matchAll(declaration)].map(({ groups }) => [
      groups?.["name"],
      groups?.["value"],
    ]),
  );
}

// A value that names another, as var(--destructive), read as that one's value in the same theme.
function resolved(theme: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(theme).map(([name, value]) => [
      name,
      theme[value.match(reference)?.groups?.["name"] ?? ""] ?? value,
    ]),
  );
}

// Dark holds only what changes, and takes the rest from light.
async function themes(): Promise<Record<string, Record<string, string>>> {
  const theme = await readFile(new URL("src/styles/theme.css", root), "utf8");
  const light = declared(theme, lightBlock);
  return {
    light: resolved(light),
    dark: resolved({ ...light, ...declared(theme, darkBlock) }),
  };
}

describe("contrast", () => {
  it.each([
    // WCAG's own two ends, and a grey known to fall just short of 4.5:1.
    ["#ffffff", "#000000", 21],
    ["#777777", "#ffffff", 4.48],
  ])("of %s on %s is %d", (one, other, expected) => {
    expect(contrast(one, other)).toBeCloseTo(expected, 1);
  });
});

// The pairs every piece paints, as axe only sees those a story draws, and only on flat colours.
describe.each(["light", "dark"])("the %s theme", (mode) => {
  it.each([
    ["foreground", "background", text],
    ["card-foreground", "card", text],
    ["popover-foreground", "popover", text],
    ["primary-foreground", "primary", text],
    ["secondary-foreground", "secondary", text],
    ["accent-foreground", "accent", text],
    ["muted-foreground", "background", text],
    ["muted-foreground", "card", text],
    ["muted-foreground", "muted", text],
    ["destructive", "background", text],
    ["destructive", "card", text],
    ["positive", "background", text],
    ["positive", "card", text],
    ["positive", "muted", text],
    ["negative", "background", text],
    ["negative", "card", text],
    ["negative", "muted", text],
    ["gold-foreground", "gold", text],
    ["sidebar-foreground", "sidebar", text],
    ["sidebar-accent-foreground", "sidebar-accent", text],
    ["sidebar-primary-foreground", "sidebar-primary", text],
    ["sidebar-primary", "sidebar", nonText],
    // A section's label, quieter than the items; the current item's gold icon; and its bar, at the item's start.
    ["sidebar-muted-foreground", "sidebar", text],
    ["sidebar-primary", "sidebar-accent", nonText],
    ["sidebar-accent-foreground", "sidebar", nonText],
    ["input", "background", nonText],
    ["input", "card", nonText],
    ["ring", "background", nonText],
    ["ring", "card", nonText],
    ["sidebar-ring", "sidebar", nonText],
    ["sidebar-ring", "sidebar-accent", nonText],
  ])("has %s on %s at %d:1 or more", async (one, other, minimum) => {
    const theme = (await themes())[mode] ?? {};
    const [first = "", second = ""] = [theme[one], theme[other]];

    expect(first).toMatch(hexColour);
    expect(second).toMatch(hexColour);
    expect(contrast(first, second)).toBeGreaterThanOrEqual(minimum);
  });
});

// The line that marks structure, a group's and a total's, stands out from the line under every row, in both modes.
it.each(["light", "dark"])(
  "draws a strong line apart from the plain one in %s",
  async (mode) => {
    const theme = (await themes())[mode] ?? {};
    const [strong = "", plain = "", card = ""] = [
      theme["border-strong"],
      theme["border"],
      theme["card"],
    ];

    expect(strong).toMatch(hexColour);
    expect(contrast(strong, card)).toBeGreaterThan(contrast(plain, card));
  },
);

// A value that names another is worked out where it is declared, so a part of a page made dark would keep light's.
it("declares again under .dark each value that names another", async () => {
  const theme = await readFile(new URL("src/styles/theme.css", root), "utf8");
  const light = declared(theme, lightBlock);
  const dark = declared(theme, darkBlock);
  const naming = Object.keys(light).filter((name) =>
    light[name]?.includes("var("),
  );

  expect(naming).not.toEqual([]);
  expect(naming.filter((name) => !(name in dark))).toEqual([]);
});

it("tells the browser its own controls are dark too", async () => {
  const theme = await readFile(new URL("src/styles/theme.css", root), "utf8");

  expect(theme.match(darkBlock)?.groups?.["body"]).toContain(
    "color-scheme: dark",
  );
});
