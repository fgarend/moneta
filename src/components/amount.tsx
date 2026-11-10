// An amount of money, exact, in its currency's decimals and the language React Aria speaks, in a row or of note. It
// never wraps and is never cut, so whatever holds it deals with the space. docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize } from "#hooks/use-value";
import { formatMoney, type Money } from "#lib/money";

const dash = "—";

function Amount({
  value,
  emptyLabel,
  size = "default",
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // null says there is no value, which shows a dash.
  value: Money | null;
  // What screen readers hear for no value, over MoneyProvider's.
  emptyLabel?: string;
  size?: ValueSize;
}) {
  const { locale } = useLocale();
  const shown = useValue("Amount", {
    isEmpty: value === null,
    emptyLabel,
    size,
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
      {formatMoney(locale, value)}
    </data>
  );
}

export { Amount };
