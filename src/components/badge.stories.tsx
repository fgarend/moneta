import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./badge.js";

const label = "Settled";

// The colour a value of the theme resolves to where the badge sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

const meta = {
  title: "Components/Feedback & Status/Badge",
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

// Drawn as another element, here a link, which keeps the badge's look.
const AsLink: Story = {
  args: { render: (props) => <a href="#settled" {...props} /> },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: label });

    await expect(link).toHaveAttribute("href", "#settled");
    await expect(link).toHaveAttribute("data-slot", "badge");
  },
};

// The colours of meaning, each its words in its colour on a soft tint of it, in light and in dark; the words say the
// meaning too.
const meanings = [
  ["destructive", "Overdue"],
  ["success", "Paid"],
  ["warning", "Due tomorrow"],
  ["info", "Scheduled"],
] as const;

const Meanings: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex gap-2 p-6">
      {meanings.map(([variant, words]) => (
        <Badge key={variant} variant={variant}>
          {words}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // A colour of its own, not the page's text, which a missing token would leave.
    const plain = colourOf("var(--foreground)", canvasElement);
    for (const [variant, words] of meanings) {
      const badge = within(canvasElement).getByText(words);
      await expect(getComputedStyle(badge).color).toBe(
        colourOf(`var(--${variant})`, canvasElement),
      );
      await expect(getComputedStyle(badge).color).not.toBe(plain);
      await expect(getComputedStyle(badge).backgroundColor).not.toBe(
        "rgba(0, 0, 0, 0)",
      );
    }
  },
};

export default meta;
export { AsLink, Default, Meanings };
