import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { NativeSelect, NativeSelectOption } from "./native-select.js";

const name = "Account";
const savings = "Savings";
const checking = "Checking";

const controlHeight = 36;

const meta = {
  title: "Components/Form & Input/Native Select",
  component: NativeSelect,
  tags: ["raw"],
  args: {
    "aria-label": name,
    defaultValue: checking,
    children: (
      <>
        <NativeSelectOption>{savings}</NativeSelectOption>
        <NativeSelectOption>{checking}</NativeSelectOption>
      </>
    ),
  },
} satisfies Meta<typeof NativeSelect>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="native-select"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    const select = within(canvasElement).getByRole("combobox", { name });

    await expect(select).toHaveValue(checking);
    await expect(
      within(select).getByRole("option", { name: savings }),
    ).toBeInTheDocument();
  },
};

const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("combobox", { name }),
    ).toBeDisabled();
  },
};

export default meta;
export { Default, Disabled };
