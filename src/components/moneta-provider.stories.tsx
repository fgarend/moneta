import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Amount } from "./amount.js";
import { useFormatDate } from "./date.js";
import { DateTime } from "./date-time.js";
import { Link } from "./link.js";
import { MonetaProvider } from "./moneta-provider.js";
import {
  type Money,
  useFormatMoney,
  useFormatPercent,
  useFormatQuantity,
} from "./money.js";
import { Percent } from "./percent.js";
import { Quantity } from "./quantity.js";

const nbsp = " ";
const minus = "−";
const noValue = "No value yet";
const otherWords = "Not computed yet";
const hiddenLabel = "Hidden value";
const dots = "••••••";
const label = "Fictitious balance";
const value: Money = { amount: "-286.4", currency: "BRL" };
const shareLabel = "Fictitious share";
const share = "-0.0324";
const sharesLabel = "Fictitious shares";
const shares = "1234.5";
const moment = "2001-01-01T14:32:00Z";
const fees = "The fee schedule";
const navigate = fn();

// The words and the hidden values each story sets; Storybook cannot type a provider whose router is one of two shapes.
type Words = {
  emptyLabel?: string;
  isHidden?: boolean;
  hiddenLabel?: string;
  children: ReactNode;
};

const meta = {
  title: "Components/Misc/Moneta Provider",
  args: { emptyLabel: noValue, children: <Amount value={null} /> },
  render: (args) => <MonetaProvider {...args} />,
  decorators: [
    (Story) => (
      <MonetaProvider locale="pt-BR">
        <Story />
      </MonetaProvider>
    ),
  ],
} satisfies Meta<Words>;

type Story = StoryObj<typeof meta>;

// Its words reach every amount with no value inside it.
const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(noValue)).toHaveClass(
      "sr-only",
    );
  },
};

