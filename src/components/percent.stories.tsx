import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { MoneyProvider } from "./money-provider.js";
import { Percent } from "./percent.js";

const minus = "−";
const noValue = "No value yet";
const dash = "—";

// What the guidelines give a value: 500 in a row, and 24/32 at 600 for one of note, with tabular figures.
const rowWeight = "500";
const noteSize = ["24px", "32px", "600"];
const tabular = "tabular-nums";

function percentIn(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector('[data-slot="percent"]') as HTMLElement;
}

const meta = {
  title: "Components/Display & Media/Percent",
  component: Percent,
  args: { value: "0.0324" },
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof Percent>;

type Story = StoryObj<typeof meta>;

// A ratio, given as a fraction of one, with the ratio as given beside it for machines.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const percent = percentIn(canvasElement);
    const { fontWeight, fontVariantNumeric } = getComputedStyle(percent);

    await expect(percent.tagName).toBe("DATA");
    await expect(percent).toHaveAttribute("value", "0.0324");
    await expect(percent.textContent).toBe("3,24%");
    await expect([fontWeight, fontVariantNumeric]).toEqual([
      rowWeight,
      tabular,
    ]);
  },
};

// A percent of note, larger.
const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvasElement }) => {
    const { fontSize, lineHeight, fontWeight } = getComputedStyle(
      percentIn(canvasElement),
    );

    await expect([fontSize, lineHeight, fontWeight]).toEqual(noteSize);
  },
};

// The decimals given, zeros too, and never rounded, so an app that sends one precision lines a column up.
const AsGiven: Story = {
  render: () => (
    <ul>
      <li>
        <Percent value="0.459" />
      </li>
      <li>
        <Percent value="0.15" />
      </li>
      <li>
        <Percent value="0.1500" />
      </li>
      <li>
        <Percent value="0.0001234" />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const texts = [
      ...canvasElement.querySelectorAll('[data-slot="percent"]'),
    ].map((percent) => percent.textContent);

    await expect(texts).toEqual(["45,9%", "15%", "15,00%", "0,01234%"]);
  },
};

// A change, with its plus and the app's tone, as an amount has them.
const Signed: Story = {
  args: { value: "0.039", sign: "always", tone: "positive" },
  play: async ({ canvasElement }) => {
    const percent = percentIn(canvasElement);
    const probe = document.createElement("span");
    probe.style.color = "var(--positive)";
    canvasElement.append(probe);

    await expect(percent.textContent).toBe("+3,9%");
    await expect(getComputedStyle(percent).color).not.toBe(
      getComputedStyle(canvasElement).color,
    );
    await expect(getComputedStyle(percent).color).toBe(
      getComputedStyle(probe).color,
    );
    probe.remove();
  },
};

// A negative ratio takes the minus sign, as an amount does.
const Negative: Story = {
  args: { value: "-0.021" },
  play: async ({ canvasElement }) => {
    await expect(percentIn(canvasElement).textContent).toBe(`${minus}2,1%`);
  },
};

// In the language React Aria speaks, here English.
const InEnglish: Story = {
  args: { value: "0.459" },
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(percentIn(canvasElement).textContent).toBe("45.9%");
  },
};

// No value: a dash, hidden from screen readers, which read the app's words for it instead.
const Empty: Story = {
  args: { value: null },
  decorators: [
    (Story) => (
      <MoneyProvider emptyLabel={noValue}>
        <Story />
      </MoneyProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(percentIn(canvasElement).tagName).toBe("SPAN");
    await expect(canvas.getByText(dash)).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText(noValue)).toHaveClass("sr-only");
  },
};

// No value and no words for it: it says so.
const EmptyWithoutWords: Story = {
  render: () => (
    <Caught>
      <Percent value={null} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "Percent: no value needs an emptyLabel, on it or on MoneyProvider.",
      ),
    ).toBeVisible();
  },
};

// A ratio that is not a decimal string says so, as "45,9" or "50%".
const NotADecimal: Story = {
  render: () => (
    <Caught>
      <Percent value="50%" />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Percent: "50%" is not a decimal string, as "0.459".',
      ),
    ).toBeVisible();
  },
};

// A copy of one percent takes a hyphen for its minus, as a copy of one amount does.
const Copy: Story = {
  args: { value: "-0.021" },
  play: async ({ canvasElement }) => {
    const text = percentIn(canvasElement).firstChild as Node;
    const selection = document.getSelection() as Selection;
    selection.setBaseAndExtent(text, 0, text, 5);
    const event = new ClipboardEvent("copy", {
      clipboardData: new DataTransfer(),
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);

    await expect(event.clipboardData?.getData("text/plain")).toBe("-2,1%");
    await expect(event.defaultPrevented).toBe(true);
  },
};

export default meta;
export {
  AsGiven,
  Copy,
  Default,
  Empty,
  EmptyWithoutWords,
  InEnglish,
  Large,
  Negative,
  NotADecimal,
  Signed,
};
