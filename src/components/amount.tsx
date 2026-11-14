// An amount of money, exact, in its currency's decimals and the language React Aria speaks, in a row or of note. It
// never wraps and is never cut, so whatever holds it deals with the space. docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize, type ValueTone } from "#hooks/use-value";
import { formatMoney, type Money, type Sign } from "#lib/money";

/**
 * An amount of money, exact, in its currency's decimals and the app's language.
 *
 * **Use it for**
 *
 * - A balance, a payment or a total, in a row, a cell or a sentence on screen.
 * - One of note, with `size="lg"`, or the size of where it sits, as in a `StatValue`.
 * - A change, with `sign="always"` and the app's `tone` for good news or bad.
 *
 * **Not recommended**
 *
 * - A ratio or shares: use `Percent` or `Quantity`.
 * - A number: give a decimal string, as `"-1234.50"`, which it never rounds.
 * - Text where no piece can go, as a chart's axis or a page's title: use `useFormatMoney`, so the two never differ.
 */
function Amount({
  value,
  emptyLabel,
  size,
  sign = "auto",
  tone,
  hideCurrency = false,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // null says there is no value, which shows a dash.
  value: Money | null;
  // What screen readers hear for no value, over MonetaProvider's.
  emptyLabel?: string;
  size?: ValueSize;
  // "always" shows the plus of a change. Zero takes no sign.
  sign?: Sign;
  // Good news or bad, as the app says, never read from the sign. Its sign or its place says it too.
  tone?: ValueTone;
  // Leaves the currency out, for a column of one currency whose header names it.
  hideCurrency?: boolean;
}) {
  const { locale } = useLocale();
  const shown = useValue("Amount", {
    isEmpty: value === null,
    emptyLabel,
    size,
    tone,
    className,
  });

  // With no value, or hidden, what the app's words say in its place, and nothing of the value.
  if (value === null || shown.words !== null) {
    return (
      <span className={shown.className} data-slot="amount" {...props}>
        {shown.words}
      </span>
    );
  }
  return (
    <data
      className={shown.className}
      data-slot="amount"
      value={value.amount}
      {...props}
    >
      {formatMoney(locale, value, { sign, hideCurrency })}
    </data>
  );
}

export { Amount };
