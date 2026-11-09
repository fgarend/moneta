// The name of a dialog's or a sheet's close button is the app's to give, in its own words: TypeScript asks for it while
// the button shows, and takes none when it is hidden.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { Dialog, DialogFooter } from "../src/components/dialog.js";
import type { Sheet } from "../src/components/sheet.js";

type DialogProps = ComponentProps<typeof Dialog>;
type FooterProps = ComponentProps<typeof DialogFooter>;
type SheetProps = ComponentProps<typeof Sheet>;
type Body = { children: null };

it("asks a dialog for the name of the close button it shows", () => {
  expectTypeOf<Body>().not.toExtend<DialogProps>();
  expectTypeOf<Body & { closeLabel: string }>().toExtend<DialogProps>();
  expectTypeOf<Body & { showCloseButton: false }>().toExtend<DialogProps>();
});

it("asks a dialog's footer for the name once it shows a close button", () => {
  expectTypeOf<{ showCloseButton: true }>().not.toExtend<FooterProps>();
  expectTypeOf<{
    showCloseButton: true;
    closeLabel: string;
  }>().toExtend<FooterProps>();
  expectTypeOf<object>().toExtend<FooterProps>();
});

it("asks a sheet for the name of the close button it shows", () => {
  expectTypeOf<Body>().not.toExtend<SheetProps>();
  expectTypeOf<Body & { closeLabel: string }>().toExtend<SheetProps>();
  expectTypeOf<Body & { showCloseButton: false }>().toExtend<SheetProps>();
});
