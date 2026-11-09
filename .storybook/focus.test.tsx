// What keyboard focus draws on the pieces, in every browser, also in forced colours through the project focus-forced:
// a solid outline, which a shadow ring is not in forced colours, on the element a person sees, with the keyboard's own Tab.

import type { ReactElement } from "react";
import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Button, LinkButton } from "../src/components/button.js";
import { Checkbox } from "../src/components/checkbox.js";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../src/components/dialog.js";
import { Input } from "../src/components/input.js";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group.js";
import { Switch } from "../src/components/switch.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src/components/tabs.js";
import { Textarea } from "../src/components/textarea.js";
import { Toggle } from "../src/components/toggle.js";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../src/components/ui/dropdown-menu.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../src/components/ui/select.js";
import { Slider } from "../src/components/ui/slider.js";
import "./preview.css";

const label = "Fictitious";
const withWidth = "2px";
const ringShadow = /0px 0px 0px 3px/u;
const closing = 5000;
const forced = matchMedia("(forced-colors: active)").matches;
// Checkbox, Radio, Switch and Slider keep focus on a hidden input, and draw on their label or thumb.
const drawnBy =
  '[data-slot="checkbox"],[data-slot="switch"],[data-slot="radio-group-item"],[data-slot="slider-thumb"]';

function focused(): Element {
  const element = document.activeElement as Element;
  return element.closest(drawnBy) ?? element;
}

function outlineOf(element: Element): {
  style: string;
  width: string;
  ring: boolean;
} {
  const { outlineStyle, outlineWidth, boxShadow } = getComputedStyle(element);
  return {
    style: outlineStyle,
    width: outlineWidth,
    // The piece's own ring, 3 px wide, should be gone.
    ring: ringShadow.test(boxShadow),
  };
}

const solid = { style: "solid", width: withWidth, ring: false };

// With no animation to wait for, as headless WebKit sometimes never ends a dialog's closing one, which says nothing of focus.
// Nor a transition, which fades the outline's colour in over frames that a loaded WebKit spaced past a second.
const still = document.createElement("style");
still.textContent =
  "* { animation: none !important; transition: none !important; }";
document.head.append(still);

const pieces: [string, ReactElement][] = [
  ["Slider", <Slider key="a" aria-label={label} defaultValue={50} />],
  ["Button", <Button key="a">{label}</Button>],
  [
    "Button outline",
    <Button key="a" variant="outline">
      {label}
    </Button>,
  ],
  [
    "Button ghost",
    <Button key="a" variant="ghost">
      {label}
    </Button>,
  ],
  [
    "Button gold",
    <Button key="a" variant="gold">
      {label}
    </Button>,
  ],
  [
    "LinkButton",
    <LinkButton href="#a" key="a">
      {label}
    </LinkButton>,
  ],
  ["Input", <Input aria-label={label} key="a" />],
  ["Textarea", <Textarea aria-label={label} key="a" />],
  ["Checkbox", <Checkbox aria-label={label} key="a" />],
  ["Switch", <Switch aria-label={label} key="a" />],
  [
    "Toggle",
    <Toggle aria-label={label} key="a">
      {label}
    </Toggle>,
  ],
  [
    "Radio",
    <RadioGroup aria-label={label} key="a">
      <RadioGroupItem aria-label={label} value="a" />
    </RadioGroup>,
  ],
  [
    "Select",
    <Select aria-label={label} key="a">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem>{label}</SelectItem>
      </SelectContent>
    </Select>,
  ],
  [
    "Tabs",
    <Tabs key="a">
      <TabsList aria-label={label}>
        <TabsTrigger id={label}>{label}</TabsTrigger>
      </TabsList>
      <TabsContent id={label}>{label}</TabsContent>
    </Tabs>,
  ],
];

it.each(pieces)("draws an outline around %s", async (_name, piece) => {
  await render(piece);
  await userEvent.keyboard("{Tab}");

  await vi.waitFor(() => expect(outlineOf(focused())).toEqual(solid));
});

it("draws no outline on a click", async () => {
  const screen = await render(<Button>{label}</Button>);
  await screen.getByRole("button").click();
  await expect.element(screen.getByRole("button")).toHaveFocus();

  expect(
    getComputedStyle(screen.getByRole("button").element()).outlineStyle,
  ).toBe("none");
});

it("shows which item of a menu the keyboard is on", async () => {
  await render(
    <DropdownMenuTrigger>
      <Button>{label}</Button>
      <DropdownMenu>
        <DropdownMenuItem>{label}</DropdownMenuItem>
      </DropdownMenu>
    </DropdownMenuTrigger>,
  );
  await userEvent.keyboard("{Tab}{Enter}");

  await vi.waitFor(() => {
    const item = document.querySelector('[role="menuitem"]') as Element;
    expect(document.activeElement).toBe(item);
    const { backgroundColor, outlineStyle } = getComputedStyle(item);
    expect(
      forced ||
        outlineStyle === "solid" ||
        backgroundColor !== "rgba(0, 0, 0, 0)",
    ).toBe(true);
  });
});

it("gives focus back to the trigger with its outline when a dialog closes", async () => {
  await render(
    <DialogTrigger>
      <Button>{label}</Button>
      <Dialog>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{label}</DialogDescription>
        </DialogHeader>
      </Dialog>
    </DialogTrigger>,
  );
  await userEvent.keyboard("{Tab}{Enter}");
  // Escape counts only once focus is inside.
  await vi.waitFor(() =>
    expect(
      document
        .querySelector('[role="dialog"]')
        ?.contains(document.activeElement),
    ).toBe(true),
  );
  await userEvent.keyboard("{Escape}");
  await vi.waitFor(
    () => expect(document.querySelector('[role="dialog"]')).toBeNull(),
    { timeout: closing },
  );

  // React Aria gives focus back a frame after the dialog closes, and a loaded WebKit took up to 670 ms for that frame.
  const trigger = document.querySelector('[data-slot="button"]') as Element;
  await vi.waitFor(() => expect(document.activeElement).toBe(trigger), {
    timeout: closing,
  });
  await vi.waitFor(() => expect(outlineOf(trigger)).toEqual(solid));
});

it("reads the ring of the area it is in", async () => {
  const screen = await render(
    <div className="[--ring:rgb(1,2,3)]">
      <Button>{label}</Button>
    </div>,
  );
  await userEvent.keyboard("{Tab}");

  if (!forced) {
    await vi.waitFor(() =>
      expect(
        getComputedStyle(screen.getByRole("button").element()).outlineColor,
      ).toBe("rgb(1, 2, 3)"),
    );
  }
});
