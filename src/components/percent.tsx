// A ratio as a percent, given as a fraction of one, "0.459" for 45.9%, with exactly the decimals given, in the
// language React Aria speaks. Drawn as Amount is, and docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize, type ValueTone } from "#hooks/use-value";
import { formatPercent, type Sign } from "#lib/money";

const dash = "—";

function Percent({
  value,
  emptyLabel,
  size = "default",
  sign = "auto",
  tone,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // A decimal string, a fraction of one, or null for no value, which shows a dash.
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
  const shown = useValue("Percent", {
    isEmpty: value === null,
    emptyLabel,
    size,
    tone,
    className,
  });

  if (value === null) {
    return (
      <span className={shown.className} data-slot="percent" {...props}>
        <span aria-hidden="true">{dash}</span>
        <span className="sr-only">{shown.label}</span>
      </span>
    );
  }
  return (
    <data
      className={shown.className}
      data-slot="percent"
      value={value}
      {...props}
    >
      {formatPercent(locale, value, sign)}
    </data>
  );
}

export { Percent };
