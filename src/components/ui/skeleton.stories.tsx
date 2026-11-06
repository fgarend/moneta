import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Skeleton } from "./skeleton.js";

const name = "Balance on its way";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["raw"],
  args: { "aria-label": name, className: "h-4 w-32", role: "status" },
} satisfies Meta<typeof Skeleton>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status", { name }),
    ).toBeVisible();
  },
};

export default meta;
export { Default };
