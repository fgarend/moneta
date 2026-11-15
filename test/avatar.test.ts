// An avatar is hidden from screen readers, so what it says beyond the name beside it is in the app's words: a
// badge's state, and a group's people.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { AvatarBadge, AvatarGroup } from "../src/components/avatar.js";

it("asks the app's words for a badge and a group", () => {
  expectTypeOf<
    ComponentProps<typeof AvatarBadge>["label"]
  >().toEqualTypeOf<string>();
  expectTypeOf<
    ComponentProps<typeof AvatarGroup>["aria-label"]
  >().toEqualTypeOf<string>();
});
