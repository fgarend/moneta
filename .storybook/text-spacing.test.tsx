// Every story with WCAG 1.4.12's text spacing, in every browser: nothing may be cut or spill out, so a piece gets this
// check from having a story, with no test of its own.
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { stories } from "./stories.js";

// The criterion's values, set on everything, and nothing else changed.
const spacing = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p {
    margin-bottom: 2em !important;
  }
`;
// Hidden from the screen on purpose, for screen readers, as Tailwind's sr-only and React Aria both do it.
const hidden = "inset(50%)";
// An area that scrolls lets everything be reached; any other has lost what does not fit.
const reachable = ["auto", "scroll"];

// How far an element's content goes past it, where that loses something.
function overflow(element: Element): number {
  const { clipPath, overflowX, overflowY } = getComputedStyle(element);
  if (clipPath === hidden) {
    return 0;
  }
  return Math.max(
    reachable.includes(overflowX)
      ? 0
      : element.scrollWidth - element.clientWidth,
    reachable.includes(overflowY)
      ? 0
      : element.scrollHeight - element.clientHeight,
  );
}

// This project has only this file, in a page of its own, so the style stays for all of it.
const style = document.createElement("style");
style.textContent = spacing;
document.head.append(style);

// Only what the spacing itself pushes out counts: a touch area larger than its piece, or a fixed height with padding,
// overflows the same with no spacing at all, and loses no text.
function cutBySpacing(root: Element): string[] {
  const elements = [...root.querySelectorAll("*")].filter(
    (element) => element.clientWidth > 0,
  );
  style.disabled = true;
  const before = elements.map(overflow);
  style.disabled = false;
  return elements
    .filter((element, index) => overflow(element) > (before[index] ?? 0) + 1)
    .map((element) => element.outerHTML);
}

it.each(stories.map((story) => [story.id, story] as const))(
  "keeps %s whole with WCAG's text spacing",
  async (_id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;

    expect(cutBySpacing(screen.container)).toEqual([]);
  },
);
