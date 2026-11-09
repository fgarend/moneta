// The gallery's frame, around the stories: Moneta's name and colours, light or dark as the system prefers, in the
// system's font.
import { addons } from "storybook/manager-api";
import { create, getPreferredColorScheme } from "storybook/theming";
import { dark, light, type Palette } from "./themes.js";

// The accent marks what is selected, under Storybook's own white text, which it darkens in dark: graphite in light, and
// the field's edge in dark, as the light graphite under white gives 1.65:1. Gold only takes the little primary marks.
function frame(base: "light" | "dark", colour: Palette, accent: keyof Palette) {
  return create({
    base,
    brandTitle: "Moneta",
    brandUrl: "https://github.com/fgarend/moneta",
    colorPrimary: colour.gold,
    colorSecondary: colour[accent],
    appBg: colour.background,
    appContentBg: colour.card,
    appHoverBg: colour.muted,
    appPreviewBg: colour.background,
    appBorderColor: colour.border,
    textColor: colour.foreground,
    textInverseColor: colour["primary-foreground"],
    textMutedColor: colour["muted-foreground"],
    barTextColor: colour["muted-foreground"],
    barHoverColor: colour.primary,
    barSelectedColor: colour.primary,
    barBg: colour.card,
    buttonBg: colour.card,
    buttonBorder: colour.input,
    booleanBg: colour.muted,
    booleanSelectedBg: colour.card,
    inputBg: colour.card,
    inputBorder: colour.input,
    inputTextColor: colour.foreground,
  });
}

addons.setConfig({
  theme:
    getPreferredColorScheme() === "dark"
      ? frame("dark", dark, "input")
      : frame("light", light, "primary"),
});
