import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { Progress, ProgressLabel, ProgressValue } from "./progress.js";

const label = "Savings goal";
const value = 40;

const meta = {
  title: "Components/Feedback & Status/Progress",
  component: Progress,
  tags: ["raw"],
  args: {
    value,
    children: (
      <>
        <ProgressLabel>{label}</ProgressLabel>
        <ProgressValue />
      </>
    ),
  },
} satisfies Meta<typeof Progress>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("progressbar", { name: label }),
    ).toHaveAttribute("aria-valuenow", String(value));
  },
};

// With no value known, the bar runs full and no value is said.
const Indeterminate: Story = {
  args: { isIndeterminate: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("progressbar", { name: label }),
    ).not.toHaveAttribute("aria-valuenow");
  },
};

// The value as the page words it.
const WordedValue: Story = {
  args: {
    children: (
      <>
        <ProgressLabel>{label}</ProgressLabel>
        <ProgressValue>{(text) => `${text} saved`}</ProgressValue>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(`${value}% saved`),
    ).toBeVisible();
  },
};

// A part used outside a Progress says so, in place of drawing nothing.
const PartOutside: Story = {
  render: () => (
    <Caught>
      <ProgressValue />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "useProgress must be used within a Progress.",
      ),
    ).toBeVisible();
  },
};

export default meta;
export { Default, Indeterminate, PartOutside, WordedValue };
