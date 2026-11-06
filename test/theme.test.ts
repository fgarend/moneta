import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { root } from "./sources.js";

const text = 4.5;
const nonText = 3;
const hexColour = /^#[0-9a-f]{6}$/u;
const lightBlock = /^:root \{(?<body>[^}]*)\}/mu;
const declaration = /--(?<name>[\w-]+):\s*(?<value>[^;]+);/gu;

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

async function lightTheme(): Promise<Record<string, string>> {
  const theme = await readFile(new URL("src/styles/theme.css", root), "utf8");
  const body = theme.match(lightBlock)?.groups?.["body"] ?? "";
  return Object.fromEntries(
    [...body.matchAll(declaration)].map(({ groups }) => [
      groups?.["name"],
      groups?.["value"],
    ]),
  );
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
describe("the light theme", () => {
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
    ["gold-foreground", "gold", text],
    ["sidebar-foreground", "sidebar", text],
    ["sidebar-accent-foreground", "sidebar-accent", text],
    ["sidebar-primary-foreground", "sidebar-primary", text],
    ["sidebar-primary", "sidebar", nonText],
    ["input", "background", nonText],
    ["input", "card", nonText],
    ["ring", "background", nonText],
    ["ring", "card", nonText],
    ["sidebar-ring", "sidebar", nonText],
    ["sidebar-ring", "sidebar-accent", nonText],
  ])("has %s on %s at %d:1 or more", async (one, other, minimum) => {
    const theme = await lightTheme();
    const [first = "", second = ""] = [theme[one], theme[other]];

    expect(first).toMatch(hexColour);
    expect(second).toMatch(hexColour);
    expect(contrast(first, second)).toBeGreaterThanOrEqual(minimum);
  });
});
