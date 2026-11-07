// Every story tagged visual, compared with its approved screenshot in Chromium, so a piece gets its screenshot from a
// tag on its story, with no test file of its own.
import { expect, inject, it } from "vitest";
import { render } from "vitest-browser-react";
import { stories } from "./stories.js";

const visual = stories.filter((story) => story.tags.includes("visual"));
const mode = inject("mode");

it("draws in the mode of its project", async () => {
  const [Story] = visual;
  await render(<Story />);

  expect(document.documentElement.classList.contains("dark")).toBe(
    mode === "dark",
  );
});

it.each(visual.map((story) => [story.id, story] as const))(
  "draws %s as approved",
  async (id, Story) => {
    const screen = await render(<Story />);
    await document.fonts.ready;

    await expect
      .element(screen.locator)
      .toMatchScreenshot(mode === "light" ? id : `${id}-${mode}`);
  },
);
