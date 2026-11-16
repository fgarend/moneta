// A key shown as a symbol takes its name in words, which a screen reader hears.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Kbd } from "../src/components/kbd.js";

it("takes a symbol's name in words", () => {
  expectTypeOf<ComponentProps<typeof Kbd>["label"]>().toEqualTypeOf<
    string | undefined
  >();
});
