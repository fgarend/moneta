import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../../.storybook/settled.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.js";
import { Button } from "./button.js";

const trigger = "Cancel the transfer";
const title = "Cancel this transfer?";
const description = "The amount returns to the savings account.";
const cancel = "Keep it";
const confirm = "Cancel it";

const meta = {
  title: "Components/Overlays & Dialogs/Alert Dialog",
  component: AlertDialogTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Button>{trigger}</Button>
        <AlertDialog>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancel}</AlertDialogCancel>
            <AlertDialogAction>{confirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      </>
    ),
  },
} satisfies Meta<typeof AlertDialogTrigger>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: trigger }),
    ).toBeEnabled();
    await expect(
      within(document.body).queryByRole("alertdialog"),
    ).not.toBeInTheDocument();
  },
};

const Open: Story = {
  play: async ({ canvasElement }) => {
    const body = within(document.body);
    const button = within(canvasElement).getByRole("button", { name: trigger });

    await userEvent.click(button);
    const dialog = await body.findByRole("alertdialog", { name: title });
    await settled(dialog);
    await expect(dialog).toHaveTextContent(description);
    await expect(
      within(dialog).getByRole("button", { name: confirm }),
    ).toBeInTheDocument();
    await expect(
      within(dialog).getByRole("button", { name: cancel }),
    ).toBeInTheDocument();
  },
};

export default meta;
export { Default, Open };
