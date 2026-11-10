// An amount of money, exact, in its currency's decimals and the language React Aria speaks, in a row or of note. It
// never wraps and is never cut, so whatever holds it deals with the space. docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize, type ValueTone } from "#hooks/use-value";
import { formatMoney, type Money, type Sign } from "#lib/money";

const dash = "—";

function Amount({
  value,
  emptyLabel,
  size = "default",
  sign = "auto",
  tone,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // null says there is no value, which shows a dash.
  value: Money | null;
  // What screen readers hear for no value, over MoneyProvider's.
  emptyLabel?: string;
  size?: ValueSize;
  // "always" shows the plus of a change. Zero takes no sign.
  sign?: Sign;
  // Good news or bad, as the app says, never read from the sign. Its sign or its place says it too.
  tone?: ValueTone;
}) {
  const { locale } = useLocale();
  const shown = useValue("Amount", {
    isEmpty: value === null,
    emptyLabel,
    size,
    tone,
    className,
  });

  if (value === null) {
    return (
      <span className={shown.className} data-slot="amount" {...props}>
        <span aria-hidden="true">{dash}</span>
        <span className="sr-only">{shown.label}</span>
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
      {formatMoney(locale, value, sign)}
    </data>
  );
}

export { Amount };
