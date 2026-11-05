import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

// Every TypeScript file under src/, by its path from the repository's root. A folder of screenshots is named after its
// test, so only files count.
async function sourceFiles(): Promise<string[]> {
  const entries = await readdir(new URL("src/", root), {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")),
    )
    .map((entry) =>
      relative(fileURLToPath(root), join(entry.parentPath, entry.name)),
    );
}

export { root, sourceFiles };
