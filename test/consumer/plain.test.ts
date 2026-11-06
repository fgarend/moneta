// The simplest way to use Moneta, in an app with no Tailwind and no settings: the dependency and one import.
import {
  copyFile,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, expect, it } from "vitest";
import { root } from "../sources.js";
import { manifest, packedTarball, run } from "./shared.js";

const fontFile = /\.woff2$/u;
const peerInstalled = /^(?:react-aria-components|lucide-react)@/u;
const tailwindInstalled = /^tailwindcss@/u;
const readsTheme = /\.bg-primary\{background-color:var\(--primary\)/u;

let app = "";
let css = "";
let files: string[] = [];

function versioned(name: string): string {
  return `${name}@${manifest.devDependencies[name]}`;
}

beforeAll(async () => {
  app = await mkdtemp(join(tmpdir(), "plain-app-"));
  await mkdir(join(app, "src"));
  await writeFile(
    join(app, "package.json"),
    JSON.stringify({ name: "plain-app", private: true, type: "module" }),
  );
  await copyFile(
    new URL("pnpm-workspace.yaml", root),
    join(app, "pnpm-workspace.yaml"),
  );
  await writeFile(
    join(app, "index.html"),
    '<!doctype html><body><script type="module" src="/src/main.js"></script></body>',
  );
  await writeFile(
    join(app, "src/main.js"),
    `import "${manifest.name}/styles.css";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "${manifest.name}/ui/button";
createRoot(document.body).render(createElement(Button, null, "Pay"));
`,
  );

  // Peers install by themselves in pnpm's and npm's defaults, which this repository turns off for itself. An app that
  // uses React has it already, and Vite stands for its build.
  const installed = run(
    "pnpm",
    [
      "add",
      "--config.auto-install-peers=true",
      await packedTarball(),
      versioned("react"),
      versioned("react-dom"),
      versioned("vite"),
    ],
    app,
  );
  if (installed.status !== 0) {
    throw new Error(installed.output);
  }
  const built = run(join(app, "node_modules/.bin/vite"), ["build"], app);
  if (built.status !== 0) {
    throw new Error(built.output);
  }
  files = await readdir(join(app, "dist/assets"));
  const sheet = files.find((file) => file.endsWith(".css")) ?? "";
  css = await readFile(join(app, "dist/assets", sheet), "utf8");
});

it("installs the peers by itself, and no Tailwind", async () => {
  const stored = await readdir(join(app, "node_modules/.pnpm"));

  expect(stored.filter((name) => peerInstalled.test(name))).toHaveLength(2);
  expect(stored.filter((name) => tailwindInstalled.test(name))).toEqual([]);
});

it.each([
  ["the classes of its pieces", /\.bg-primary/u],
  ["the theme's values", /:root[^}]*--primary:/u],
  ["the animations", /animate-in/u],
  ["shadcn's variants", /data-state=.?open/u],
  ["the font", /@font-face/u],
])("brings %s with one import", (_, text) => {
  expect(css).toMatch(text);
});

it("brings the font's files", () => {
  expect(files.filter((file) => fontFile.test(file))).not.toEqual([]);
});

// Ready-made classes that read the theme's variables are what lets an app change the look with no Tailwind of its own.
it("keeps the classes reading the theme's values", () => {
  expect(css).toMatch(readsTheme);
});
