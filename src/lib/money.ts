// Money as Moneta holds it, and the one path from a value to its text, which every piece of money and the hooks take.
// Internal: an app gets it through them. docs/decisions/money.md says why it is so.
// An amount as a decimal string, exact, and its currency's code, as a backend sends them.
type Money = { amount: string; currency: string };

// What a hidden value shows, of one width, so it says nothing of the number's size.
const hiddenText = "••••••";

const decimalString = /^-?\d+(?:\.\d+)?$/u;
const currencyCode = /^[A-Z]{3}$/u;
// Read as "minus" by screen readers, where Intl writes a hyphen in many languages.
const minusSign = "−";
// Intl's highest, so every digit given is shown and none is rounded. The currency's own decimals stay the least, as
// the browser gives them.
const everyDigit = 100;
// A ratio's first two decimals become a percent's whole part.
const percentShift = 2;

// Which signs a value shows: the minus alone, or the plus too, for a change. Zero takes neither, even as "-0", as
// Intl's "negative" and "exceptZero" have it.
type Sign = "auto" | "always";
// How an amount is written: its sign, and whether its currency is left out, as a column's header names it.
type MoneyOptions = {
  sign?: Sign | undefined;
  hideCurrency?: boolean | undefined;
};
const signDisplays = { auto: "negative", always: "exceptZero" } as const;

// One formatter per set of options, as making one is slow and a table may hold hundreds of values.
const formatters = new Map<string, Intl.NumberFormat>();

function formatterOf(
  locale: string,
  options: Intl.NumberFormatOptions,
  sign: Sign,
): Intl.NumberFormat {
  const key = `${locale} ${sign} ${JSON.stringify(options)}`;
  let formatter = formatters.get(key);
  if (formatter === undefined) {
    formatter = new Intl.NumberFormat(locale, {
      ...options,
      signDisplay: signDisplays[sign],
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

// How many decimals a decimal string holds.
function decimalsOf(value: string): number {
  return (value.split(".")[1] ?? "").length;
}

const space = /^\s+$/u;

// The text, exact, with the minus sign, and with the currency left out when asked, with the space that joins it to
// the number, before it or after it as the language puts it.
function textOf(
  formatter: Intl.NumberFormat,
  value: string,
  hideCurrency = false,
): string {
  const parts = formatter.formatToParts(value as Intl.StringNumericLiteral);
  const left = new Set<number>();
  for (const [index, part] of parts.entries()) {
    if (hideCurrency && part.type === "currency") {
      left.add(index);
      for (const near of [index - 1, index + 1]) {
        const joint = parts[near];
        if (joint?.type === "literal" && space.test(joint.value)) {
          left.add(near);
        }
      }
    }
  }
  return parts
    .filter((_part, index) => !left.has(index))
    .map((part) => (part.type === "minusSign" ? minusSign : part.value))
    .join("");
}

function formatMoney(
  locale: string,
  { amount, currency }: Money,
  { sign = "auto", hideCurrency = false }: MoneyOptions = {},
): string {
  checkDecimal("Money", amount, "1234.50");
  if (!currencyCode.test(currency)) {
    throw new Error(`Money: "${currency}" is not a currency code, as "BRL".`);
  }
  return textOf(
    formatterOf(
      locale,
      { style: "currency", currency, maximumFractionDigits: everyDigit },
      sign,
    ),
    amount,
    hideCurrency,
  );
}

// A ratio, as "0.459" for 45.9%, with exactly the decimals given beyond its hundredths, zeros too.
function formatPercent(
  locale: string,
  ratio: string,
  sign: Sign = "auto",
): string {
  checkDecimal("Percent", ratio, "0.459");
  const decimals = Math.max(0, decimalsOf(ratio) - percentShift);
  return textOf(
    formatterOf(
      locale,
      {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      },
      sign,
    ),
    ratio,
  );
}

// A quantity, as shares or units, with exactly the decimals given, zeros too.
function formatQuantity(
  locale: string,
  value: string,
  sign: Sign = "auto",
): string {
  checkDecimal("Quantity", value, "1234.5");
  const decimals = decimalsOf(value);
  return textOf(
    formatterOf(
      locale,
      { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
      sign,
    ),
    value,
  );
}

export {
  formatMoney,
  formatPercent,
  formatQuantity,
  hiddenText,
  type Money,
  type Sign,
};
