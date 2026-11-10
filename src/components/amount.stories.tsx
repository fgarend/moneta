import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { Amount } from "./amount.js";
import { MoneyProvider } from "./money-provider.js";

// What Intl writes between a currency and its number, so the two never part.
const nbsp = " ";
const minus = "−";
const noValue = "No value yet";
const notComputed = "Not computed yet";
const dash = "—";
const before = "A fictitious balance of ";
const after = " today.";

// What the guidelines give an amount: 500 in a row, and 24/32 at 600 for an amount of note, with tabular figures.
const rowWeight = "500";
const noteSize = ["24px", "32px", "600"];
const tabular = "tabular-nums";

function amountIn(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector('[data-slot="amount"]') as HTMLElement;
}

// What a copy of the selection from one point to another gives, and whether a handler took its place. Firefox hands
// the event its own copy of the data, so it is read from the event.
function copyOf(
  from: [Node, number],
  to: [Node, number],
): { text: string; taken: boolean } {
  const selection = document.getSelection() as Selection;
  selection.setBaseAndExtent(...from, ...to);
  const event = new ClipboardEvent("copy", {
    clipboardData: new DataTransfer(),
    bubbles: true,
    cancelable: true,
  });
  document.body.dispatchEvent(event);
  // Firefox's own copy turns the space that does not break into a plain one.
  const text = (event.clipboardData?.getData("text/plain") ?? "").replaceAll(
    nbsp,
    " ",
  );
  return { text, taken: event.defaultPrevented };
}

const meta = {
  title: "Components/Display & Media/Amount",
  component: Amount,
  args: { value: { amount: "1234.5", currency: "BRL" } },
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof Amount>;

type Story = StoryObj<typeof meta>;

// In a row: every digit given, padded to the currency's decimals, with the value as given beside it for machines.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const amount = amountIn(canvasElement);
    const { fontWeight, fontVariantNumeric } = getComputedStyle(amount);

    await expect(amount.tagName).toBe("DATA");
    await expect(amount).toHaveAttribute("value", "1234.5");
    await expect(amount.textContent).toBe(`R$${nbsp}1.234,50`);
    await expect([fontWeight, fontVariantNumeric]).toEqual([
      rowWeight,
      tabular,
    ]);
  },
};

// An amount of note, larger.
const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvasElement }) => {
    const { fontSize, lineHeight, fontWeight, fontVariantNumeric } =
      getComputedStyle(amountIn(canvasElement));

    await expect([fontSize, lineHeight, fontWeight]).toEqual(noteSize);
    await expect(fontVariantNumeric).toBe(tabular);
  },
};

// In a sentence, at the size of its text.
const InSentence: Story = {
  render: (args) => (
    <p className="text-sm">
      {before}
      <Amount {...args} />
      {after}
    </p>
  ),
  play: async ({ canvasElement }) => {
    const sentence = canvasElement.querySelector("p") as Element;

    await expect(getComputedStyle(amountIn(canvasElement)).fontSize).toBe(
      getComputedStyle(sentence).fontSize,
    );
  },
};

// A negative amount takes the minus sign, which screen readers read as "minus", where Intl writes a hyphen.
const Negative: Story = {
  args: { value: { amount: "-286.4", currency: "BRL" } },
  play: async ({ canvasElement }) => {
    const amount = amountIn(canvasElement);

    await expect(amount.textContent).toBe(`${minus}R$${nbsp}286,40`);
    await expect(amount).toHaveAttribute("value", "-286.4");
  },
};

// Zero has no sign, even when given as negative.
const NegativeZero: Story = {
  args: { value: { amount: "-0.00", currency: "BRL" } },
  play: async ({ canvasElement }) => {
    await expect(amountIn(canvasElement).textContent).toBe(`R$${nbsp}0,00`);
  },
};

// In the language React Aria speaks, here English.
const InEnglish: Story = {
  args: { value: { amount: "-1234.5", currency: "USD" } },
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(amountIn(canvasElement).textContent).toBe(`${minus}$1,234.50`);
  },
};

// Other currencies, each with its own decimals: none for the yen, three for the Bahraini dinar.
const OtherCurrencies: Story = {
  render: () => (
    <ul>
      <li>
        <Amount value={{ amount: "1234.5", currency: "USD" }} />
      </li>
      <li>
        <Amount value={{ amount: "1234", currency: "JPY" }} />
      </li>
      <li>
        <Amount value={{ amount: "1.5", currency: "BHD" }} />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const texts = [
      ...canvasElement.querySelectorAll('[data-slot="amount"]'),
    ].map((amount) => amount.textContent);

    await expect(texts).toEqual([
      `US$${nbsp}1.234,50`,
      `JP¥${nbsp}1.234`,
      `BHD${nbsp}1,500`,
    ]);
  },
};

