import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Slider } from "./slider.js";

const name = "Share to save";
const value = 40;

const meta = {
  title: "Components/Form & Input/Slider",
  component: Slider,
  tags: ["raw"],
  args: { "aria-label": name, defaultValue: value },
} satisfies Meta<typeof Slider>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("slider", { name }),
    ).toHaveValue(String(value));
  },
};

export default meta;
export { Default };
