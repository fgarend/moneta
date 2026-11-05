// Test settings. make test runs the project on Node, and make stories, with --mode stories, those in a browser.
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import {
  defineConfig,
  type TestProjectInlineConfiguration,
  type ViteUserConfig,
} from "vitest/config";

type Browser = "chromium" | "firefox" | "webkit";

const notCode = ["**/*.test.{ts,tsx}", "**/*.stories.tsx", "**/*.d.ts"];
const logic = ["src/lib/**/*.{ts,tsx}"];
// What each check's coverage measures, at 100%, each by its own tests, with nothing run twice. stories names what it
// leaves out, so a new folder cannot go unmeasured. shadcn's files in ui/ are not ours to cover.
const coverageAreas = {
  test: { include: logic, exclude: notCode },
  stories: {
    include: ["src/**/*.{ts,tsx}"],
    exclude: [...notCode, ...logic, "src/components/ui/**"],
  },
};

const everyBrowser: Browser[] = ["chromium", "firefox", "webkit"];

// A function, so each project gets objects of its own: Vitest writes each project's name into its instances, and
// projects that share one take each other's tests.
function inBrowsers(
  browsers: Browser[],
  provider = playwright(),
): NonNullable<NonNullable<TestProjectInlineConfiguration["test"]>["browser"]> {
  return {
    enabled: true,
    provider,
    headless: true,
    // Every screenshot at one width: Tailwind's xl, and Playwright's own default. Vitest's would be a phone's.
    viewport: { width: 1280, height: 800 },
    // A failing test's screenshot would land among the approved ones.
    screenshotFailures: false,
    instances: browsers.map((browser) => ({ browser })),
  };
}

// A check that goes through every story, from its one test file in .storybook/.
function everyStory(
  name: string,
  browsers: Browser[],
  provider = playwright(),
): TestProjectInlineConfiguration {
  return {
    test: {
      name,
      include: [`.storybook/${name}.test.tsx`],
      browser: inBrowsers(browsers, provider),
      setupFiles: [".storybook/vitest.setup.ts"],
    },
  };
}

function storyProjects(): TestProjectInlineConfiguration[] {
  return [
    // Every story, with axe checking it and its play function checking what it shows.
    {
      plugins: [storybookTest()],
      test: { name: "storybook", browser: inBrowsers(everyBrowser) },
    },
    // Every story tagged visual, against its approved screenshot.
    everyStory("visual", ["chromium"]),
    everyStory("text-spacing", everyBrowser),
    // WebKit's emulation answers the media query but forces no colours.
    everyStory(
      "forced-colors",
      ["chromium", "firefox"],
      playwright({ contextOptions: { forcedColors: "active" } }),
    ),
  ];
}

// Logic and the repository's checks.
const nodeProject: TestProjectInlineConfiguration = {
  test: {
    name: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    exclude: ["test/consumer/**"],
  },
};

// The tarball in a throwaway app, which installs packages, so its time limits allow for a slow registry.
const consumerProject: TestProjectInlineConfiguration = {
  test: {
    name: "package",
    include: ["test/consumer/*.test.ts"],
    hookTimeout: 180_000,
    testTimeout: 60_000,
  },
};

function projectsOf(mode: string): TestProjectInlineConfiguration[] {
  if (mode === "stories") {
    return storyProjects();
  }
  return mode === "package" ? [consumerProject] : [nodeProject];
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
      projects: projectsOf(mode),
    },
  };
});
