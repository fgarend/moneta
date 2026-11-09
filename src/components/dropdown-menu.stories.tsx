import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
        <DropdownMenu>
          <DropdownMenuGroup
            selectionMode="single"
            defaultSelectedKeys={[listKey]}
          >
            <DropdownMenuLabel>{showAs}</DropdownMenuLabel>
            <DropdownMenuItem id={listKey}>{list}</DropdownMenuItem>
            <DropdownMenuItem id={cardsKey}>{cards}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup
            selectionMode="multiple"
            defaultSelectedKeys={[feesKey]}
          >
            <DropdownMenuItem id={feesKey}>{fees}</DropdownMenuItem>
            <DropdownMenuItem id={notesKey} textValue={notes}>
              <span>{notes}</span>
              <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{exportTo}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>{csv}</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger textValue={share}>
              <span>{share}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>{csv}</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenu>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const body = within(document.body);
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: trigger }),
    );
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
