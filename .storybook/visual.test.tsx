// Every story tagged visual, compared with its approved screenshot in Chromium, so a piece gets its screenshot from a
// tag on its story, with no test file of its own.
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { stories } from "./stories.js";

const visual = stories.filter((story) => story.tags.includes("visual"));

it.each(visual.map((story) => [story.id, story] as const))(
  "draws %s as approved",
  async (id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;

    await expect.element(screen.locator).toMatchScreenshot(id);
  },
);
