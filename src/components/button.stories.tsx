import type { Meta, StoryObj } from "@storybook/react-vite";
import { DownloadIcon, SendIcon, Trash2Icon } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { contrast } from "../../.storybook/contrast.js";
import { settled } from "../../.storybook/settled.js";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.js";
import { Button, LinkButton } from "./button.js";

// Button and LinkButton, on React Aria, which tests their keyboard, press and the wait's announcement itself. Of WCAG
// 2.2, 1.4.3 (contrast) is checked here on each surface at rest and on hover, and by axe in both modes, 2.5.8 (target
// size) by the sizes, 4.1.2 (name, role, value) here, by axe and by TypeScript in test/button.test.ts, and 1.4.10 by a
// long label; 1.4.12, 2.4.7 and forced colours by every story. Not checked: real screen readers.
const label = "Pay";
const defaultHeight = 36;
// What --gold paints, as it is the one name here that shadcn does not have.
const gold = "rgb(240, 189, 42)";
const remove = "Delete the account";
const keep = "Keep it";
const removeTitle = "Delete this account?";
const sending = "Sending";
const download = "Download";
const longLabel = "Transfer to the investment account";
const minimum = 4.5;
const dimmed = "0.5";
const extraSmall = 24;
// The surfaces a button sits on: a card, the page and a muted box.
const surfaces = ["bg-card", "bg-background", "bg-muted"] as const;

// A pointer moves before it arrives, which React Aria needs to count it as hovering, and the hover is tried again, as
// Link's story says.
async function hover(element: HTMLElement, check: () => Promise<void>) {
  await userEvent.hover(document.body);
  await waitFor(async () => {
    await userEvent.hover(element);
    await expect(element).toHaveAttribute("data-hovered", "true");
    await check();
  });
  await userEvent.unhover(element);
}

const meta = {
  title: "Components/Form & Input/Button",
  component: Button,
  args: { children: label },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    // Inside a form, a button with no type would submit it.
    await expect(button).toHaveAttribute("type", "button");
    // Its own height, so the theme and Tailwind reach what every story draws.
    await expect(button.offsetHeight).toBe(defaultHeight);
  },
};

const Gold: Story = {
  args: { variant: "gold" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: label });

    await expect(getComputedStyle(button).backgroundColor).toBe(gold);
  },
};

const Submit: Story = {
  args: { type: "submit" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    await expect(button).toHaveAttribute("type", "submit");
  },
};

// A disabled button and a disabled link drawn as one look alike, at half their opacity with nothing under the pointer,
// though React Aria draws the link as a span.
const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button isDisabled={true}>{label}</Button>
      <LinkButton href="#pay" isDisabled={true}>
        {download}
      </LinkButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: label });
    const link = canvas.getByRole("link", { name: download });

    await expect(button).toBeDisabled();
    for (const element of [button, link]) {
      await expect(getComputedStyle(element).opacity).toBe(dimmed);
      await expect(getComputedStyle(element).pointerEvents).toBe("none");
    }
  },
};

// Solid, the red under its own foreground, readable at rest and on hover on each surface a button sits on.
const Destructive: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-col gap-3">
      {surfaces.map((surface) => (
        <div key={surface} className={`${surface} p-4`}>
          <Button variant="destructive">
            <Trash2Icon />
            {remove}
          </Button>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button", {
      name: remove,
    });

    await expect(buttons).toHaveLength(surfaces.length);
    for (const button of buttons) {
      await expect(contrast(button)).toBeGreaterThanOrEqual(minimum);
      await hover(button, async () => {
        await expect(contrast(button)).toBeGreaterThanOrEqual(minimum);
      });
    }
  },
};

// A dialog's main action, on the dialog's own surface.
const InDialog: Story = {
  render: () => (
    <AlertDialogTrigger>
      <Button variant="outline">{remove}</Button>
      <AlertDialog>
        <AlertDialogHeader>
          <AlertDialogTitle>{removeTitle}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{keep}</AlertDialogCancel>
          <AlertDialogAction variant="destructive">{remove}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialogTrigger>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: remove }),
    );
    const dialog = await within(document.body).findByRole("alertdialog", {
      name: removeTitle,
    });
    await settled(dialog);
    const action = within(dialog).getByRole("button", { name: remove });

    await expect(contrast(action)).toBeGreaterThanOrEqual(minimum);
    await hover(action, async () => {
      await expect(contrast(action)).toBeGreaterThanOrEqual(minimum);
    });
  },
};

