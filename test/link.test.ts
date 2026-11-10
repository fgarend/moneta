// A link with nothing in it has no name, so TypeScript asks for what it holds, its words or an icon with a label.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Link } from "../src/components/link.js";

type LinkProps = ComponentProps<typeof Link>;

it("asks a link for what it holds", () => {
  expectTypeOf<{ href: string }>().not.toExtend<LinkProps>();
  expectTypeOf<{ href: string; children: string }>().toExtend<LinkProps>();
});
