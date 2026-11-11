// A list loading says so in the app's words.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { ItemGroup } from "../src/components/item.js";

type ItemGroupProps = ComponentProps<typeof ItemGroup>;

it("asks a loading list for its words", () => {
  expectTypeOf<{ isLoading: boolean }>().not.toExtend<ItemGroupProps>();
  expectTypeOf<{
    isLoading: boolean;
    loadingLabel: string;
  }>().toExtend<ItemGroupProps>();
  expectTypeOf<object>().toExtend<ItemGroupProps>();
});
