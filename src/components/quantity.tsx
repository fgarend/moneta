// A quantity, as shares or units, with exactly the decimals given, in the language React Aria speaks. Its unit is
// the app's words, around it. Drawn as Amount is, and docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize, type ValueTone } from "#hooks/use-value";
import { formatQuantity, type Sign } from "#lib/money";

function Quantity({
  value,
  emptyLabel,
  size = "default",
  sign = "auto",
  tone,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // A decimal string, or null for no value, which shows a dash.
  value: string | null;
  // What screen readers hear for no value, over MoneyProvider's.
  emptyLabel?: string;
  size?: ValueSize;
  // "always" shows the plus of a change. Zero takes no sign.
  sign?: Sign;
  // Good news or bad, as the app says, never read from the sign. Its sign or its place says it too.
  tone?: ValueTone;
}) {
  const { locale } = useLocale();
  const shown = useValue("Quantity", {
    isEmpty: value === null,
    emptyLabel,
    size,
    tone,
    className,
  });

  // With no value, or hidden, what the app's words say in its place, and nothing of the value.
  if (value === null || shown.words !== null) {
    return (
      <span className={shown.className} data-slot="quantity" {...props}>
        {shown.words}
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
      {formatQuantity(locale, value, sign)}
    </data>
  );
}

export { Quantity };
