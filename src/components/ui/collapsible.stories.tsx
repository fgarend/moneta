import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible.js";

const trigger = "Fees";
const content = "No fee applies to this transfer.";

const meta = {
  title: "Components/Misc/Collapsible",
  component: Collapsible,
  tags: ["raw"],
  args: {
    children: (
      <>
        <CollapsibleTrigger>{trigger}</CollapsibleTrigger>
        <CollapsibleContent>{content}</CollapsibleContent>
      </>
    ),
  },
} satisfies Meta<typeof Collapsible>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: trigger });

    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.getByText(content)).not.toBeVisible();
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(content)).toBeVisible();
  },
};

const Open: Story = {
  args: { defaultExpanded: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(content)).toBeVisible();
  },
};

export default meta;
export { Default, Open };