// More digits than the currency's, all shown, never rounded.
const MoreDigits: Story = {
  args: { value: { amount: "0.0001234", currency: "USD" } },
  play: async ({ canvasElement }) => {
    await expect(amountIn(canvasElement).textContent).toBe(
      `US$${nbsp}0,0001234`,
    );
  },
};

// Beyond what a JavaScript number holds, still exact.
const Huge: Story = {
  args: { value: { amount: "123456789012345678.99", currency: "BRL" } },
  play: async ({ canvasElement }) => {
    await expect(amountIn(canvasElement).textContent).toBe(
      `R$${nbsp}123.456.789.012.345.678,99`,
    );
  },
};

// Wider than its column: on one line, never cut, and its column makes room, as a table's does.
const Narrow: Story = {
  args: { value: { amount: "-123456789.5", currency: "BRL" } },
  decorators: [
    (Story) => (
      <table className="w-16">
        <tbody>
          <tr>
            <td>
              <Story />
            </td>
          </tr>
        </tbody>
      </table>
    ),
  ],
  play: async ({ canvasElement }) => {
    const amount = amountIn(canvasElement);
    const column = canvasElement.querySelector("table") as Element;

    await expect(amount.getClientRects().length).toBe(1);
    await expect(amount.textContent).toBe(`${minus}R$${nbsp}123.456.789,50`);
    await expect(column.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      amount.getBoundingClientRect().width,
    );
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
    const amount = amountIn(canvasElement);

    await expect(amount.tagName).toBe("SPAN");
    await expect(canvasElement.querySelector("data")).toBeNull();
    await expect(canvas.getByText(dash)).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText(noValue)).toHaveClass("sr-only");
  },
};

// Its own words win over the provider's.
const EmptyWithItsOwnWords: Story = {
  args: { value: null, emptyLabel: notComputed },
  decorators: Empty.decorators,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(notComputed)).toHaveClass("sr-only");
    await expect(canvas.queryByText(noValue)).toBeNull();
  },
};

// No value and no words for it, here or in a provider: it says so, rather than leave screen readers with nothing.
const EmptyWithoutWords: Story = {
  render: () => (
    <Caught>
      <Amount value={null} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "Amount: no value needs an emptyLabel, on it or on MoneyProvider.",
      ),
    ).toBeVisible();
  },
};

// An amount that is not a decimal string says so, rather than show "NaN" or a wrong value.
const NotADecimal: Story = {
  render: () => (
    <Caught>
      <Amount value={{ amount: "1,5", currency: "BRL" }} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Money: "1,5" is not a decimal string, as "1234.50".',
      ),
    ).toBeVisible();
  },
};

// Nor a currency that is not three capital letters.
const NotACurrency: Story = {
  render: () => (
    <Caught>
      <Amount value={{ amount: "10", currency: "real" }} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Money: "real" is not a currency code, as "BRL".',
      ),
    ).toBeVisible();
  },
};

// A copy of one amount takes a hyphen for its minus, as a spreadsheet reads only that as negative. A copy of more
// is the browser's own.
const Copy: Story = {
  render: () => (
    <p>
      {before}
      <Amount value={{ amount: "-286.4", currency: "BRL" }} />
      {after}
      <Amount value={{ amount: "-48.9", currency: "BRL" }} />
    </p>
  ),
  play: async ({ canvasElement }) => {
    const [first, second] = [
      ...canvasElement.querySelectorAll('[data-slot="amount"]'),
    ].map((amount) => amount.firstChild as Node);
    const words = (canvasElement.querySelector("p") as Element)
      .firstChild as Node;

    await expect(copyOf([first as Node, 0], [first as Node, 10])).toEqual({
      text: "-R$ 286,40",
      taken: true,
    });
    await expect(copyOf([words, 0], [words, 5])).toEqual({
      text: "",
      taken: false,
    });
    await expect(copyOf([first as Node, 0], [second as Node, 3])).toEqual({
      text: "",
      taken: false,
    });
    // With nothing selected, as a copy from a field that keeps its selection apart.
    document.getSelection()?.removeAllRanges();
    const event = new ClipboardEvent("copy", {
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);
    await expect(event.defaultPrevented).toBe(false);
  },
};

export default meta;
export {
  Copy,
  Default,
  Empty,
  EmptyWithItsOwnWords,
  EmptyWithoutWords,
  Huge,
  InEnglish,
  InSentence,
  Large,
  MoreDigits,
  Narrow,
  Negative,
  NegativeZero,
  NotACurrency,
  NotADecimal,
  OtherCurrencies,
};
