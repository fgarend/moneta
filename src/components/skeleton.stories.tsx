import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { withLessMotion } from "../../.storybook/reduced-motion.js";
import { Skeleton } from "./skeleton.js";

// An animation that stops: none.
const still = /^none/u;

const name = "Balance on its way";

const meta = {
  title: "Components/Feedback & Status/Skeleton",
  component: Skeleton,
  tags: ["raw"],
  args: { "aria-label": name, className: "h-4 w-32", role: "status" },
} satisfies Meta<typeof Skeleton>;

type Story = StoryObj<typeof meta>;

// It pulses, unless its reader asks for less motion.
const Default: Story = {
  play: async ({ canvasElement }) => {
    const skeleton = within(canvasElement).getByRole("status", { name });
    const lessMotion = withLessMotion(skeleton);

    await expect(skeleton).toBeVisible();
    await expect(getComputedStyle(skeleton).animationName).toBe("pulse");
    await expect(
      lessMotion.get("animation-name") ?? lessMotion.get("animation") ?? "none",
    ).toMatch(still);
  },
};

export default meta;
export { Default };