// Waiting on what it started: still focusable, pressing nothing, a spinner in place of its icon, its words and width
// kept, and the app's words for the wait heard with its name.
const Pending: Story = {
  args: { onPress: fn() },
  render: (args) => (
    <div className="flex gap-3">
      <Button isPending={true} onPress={args.onPress} pendingLabel={sending}>
        <SendIcon />
        {label}
      </Button>
      <Button>
        <SendIcon />
        {label}
      </Button>
      <Button
        aria-label={download}
        isPending={true}
        pendingLabel={sending}
        size="icon"
        variant="outline"
      >
        <DownloadIcon />
      </Button>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pending = canvas.getByRole("button", { name: `${label} ${sending}` });
    const idle = canvas.getByRole("button", { name: label });

    await expect(pending).toHaveAttribute("aria-disabled", "true");
    // The spinner shows in place of the icon, which is still there, hidden.
    await expect(
      pending.querySelector("[data-slot=button-spinner]"),
    ).toBeVisible();
    await expect(
      [...pending.querySelectorAll("svg")].filter(
        (icon) => getComputedStyle(icon).display !== "none",
      ),
    ).toHaveLength(1);
    await expect(pending).toHaveTextContent(label);
    // In whole pixels, as Firefox lays the spinner a hundred-thousandth apart from the icon.
    await expect(Math.round(pending.getBoundingClientRect().width)).toBe(
      Math.round(idle.getBoundingClientRect().width),
    );
    // A name of the app's own gains the words too.
    await expect(
      canvas.getByRole("button", { name: `${download} ${sending}` }),
    ).toHaveAttribute("aria-disabled", "true");
    // A press reaches it, and focuses it, but does nothing.
    await userEvent.click(pending);
    await expect(args.onPress).not.toHaveBeenCalled();
    await expect(pending).toHaveFocus();
  },
};

// What it holds may be drawn from its state, as React Aria's children may.
const FromState: Story = {
  render: () => (
    <Button isDisabled={true}>
      {({ isDisabled }) => (isDisabled ? `${label} later` : label)}
    </Button>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: `${label} later` }),
    ).toBeDisabled();
  },
};

// Words longer than their place wrap rather than overflow, centred, while a short label keeps its one line.
const LongLabel: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex w-60 flex-col items-start gap-3">
      <Button>{longLabel}</Button>
      <Button variant="outline">{label}</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const long = canvas.getByRole("button", { name: longLabel });
    const short = canvas.getByRole("button", { name: label });

    await expect(long.scrollWidth).toBe(long.clientWidth);
    await expect(long.getBoundingClientRect().right).toBeLessThanOrEqual(
      canvasElement.getBoundingClientRect().right,
    );
    await expect(height(long)).toBeGreaterThan(defaultHeight);
    await expect(getComputedStyle(long).textAlign).toBe("center");
    await expect(height(short)).toBe(defaultHeight);
  },
};

// 24 px, for a button inside another piece or beside a line of text, at the theme's radius.
const ExtraSmall: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">{label}</Button>
      <Button aria-label={download} size="icon-xs" variant="ghost">
        <DownloadIcon />
      </Button>
      <span className="rounded-md" data-testid="radius" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radius = getComputedStyle(canvas.getByTestId("radius")).borderRadius;

    for (const button of [
      canvas.getByRole("button", { name: label }),
      canvas.getByRole("button", { name: download }),
    ]) {
      await expect(height(button)).toBe(extraSmall);
      await expect(getComputedStyle(button).borderRadius).toBe(radius);
    }
  },
};

// The class an app passes wins over the piece's own for the same property, which is what cn is for.
const MergesClasses: Story = {
  args: { className: "h-12" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Pay" });

    await expect(button).toHaveClass("h-12");
    await expect(button).not.toHaveClass("h-9");
  },
};

const Link: Story = {
  render: () => <LinkButton href="#pay">{label}</LinkButton>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Pay" });

    await expect(link).toHaveAttribute("href", "#pay");
  },
};

// Each size of the scale, 32, 36 and 40 px, its icon 14 px at sm, as its text shrinks, and 16 above.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-start gap-3">
      {sizes.map((size) => (
        <Button key={size} size={size}>
          <DownloadIcon />
          {label}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button");
    const icon = { sm: 14, default: 16, lg: 16 };

    for (const [index, size] of sizes.entries()) {
      const button = buttons[index] as HTMLElement;
      await expect(height(button)).toBe(scale[size]);
      await expect(height(button.querySelector("svg") as Element)).toBe(
        icon[size],
      );
    }
  },
};

export default meta;
export {
  Default,
  Destructive,
  Disabled,
  ExtraSmall,
  FromState,
  Gold,
  InDialog,
  Link,
  LongLabel,
  MergesClasses,
  Pending,
  Sizes,
  Submit,
};
