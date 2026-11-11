import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Checkbox } from "./checkbox.js";

const name = "Round up payments";

const meta = {
  title: "Components/Form & Input/Checkbox",
  component: Checkbox,
  tags: ["raw"],
  args: { "aria-label": name },
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("checkbox", { name }),
    ).not.toBeChecked();
  },
};

const Checked: Story = {
  args: { defaultSelected: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("checkbox", { name }),
    ).toBeChecked();
  },
};

// Partly checked, as a box over rows of which some are: a dash on the filled box, not a check.
const Indeterminate: Story = {
  args: { isIndeterminate: true },
  play: async ({ canvasElement }) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--primary)";
    canvasElement.append(probe);
    const primary = getComputedStyle(probe).color;
    probe.remove();

    await expect(
      within(canvasElement).getByRole("checkbox", { name }),
    ).toBePartiallyChecked();
    await expect(
      canvasElement.querySelector('[data-slot="checkbox-indicator"] svg'),
    ).toHaveClass("lucide-minus");
    await expect(
      getComputedStyle(
        canvasElement.querySelector('[data-slot="checkbox"]') as Element,
      ).backgroundColor,
    ).toBe(primary);
  },
};

export default meta;
export { Checked, Default, Indeterminate };
