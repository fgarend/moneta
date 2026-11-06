import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Input } from "./input.js";

const name = "Reference";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["raw"],
  args: { "aria-label": name },
} satisfies Meta<typeof Input>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name }),
    ).toBeEnabled();
  },
};

const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name }),
    ).toBeDisabled();
  },
};

export default meta;
export { Default, Disabled };
