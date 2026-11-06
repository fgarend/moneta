import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { root } from "./sources.js";

const checks = /^CHECKS := (?<names>.+)$/mu;
const boxes = /^ +check: \[(?<names>.+)\]$/mu;
const separator = /[ ,]+/u;

async function namesIn(file: string, line: RegExp): Promise<string[]> {
  const text = await readFile(new URL(file, root), "utf8");
  const names = text.match(line)?.groups?.["names"];
  if (names === undefined) {
    throw new Error(`${file} has no line matching ${line}`);
  }
  return names.split(separator);
}

// The list is written twice, and a check missing from continuous integration turns nothing red.
it("has one box per check of make check, in its order", async () => {
  expect(await namesIn(".github/workflows/ci.yml", boxes)).toEqual(
    await namesIn("Makefile", checks),
  );
});
