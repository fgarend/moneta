import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Spinner } from "./spinner.js";

const name = "Sending the payment";

const meta = {
  title: "Components/Feedback & Status/Spinner",
  component: Spinner,
  tags: ["raw"],
  args: { "aria-label": name },
} satisfies Meta<typeof Spinner>;

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
