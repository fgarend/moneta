// Money for an app: its type, and the hooks that write a value where no piece can go, such as a chart's axis or a
// page's title. It holds no piece, so it stays apart from MoneyProvider. docs/decisions/money.md says why it is so.
import { useCallback } from "react";
import { useLocale } from "react-aria-components";
import { formatMoney, formatPercent, type Money } from "#lib/money";

// The same text as Amount, in the language React Aria speaks.
function useFormatMoney(): (money: Money) => string {
  const { locale } = useLocale();
  return useCallback((money) => formatMoney(locale, money), [locale]);
}

// The same text as Percent, from a ratio given as a fraction of one.
function useFormatPercent(): (ratio: string) => string {
  const { locale } = useLocale();
  return useCallback((ratio) => formatPercent(locale, ratio), [locale]);
}

export type { Money };
export { useFormatMoney, useFormatPercent };
