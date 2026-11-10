// Money as Moneta holds it, and the one path from an amount to its text, which every piece of money and the hook
// take. Internal: an app gets it through them. docs/decisions/money.md says why it is so.
import { createContext } from "react";

// An amount as a decimal string, exact, and its currency's code, as a backend sends them.
type Money = { amount: string; currency: string };

// The app's words for what a piece of money shows with no number, from MoneyProvider.
type MoneyWords = { emptyLabel?: string | undefined };

const MoneyContext = createContext<MoneyWords>({});

const decimalString = /^-?\d+(?:\.\d+)?$/u;
const currencyCode = /^[A-Z]{3}$/u;
// Read as "minus" by screen readers, where Intl writes a hyphen in many languages.
const minusSign = "−";
// Intl's highest, so every digit given is shown and none is rounded. The currency's own decimals stay the least, as
// the browser gives them.
const everyDigit = 100;

// One formatter per language and currency, as making one is slow and a table may hold hundreds of amounts.
const formatters = new Map<string, Intl.NumberFormat>();

function formatterOf(locale: string, currency: string): Intl.NumberFormat {
  const key = `${locale} ${currency}`;
  let formatter = formatters.get(key);
  if (formatter === undefined) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: everyDigit,
      // Zero takes no sign, even when given as "-0".
      signDisplay: "negative",
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

function formatMoney(locale: string, { amount, currency }: Money): string {
  if (!decimalString.test(amount)) {
    throw new Error(
      `Money: "${amount}" is not a decimal string, as "1234.50".`,
    );
  }
  if (!currencyCode.test(currency)) {
    throw new Error(`Money: "${currency}" is not a currency code, as "BRL".`);
  }
  return formatterOf(locale, currency)
    .formatToParts(amount as Intl.StringNumericLiteral)
    .map(({ type, value }) => (type === "minusSign" ? minusSign : value))
    .join("");
}

export { formatMoney, type Money, MoneyContext, type MoneyWords };
