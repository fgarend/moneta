import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { root } from "./sources.js";

const variable = /--(?<name>[a-z][a-z0-9-]*[a-z0-9])/gu;
const declaration = /--(?<name>[\w-]+):/gu;
const markdownLink = /\]\((?<target>[^)]+)\)/gu;

const guidelines = await readFile(new URL("docs/guidelines.md", root), "utf8");
const theme = await readFile(new URL("src/styles/theme.css", root), "utf8");

// So a variable renamed or removed in the theme does not live on in the guide that goes to every app.
it("names only variables the theme declares", () => {
  const declared = new Set(
    [...theme.matchAll(declaration)].map(({ groups }) => groups?.["name"]),
  );
  const named = [...guidelines.matchAll(variable)].map(
    ({ groups }) => groups?.["name"],
  );

  expect(named).not.toEqual([]);
  expect(named.filter((name) => !declared.has(name))).toEqual([]);
});

// It goes in the tarball, where the repository's other files do not exist.
it("links only to the web", () => {
  const targets = [...guidelines.matchAll(markdownLink)].map(
    ({ groups }) => groups?.["target"] ?? "",
  );

  expect(targets.filter((target) => !target.startsWith("https://"))).toEqual(
    [],
  );
});
