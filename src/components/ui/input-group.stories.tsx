import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "./input-group.js";

const group = "Amount";
const name = "Amount in the account's currency";
const currency = "USD";
const clear = "Clear";

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

export default meta;
export { Default };
