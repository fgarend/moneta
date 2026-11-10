// A ratio is a decimal string, never a number, or null for none, as an amount is.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Percent } from "../src/components/percent.js";

type PercentProps = ComponentProps<typeof Percent>;

it("asks for a ratio as a string, or null for none", () => {
  expectTypeOf<object>().not.toExtend<PercentProps>();
  expectTypeOf<{ value: null }>().toExtend<PercentProps>();
  expectTypeOf<{ value: string }>().toExtend<PercentProps>();
  expectTypeOf<{ value: number }>().not.toExtend<PercentProps>();
});
