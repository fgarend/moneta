// Every story at WCAG 1.4.10's width, 320 px, in every browser: the page never scrolls sideways, an area that scrolls
// on its own is reached by keyboard, and no text is cut by the narrow width alone. A piece gets this check from having
// a story, with no test of its own.
import axe from "axe-core";
import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { cutByChange } from "./cut.js";
import { stories } from "./stories.js";

// The criterion's width, which this project opens every story at, and the width of every other check's.
const narrow = { width: 320, height: 1200 };
const wide = { width: 1280, height: 1200 };

// What a resize moves is laid out, and what measures it, as a table's area, has measured, a frame later.
async function resized({
  width,
  height,
}: {
  width: number;
  height: number;
}): Promise<void> {
  await page.viewport(width, height);
  for (const _frame of [1, 2]) {
    await new Promise((done) => requestAnimationFrame(done));
  }
}

// The areas that scroll on their own and that a keyboard cannot reach, by axe's own rule.
async function unreachableAreas(root: Element): Promise<string[]> {
  const { violations } = await axe.run(root, {
    runOnly: ["scrollable-region-focusable"],
  });
  return violations.flatMap(({ nodes }) =>
    nodes.map(({ target }) => target.join(" ")),
  );
}

// The room the gallery gives a story, Storybook's padded layout, 1rem, as on a page a piece never meets the screen's
// edge; a fullscreen story, as the sample page, brings its own.
function roomFor(Story: (typeof stories)[number]): string {
  return Story.parameters.layout === "fullscreen" ? "0" : "1rem";
}

// A gap lets a story off: a raw piece's, written down in docs/pieces.md, until the piece is reviewed, and the sample
// page's, in the roadmap, until it is rebuilt.
const checked = stories.filter((story) => !story.tags.includes("gap-reflow"));

it.each(checked.map((story) => [story.id, story] as const))(
  "reflows %s at 320 px",
  async (_id, Story) => {
    await resized(narrow);
    const screen = await render(
      <div style={{ padding: roomFor(Story) }}>
        <Story />
      </div>,
    );
    await document.fonts.ready;
    await resized(narrow);
    const { scrollWidth, clientWidth } = document.documentElement;

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    expect(await unreachableAreas(screen.container)).toEqual([]);
    expect(
      await cutByChange(screen.container, {
        undo: () => resized(wide),
        redo: () => resized(narrow),
      }),
    ).toEqual([]);
  },
);
