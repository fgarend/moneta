import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Kbd, KbdGroup } from "./kbd.js";

const action = "Search";
const modifier = "Ctrl";
const key = "K";
const symbol = "⌘";
const symbolName = "Command";

// What the guidelines give it: a key 20 px tall on --muted.
const height = 20;

function backgroundOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

const meta = {
  title: "Components/Display & Media/Kbd",
  component: KbdGroup,
  args: {
    children: (
      <>
        <Kbd>{modifier}</Kbd>
        <Kbd>{key}</Kbd>
      </>
    ),
  },
} satisfies Meta<typeof KbdGroup>;

type Story = StoryObj<typeof meta>;

// A shortcut beside its action: keys pressed together, side by side, each a kbd inside the group's.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <p className="flex items-center gap-2 p-6">
      {action}
      <KbdGroup {...args} />
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector(
      '[data-slot="kbd-group"]',
    ) as HTMLElement;
    const first = canvas.getByText(modifier);

    await expect(group.tagName).toBe("KBD");
    await expect(first.tagName).toBe("KBD");
    await expect(first.parentElement).toBe(group);
    await expect(first.getBoundingClientRect().height).toBe(height);
    await expect(getComputedStyle(first).backgroundColor).toBe(
      backgroundOf("var(--muted)", canvasElement),
    );
  },
};

// A key shown as a symbol takes its name in words, which a screen reader hears; the symbol is hidden.
const SymbolKey: Story = {
  args: {
    children: (
      <>
        <Kbd label={symbolName}>{symbol}</Kbd>
        <Kbd>{key}</Kbd>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(symbol)).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(canvas.getByText(symbolName)).toHaveClass("sr-only");
  },
};

export default meta;
export { Default, SymbolKey };
