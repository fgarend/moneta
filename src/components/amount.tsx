// An amount of money, exact, in its currency's decimals and the language React Aria speaks, in a row or of note. It
// never wraps and is never cut, so whatever holds it deals with the space. docs/decisions/money.md says why it is so.
import { cn } from "cn";
import { type HTMLAttributes, useContext, useEffect } from "react";
import { useLocale } from "react-aria-components";
import { formatMoney, type Money, MoneyContext } from "#lib/money";

const dash = "—";
const sizes = { default: "type-amount", lg: "type-amount-lg" };

// A copy of one amount, and of nothing more, takes a hyphen for its minus, as spreadsheets read only that as
// negative. A copy of more is the browser's own, as it lets a page replace a copy but not change one.
function copyWithHyphen(event: ClipboardEvent): void {
  const selection = document.getSelection() as Selection;
  if (selection.rangeCount === 0) {
    return;
  }
  const common = selection.getRangeAt(0).commonAncestorContainer;
  const element =
    common instanceof Element ? common : (common.parentElement as Element);
  if (element.closest('[data-slot="amount"]') === null) {
    return;
  }
  (event.clipboardData as DataTransfer).setData(
    "text/plain",
    selection.toString().replaceAll("−", "-"),
  );
  event.preventDefault();
}

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
  size?: keyof typeof sizes;
}) {
  const { locale } = useLocale();
  const words = useContext(MoneyContext);
  // One listener serves every amount, as adding the same one again does nothing. It stays after the last amount, and
  // does nothing then.
  useEffect(() => {
    document.addEventListener("copy", copyWithHyphen);
  }, []);
  const classes = cn("whitespace-nowrap", sizes[size], className);

  if (value === null) {
    const label = emptyLabel ?? words.emptyLabel;
    if (label === undefined) {
      throw new Error(
        "Amount: no value needs an emptyLabel, on it or on MoneyProvider.",
      );
    }
    return (
      <span className={classes} data-slot="amount" {...props}>
        <span aria-hidden="true">{dash}</span>
        <span className="sr-only">{label}</span>
      </span>
    );
  }
  return (
    <data
      className={classes}
      data-slot="amount"
      value={value.amount}
      {...props}
    >
      {formatMoney(locale, value)}
    </data>
  );
}

export { Amount };
