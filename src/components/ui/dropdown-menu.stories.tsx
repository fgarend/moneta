import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

const trigger = "Options";
const view = "View";
const remove = "Remove";

const meta = {
  title: "Components/Overlays & Dialogs/Dropdown Menu",
  component: DropdownMenuTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Button variant="outline">{trigger}</Button>
        <DropdownMenu>
          <DropdownMenuItem>{view}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">{remove}</DropdownMenuItem>
        </DropdownMenu>
      </>
    ),
  },
} satisfies Meta<typeof DropdownMenuTrigger>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: trigger }),
    ).toBeEnabled();
    await expect(
      within(document.body).queryByRole("menu"),
    ).not.toBeInTheDocument();
  },
};

const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: trigger }),
    );
    const menu = await within(document.body).findByRole("menu", {
      name: trigger,
    });
    await settled(menu);
    await expect(
      within(menu).getByRole("menuitem", { name: view }),
    ).toBeInTheDocument();
    await expect(
      within(menu).getByRole("menuitem", { name: remove }),
    ).toBeInTheDocument();
  },
};

export default meta;
export { Default, Open };
