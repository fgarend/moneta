// The tarball make package wrote, installed in a throwaway app, as an app would receive it.
import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdtemp,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, expect, it } from "vitest";
import { root, sources } from "../sources.js";

interface Manifest {
  devDependencies: Record<string, string>;
  name: string;
  peerDependencies: Record<string, string>;
}

const manifest = JSON.parse(
  await readFile(new URL("package.json", root), "utf8"),
) as Manifest;
const inUi = /^\/src\/components\/ui\/(?<name>[^/.]+)\.tsx$/u;
const packaged =
  /^package\/(?:package\.json|README\.md|LICENSE|dist\/.+\.(?:js|d\.ts))$/u;
const testOrStory = /\.(?:stories|test)\./u;
const clean = { status: 0, output: "" };

// Each piece of ui/, from the sources, so a piece the package fails to offer is noticed.
const specifiers = Object.keys(sources).flatMap((path) => {
  const name = path.match(inUi)?.groups?.["name"];
  return name === undefined ? [] : [`${manifest.name}/ui/${name}`];
});

function run(
  command: string,
  args: string[],
  cwd: string,
): { status: number | null; output: string } {
  const { status, stdout, stderr } = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
  });
  return { status, output: stdout + stderr };
}

let app = "";
let tarball = "";

beforeAll(async () => {
  const folder = fileURLToPath(new URL(".package/", root));
  const tarballs = await readdir(folder);
  if (tarballs.length !== 1) {
    throw new Error(
      `.package holds ${tarballs.length} files, and make package leaves one tarball there`,
    );
  }
  tarball = join(folder, tarballs[0] ?? "");

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

  // What an app brings itself, at the versions used here: the peers, their types and TypeScript.
  const peers = Object.keys(manifest.peerDependencies);
  const brought = [...peers, ...peers.map((peer) => `@types/${peer}`)]
    .concat("typescript")
    .filter((name) => manifest.devDependencies[name] !== undefined)
    .map((name) => `${name}@${manifest.devDependencies[name]}`);
  const installed = run("pnpm", ["add", tarball, ...brought], app);
  if (installed.status !== 0) {
    throw new Error(installed.output);
  }
});

it("holds only the build, the manifest and the notices", () => {
  const { output } = run("tar", ["tzf", tarball], app);
  const entries = output.trim().split("\n");

  expect(
    entries.filter((entry) => !packaged.test(entry) || testOrStory.test(entry)),
  ).toEqual([]);
});

it("imports every piece in Node", () => {
  expect(run("node", ["import.mjs"], app)).toEqual(clean);
});

it.each([
  ["a bundler", []],
  ["Node", ["--module", "nodenext", "--moduleResolution", "nodenext"]],
])("accepts the types of every piece, resolved as %s does", (_, options) => {
  expect(
    run(join(app, "node_modules/.bin/tsc"), ["-p", ".", ...options], app),
  ).toEqual(clean);
});
