// Every story with WCAG 1.4.12's text spacing, in every browser: no text may be pushed out of a box around it, so a
// piece gets this check from having a story, with no test of its own.
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { cutByChange } from "./cut.js";
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

// This project has only this file, in a page of its own, so the style stays for all of it.
const style = document.createElement("style");
style.textContent = spacing;
document.head.append(style);

it.each(stories.map((story) => [story.id, story] as const))(
  "keeps %s whole with WCAG's text spacing",
  async (_id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;

    expect(
      await cutByChange(screen.container, {
        undo: () => {
          style.disabled = true;
        },
        redo: () => {
          style.disabled = false;
        },
      }),
    ).toEqual([]);
  },
);
