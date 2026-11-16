// An area that scrolls is named by the app's words, which a screen reader hears when it takes focus.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { ScrollArea } from "../src/components/scroll-area.js";

type Props = ComponentProps<typeof ScrollArea>;

it("takes its name in aria-label or aria-labelledby", () => {
  expectTypeOf<{ "aria-label": string }>().toExtend<Props>();
  expectTypeOf<{ "aria-labelledby": string }>().toExtend<Props>();
});

it("takes no area without a name, nor one with two", () => {
  expectTypeOf<{ children: string }>().not.toExtend<Props>();
  expectTypeOf<{
    "aria-label": string;
    "aria-labelledby": string;
  }>().not.toExtend<Props>();
});
