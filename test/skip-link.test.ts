// A skip link names where it goes and says so in the app's words.
import type { ComponentProps, ReactNode } from "react";
import { expectTypeOf, it } from "vitest";
import type { SkipLink } from "../src/components/skip-link.js";

type SkipLinkProps = ComponentProps<typeof SkipLink>;

it("asks a skip link for its target, an id, and its words", () => {
  expectTypeOf<{ href: "#main" }>().not.toExtend<SkipLinkProps>();
  expectTypeOf<{ children: ReactNode }>().not.toExtend<SkipLinkProps>();
  expectTypeOf<{
    href: "/main";
    children: ReactNode;
  }>().not.toExtend<SkipLinkProps>();
  expectTypeOf<{
    href: "#main";
    children: ReactNode;
  }>().toExtend<SkipLinkProps>();
});
