// What every story runs in.
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
  // A switch in the toolbar puts the theme's .dark class on the page, as an app would.
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    // Pieces first, under shadcn's groups as its docs list its components, then the sample page, each piece in the
    // alphabet's order, as its files load, and each piece's stories in its file's, as its page teaches them. Storybook
    // reads this as text, so it names no import, and test/pieces.test.ts reads it too.
    options: {
      storySort: {
        method: "configure",
        order: [
          "Components",
          [
            "Form & Input",
            "Layout & Navigation",
            "Overlays & Dialogs",
            "Feedback & Status",
            "Display & Media",
            "Misc",
          ],
          "Sample",
        ],
      },
    },
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
