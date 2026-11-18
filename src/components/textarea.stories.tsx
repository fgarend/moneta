import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Textarea } from "./textarea.js";

const name = "Note on the payment";
const few = "A fictitious note.";
const many = Array.from(
  { length: 30 },
  (_, line) => `Line ${line + 1} of a fictitious note on the payment.`,
).join("\n");

// About 10 lines at most, then it scrolls in itself; and at least two.
const tallest = 224;
const shortest = 64;
const transparent = "rgba(0, 0, 0, 0)";

// The colour a value of the theme resolves to where the box sits, in light and in dark.
function colourOf(token: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = token;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

const meta = {
  title: "Components/Form & Input/Textarea",
  component: Textarea,
  args: { "aria-label": name },
} satisfies Meta<typeof Textarea>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name }),
    ).toBeEnabled();
  },
};

const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name }),
    ).toBeDisabled();
  },
};

// It grows with its text up to about 10 lines, then scrolls in itself.
const Grows: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-col gap-3">
      <Textarea aria-label={`${name}, short`} defaultValue={few} />
      <Textarea aria-label={`${name}, long`} defaultValue={many} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [short, long] = within(canvasElement).getAllByRole("textbox") as [
      HTMLElement,
      HTMLElement,
    ];

    await expect(short.offsetHeight).toBe(shortest);
    await expect(long.offsetHeight).toBe(tallest);
    await expect(long.scrollHeight).toBeGreaterThan(long.clientHeight);
  },
};

// Read-only: a filled box with no border, as Input's.
const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: few },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name });

    await expect(getComputedStyle(box).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(getComputedStyle(box).borderTopColor).toBe(transparent);
  },
};

export default meta;
export { Default, Disabled, Grows, ReadOnly };
