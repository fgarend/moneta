// What is drawn over what, in every browser, as docs/decisions/theme.md orders it: the page; what sticks inside a
// piece, as a table's header; the modal overlays, Dialog and Sheet; and what floats, as a tooltip, a menu or a
// select's list, over them all. Each part that should show is the one the browser finds at its centre.
import { composeStory } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "../src/components/button.js";
import { Dialog, DialogTrigger } from "../src/components/dialog.js";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../src/components/dropdown-menu.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../src/components/select.js";
import { Sheet, SheetTrigger } from "../src/components/sheet.js";
import tableMeta, { StickyHeader } from "../src/components/table.stories.js";
import { Tooltip, TooltipTrigger } from "../src/components/tooltip.js";
import "./preview.css";

const label = "Fictitious";
const showing = 3000;

// The part the browser draws on top at an element's centre. Inert only keeps the pointer from what it holds, and React
// Aria makes inert what is outside the overlay last opened, a tooltip in a dialog, or the dialog under a menu, so
// every inert is lifted while the browser looks.
function topAt(element: Element): Element | null {
  const inert = [...document.querySelectorAll("[inert]")];
  for (const part of inert) {
    part.removeAttribute("inert");
  }
  const { left, top, width, height } = element.getBoundingClientRect();
  const found = document.elementFromPoint(left + width / 2, top + height / 2);
  for (const part of inert) {
    part.setAttribute("inert", "");
  }
  return found;
}

// An element once it is drawn where it goes, as React Aria hides a popover with a clip until it is placed, its entrance
// played to its end.
async function drawn(selector: string): Promise<Element> {
  return await vi.waitFor(
    () => {
      for (const animation of document.getAnimations()) {
        animation.finish();
      }
      const element = document.querySelector(selector);
      if (
        !(element instanceof HTMLElement) ||
        getComputedStyle(element).clipPath !== "none"
      ) {
        throw new Error(`No ${selector} in place yet.`);
      }
      return element;
    },
    { timeout: showing },
  );
}

// Each floats up once its dialog or sheet is open, as a person opens it from inside: React Aria makes inert what was on
// the page before, and a part made inert is not found where it is drawn.
function tooltipIn(isOpen: boolean): ReactElement {
  return (
    <DialogTrigger defaultOpen={true}>
      <Button>{label}</Button>
      <Dialog closeLabel={label}>
        <TooltipTrigger isOpen={isOpen}>
          <Button>{label}</Button>
          <Tooltip>{label}</Tooltip>
        </TooltipTrigger>
      </Dialog>
    </DialogTrigger>
  );
}

function menuIn(isOpen: boolean): ReactElement {
  return (
    <DialogTrigger defaultOpen={true}>
      <Button>{label}</Button>
      <Dialog closeLabel={label}>
        <DropdownMenuTrigger isOpen={isOpen}>
          <Button>{label}</Button>
          <DropdownMenu>
            <DropdownMenuItem>{label}</DropdownMenuItem>
          </DropdownMenu>
        </DropdownMenuTrigger>
      </Dialog>
    </DialogTrigger>
  );
}

function listIn(isOpen: boolean): ReactElement {
  return (
    <SheetTrigger defaultOpen={true}>
      <Button>{label}</Button>
      <Sheet closeLabel={label}>
        <Select aria-label={label} isOpen={isOpen}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem>{label}</SelectItem>
          </SelectContent>
        </Select>
      </Sheet>
    </SheetTrigger>
  );
}

const floating = [
  ["a tooltip", "the dialog", tooltipIn, '[role="tooltip"]'],
  ["a menu", "the dialog", menuIn, '[role="menu"]'],
  ["a select's list", "the sheet", listIn, '[role="listbox"]'],
] as const;

it.each(floating)(
  "draws %s over %s it opens in",
  async (_what, _over, draw, part) => {
    const screen = await render(draw(false));
    // A sheet is a dialog too.
    await drawn('[role="dialog"]');
    await screen.rerender(draw(true));
    const top = await drawn(part);

    expect(top.contains(topAt(top))).toBe(true);
  },
);

it("draws a sheet over a table's sticky header", async () => {
  const Table = composeStory(StickyHeader, tableMeta);
  await render(
    <>
      <Table />
      <SheetTrigger defaultOpen={true}>
        <Button>{label}</Button>
        <Sheet closeLabel={label} side="top">
          {label}
        </Sheet>
      </SheetTrigger>
    </>,
  );
  await drawn('[role="dialog"]');
  const header = document.querySelector("thead th") as Element;

  expect(topAt(header)?.closest('[data-slot^="sheet"]')).not.toBeNull();
});
