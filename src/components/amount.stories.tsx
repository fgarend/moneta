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

const dots = "••••••";
const hiddenWords = "Hidden value";
// The salary below, as given or as shown, which a hidden amount must leave nowhere in the page.
const hiddenSalary = /7\.?250/u;
const salary = "Fictitious salary";
const groceries = "Central Market";
const debt = "Card debt this month";
const transfer = "Between accounts";

function amountIn(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector('[data-slot="amount"]') as HTMLElement;
}

// The colour a value of the theme resolves to where the amount sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
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

// A change, with its plus. Zero takes no sign.
const Signed: Story = {
  render: () => (
    <ul>
      <li>
        <Amount sign="always" value={{ amount: "7250", currency: "BRL" }} />
      </li>
      <li>
        <Amount sign="always" value={{ amount: "-286.4", currency: "BRL" }} />
      </li>
      <li>
        <Amount sign="always" value={{ amount: "0", currency: "BRL" }} />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const texts = [
      ...canvasElement.querySelectorAll('[data-slot="amount"]'),
    ].map((amount) => amount.textContent);

    await expect(texts).toEqual([
      `+R$${nbsp}7.250,00`,
      `${minus}R$${nbsp}286,40`,
      `R$${nbsp}0,00`,
    ]);
  },
};

// Good news and bad, as the app says, never read from the sign: a debt that falls is good. Its sign or its row says
// it too, as colour is never alone. With no tone, the colour of the text around it.
const Tones: Story = {
  tags: ["visual"],
  render: () => (
    <table className="text-sm">
      <tbody>
        <tr>
          <td>{salary}</td>
          <td className="ps-4 text-end">
            <Amount
              sign="always"
              tone="positive"
              value={{ amount: "7250", currency: "BRL" }}
            />
          </td>
        </tr>
        <tr>
          <td>{groceries}</td>
          <td className="ps-4 text-end">
            <Amount
              tone="negative"
              value={{ amount: "-286.4", currency: "BRL" }}
            />
          </td>
        </tr>
        <tr>
          <td>{debt}</td>
          <td className="ps-4 text-end">
            <Amount
              tone="positive"
              value={{ amount: "-500", currency: "BRL" }}
            />
          </td>
        </tr>
        <tr className="bg-muted">
          <td>{transfer}</td>
          <td className="ps-4 text-end">
            <Amount value={{ amount: "1000", currency: "BRL" }} />
          </td>
        </tr>
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const [gain, loss, fall, plain] = [
      ...canvasElement.querySelectorAll('[data-slot="amount"]'),
    ].map((amount) => getComputedStyle(amount).color);
    const row = canvasElement.querySelector("tr:last-child") as Element;

    await expect(plain).toBe(getComputedStyle(row).color);
    // A colour the theme does not have would fall back to the text's, so each must differ from it.
    await expect(gain).not.toBe(plain);
    await expect(loss).not.toBe(plain);
    await expect(gain).toBe(colourOf("var(--positive)", canvasElement));
    await expect(loss).toBe(colourOf("var(--negative)", canvasElement));
    await expect(fall).toBe(gain);
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

// Hidden, as the app asks: dots, hidden from screen readers, which read the app's words for them, with no sign, no
// tone and nothing of the value left in the page, not even in an attribute.
const Hidden: Story = {
  tags: ["visual"],
  args: {
    value: { amount: "7250", currency: "BRL" },
    sign: "always",
    tone: "positive",
  },
  decorators: [
    (Story) => (
      <MoneyProvider hiddenLabel={hiddenWords} isHidden={true}>
        <Story />
      </MoneyProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const amount = amountIn(canvasElement);

    await expect(amount.tagName).toBe("SPAN");
    await expect(canvas.getByText(dots)).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText(hiddenWords)).toHaveClass("sr-only");
    await expect(canvasElement.innerHTML).not.toMatch(hiddenSalary);
    await expect(getComputedStyle(amount).color).toBe(
      getComputedStyle(canvasElement).color,
    );
  },
};

// No value, hidden: dots too, as hidden hides everything.
const HiddenEmpty: Story = {
  args: { value: null },
  decorators: Hidden.decorators,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(dots)).toBeVisible();
    await expect(canvas.queryByText(dash)).toBeNull();
  },
};

// Hidden with no words for it: it says so, rather than leave screen readers with nothing.
const HiddenWithoutWords: Story = {
  render: (args) => (
    <Caught>
      <MoneyProvider isHidden={true}>
        <Amount {...args} />
      </MoneyProvider>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "Amount: a hidden value needs a hiddenLabel on MoneyProvider.",
      ),
    ).toBeVisible();
  },
};

export default meta;
export {
  Copy,
  Default,
  Empty,
  EmptyWithItsOwnWords,
  EmptyWithoutWords,
  Hidden,
  HiddenEmpty,
  HiddenWithoutWords,
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
  Signed,
  Tones,
};
