// What every story runs in: the canvas a visual test takes its screenshot of.
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div data-story-canvas="">
        <Story />
      </div>
    ),
  ],
  parameters: {
    // Any violation axe finds fails the story's test, by WCAG 2.2 AA, which the addon's default stops short of, and by
    // axe's best practices.
    a11y: {
      test: "error",
      options: {
        runOnly: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ],
      },
    },
  },
};

export default preview;
