const root = new URL("../", import.meta.url);

// The text of every TypeScript file under src/, by its path, which starts with /src/.
const sources = import.meta.glob<string>("/src/**/*.{ts,tsx}", {
  eager: true,
  import: "default",
  query: "?raw",
});

export { root, sources };
