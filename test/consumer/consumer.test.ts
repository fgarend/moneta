// The tarball make package wrote, installed in a throwaway app, as an app would receive it.
import {
  copyFile,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, expect, it } from "vitest";
import { root, sources } from "../sources.js";
import { manifest, packedTarball, run } from "./shared.js";

const inUi = /^\/src\/components\/ui\/(?<name>[^/.]+)\.tsx$/u;
const packaged =
  /^package\/(?:package\.json|README\.md|LICENSE|docs\/guidelines\.md|dist\/.+\.(?:js|d\.ts|css))$/u;
const testOrStory = /\.(?:stories|test)\./u;
const clean = { status: 0, output: "" };
const fontFile = /\.woff2$/u;

// Each piece of ui/, from the sources, so a piece the package fails to offer is noticed.
const specifiers = Object.keys(sources).flatMap((path) => {
  const name = path.match(inUi)?.groups?.["name"];
  return name === undefined ? [] : [`${manifest.name}/ui/${name}`];
});

let app = "";
let tarball = "";

// What the app in make package adds to the tarball: a page, its build's settings and its style sheet.
async function writeAppFiles(): Promise<void> {
  await mkdir(join(app, "src"));
  await writeFile(
    join(app, "index.html"),
    '<!doctype html><body><script type="module" src="/src/main.js"></script></body>',
  );
  await writeFile(
    join(app, "vite.config.js"),
    'import tailwindcss from "@tailwindcss/vite";\nexport default { plugins: [tailwindcss()] };\n',
  );
  await writeFile(
    join(app, "src/main.css"),
    `@import "tailwindcss";\n@import "${manifest.name}/theme.css";\n`,
  );
}

// An app's build from the tarball, the second way `docs/decisions/delivery.md` gives, with what it wrote: its style sheet and files.
async function buildApp(
  fromCode: string,
): Promise<{ css: string; files: string[] }> {
  await rm(join(app, "dist"), { force: true, recursive: true });
  await writeFile(
    join(app, "src/main.js"),
    `${fromCode}
import "./main.css";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "${manifest.name}/ui/button";
createRoot(document.body).render(createElement(Button, null, "Pay"));
`,
  );
  const built = run(join(app, "node_modules/.bin/vite"), ["build"], app);
  if (built.status !== 0) {
    throw new Error(built.output);
  }
  const files = await readdir(join(app, "dist/assets"));
  const sheet = files.find((file) => file.endsWith(".css")) ?? "";
  return {
    css: await readFile(join(app, "dist/assets", sheet), "utf8"),
    files,
  };
}

beforeAll(async () => {
  tarball = await packedTarball();

  app = await mkdtemp(join(tmpdir(), "app-"));
  await writeFile(
    join(app, "package.json"),
    JSON.stringify({ name: "app", private: true, type: "module" }),
  );
  await copyFile(
    new URL("pnpm-workspace.yaml", root),
    join(app, "pnpm-workspace.yaml"),
  );
  await copyFile(
    new URL("test/consumer/tsconfig.json", root),
    join(app, "tsconfig.json"),
  );
  await writeFile(
    join(app, "import.mjs"),
    specifiers.map((specifier) => `import "${specifier}";`).join("\n"),
  );
  await writeFile(
    join(app, "check.ts"),
    specifiers.map((specifier) => `export * from "${specifier}";`).join("\n"),
  );

  await writeAppFiles();

  // What an app brings itself, at the versions used here: the peers, their types, TypeScript and its build.
  const peers = Object.keys(manifest.peerDependencies);
  const brought = [...peers, ...peers.map((peer) => `@types/${peer}`)]
    .concat("typescript", "vite", "@tailwindcss/vite")
    .filter((name) => manifest.devDependencies[name] !== undefined)
    .map((name) => `${name}@${manifest.devDependencies[name]}`);
  const installed = run("pnpm", ["add", tarball, ...brought], app);
  if (installed.status !== 0) {
    throw new Error(installed.output);
  }
});

it("holds only the build, the manifest, the notices and the guidelines", () => {
  const { output } = run("tar", ["tzf", tarball], app);
  const entries = output.trim().split("\n");

  expect(
    entries.filter((entry) => !packaged.test(entry) || testOrStory.test(entry)),
  ).toEqual([]);
  expect(entries).toContain("package/docs/guidelines.md");
});

it("imports every piece in Node", () => {
  expect(run("node", ["import.mjs"], app)).toEqual(clean);
});

// With no class of the package read by the app's Tailwind, the build still passes, and the pieces draw with no style.
it.each([
  ["the classes of its pieces", /\.bg-primary/u],
  ["the theme's values", /:root[^}]*--primary:/u],
  ["the animations", /animate-in/u],
  // Tailwind knows data-open by itself, and only shadcn's sheet reads it as data-state too.
  ["shadcn's variants", /data-state=.?open/u],
])("brings %s to an app's build", async (_, text) => {
  const { css } = await buildApp("");

  expect(css).toMatch(text);
});

it("brings the font only to an app that imports fonts.css", async () => {
  const without = await buildApp("");
  const withFonts = await buildApp(`import "${manifest.name}/fonts.css";`);

  expect(without.files.filter((file) => fontFile.test(file))).toEqual([]);
  expect(withFonts.files.filter((file) => fontFile.test(file))).not.toEqual([]);
  expect(withFonts.css).toContain("@font-face");
});

it.each([
  ["a bundler", []],
  ["Node", ["--module", "nodenext", "--moduleResolution", "nodenext"]],
])("accepts the types of every piece, resolved as %s does", (_, options) => {
  expect(
    run(join(app, "node_modules/.bin/tsc"), ["-p", ".", ...options], app),
  ).toEqual(clean);
});
