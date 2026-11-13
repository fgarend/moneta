import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select.js";

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

// Options in groups, each with its own label.
const Grouped: Story = {
  args: {
    children: (
      <>
        <NativeSelectOptGroup label="Everyday">
          <NativeSelectOption>{checking}</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Put aside">
          <NativeSelectOption>{savings}</NativeSelectOption>
        </NativeSelectOptGroup>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll("optgroup");

    await expect([...groups].map((group) => group.label)).toEqual([
      "Everyday",
      "Put aside",
    ]);
    await expect(
      within(canvasElement).getByRole("combobox", { name }),
    ).toHaveValue(checking);
  },
};

// Each size of the scale, so a field lines up with the buttons beside it: 32, 36 and 40 px.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-start gap-3">
      {sizes.map((size) => (
        <NativeSelect aria-label={`${name} ${size}`} key={size} size={size}>
          <NativeSelectOption>{savings}</NativeSelectOption>
          <NativeSelectOption>{checking}</NativeSelectOption>
        </NativeSelect>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = [
      ...canvasElement.querySelectorAll('[data-slot="native-select"]'),
    ];

    await expect(controls.map(height)).toEqual(
      sizes.map((size) => scale[size]),
    );
  },
};

export default meta;
export { Default, Disabled, Grouped, Sizes };
