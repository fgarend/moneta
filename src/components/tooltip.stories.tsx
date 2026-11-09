import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../.storybook/settled.js";
import { Button } from "./button.js";
import { Tooltip, TooltipTrigger } from "./tooltip.js";

const trigger = "Fee";
const content = "No fee applies to this transfer.";

const meta = {
  title: "Components/Overlays & Dialogs/Tooltip",
  component: Tooltip,
  tags: ["raw"],
  args: { children: content },
  // Two direct children: the piece takes them apart with Children.toArray, which does not open a fragment.
  render: (args) => (
    <TooltipTrigger>
      <Button variant="outline">{trigger}</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: trigger }),
    ).toBeEnabled();
    await expect(
      within(document.body).queryByRole("tooltip"),
    ).not.toBeInTheDocument();
  },
};

// It says itself as the trigger's description.
const Open: Story = {
  play: async ({ canvasElement }) => {
    // A pointer moves before it arrives, which React Aria needs to count it as hovering.
    await userEvent.hover(canvasElement);
    await userEvent.hover(
      within(canvasElement).getByRole("button", { name: trigger }),
    );
    const tooltip = await within(document.body).findByRole("tooltip");

    await settled(tooltip);
    await expect(tooltip).toHaveTextContent(content);
    await expect(
      within(canvasElement).getByRole("button", { name: trigger }),
    ).toHaveAccessibleDescription(content);
  },
};

// On each side of the trigger, with room around it so none flips, the arrow follows the side.
function onSide(placement: "top" | "bottom" | "left" | "right"): Story {
  return {
    args: { placement },
    decorators: [
      (Story) => (
        <div className="flex justify-center p-16">
          <Story />
        </div>
      ),
    ],
    play: async ({ canvasElement }) => {
      await userEvent.hover(canvasElement);
      await userEvent.hover(
        within(canvasElement).getByRole("button", { name: trigger }),
      );
      const tooltip = await within(document.body).findByRole("tooltip");
      await settled(tooltip);

      await expect(tooltip).toHaveAttribute("data-placement", placement);
    },
  };
}

const Top = onSide("top");
const Bottom = onSide("bottom");
const Left = onSide("left");
const Right = onSide("right");

export default meta;
export { Bottom, Default, Left, Open, Right, Top };
