import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { root } from "./sources.js";

const ignoreMissingTime =
  /^minimumReleaseAgeIgnoreMissingTime:\s*(?<value>\S+)\s*$/mu;
const exactVersion = /^\d+\.\d+\.\d+$/u;

// pnpm lets a version past the release age when its registry gives no publish time, unless told not to.
it("refuses a version whose publish time is missing", async () => {
  const workspace = await readFile(
    new URL("pnpm-workspace.yaml", root),
    "utf8",
  );

  expect(workspace.match(ignoreMissingTime)?.groups?.["value"]).toBe("false");
});

// A range would let an update in with no diff, which is the point of saving versions exact.
it("gives every development dependency an exact version", async () => {
  const { devDependencies } = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  ) as { devDependencies: Record<string, string> };
  const notExact = Object.entries(devDependencies)
    .filter(([, version]) => !exactVersion.test(version))
    .map(([name, version]) => `${name} ${version}`);

  expect(notExact).toEqual([]);
});
