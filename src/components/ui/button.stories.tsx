import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";

// The minimal button the pipeline runs on, until shadcn's replaces it. Of WCAG 2.2, 4.1.2 (name, role, value) is checked
// here and by axe, and 2.5.8 (target size) by axe. Not checked: 2.1.1 (keyboard), left to the browser's own button, and
// real screen readers.
const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Pay" },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    // Inside a form, a button with no type would submit it.
    await expect(button).toHaveAttribute("type", "button");
  },
};

const Submit: Story = {
  args: { type: "submit" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    await expect(button).toHaveAttribute("type", "submit");
  },
};

export default meta;
export { Default, Submit };
