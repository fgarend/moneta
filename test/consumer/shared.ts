// What the throwaway apps of make package have in common.
import { spawnSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { root } from "../sources.js";

interface Manifest {
  devDependencies: Record<string, string>;
  name: string;
  peerDependencies: Record<string, string>;
}

const manifest = JSON.parse(
  await readFile(new URL("package.json", root), "utf8"),
) as Manifest;

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

// The one tarball make package leaves.
async function packedTarball(): Promise<string> {
  const folder = fileURLToPath(new URL(".package/", root));
  const tarballs = await readdir(folder);
  if (tarballs.length !== 1) {
    throw new Error(
      `.package holds ${tarballs.length} files, and make package leaves one tarball there`,
    );
  }
  return join(folder, tarballs[0] ?? "");
}

export { manifest, packedTarball, run };
