import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Amount } from "./amount.js";
import { type Money, useFormatMoney, useFormatPercent } from "./money.js";
import { MoneyProvider } from "./money-provider.js";
import { Percent } from "./percent.js";

const nbsp = " ";
const minus = "−";
const noValue = "No value yet";
const label = "Fictitious balance";
const value: Money = { amount: "-286.4", currency: "BRL" };
const shareLabel = "Fictitious share";
const share = "-0.0324";

const meta = {
  title: "Components/Misc/Money Provider",
  component: MoneyProvider,
  args: { emptyLabel: noValue, children: <Amount value={null} /> },
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof MoneyProvider>;

type Story = StoryObj<typeof meta>;

// Its words reach every amount with no value inside it.
const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(noValue)).toHaveClass(
      "sr-only",
    );
  },
};

// Where no piece can go, such as a chart's axis or a title, the hooks give the same text as Amount and Percent.
const WithTheHook: Story = {
  render: function Render(args) {
    const formatMoney = useFormatMoney();
    const formatPercent = useFormatPercent();
    return (
      <MoneyProvider {...args}>
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
        </dl>
      </MoneyProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const [money, amount, ratio, percent] = [
      ...canvasElement.querySelectorAll("dd"),
    ].map((part) => part.textContent);

    await expect(money).toBe(`${minus}R$${nbsp}286,40`);
    await expect(money).toBe(amount);
    await expect(ratio).toBe(`${minus}3,24%`);
    await expect(ratio).toBe(percent);
  },
};

// In the language React Aria speaks, which the hook follows as Amount does.
const WithTheHookInEnglish: Story = {
  render: WithTheHook.render,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const [money, , ratio] = [...canvasElement.querySelectorAll("dd")].map(
      (part) => part.textContent,
    );

    await expect(money).toBe(`${minus}R$286.40`);
    await expect(ratio).toBe(`${minus}3.24%`);
  },
};

export default meta;
export { Default, WithTheHook, WithTheHookInEnglish };
