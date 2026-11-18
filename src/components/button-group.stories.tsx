import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group.js";
import { Input } from "./input.js";

const group = "Statement actions";
const text = "Statement";
const download = "Download";
const print = "Print";
const amount = "Amount";
const amountId = "button-group-amount";

const meta = {
  title: "Components/Form & Input/Button Group",
  component: ButtonGroup,
  args: {
    "aria-label": group,
    children: (
      <>
        <ButtonGroupText>{text}</ButtonGroupText>
        <Button variant="outline">{download}</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">{print}</Button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const buttons = within(
      within(canvasElement).getByRole("group", { name: group }),
    );

    await expect(buttons.getByRole("button", { name: download })).toBeVisible();
    await expect(buttons.getByRole("button", { name: print })).toBeVisible();
    await expect(buttons.getByRole("separator")).toBeInTheDocument();
  },
};

// The text drawn as another element, here the label of the field beside it.
const TextAsLabel: Story = {
  args: {
    children: (
      <>
        <ButtonGroupText
          render={({ children, ...props }) => (
            <label htmlFor={amountId} {...props}>
              {children}
            </label>
          )}
        >
          {amount}
        </ButtonGroupText>
        <Input id={amountId} />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name: amount }),
    ).toBeVisible();
  },
};

const save = "Save";
const cancel = "Cancel";
const apart = 8;
// Words that need two lines in a narrow place.
const downloadStatement = "Download the statement";

function edges(element: Element) {
  return element.getBoundingClientRect();
}

// By the vocabulary's spacing: 0, one box with each button against the next, and 2, a box each 8 px apart, which wrap
// when the row is narrow.
const Spacing: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex w-40 flex-col gap-6">
      <ButtonGroup aria-label={group}>
        <Button variant="outline">{download}</Button>
        <Button variant="outline">{print}</Button>
      </ButtonGroup>
      <ButtonGroup aria-label={text} spacing={2}>
        <Button>{save}</Button>
        <Button variant="outline">{cancel}</Button>
        <Button variant="outline">{print}</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const joined = within(canvas.getByRole("group", { name: group }));
    const parted = within(canvas.getByRole("group", { name: text }));
    const first = joined.getByRole("button", { name: download });
    const second = joined.getByRole("button", { name: print });
    const saveButton = parted.getByRole("button", { name: save });
    const cancelButton = parted.getByRole("button", { name: cancel });
    const printButton = parted.getByRole("button", { name: print });

    await expect(edges(second).left - edges(first).right).toBe(0);
    await expect(getComputedStyle(first).borderTopRightRadius).toBe("0px");
    await expect(edges(cancelButton).left - edges(saveButton).right).toBe(
      apart,
    );
    await expect(getComputedStyle(saveButton).borderTopRightRadius).not.toBe(
      "0px",
    );
    // The third does not fit beside the others in 160 px, so it goes to the next line, 8 px below.
    await expect(edges(printButton).top - edges(saveButton).bottom).toBe(apart);
  },
};

// Joined in a narrow place: the buttons share the width at one height, their words wrapping, and nothing overflows.
const Narrow: Story = {
  tags: ["visual"],
  render: () => (
    <div className="w-48">
      <ButtonGroup aria-label={group}>
        <Button variant="outline">{downloadStatement}</Button>
        <Button variant="outline">{print}</Button>
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const joined = canvas.getByRole("group", { name: group });
    const first = canvas.getByRole("button", { name: downloadStatement });
    const second = canvas.getByRole("button", { name: print });

    await expect(edges(joined).right).toBeLessThanOrEqual(
      edges(joined.parentElement as Element).right,
    );
    await expect(edges(first).height).toBe(edges(second).height);
    await expect(first.scrollWidth).toBe(first.clientWidth);
  },
};

export default meta;
export { Default, Narrow, Spacing, TextAsLabel };
