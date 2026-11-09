import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { settled } from "../../../.storybook/settled.js";
import { LinkButton } from "./button.js";
import { HoverCard, HoverCardTrigger } from "./hover-card.js";

const trigger = "Savings";
const content = "Balance 1,250.00";

const meta = {
  title: "Components/Overlays & Dialogs/Hover Card",
  component: HoverCardTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <LinkButton href="#savings" variant="link">
          {trigger}
        </LinkButton>
        <HoverCard>{content}</HoverCard>
      </>
    ),
  },
} satisfies Meta<typeof HoverCardTrigger>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("link", { name: trigger }),
    ).toHaveAttribute("href", "#savings");
    await expect(
      within(document.body).queryByText(content),
    ).not.toBeInTheDocument();
  },
};

// Opened from the start, as what opens it by focus or by hovering is React Aria's, and not checked here.
const Open: Story = {
  args: {
    children: (
      <>
        <LinkButton href="#savings" variant="link">
          {trigger}
        </LinkButton>
        <HoverCard aria-label={trigger} defaultOpen={true}>
          {content}
        </HoverCard>
      </>
    ),
  },
  play: async () => {
    const card = within(document.body).getByRole("dialog", { name: trigger });

    await settled(card);
    await expect(card).toHaveTextContent(content);
  },
};

export default meta;
export { Default, Open };
