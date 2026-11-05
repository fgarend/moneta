// Storybook's settings: the stories, with the accessibility and Vitest addons.
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  // No usage data leaves for Storybook's servers, and no notice of new versions shows: updates are made by hand.
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};

export default config;
