// A badge only shows: nothing draws it as a link, and it takes no control's look.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Badge } from "../src/components/badge.js";

type BadgeProps = ComponentProps<typeof Badge>;
type BadgeVariant = NonNullable<BadgeProps["variant"]>;

it("draws a badge as a label alone", () => {
  expectTypeOf<BadgeProps>().not.toHaveProperty("render");
  expectTypeOf<"ghost">().not.toExtend<BadgeVariant>();
  expectTypeOf<"link">().not.toExtend<BadgeVariant>();
  expectTypeOf<"secondary">().toExtend<BadgeVariant>();
});
