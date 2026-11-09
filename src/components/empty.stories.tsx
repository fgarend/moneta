import type { Meta, StoryObj } from "@storybook/react-vite";
import { Receipt } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty.js";

const title = "No payments yet";
const description = "Payments appear here once one is made.";
const action = "Make a payment";

const meta = {
  title: "Components/Feedback & Status/Empty",
  component: Empty,
  tags: ["raw"],
  args: {
    children: (
      <>
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>{action}</Button>
        </EmptyContent>
      </>
    ),
  },
} satisfies Meta<typeof Empty>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(title)).toBeVisible();
    await expect(canvas.getByText(description)).toBeVisible();
    await expect(canvas.getByRole("button", { name: action })).toBeVisible();
  },
};

// What sits above the title: an image as it is, or an icon on a tile.
function withMedia(variant?: "icon") {
  return (
    <EmptyHeader>
      <EmptyMedia variant={variant}>
        <Receipt aria-hidden={true} />
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
    </EmptyHeader>
  );
}

const WithMedia: Story = {
  args: { children: withMedia() },
  play: async ({ canvasElement }) => {
    const media = canvasElement.querySelector('[data-slot="empty-icon"]');
    await expect(media).toHaveAttribute("data-variant", "default");
    await expect(media?.querySelector("svg")).toBeVisible();
  },
};

const WithIcon: Story = {
  args: { children: withMedia("icon") },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="empty-icon"]'),
    ).toHaveAttribute("data-variant", "icon");
  },
};

export default meta;
export { Default, WithIcon, WithMedia };
