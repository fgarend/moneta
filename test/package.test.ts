import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { root } from "./sources.js";

interface Manifest {
  devDependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  sideEffects?: boolean;
}

const manifest = JSON.parse(
  await readFile(new URL("package.json", root), "utf8"),
) as Manifest;

// A script that runs on install runs on the machine of whoever uses Moneta.
it("runs nothing when installed", () => {
  const onInstall = ["preinstall", "install", "postinstall", "prepare"].filter(
    (name) => manifest.scripts?.[name] !== undefined,
  );

  expect(onInstall).toEqual([]);
});

// Peers are not installed on their own here, so one missing from devDependencies would never be tested.
it("installs each peer here as well", () => {
  const missing = Object.keys(manifest.peerDependencies ?? {}).filter(
    (name) => manifest.devDependencies[name] === undefined,
  );

  expect(missing).toEqual([]);
});

// shadcn's license asks that its notice stay with copies of its code, and LICENSE is always packed.
it("keeps shadcn's copyright with the code copied from it", async () => {
  const license = await readFile(new URL("LICENSE", root), "utf8");

  expect(license).toContain("Copyright (c) 2023 shadcn");
});

// So an app's bundler can leave out the pieces it does not import. The app in make package cannot see this.
it("tells bundlers that importing a piece has no side effects", () => {
  expect(manifest.sideEffects).toBe(false);
});
