// An amount is given, or said to be missing with null, so an app decides what an empty value shows.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Amount } from "../src/components/amount.js";

type AmountProps = ComponentProps<typeof Amount>;

it("asks for a value, or null for none", () => {
  expectTypeOf<object>().not.toExtend<AmountProps>();
  expectTypeOf<{ value: null }>().toExtend<AmountProps>();
  expectTypeOf<{
    value: { amount: string; currency: string };
  }>().toExtend<AmountProps>();
  expectTypeOf<{ value: number }>().not.toExtend<AmountProps>();
});

// A tone is good news or bad, which is not the same as a state of the interface, as success or an error.
it("takes a tone of good news or bad only", () => {
  expectTypeOf<{ value: null; tone: "positive" }>().toExtend<AmountProps>();
  expectTypeOf<{ value: null; tone: "success" }>().not.toExtend<AmountProps>();
});
