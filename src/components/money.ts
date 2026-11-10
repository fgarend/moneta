// Money for an app: its type, and the hooks that write a value where no piece can go, such as a chart's axis or a
// page's title. It holds no piece, so it stays apart from MoneyProvider. docs/decisions/money.md says why it is so.
import { useCallback, useContext } from "react";
import { useLocale } from "react-aria-components";
import {
  formatMoney,
  formatPercent,
  formatQuantity,
  hiddenText,
  type Money,
  MoneyContext,
  type Sign,
} from "#lib/money";

// As the pieces' prop: "always" shows the plus of a change.
type FormatOptions = { sign?: Sign };

// The language React Aria speaks, and whether MoneyProvider hides values, which turns any text into dots. A text only
// screen readers hear, as an aria-label, is the app's to word while values are hidden.
function useFormatting(): { locale: string; isHidden: boolean } {
  const { locale } = useLocale();
  return { locale, isHidden: useContext(MoneyContext).isHidden === true };
}

// The same text as Amount.
function useFormatMoney(): (money: Money, options?: FormatOptions) => string {
  const { locale, isHidden } = useFormatting();
  return useCallback(
    (money, options) =>
      isHidden ? hiddenText : formatMoney(locale, money, options?.sign),
    [locale, isHidden],
  );
}

// The same text as Percent, from a ratio given as a fraction of one.
function useFormatPercent(): (
  ratio: string,
  options?: FormatOptions,
) => string {
  const { locale, isHidden } = useFormatting();
  return useCallback(
    (ratio, options) =>
      isHidden ? hiddenText : formatPercent(locale, ratio, options?.sign),
    [locale, isHidden],
  );
}

// The same text as Quantity.
function useFormatQuantity(): (
  value: string,
  options?: FormatOptions,
) => string {
  const { locale, isHidden } = useFormatting();
  return useCallback(
    (value, options) =>
      isHidden ? hiddenText : formatQuantity(locale, value, options?.sign),
    [locale, isHidden],
  );
}

export type { Money };
export { useFormatMoney, useFormatPercent, useFormatQuantity };
