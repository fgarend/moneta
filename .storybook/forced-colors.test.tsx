// Every story in forced colours, as Windows's contrast themes set, in the browsers whose emulation forces them. Fills
// disappear there, so what marks a state has to be something else, and a piece gets this check from having a story.
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { stories } from "./stories.js";

const none = "rgba(0, 0, 0, 0)";

function hasEdge(element: Element): boolean {
  const { borderLeftColor, borderLeftStyle, outlineColor, outlineStyle } =
    getComputedStyle(element);
  return (
    (outlineStyle !== "none" && outlineColor !== none) ||
    (borderLeftStyle !== "none" && borderLeftColor !== none)
  );
}

// What only a fill told apart, with the fill gone: the current page, and an open popover.
function withoutEdge(root: Element): string[] {
  return [...root.querySelectorAll('[aria-current="page"], :popover-open')]
    .filter((element) => !hasEdge(element))
    .map((element) => element.outerHTML);
}

// A colour set on the svg itself stays as it is in forced colours, whatever is behind it now.
function offColourIcons(root: Element): string[] {
  return [...root.querySelectorAll("a svg, button svg")]
    .filter((icon) => {
      const parent = icon.closest("a, button") as Element;
      return getComputedStyle(icon).color !== getComputedStyle(parent).color;
    })
    .map((icon) => icon.closest("a, button")?.outerHTML ?? "");
}

it("runs in forced colours", () => {
  expect(matchMedia("(forced-colors: active)").matches).toBe(true);
});

it.each(stories.map((story) => [story.id, story] as const))(
  "keeps %s legible in forced colours",
  async (_id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;

    expect(withoutEdge(screen.container)).toEqual([]);
    expect(offColourIcons(screen.container)).toEqual([]);
  },
);
