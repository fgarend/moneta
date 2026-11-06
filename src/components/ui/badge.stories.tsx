import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./badge.js";

const label = "Settled";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["raw"],
  args: { children: label },
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(label)).toBeVisible();
  },
};

export default meta;
export { Default };
