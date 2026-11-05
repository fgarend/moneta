// Test settings. make test runs the project node, and make stories every other, with --mode stories.
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, type ViteUserConfig } from "vitest/config";

const notCode = ["**/*.test.{ts,tsx}", "**/*.stories.tsx", "**/*.d.ts"];
const logic = ["src/lib/**/*.{ts,tsx}", "src/index.ts"];
// What each check's coverage measures, at 100%, each by its own tests, with nothing run twice. stories names what it
// leaves out, so a new folder cannot go unmeasured. shadcn's files in ui/ are not ours to cover.
const coverageAreas = {
  test: { include: logic, exclude: notCode },
  stories: {
    include: ["src/**/*.{ts,tsx}"],
    exclude: [...notCode, ...logic, "src/components/ui/**"],
  },
};

const storySetup = ".storybook/vitest.setup.ts";
const inBrowser = {
  enabled: true,
  provider: playwright(),
  headless: true,
  // Every screenshot at one width: Tailwind's xl, and Playwright's own default. Vitest's would be a phone's.
  viewport: { width: 1280, height: 800 },
  // A failing test's screenshot would land among the approved ones.
  screenshotFailures: false,
};
// Functions, so each project gets objects of its own: Vitest writes each project's name into its instances, and
// projects that share one take each other's tests.
function chromium(): typeof inBrowser & {
  instances: { browser: "chromium" }[];
} {
  return { ...inBrowser, instances: [{ browser: "chromium" }] };
}
function everyBrowser(): typeof inBrowser & {
  instances: { browser: "chromium" | "firefox" | "webkit" }[];
} {
  return {
    ...inBrowser,
    instances: [
      { browser: "chromium" },
      { browser: "firefox" },
      { browser: "webkit" },
    ],
  };
}

export { coverageAreas };

export default defineConfig(({ mode }): ViteUserConfig => {
  const check = mode === "stories" ? "stories" : "test";
  return {
    test: {
      coverage: {
        provider: "istanbul",
        ...coverageAreas[check],
        // The table lists only what is below 100%, and coverage/<check>/index.html colours each line.
        reporter: [["text", { skipFull: true }], "html"],
        reportsDirectory: `coverage/${check}`,
        thresholds: { 100: true },
      },
      projects: [
        // Logic and the repository's checks, on Node.
        {
          test: {
            name: "node",
            include: [
              "src/**/*.test.ts",
              "scripts/**/*.test.ts",
              "test/**/*.test.ts",
            ],
            environment: "node",
          },
        },
        // Every story, in the three browsers, with axe checking it and its play function checking what it shows.
        {
          plugins: [storybookTest({ configDir: ".storybook" })],
          test: { name: "storybook", browser: everyBrowser() },
        },
        // Every story tagged visual, against its approved screenshot.
        {
          test: {
            name: "visual",
            include: [".storybook/visual.test.tsx"],
            browser: chromium(),
            setupFiles: [storySetup],
          },
        },
        {
          test: {
            name: "text-spacing",
            include: [".storybook/text-spacing.test.tsx"],
            browser: everyBrowser(),
            setupFiles: [storySetup],
          },
        },
        {
          test: {
            name: "forced-colors",
            include: [".storybook/forced-colors.test.tsx"],
            browser: {
              ...inBrowser,
              provider: playwright({
                contextOptions: { forcedColors: "active" },
              }),
              // WebKit's emulation answers the media query but forces no colours.
              instances: [{ browser: "chromium" }, { browser: "firefox" }],
            },
            setupFiles: [storySetup],
          },
        },
      ],
    },
  };
});
