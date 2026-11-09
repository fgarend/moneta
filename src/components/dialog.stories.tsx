import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";

const trigger = "Edit the note";
const title = "Note on the payment";
const description = "Only you see this note.";
const done = "Done";
// The close button's name, which the app gives in its own words.
const close = "Close the note";

const meta = {
  title: "Components/Overlays & Dialogs/Dialog",
  component: DialogTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Button>{trigger}</Button>
        <Dialog closeLabel={close}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>{done}</DialogClose>
          </DialogFooter>
        </Dialog>
      </>
    ),
  },
} satisfies Meta<typeof DialogTrigger>;

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
    const body = within(document.body);
    const button = within(canvasElement).getByRole("button", { name: trigger });

    await userEvent.click(button);
    const dialog = await body.findByRole("dialog", { name: title });
    await settled(dialog);
    await expect(dialog).toHaveTextContent(description);
    await expect(
      within(dialog).getByRole("button", { name: done }),
    ).toBeInTheDocument();
    await expect(
      within(dialog).getByRole("button", { name: close }),
    ).toBeInTheDocument();
  },
};

// With no close button in the corner, and the footer's instead.
const CloseInFooter: Story = {
  args: {
    children: (
      <>
        <Button>{trigger}</Button>
        <Dialog showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogFooter showCloseButton={true} closeLabel={close} />
        </Dialog>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: trigger }),
    );
    const dialog = await within(document.body).findByRole("dialog", {
      name: title,
    });
    await settled(dialog);

    await expect(
      within(dialog).getAllByRole("button", { name: close }),
    ).toHaveLength(1);
    await expect(
      dialog.querySelector('[data-slot="dialog-footer"] button'),
    ).toHaveTextContent(close);
  },
};

export default meta;
export { CloseInFooter, Default, Open };
