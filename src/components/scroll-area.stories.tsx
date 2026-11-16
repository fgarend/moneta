import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement, ReactNode } from "react";
import { expect, waitFor, within } from "storybook/test";
import { ScrollArea } from "./scroll-area.js";

const title = "Bills this month";
const titleId = "bills-title";
const bills = [
  "Rent",
  "Groceries",
  "Electricity",
  "Internet",
  "Water",
  "Gas",
  "Insurance",
  "Phone",
];
const few = 2;
// A shadow at each of its four ends, each drawn where it goes on.
const ends = 4;
const shadow = /radial-gradient/gu;

function slot(root: Element, part: string): HTMLElement {
  return root.querySelector(`[data-slot="${part}"]`) as HTMLElement;
}

// The scrollbar the browser gives any area that scrolls, which is the one it keeps.
function scrollbarOf(near: Element): [string, string] {
  const probe = document.createElement("div");
  probe.style.overflow = "auto";
  near.append(probe);
  const { scrollbarWidth, scrollbarColor } = getComputedStyle(probe);
  probe.remove();
  return [scrollbarWidth, scrollbarColor];
}

function list(names: string[]): ReactNode {
  return (
    <ul>
      {names.map((bill) => (
        <li className="py-1" key={bill}>
          {bill}
        </li>
      ))}
    </ul>
  );
}

// A place of fixed height, as a panel: its title, and the area that fills what is left.
function place(area: ReactNode): ReactElement {
  return (
    <div className="p-6">
      <div className="flex h-40 max-w-80 flex-col gap-2" data-testid="place">
        <p className="font-medium" id={titleId}>
          {title}
        </p>
        {area}
      </div>
    </div>
  );
}

const meta = {
  title: "Components/Layout & Navigation/Scroll Area",
  component: ScrollArea,
  args: { "aria-labelledby": titleId, children: list(bills) },
} satisfies Meta<typeof ScrollArea>;

type Story = StoryObj<typeof meta>;

// More than its place holds: it fills what is left under the title and scrolls there, a region named by the title that
// takes focus, with the browser's scrollbar and a shadow where it goes on.
const Default: Story = {
  tags: ["visual"],
  render: (args) => place(<ScrollArea {...args} />),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = slot(canvasElement, "scroll-area");
    const style = getComputedStyle(area);

    await expect(area.getBoundingClientRect().bottom).toBe(
      canvas.getByTestId("place").getBoundingClientRect().bottom,
    );
    await expect(area.scrollHeight).toBeGreaterThan(area.clientHeight);
    await waitFor(() => expect(area).toHaveAttribute("tabindex", "0"));
    await expect(canvas.getByRole("region", { name: title })).toBe(area);
    await expect([style.scrollbarWidth, style.scrollbarColor]).toEqual(
      scrollbarOf(canvasElement),
    );
    await expect(style.backgroundImage.match(shadow)).toHaveLength(ends);
    await expect(style.backgroundAttachment).toContain("local");
  },
};

// What fits its place: no region and no stop for the keyboard, as there is nothing to scroll.
const Fits: Story = {
  args: { children: list(bills.slice(0, few)) },
  render: (args) => place(<ScrollArea {...args} />),
  play: async ({ canvasElement }) => {
    const area = slot(canvasElement, "scroll-area");

    await expect(area.scrollHeight).toBe(area.clientHeight);
    await expect(area).not.toHaveAttribute("tabindex");
    await expect(within(canvasElement).queryByRole("region")).toBeNull();
  },
};

export default meta;
export { Default, Fits };
