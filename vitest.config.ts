// Test settings. make test runs the project on Node, and make stories, with --mode stories, those in a browser.
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defaultClientConditions } from "vite";
import {
  defineConfig,
  type TestProjectInlineConfiguration,
  type ViteUserConfig,
} from "vitest/config";

type Browser = "chromium" | "firefox" | "webkit";
// The colour mode a project runs every story in, as the gallery's toolbar sets it.
type Mode = "light" | "dark";

const notCode = ["**/*.test.{ts,tsx}", "**/*.stories.tsx", "**/*.d.ts"];
const logic = ["src/lib/**/*.{ts,tsx}", "scripts/**/*.ts"];
// What each check's coverage measures, at 100%, each by its own tests, with nothing run twice. stories names what it
// leaves out, so a new folder cannot go unmeasured. Every piece is covered, shadcn's too, as docs/pieces.md says.
const coverageAreas = {
  test: { include: logic, exclude: notCode },
  stories: {
    include: ["src/**/*.{ts,tsx}"],
    exclude: [...notCode, ...logic],
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
    // Every screenshot at one width: Tailwind's xl, and Playwright's own default. Vitest's would be a phone's. Tall
    // enough for the sample page, as a screenshot draws nothing past the screen.
    viewport: { width: 1280, height: 1200 },
    // A failing test's screenshot would land among the approved ones.
    screenshotFailures: false,
    // Every pixel exactly, but the edges' anti-aliasing: the default, 0.1, let a whole palette pass unseen.
    expect: {
      toMatchScreenshot: {
        comparatorName: "pixelmatch",
        comparatorOptions: { threshold: 0 },
      },
    },
    instances: browsers.map((browser) => ({ browser })),
  };
}

// A check that goes through every story, from its one test file in .storybook/, in one mode.
function everyStory(
  name: string,
  browsers: Browser[],
  { provider = playwright(), mode = "light" as Mode } = {},
): TestProjectInlineConfiguration {
  return {
    plugins: [tailwindcss()],
    test: {
      name: mode === "light" ? name : `${name}-${mode}`,
      include: [`.storybook/${name}.test.tsx`],
      browser: inBrowsers(browsers, provider),
      setupFiles: [".storybook/vitest.setup.ts"],
      provide: { mode },
    },
  };
}

// Every story, with axe checking it and its play function checking what it shows, in one mode.
function storybook(mode: Mode): TestProjectInlineConfiguration {
  return {
    plugins: [storybookTest({ initialGlobals: { theme: mode } })],
    test: {
      name: mode === "light" ? "storybook" : `storybook-${mode}`,
      browser: inBrowsers(everyBrowser),
    },
  };
}

function storyProjects(): TestProjectInlineConfiguration[] {
  return [
    storybook("light"),
    storybook("dark"),
    // Every story tagged visual, against its approved screenshot.
    everyStory("visual", ["chromium"]),
    everyStory("visual", ["chromium"], { mode: "dark" }),
    everyStory("text-spacing", everyBrowser),
    everyStory("focus", everyBrowser),
    // The same file again in forced colours, in the browsers whose emulation forces them.
    {
      plugins: [tailwindcss()],
      test: {
        name: "focus-forced",
        include: [".storybook/focus.test.tsx"],
        browser: inBrowsers(
          ["chromium", "firefox"],
          playwright({ contextOptions: { forcedColors: "active" } }),
        ),
        setupFiles: [".storybook/vitest.setup.ts"],
        provide: { mode: "light" },
      },
    },
    // WebKit's emulation answers the media query but forces no colours.
    ...(["light", "dark"] as const).map((mode) =>
      everyStory("forced-colors", ["chromium", "firefox"], {
        provider: playwright({ contextOptions: { forcedColors: "active" } }),
        mode,
      }),
    ),
  ];
}

// Logic and the repository's checks.
const nodeProject: TestProjectInlineConfiguration = {
  test: {
    name: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts", "test/**/*.test.ts"],
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

export { coverageAreas, everyBrowser };

export default defineConfig(({ mode }): ViteUserConfig => {
  const check = mode === "stories" ? "stories" : "test";
  return {
    // The aliases of package.json#imports point to the sources here.
    resolve: { conditions: ["moneta-source", ...defaultClientConditions] },
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
