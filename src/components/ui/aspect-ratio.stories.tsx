import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AspectRatio } from "./aspect-ratio.js";

const content = "Receipt preview";
const widescreen = 1.75;

const meta = {
  title: "UI/Aspect Ratio",
  component: AspectRatio,
  tags: ["raw"],
  args: { ratio: widescreen, children: content },
} satisfies Meta<typeof AspectRatio>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(content)).toBeVisible();
  },
};

export default meta;
export { Default };
