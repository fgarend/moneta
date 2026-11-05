import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { removeScreenshots } from "./update-screenshots.ts";

// A fictitious tree, with approved screenshots beside two tests and a file of the same name elsewhere.
function sourceTree(): string {
  const root = mkdtempSync(join(tmpdir(), "src-"));
  for (const path of [
    "button/__screenshots__/button.visual.test.tsx/idle-chromium-linux.png",
    "other/__screenshots__/text.visual.test.tsx/text-chromium-linux.png",
    "other/data.json",
    "notes/__screenshots__.md",
  ]) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), "");
  }
  return root;
}

describe("removeScreenshots", () => {
  it("removes every folder of approved screenshots, and nothing else", () => {
    const root = sourceTree();

    removeScreenshots(root);

    expect(existsSync(join(root, "button/__screenshots__"))).toBe(false);
    expect(existsSync(join(root, "other/__screenshots__"))).toBe(false);
    expect(existsSync(join(root, "other/data.json"))).toBe(true);
    expect(existsSync(join(root, "notes/__screenshots__.md"))).toBe(true);
  });
});
