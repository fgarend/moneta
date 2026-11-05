// Gives the tests that import stories what every story runs in: the settings of preview.ts.
import { setProjectAnnotations } from "@storybook/react-vite";
import preview from "./preview.js";

setProjectAnnotations([preview]);
