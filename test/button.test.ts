// What a button asks of the app, so no screen reader meets a button with no name or a wait with no words: an icon's
// sizes ask for a name, a wait for the app's words for it, and a link drawn as a button takes no `link`, which is a
// `Link`.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Button, LinkButton } from "../src/components/button.js";

type ButtonProps = ComponentProps<typeof Button>;
type LinkButtonProps = ComponentProps<typeof LinkButton>;

it("asks an icon's sizes for a name", () => {
  for (const size of ["icon", "icon-xs", "icon-sm", "icon-lg"] as const) {
    expectTypeOf<{ size: typeof size }>().not.toExtend<ButtonProps>();
    expectTypeOf<{
      size: typeof size;
      "aria-label": string;
    }>().toExtend<ButtonProps>();
    expectTypeOf<{
      size: typeof size;
      "aria-labelledby": string;
    }>().toExtend<ButtonProps>();
  }
  expectTypeOf<{ size: "sm" }>().toExtend<ButtonProps>();
});

it("asks a wait for the app's words", () => {
  expectTypeOf<{ isPending: true }>().not.toExtend<ButtonProps>();
  expectTypeOf<{
    isPending: true;
    pendingLabel: string;
  }>().toExtend<ButtonProps>();
  expectTypeOf<{ isPending: false }>().toExtend<ButtonProps>();
});

it("takes no link variant on a link drawn as a button", () => {
  expectTypeOf<{ variant: "link" }>().not.toExtend<LinkButtonProps>();
  expectTypeOf<{ variant: "outline" }>().toExtend<LinkButtonProps>();
  expectTypeOf<{ variant: "link" }>().toExtend<ButtonProps>();
});
