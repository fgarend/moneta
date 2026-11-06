// Every story with WCAG 1.4.12's text spacing, in every browser: no text may be pushed out of a box around it, so a
// piece gets this check from having a story, with no test of its own.
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

// The boxes that can lose a text, up to the first it can be scrolled to in, which keeps it within reach.
function boxesAround(text: Node, root: Element): Element[] {
  const boxes: Element[] = [];
  for (
    let box = text.parentElement;
    box && box !== root;
    box = box.parentElement
  ) {
    const { overflowX, overflowY } = getComputedStyle(box);
    if (reachable.includes(overflowX) || reachable.includes(overflowY)) {
      break;
    }
    boxes.push(box);
  }
  return boxes;
}

function rectOf(text: Node): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(text);
  return range.getBoundingClientRect();
}

// How far a text goes past a box around it, where that loses it.
function past(text: DOMRect, box: Element): number {
  const { overflowX, overflowY } = getComputedStyle(box);
  const edge = box.getBoundingClientRect();
  return Math.max(
    reachable.includes(overflowX)
      ? 0
      : Math.max(text.right - edge.right, edge.left - text.left),
    reachable.includes(overflowY)
      ? 0
      : Math.max(text.bottom - edge.bottom, edge.top - text.top),
  );
}

// This project has only this file, in a page of its own, so the style stays for all of it.
const style = document.createElement("style");
style.textContent = spacing;
document.head.append(style);

// Only what the spacing itself pushes out counts, as a text may already pass a box, closed in a panel that opens.
function cutBySpacing(root: Element): (string | null)[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Node[] = [];
  while (walker.nextNode()) {
    const boxes = boxesAround(walker.currentNode, root);
    const shown = !boxes.some(
      (box) => getComputedStyle(box).clipPath === hidden,
    );
    if (shown && rectOf(walker.currentNode).width > 0) {
      texts.push(walker.currentNode);
    }
  }
  const distance = (text: Node): number =>
    Math.max(
      0,
      ...boxesAround(text, root).map((box) => past(rectOf(text), box)),
    );

  style.disabled = true;
  const before = texts.map(distance);
  style.disabled = false;
  return texts
    .filter((text, index) => distance(text) > (before[index] ?? 0) + 1)
    .map((text) => text.textContent);
}

it.each(stories.map((story) => [story.id, story] as const))(
  "keeps %s whole with WCAG's text spacing",
  async (_id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;

    expect(cutBySpacing(screen.container)).toEqual([]);
  },
);
