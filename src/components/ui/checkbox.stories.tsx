import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Checkbox } from "./checkbox.js";

const name = "Round up payments";

const meta = {
  title: "UI/Checkbox",
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

export default meta;
export { Checked, Default };
