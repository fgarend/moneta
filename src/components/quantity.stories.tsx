import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { MonetaProvider } from "./moneta-provider.js";
import { Quantity } from "./quantity.js";

const minus = "−";
const noValue = "No value yet";
const dash = "—";
const before = "A fictitious fund of ";
const after = " shares.";

// What the guidelines give a value: 500 in a row, and 24/32 at 600 for one of note, with tabular figures.
const rowWeight = "500";
const noteSize = ["24px", "32px", "600"];
const tabular = "tabular-nums";

function quantityIn(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector('[data-slot="quantity"]') as HTMLElement;
}

const meta = {
  title: "Components/Display & Media/Quantity",
  component: Quantity,
  args: { value: "1234.5" },
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof Quantity>;

type Story = StoryObj<typeof meta>;

// A quantity, as shares or units, with the value as given beside it for machines.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const quantity = quantityIn(canvasElement);
    const { fontWeight, fontVariantNumeric } = getComputedStyle(quantity);

    await expect(quantity.tagName).toBe("DATA");
    await expect(quantity).toHaveAttribute("value", "1234.5");
    await expect(quantity.textContent).toBe("1.234,5");
    await expect([fontWeight, fontVariantNumeric]).toEqual([
      rowWeight,
      tabular,
    ]);
  },
};

// A quantity of note, larger.
const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvasElement }) => {
    const { fontSize, lineHeight, fontWeight } = getComputedStyle(
      quantityIn(canvasElement),
    );

    await expect([fontSize, lineHeight, fontWeight]).toEqual(noteSize);
  },
};

// The decimals given, zeros too, and never rounded, as each asset has its own precision.
const AsGiven: Story = {
  render: () => (
    <ul>
      <li>
        <Quantity value="100" />
      </li>
      <li>
        <Quantity value="10.50" />
      </li>
      <li>
        <Quantity value="0.12345678" />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const texts = [
      ...canvasElement.querySelectorAll('[data-slot="quantity"]'),
    ].map((quantity) => quantity.textContent);

    await expect(texts).toEqual(["100", "10,50", "0,12345678"]);
  },
};

// In a sentence, with its unit in the app's words around it.
const WithItsUnit: Story = {
  args: { value: "100" },
  render: (args) => (
    <p>
      {before}
      <Quantity {...args} />
      {after}
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("p")?.textContent).toBe(
      `${before}100${after}`,
    );
  },
};

// A change, with its plus and the app's tone, as an amount has them.
const Signed: Story = {
  args: { value: "3", sign: "always", tone: "negative" },
  play: async ({ canvasElement }) => {
    const quantity = quantityIn(canvasElement);
    const probe = document.createElement("span");
    probe.style.color = "var(--negative)";
    canvasElement.append(probe);

    // A tone is the app's, whatever the sign.
    await expect(quantity.textContent).toBe("+3");
    await expect(getComputedStyle(quantity).color).not.toBe(
      getComputedStyle(canvasElement).color,
    );
    await expect(getComputedStyle(quantity).color).toBe(
      getComputedStyle(probe).color,
    );
    probe.remove();
  },
};

// A negative quantity takes the minus sign, as an amount does.
const Negative: Story = {
  args: { value: "-3" },
  play: async ({ canvasElement }) => {
    await expect(quantityIn(canvasElement).textContent).toBe(`${minus}3`);
  },
};

// In the language React Aria speaks, here English.
const InEnglish: Story = {
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(quantityIn(canvasElement).textContent).toBe("1,234.5");
  },
};

// No value: a dash, hidden from screen readers, which read the app's words for it instead.
const Empty: Story = {
  args: { value: null },
  decorators: [
    (Story) => (
      <MonetaProvider emptyLabel={noValue}>
        <Story />
      </MonetaProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(quantityIn(canvasElement).tagName).toBe("SPAN");
    await expect(canvas.getByText(dash)).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText(noValue)).toHaveClass("sr-only");
  },
};

// Hidden, as an amount is, as shares times a known price say what they are worth.
const Hidden: Story = {
  decorators: [
    (Story) => (
      <MonetaProvider hiddenLabel={noValue} isHidden={true}>
        <Story />
      </MonetaProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(quantityIn(canvasElement).textContent).toBe(
      `••••••${noValue}`,
    );
    await expect(canvasElement.innerHTML).not.toContain("1234");
  },
};

// No value and no words for it: it says so.
const EmptyWithoutWords: Story = {
  render: () => (
    <Caught>
      <Quantity value={null} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "Quantity: no value needs an emptyLabel, on it or on MonetaProvider.",
      ),
    ).toBeVisible();
  },
};

// A quantity that is not a decimal string says so, as one with its unit inside.
const NotADecimal: Story = {
  render: () => (
    <Caught>
      <Quantity value="100 shares" />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Quantity: "100 shares" is not a decimal string, as "1234.5".',
      ),
    ).toBeVisible();
  },
};

// A copy of one quantity takes a hyphen for its minus, as a copy of one amount does.
const Copy: Story = {
  args: { value: "-3" },
  play: async ({ canvasElement }) => {
    const text = quantityIn(canvasElement).firstChild as Node;
    const selection = document.getSelection() as Selection;
    selection.setBaseAndExtent(text, 0, text, 2);
    const event = new ClipboardEvent("copy", {
      clipboardData: new DataTransfer(),
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);

    await expect(event.clipboardData?.getData("text/plain")).toBe("-3");
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
  Hidden,
  InEnglish,
  Large,
  Negative,
  NotADecimal,
  Signed,
  WithItsUnit,
};
