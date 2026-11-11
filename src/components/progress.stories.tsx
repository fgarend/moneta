import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { withLessMotion } from "../../.storybook/reduced-motion.js";
import { Progress, ProgressLabel, ProgressValue } from "./progress.js";

// An animation that stops: none.
const still = /^none/u;

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

// With no value known, no value is said, and a part of the bar runs across it, which never reads as done; with less
// motion asked for, the bar stands still, dashed.
const share = 0.4;

const Indeterminate: Story = {
  args: { isIndeterminate: true },
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector(
      '[data-slot="progress-track"]',
    ) as Element;
    const indicator = canvasElement.querySelector(
      '[data-slot="progress-indicator"]',
    ) as Element;
    const lessMotion = withLessMotion(indicator);

    await expect(
      within(canvasElement).getByRole("progressbar", { name: label }),
    ).not.toHaveAttribute("aria-valuenow");
    await expect(Math.round(indicator.getBoundingClientRect().width)).toBe(
      Math.round(track.getBoundingClientRect().width * share),
    );
    await expect(getComputedStyle(indicator).animationName).toBe(
      "progress-run",
    );
    await expect(
      lessMotion.get("animation-name") ?? lessMotion.get("animation"),
    ).toMatch(still);
    await expect(lessMotion.get("background-image")).toContain(
      "repeating-linear-gradient",
    );
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
