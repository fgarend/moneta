// A preview is what a press does in place of going to a link's page, so a piece takes one only with a page.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Link } from "../src/components/link.js";
import type { TickerChip } from "../src/components/ticker-chip.js";

type LinkProps = ComponentProps<typeof Link>;
type ChipProps = ComponentProps<typeof TickerChip>;
type Text = { children: string };
type Preview = { onPreview: () => void };

it("takes a preview on a link with a page", () => {
  expectTypeOf<Text & Preview & { href: string }>().toExtend<LinkProps>();
  expectTypeOf<Text & Preview & { href: string }>().toExtend<ChipProps>();
});

it("takes no preview on a link with no page", () => {
  expectTypeOf<Text & Preview>().not.toExtend<LinkProps>();
  expectTypeOf<Text & Preview>().not.toExtend<ChipProps>();
});
