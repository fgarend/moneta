// Every story tagged visual, compared with its approved screenshot in Chromium, so a piece gets its screenshot from a
// tag on its story, with no test file of its own.
import { expect, inject, it } from "vitest";
import { render } from "vitest-browser-react";
import { stories } from "./stories.js";

const visual = stories.filter((story) => story.tags.includes("visual"));
const mode = inject("mode");

// No animation runs in a screenshot, so each piece is drawn at rest, as a pulse or a running bar would otherwise differ
// from shot to shot, and pausing them waited on their timing, which a busy machine missed.
const still = document.createElement("style");
still.textContent = "*, *::before, *::after { animation: none !important; }";
document.head.append(still);

it("draws in the mode of its project", async () => {
  const [Story] = visual;
  await render(<Story />);

  expect(document.documentElement.classList.contains("dark")).toBe(
    mode === "dark",
  );
});

// Chromium can keep a pixel of an earlier story where it believes nothing changed, as a 1 px corner of the section's
// button showed up in the table's groups after both had run. So the whole page is painted over for a frame, and
// cleared, before each story draws.
async function repaint(): Promise<void> {
  const cover = document.createElement("div");
  cover.style.cssText =
    "position: fixed; inset: 0; z-index: 2147483647; background: black;";
  document.body.append(cover);
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  cover.remove();
}

it.each(visual.map((story) => [story.id, story] as const))(
  "draws %s as approved",
  async (id, Story) => {
    await repaint();
    const screen = await render(<Story />);
    await document.fonts.ready;
    await expect
      .element(screen.locator)
      .toMatchScreenshot(mode === "light" ? id : `${id}-${mode}`);
  },
);
