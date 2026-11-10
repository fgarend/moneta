// A quantity, as shares or units, with exactly the decimals given, in the language React Aria speaks. Its unit is
// the app's words, around it. Drawn as Amount is, and docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize } from "#hooks/use-value";
import { formatQuantity } from "#lib/money";

const dash = "—";

function Quantity({
  value,
  emptyLabel,
  size = "default",
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // A decimal string, or null for no value, which shows a dash.
  value: string | null;
  // What screen readers hear for no value, over MoneyProvider's.
  emptyLabel?: string;
  size?: ValueSize;
}) {
  const { locale } = useLocale();
  const shown = useValue("Quantity", {
    isEmpty: value === null,
    emptyLabel,
    size,
    className,
  });

  if (value === null) {
    return (
      <span className={shown.className} data-slot="quantity" {...props}>
        <span aria-hidden="true">{dash}</span>
        <span className="sr-only">{shown.label}</span>
      </span>
    );
  }
  return (
    <data
      className={shown.className}
      data-slot="quantity"
      value={value}
      {...props}
    >
      {formatQuantity(locale, value)}
    </data>
  );
}

export { Quantity };
