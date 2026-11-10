// Money as Moneta holds it, and the one path from a value to its text, which every piece of money and the hooks take.
// Internal: an app gets it through them. docs/decisions/money.md says why it is so.
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
// A ratio's first two decimals become a percent's whole part.
const percentShift = 2;

// One formatter per set of options, as making one is slow and a table may hold hundreds of values.
const formatters = new Map<string, Intl.NumberFormat>();

function formatterOf(
  locale: string,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = `${locale} ${JSON.stringify(options)}`;
  let formatter = formatters.get(key);
  if (formatter === undefined) {
    // Zero takes no sign, even when given as "-0".
    formatter = new Intl.NumberFormat(locale, {
      ...options,
      signDisplay: "negative",
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

function checkDecimal(piece: string, value: string, example: string): void {
  if (!decimalString.test(value)) {
    throw new Error(
      `${piece}: "${value}" is not a decimal string, as "${example}".`,
    );
  }
}

// The text, exact, with the minus sign.
function textOf(formatter: Intl.NumberFormat, value: string): string {
  return formatter
    .formatToParts(value as Intl.StringNumericLiteral)
    .map((part) => (part.type === "minusSign" ? minusSign : part.value))
    .join("");
}

function formatMoney(locale: string, { amount, currency }: Money): string {
  checkDecimal("Money", amount, "1234.50");
  if (!currencyCode.test(currency)) {
    throw new Error(`Money: "${currency}" is not a currency code, as "BRL".`);
  }
  return textOf(
    formatterOf(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: everyDigit,
    }),
    amount,
  );
}

// A ratio, as "0.459" for 45.9%, with exactly the decimals given beyond its hundredths, zeros too.
function formatPercent(locale: string, ratio: string): string {
  checkDecimal("Percent", ratio, "0.459");
  const decimals = Math.max(
    0,
    (ratio.split(".")[1] ?? "").length - percentShift,
  );
  return textOf(
    formatterOf(locale, {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
    ratio,
  );
}

export {
  formatMoney,
  formatPercent,
  type Money,
  MoneyContext,
  type MoneyWords,
};
