import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./badge.js";

const label = "Settled";

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

export default meta;
export { AsLink, Default };
