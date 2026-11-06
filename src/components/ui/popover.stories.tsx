import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js";

const trigger = "Exchange rate";
const title = "Rate used";
const description = "One unit buys 1.25 units.";

const meta = {
  title: "UI/Popover",
  component: PopoverTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Button variant="outline">{trigger}</Button>
        <Popover>
          <PopoverHeader>
            <PopoverTitle>{title}</PopoverTitle>
            <PopoverDescription>{description}</PopoverDescription>
          </PopoverHeader>
        </Popover>
      </>
    ),
  },
} satisfies Meta<typeof PopoverTrigger>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: trigger }),
    ).toBeEnabled();
    await expect(
      within(document.body).queryByRole("dialog"),
    ).not.toBeInTheDocument();
  },
};

const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: trigger }),
    );
    const popover = await within(document.body).findByRole("dialog");

    await settled(popover);
    await expect(
      within(popover).getByRole("heading", { name: title }),
    ).toBeInTheDocument();
    await expect(popover).toHaveTextContent(description);
  },
};

export default meta;
export { Default, Open };
