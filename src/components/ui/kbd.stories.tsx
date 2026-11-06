import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Kbd, KbdGroup } from "./kbd.js";

const modifier = "Ctrl";
const key = "K";

const meta = {
  title: "UI/Kbd",
  component: KbdGroup,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Kbd>{modifier}</Kbd>
        <Kbd>{key}</Kbd>
      </>
    ),
  },
} satisfies Meta<typeof KbdGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(modifier)).toBeVisible();
    await expect(canvas.getByText(key)).toBeVisible();
  },
};

export default meta;
export { Default };
