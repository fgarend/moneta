import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, within } from "storybook/test";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group.js";

const group = "Amount";
const name = "Amount in the account's currency";
const currency = "USD";
const clear = "Clear";
const note = "Note on the payment";

const controlHeight = 36;

const meta = {
  title: "Components/Form & Input/Input Group",
  component: InputGroup,
  tags: ["raw"],
  args: {
    "aria-label": group,
    children: (
      <>
        <InputGroupInput aria-label={name} />
        <InputGroupAddon>
          <InputGroupText>{currency}</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton>{clear}</InputGroupButton>
        </InputGroupAddon>
      </>
    ),
  },
} satisfies Meta<typeof InputGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="input-group"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    const canvas = within(
      within(canvasElement).getByRole("group", { name: group }),
    );

    await expect(canvas.getByRole("button", { name: clear })).toBeVisible();
  },
};

// A click on the addon's text puts the cursor in the field, and one on its button leaves the field alone. What is
// checked is the piece asking the field for focus: whether the browser grants it depends on the window being in focus,
// which Firefox, running many tests at once, does not always keep.
const ClickOnAddon: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name });
    const focus = spyOn(field, "focus");

    await userEvent.click(canvas.getByText(currency));
    await expect(focus).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: clear }));
    await expect(focus).toHaveBeenCalledTimes(1);
    focus.mockRestore();
  },
};

// A field of several lines in the group.
const WithTextarea: Story = {
  args: {
    children: (
      <>
        <InputGroupTextarea aria-label={note} />
        <InputGroupAddon align="block-end">
          <InputGroupText>{currency}</InputGroupText>
        </InputGroupAddon>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name: note }),
    ).toBeVisible();
  },
};

// A plain button in the addon keeps the click, so the piece does not ask the field for focus.
const PlainButtonInAddon: Story = {
  args: {
    children: (
      <>
        <InputGroupInput aria-label={name} />
        <InputGroupAddon align="inline-end">
          <button type="button">{clear}</button>
        </InputGroupAddon>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const focus = spyOn(canvas.getByRole("textbox", { name }), "focus");

    await userEvent.click(canvas.getByRole("button", { name: clear }));
    await expect(focus).not.toHaveBeenCalled();
    focus.mockRestore();
  },
};

export default meta;
export { ClickOnAddon, Default, PlainButtonInAddon, WithTextarea };
