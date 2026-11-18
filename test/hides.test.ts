// What hiding hides is said in the pieces' own names, and no other.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { MonetaProvider } from "../src/components/moneta-provider.js";

type Hides = ComponentProps<typeof MonetaProvider>["hides"];

it("takes the kinds of value hiding hides", () => {
  expectTypeOf<["amount", "percent", "quantity"]>().toExtend<Hides>();
  expectTypeOf<["amount"]>().toExtend<Hides>();
  expectTypeOf<["money"]>().not.toExtend<Hides>();
});
