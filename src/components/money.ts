// Money for an app: its type, and the hooks that write a value where no piece can go, such as a chart's axis or a
// page's title. It holds no piece, so it stays apart from MoneyProvider. docs/decisions/money.md says why it is so.
import { useCallback } from "react";
import { useLocale } from "react-aria-components";
import {
  formatMoney,
  formatPercent,
  formatQuantity,
  type Money,
  type Sign,
} from "#lib/money";

// As the pieces' prop: "always" shows the plus of a change.
type FormatOptions = { sign?: Sign };

// The same text as Amount, in the language React Aria speaks.
function useFormatMoney(): (money: Money, options?: FormatOptions) => string {
  const { locale } = useLocale();
  return useCallback(
    (money, options) => formatMoney(locale, money, options?.sign),
    [locale],
  );
}

// The same text as Percent, from a ratio given as a fraction of one.
function useFormatPercent(): (
  ratio: string,
  options?: FormatOptions,
) => string {
  const { locale } = useLocale();
  return useCallback(
    (ratio, options) => formatPercent(locale, ratio, options?.sign),
    [locale],
  );
}

// The same text as Quantity.
function useFormatQuantity(): (
  value: string,
  options?: FormatOptions,
) => string {
  const { locale } = useLocale();
  return useCallback(
    (value, options) => formatQuantity(locale, value, options?.sign),
    [locale],
  );
}

export type { Money };
export { useFormatMoney, useFormatPercent, useFormatQuantity };
