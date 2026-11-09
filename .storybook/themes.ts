// The theme's colours the gallery's frame paints, by their names in theme.css, in each mode. The frame cannot read the
// theme's variables, so it repeats their values, and test/gallery.test.ts keeps them the same.
const light = {
  background: "#faf9f6",
  card: "#ffffff",
  foreground: "#23262b",
  "muted-foreground": "#5f636a",
  primary: "#2b2e33",
  "primary-foreground": "#ffffff",
  muted: "#eeede8",
  border: "#e7e5df",
  input: "#8e8c84",
  gold: "#f0bd2a",
};

const dark: typeof light = {
  background: "#1a1b1e",
  card: "#232529",
  foreground: "#f4f4f2",
  "muted-foreground": "#b4b7bd",
  primary: "#f4f4f2",
  "primary-foreground": "#1a1b1e",
  muted: "#30333a",
  border: "#35383d",
  input: "#868a91",
  gold: "#f0bd2a",
};

type Palette = typeof light;

export { dark, light, type Palette };
