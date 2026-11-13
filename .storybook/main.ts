// Storybook's settings: the stories, with the accessibility, docs, themes and Vitest addons.
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { defaultClientConditions } from "vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-a11y",
    // A page per piece, from its comment and its stories, for a piece tagged autodocs.
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  // No usage data leaves for Storybook's servers, and no notice of new versions shows: updates are made by hand.
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  // The aliases of package.json#imports point to the sources in the gallery.
  viteFinal: (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), tailwindcss()],
    resolve: {
      ...vite.resolve,
      conditions: ["moneta-source", ...defaultClientConditions],
    },
  }),
};

export default config;
