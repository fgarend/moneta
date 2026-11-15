import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import { Separator } from "./separator.js";

const limit = "Monthly limit: 2,000.00";
const alerts = "Alerts by e-mail";
const actions = ["Export", "Print", "Share"];

// What the guidelines give it: a line of 1 px in the colour of a card's edge, and no space of its own.
const line = 1;

function backgroundOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

const meta = {
  title: "Components/Layout & Navigation/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

type Story = StoryObj<typeof meta>;

// Across, between two groups, heard as a separator; the column's gap places it, as it has no space of its own.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className="flex max-w-80 flex-col gap-4 p-6">
      <p>{limit}</p>
      <Separator {...args} />
      <p>{alerts}</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole("separator");
    const { marginTop, marginBottom, backgroundColor } =
      getComputedStyle(separator);

    await expect(separator.tagName).toBe("HR");
    await expect(separator.getBoundingClientRect().height).toBe(line);
    await expect([marginTop, marginBottom]).toEqual(["0px", "0px"]);
    await expect(backgroundColor).toBe(
      backgroundOf("var(--border)", canvasElement),
    );
  },
};

// Upright, between controls in a row, as tall as they are, heard with its orientation.
const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost">
        {actions[0]}
      </Button>
      <Separator orientation="vertical" />
      <Button size="sm" variant="ghost">
        {actions[1]}
      </Button>
      <Button size="sm" variant="ghost">
        {actions[2]}
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const separator = within(canvasElement).getByRole("separator");
    const button = within(canvasElement)
      .getByRole("button", { name: actions[0] })
      .getBoundingClientRect();

    await expect(separator).toHaveAttribute("aria-orientation", "vertical");
    await expect(separator.getBoundingClientRect().width).toBe(line);
    await expect(separator.getBoundingClientRect().height).toBe(button.height);
  },
};

export default meta;
export { Default, Vertical };
