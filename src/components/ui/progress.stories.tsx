import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Progress, ProgressLabel, ProgressValue } from "./progress.js";

const label = "Savings goal";
const value = 40;

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["raw"],
  args: {
    value,
    children: (
      <>
        <ProgressLabel>{label}</ProgressLabel>
        <ProgressValue />
      </>
    ),
  },
} satisfies Meta<typeof Progress>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("progressbar", { name: label }),
    ).toHaveAttribute("aria-valuenow", String(value));
  },
};

export default meta;
export { Default };
