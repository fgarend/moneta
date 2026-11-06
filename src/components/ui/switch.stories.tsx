import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Switch } from "./switch.js";

const name = "Round up payments";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["raw"],
  args: { "aria-label": name },
} satisfies Meta<typeof Switch>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("switch", { name }),
    ).not.toBeChecked();
  },
};

const Checked: Story = {
  args: { defaultSelected: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("switch", { name }),
    ).toBeChecked();
  },
};

export default meta;
export { Checked, Default };
