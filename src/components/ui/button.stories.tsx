import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, LinkButton } from "./button.js";

// shadcn's Button and LinkButton, on React Aria, which tests their keyboard and press behaviour itself. Of WCAG 2.2, 4.1.2
// (name, role, value) is checked here and by axe, and 1.4.3 (contrast) and 2.5.8 (target size) by axe at rest, in the light
// theme. Not checked: 1.4.11 (contrast of its edges), 2.4.7 (focus visible), its other variants, and real screen readers.
const label = "Pay";
const defaultHeight = 36;
const smallHeight = 32;
const largeHeight = 40;
// What --gold paints, as it is the one name here that shadcn does not have.
const gold = "rgb(240, 189, 42)";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["raw"],
  args: { children: label },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    // Inside a form, a button with no type would submit it.
    await expect(button).toHaveAttribute("type", "button");
    // Its own height, so the theme and Tailwind reach what every story draws.
    await expect(button.offsetHeight).toBe(defaultHeight);
  },
};

const Small: Story = {
  args: { size: "sm" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: label });

    await expect(button.offsetHeight).toBe(smallHeight);
  },
};

const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: label });

    await expect(button.offsetHeight).toBe(largeHeight);
  },
};

const Gold: Story = {
  args: { variant: "gold" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: label });

    await expect(getComputedStyle(button).backgroundColor).toBe(gold);
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
    await expect(button).not.toHaveClass("h-9");
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
export { Default, Disabled, Gold, Large, Link, MergesClasses, Small, Submit };
