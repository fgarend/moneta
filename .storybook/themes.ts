// The theme's colours the gallery's frame paints, by their names in theme.css, in each mode. The frame cannot read the
// theme's variables, so it repeats their values, and test/gallery.test.ts keeps them the same.
const light = {
  background: "#f9f9f9",
  card: "#ffffff",
  foreground: "#23262b",
  "muted-foreground": "#5f636a",
  primary: "#2b2e33",
  "primary-foreground": "#ffffff",
  muted: "#f3f3f3",
  border: "#e6e6e6",
  input: "#8a8a8a",
  gold: "#f0bd2a",
};

const dark: typeof light = {
  background: "#2f3133",
  card: "#3a3c3f",
  foreground: "#f1f3f5",
  "muted-foreground": "#b4b9bf",
  primary: "#f1f3f5",
  "primary-foreground": "#2f3133",
  muted: "#45484c",
  border: "#4a4d51",
  input: "#8d939a",
  gold: "#f0bd2a",
};

type Palette = typeof light;

export { dark, light, type Palette };
