import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu.js";

const trigger = "Payment";
const view = "View";
const remove = "Remove";

const meta = {
  title: "Components/Overlays & Dialogs/Context Menu",
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

// The keys React Aria knows each item by, which no element takes as its id.
const listKey = "list";
const cardsKey = "cards";
const feesKey = "fees";
const notesKey = "notes";

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

const showAs = "Show as";
const list = "List";
const cards = "Cards";
const fees = "Fees";
const notes = "Notes";
const shortcut = "⌘N";
const exportTo = "Export";
const csv = "CSV";
const share = "Share";

// Every part: a group with its label and one choice, a group of several choices, an item with a shortcut and words of
// its own, and a submenu.
const AllParts: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">{trigger}</Button>
        <ContextMenu>
          <ContextMenuGroup
            selectionMode="single"
            defaultSelectedKeys={[listKey]}
          >
            <ContextMenuLabel>{showAs}</ContextMenuLabel>
            <ContextMenuItem id={listKey}>{list}</ContextMenuItem>
            <ContextMenuItem id={cardsKey}>{cards}</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup
            selectionMode="multiple"
            defaultSelectedKeys={[feesKey]}
          >
            <ContextMenuItem id={feesKey}>{fees}</ContextMenuItem>
            <ContextMenuItem id={notesKey} textValue={notes}>
              <span>{notes}</span>
              <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>{exportTo}</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>{csv}</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger textValue={share}>
              <span>{share}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>{csv}</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenu>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const body = within(document.body);
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: within(canvasElement).getByRole("button", { name: trigger }),
    });
    const opened = await body.findByRole("menu", { name: trigger });
    await settled(opened);
    const menu = within(opened);

    await expect(menu.getByRole("menuitemradio", { name: list })).toBeChecked();
    await expect(
      menu.getByRole("menuitemradio", { name: cards }),
    ).not.toBeChecked();
    await expect(
      menu.getByRole("menuitemcheckbox", { name: fees }),
    ).toBeChecked();
    await expect(menu.getByText(shortcut)).toBeInTheDocument();
    await userEvent.click(menu.getByRole("menuitem", { name: exportTo }));
    const submenu = await body.findByRole("menu", { name: exportTo });
    await settled(submenu);
    await expect(
      within(submenu).getByRole("menuitem", { name: csv }),
    ).toBeInTheDocument();
    await expect(menu.getByRole("menuitem", { name: share })).toHaveAttribute(
      "aria-haspopup",
      "menu",
    );
  },
};

export default meta;
export { AllParts, Default, Open };
