// A quantity is a decimal string, never a number, or null for none, as an amount is.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Quantity } from "../src/components/quantity.js";

type QuantityProps = ComponentProps<typeof Quantity>;

it("asks for a quantity as a string, or null for none", () => {
  expectTypeOf<object>().not.toExtend<QuantityProps>();
  expectTypeOf<{ value: null }>().toExtend<QuantityProps>();
  expectTypeOf<{ value: string }>().toExtend<QuantityProps>();
  expectTypeOf<{ value: number }>().not.toExtend<QuantityProps>();
});
