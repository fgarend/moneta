// A page's title that loads asks for the app's words for it, which a screen reader hears in place of the title.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { PageTitle } from "../src/components/page-header.js";

type TitleProps = ComponentProps<typeof PageTitle>;
type Words = { children: string };

it("asks a loading title for the app's words", () => {
  expectTypeOf<Words & { isLoading: boolean }>().not.toExtend<TitleProps>();
  expectTypeOf<
    Words & { isLoading: boolean; loadingLabel: string }
  >().toExtend<TitleProps>();
  expectTypeOf<Words>().toExtend<TitleProps>();
});
