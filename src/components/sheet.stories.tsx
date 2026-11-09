import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../.storybook/settled.js";
import { Button } from "./button.js";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet.js";

const trigger = "Payment details";
const title = "Details of the payment";
const description = "Paid from the savings account.";
const done = "Done";
// The piece's own name for its close button, with no prop to change it.
const close = "Close";

const meta = {
  title: "Components/Overlays & Dialogs/Sheet",
  component: SheetTrigger,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Button>{trigger}</Button>
        <Sheet>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>{done}</SheetClose>
          </SheetFooter>
        </Sheet>
      </>
    ),
  },
} satisfies Meta<typeof SheetTrigger>;

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
    const sheet = await body.findByRole("dialog", { name: title });
    await settled(sheet);
    await expect(sheet).toHaveTextContent(description);
    await expect(
      within(sheet).getByRole("button", { name: done }),
    ).toBeInTheDocument();
    await expect(
      within(sheet).getByRole("button", { name: close }),
    ).toBeInTheDocument();
  },
};

// Opens it from a story's trigger and returns it settled.
async function openSheet(canvasElement: HTMLElement): Promise<HTMLElement> {
  await userEvent.click(
    within(canvasElement).getByRole("button", { name: trigger }),
  );
  const sheet = await within(document.body).findByRole("dialog", {
    name: title,
  });
  await settled(sheet);
  return sheet;
}

// Through SheetContent, at its defaults: on the right, with a close button.
const Content: Story = {
  args: {
    children: (
      <>
        <Button>{trigger}</Button>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement);

    await expect(sheet.closest('[data-side="right"]')).not.toBeNull();
    await expect(
      within(sheet).getByRole("button", { name: close }),
    ).toBeInTheDocument();
  },
};

// From the left, with no close button, so it closes by Esc or outside.
const LeftWithNoClose: Story = {
  args: {
    children: (
      <>
        <Button>{trigger}</Button>
        <Sheet side="left" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        </Sheet>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement);

    await expect(sheet.closest('[data-side="left"]')).not.toBeNull();
    await expect(
      within(sheet).queryByRole("button", { name: close }),
    ).not.toBeInTheDocument();
  },
};

export default meta;
export { Content, Default, LeftWithNoClose, Open };
