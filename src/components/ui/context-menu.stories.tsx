import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu.js";

const trigger = "Payment";
const view = "View";
const remove = "Remove";

const meta = {
  title: "UI/Context Menu",
  component: ContextMenuTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Button variant="outline">{trigger}</Button>
        <ContextMenu>
          <ContextMenuItem>{view}</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">{remove}</ContextMenuItem>
        </ContextMenu>
      </>
    ),
  },
} satisfies Meta<typeof ContextMenuTrigger>;

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
    const target = within(canvasElement).getByRole("button", { name: trigger });

    await userEvent.pointer({ keys: "[MouseRight]", target });
    const menu = await within(document.body).findByRole("menu");
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
