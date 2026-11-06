import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Toggle } from "./toggle.js";

const label = "Hide amounts";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["raw"],
  args: { children: label },
} satisfies Meta<typeof Toggle>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: label,
        pressed: false,
      }),
    ).toBeVisible();
  },
};

const Pressed: Story = {
  args: { defaultSelected: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: label,
        pressed: true,
      }),
    ).toBeVisible();
  },
};

export default meta;
export { Default, Pressed };
