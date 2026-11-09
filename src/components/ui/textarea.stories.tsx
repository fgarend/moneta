import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Textarea } from "./textarea.js";

const name = "Note on the payment";

const meta = {
  title: "Components/Form & Input/Textarea",
  component: Textarea,
  tags: ["raw"],
  args: { "aria-label": name },
} satisfies Meta<typeof Textarea>;

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
