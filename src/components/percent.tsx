// A ratio as a percent, given as a fraction of one, "0.459" for 45.9%, with exactly the decimals given, in the
// language React Aria speaks. Drawn as Amount is, and docs/decisions/money.md says why it is so.
import type { HTMLAttributes } from "react";
import { useLocale } from "react-aria-components";
import { useValue, type ValueSize, type ValueTone } from "#hooks/use-value";
import { formatPercent, type Sign } from "#lib/money";

/**
 * A ratio as a percent, given as a fraction of one, with exactly the decimals given.
 *
 * **Use it for**
 *
 * - A change, a return or a share of a budget.
 * - A column of ratios, each sent in one precision, as `"0.1500"`.
 *
 * **Not recommended**
 *
 * - `"45.9"` for 45.9%: give `"0.459"`.
 * - Rounding for the screen: send the decimals to show, as it shows them all.
 * - Money or shares: use `Amount` or `Quantity`.
 */
function Percent({
  value,
  emptyLabel,
  size,
  sign = "auto",
  tone,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // A decimal string, a fraction of one, or null for no value, which shows a dash.
  value: string | null;
  // What screen readers hear for no value, over MonetaProvider's.
  emptyLabel?: string;
  size?: ValueSize;
  // "always" shows the plus of a change. Zero takes no sign.
  sign?: Sign;
  // Good news or bad, as the app says, never read from the sign. Its sign or its place says it too.
  tone?: ValueTone;
}) {
  const { locale } = useLocale();
  const shown = useValue("Percent", "percent", {
    isEmpty: value === null,
    emptyLabel,
    size,
    tone,
    className,
  });

  // With no value, or hidden, what the app's words say in its place, and nothing of the value.
  if (value === null || shown.words !== null) {
    return (
      <span className={shown.className} data-slot="percent" {...props}>
        {shown.words}
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