// Where no piece can go, such as a chart's axis or a title, the hooks give the same text as the pieces.
const WithTheHook: Story = {
  render: function Render(args) {
    const formatMoney = useFormatMoney();
    const formatPercent = useFormatPercent();
    const formatQuantity = useFormatQuantity();
    return (
      <MonetaProvider {...args}>
        <dl>
          <dt>{label}</dt>
          <dd>{formatMoney(value)}</dd>
          <dd>
            <Amount value={value} />
          </dd>
          <dt>{shareLabel}</dt>
          <dd>{formatPercent(share)}</dd>
          <dd>
            <Percent value={share} />
          </dd>
          <dt>{sharesLabel}</dt>
          <dd>{formatQuantity(shares)}</dd>
          <dd>
            <Quantity value={shares} />
          </dd>
        </dl>
      </MonetaProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const [money, amount, ratio, percent, count, quantity] = [
      ...canvasElement.querySelectorAll("dd"),
    ].map((part) => part.textContent);

    await expect(money).toBe(`${minus}R$${nbsp}286,40`);
    await expect(money).toBe(amount);
    await expect(ratio).toBe(`${minus}3,24%`);
    await expect(ratio).toBe(percent);
    await expect(count).toBe("1.234,5");
    await expect(count).toBe(quantity);
  },
};

// In the app's language, its locale, which the hook follows as Amount does.
const WithTheHookInEnglish: Story = {
  render: WithTheHook.render,
  decorators: [
    (Story) => (
      <MonetaProvider locale="en-US">
        <Story />
      </MonetaProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const [money, , ratio, , count] = [
      ...canvasElement.querySelectorAll("dd"),
    ].map((part) => part.textContent);

    await expect(money).toBe(`${minus}R$286.40`);
    await expect(ratio).toBe(`${minus}3.24%`);
    await expect(count).toBe("1,234.5");
  },
};

// The hooks take the plus of a change, as the pieces do.
const WithTheHookSigned: Story = {
  render: function Render(args) {
    const formatMoney = useFormatMoney();
    const formatPercent = useFormatPercent();
    const formatQuantity = useFormatQuantity();
    return (
      <MonetaProvider {...args}>
        <dl>
          <dt>{label}</dt>
          <dd>
            {formatMoney(
              { amount: "286.4", currency: "BRL" },
              { sign: "always" },
            )}
          </dd>
          <dt>{shareLabel}</dt>
          <dd>{formatPercent("0.0324", { sign: "always" })}</dd>
          <dt>{sharesLabel}</dt>
          <dd>{formatQuantity(shares, { sign: "always" })}</dd>
        </dl>
      </MonetaProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const texts = [...canvasElement.querySelectorAll("dd")].map(
      (part) => part.textContent,
    );

    await expect(texts).toEqual([`+R$${nbsp}286,40`, "+3,24%", "+1.234,5"]);
  },
};

// Hidden: the hooks give the dots too, so a chart's axis hides with the table beside it. They read the provider
// above them, as any hook reads a context.
const Hidden: Story = {
  render: WithTheHook.render,
  decorators: [
    (Story) => (
      <MonetaProvider hiddenLabel={hiddenLabel} isHidden={true}>
        <Story />
      </MonetaProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const texts = [...canvasElement.querySelectorAll("dd")].map(
      (part) => part.textContent,
    );

    await expect(texts).toEqual([
      dots,
      `${dots}${hiddenLabel}`,
      dots,
      `${dots}${hiddenLabel}`,
      dots,
      `${dots}${hiddenLabel}`,
    ]);
  },
};

// A provider inside another keeps what it is not given, so one that only changes the words for no value never shows
// what the app hid.
const Nested: Story = {
  args: { isHidden: true, hiddenLabel },
  render: (args) => (
    <MonetaProvider {...args}>
      <MonetaProvider emptyLabel={otherWords}>
        <Amount value={value} />
      </MonetaProvider>
    </MonetaProvider>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(dots)).toBeVisible();
    await expect(canvasElement.innerHTML).not.toContain("286");
  },
};

// Links go through the app's router: useHref makes its paths into addresses, and a press calls navigate.
const Router: Story = {
  render: (args) => (
    <MonetaProvider
      {...args}
      navigate={navigate}
      useHref={(href) => `/app${href}`}
    >
      <Link href="/fees">{fees}</Link>
    </MonetaProvider>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: fees });
    navigate.mockClear();

    await expect(link).toHaveAttribute("href", "/app/fees");
    await userEvent.click(link);
    await expect(navigate.mock.lastCall?.[0]).toBe("/fees");
  },
};

// A moment, and today, in the app's zone, for every date and the hook, which read the provider above them; a date's
// own zone wins, as a market's hours.
const TimeZone: Story = {
  decorators: [
    (Story) => (
      <MonetaProvider timeZone="Asia/Tokyo">
        <Story />
      </MonetaProvider>
    ),
  ],
  render: function Render(args) {
    const formatDate = useFormatDate();
    return (
      <MonetaProvider {...args}>
        <ul>
          <li>
            <DateTime showTime={true} value={moment} />
          </li>
          <li>
            <DateTime showTime={true} timeZone="UTC" value={moment} />
          </li>
          <li>{formatDate(moment, { showTime: true })}</li>
        </ul>
      </MonetaProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const texts = [...canvasElement.querySelectorAll("li")].map(
      (part) => part.textContent,
    );

    await expect(texts).toEqual([
      "1 de jan. de 2001, 23:32",
      "1 de jan. de 2001, 14:32",
      "1 de jan. de 2001, 23:32",
    ]);
  },
};

// One inside another keeps the language, the zone and the router it is not given, as it keeps the hidden values.
const NestedSettings: Story = {
  render: (args) => (
    <MonetaProvider
      {...args}
      locale="en-US"
      navigate={navigate}
      timeZone="Asia/Tokyo"
      useHref={(href) => `/app${href}`}
    >
      <MonetaProvider emptyLabel={otherWords}>
        <p>
          <Amount value={value} />
        </p>
        <p>
          <DateTime showTime={true} value={moment} />
        </p>
        <Link href="/fees">{fees}</Link>
      </MonetaProvider>
    </MonetaProvider>
  ),
  play: async ({ canvasElement }) => {
    const [amount, date] = [...canvasElement.querySelectorAll("p")].map(
      (part) => part.textContent,
    );

    await expect(amount).toBe(`${minus}R$286.40`);
    await expect(date).toContain("11:32");
    await expect(
      within(canvasElement).getByRole("link", { name: fees }),
    ).toHaveAttribute("href", "/app/fees");
  },
};

export default meta;
export {
  Default,
  Hidden,
  Nested,
  NestedSettings,
  Router,
  TimeZone,
  WithTheHook,
  WithTheHookInEnglish,
  WithTheHookSigned,
};
