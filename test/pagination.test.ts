// A pagination has a name, as a page may hold more than one, and Previous and Next their words, which name them.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "../src/components/pagination.js";

it("asks a pagination for its name", () => {
  type Props = ComponentProps<typeof Pagination>;
  expectTypeOf<object>().not.toExtend<Props>();
  expectTypeOf<{ "aria-label": string }>().toExtend<Props>();
  expectTypeOf<{ "aria-labelledby": string }>().toExtend<Props>();
});

it("asks Previous and Next for their words", () => {
  expectTypeOf<object>().not.toExtend<
    ComponentProps<typeof PaginationPrevious>
  >();
  expectTypeOf<object>().not.toExtend<ComponentProps<typeof PaginationNext>>();
  expectTypeOf<{ children: string }>().toExtend<
    ComponentProps<typeof PaginationPrevious>
  >();
});
