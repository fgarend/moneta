import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Separator } from "./separator.js";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["raw"],
} satisfies Meta<typeof Separator>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("separator"),
    ).toBeInTheDocument();
  },
};

export default meta;
export { Default };
