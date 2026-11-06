import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, LinkButton } from "./button.js";

// shadcn's Button and LinkButton, on React Aria, which tests their keyboard and press behaviour itself. Of WCAG 2.2, 4.1.2
// (name, role, value) is checked here and by axe. Not checked until there is CSS, in 2.2: 1.4.3 and 1.4.11 (contrast),
// 2.4.7 (focus visible) and 2.5.8 (target size), as axe sees only the browser's own look. Not checked: real screen readers.
const label = "Pay";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: label },
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

const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    await expect(button).toBeDisabled();
  },
};

// The class an app passes wins over the piece's own for the same property, which is what cn is for.
const MergesClasses: Story = {
  args: { className: "h-12" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    await expect(button).toHaveClass("h-12");
    await expect(button).not.toHaveClass("h-8");
  },
};

const Link: Story = {
  render: () => <LinkButton href="#pay">{label}</LinkButton>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Pay" });

    await expect(link).toHaveAttribute("href", "#pay");
  },
};

export default meta;
export { Default, Disabled, Link, MergesClasses, Submit };
