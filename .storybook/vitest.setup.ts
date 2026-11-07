// Gives the tests that import stories what every story runs in: the settings of preview.ts, and the project's mode.
import { setProjectAnnotations } from "@storybook/react-vite";
import { inject } from "vitest";
import preview from "./preview.js";

declare module "vitest" {
  interface ProvidedContext {
    mode: "light" | "dark";
  }
}

setProjectAnnotations([preview]);
// A story drawn as a component runs no effect of Storybook's, so the themes addon never sets the class here: this
// sets it where the addon would, on the page's root.
document.documentElement.classList.toggle("dark", inject("mode") === "dark");
