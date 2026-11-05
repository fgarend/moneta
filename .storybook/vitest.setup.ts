// Gives the tests that import stories what every story runs in: the decorators and parameters of preview.tsx.
import { setProjectAnnotations } from "@storybook/react-vite";
import * as preview from "./preview.js";

setProjectAnnotations([preview]);
