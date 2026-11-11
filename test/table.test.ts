// A table has a name, which a screen reader says on entering it: a label, a heading it points to, or its caption.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Table } from "../src/components/table.js";

type TableProps = ComponentProps<typeof Table>;

it("asks a table for its name", () => {
  expectTypeOf<object>().not.toExtend<TableProps>();
  expectTypeOf<{ "aria-label": string }>().toExtend<TableProps>();
  expectTypeOf<{ "aria-labelledby": string }>().toExtend<TableProps>();
  expectTypeOf<{ caption: string }>().toExtend<TableProps>();
});
