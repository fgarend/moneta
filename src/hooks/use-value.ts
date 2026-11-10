// What every piece of money shares: its text, the app's words for no value, and a copy of one taking a hyphen.
// Internal: Amount and Percent read it. docs/decisions/money.md says why it is so.
import { cn } from "cn";
import { useContext, useEffect } from "react";
import { MoneyContext } from "#lib/money";

const sizes = { default: "type-amount", lg: "type-amount-lg" };
// Every piece of money, by its data-slot.
const pieces = '[data-slot="amount"],[data-slot="percent"]';

type ValueSize = keyof typeof sizes;

// A copy of one value, and of nothing more, takes a hyphen for its minus, as spreadsheets read only that as
// negative. A copy of more is the browser's own, as it lets a page replace a copy but not change one.
function copyWithHyphen(event: ClipboardEvent): void {
  const selection = document.getSelection() as Selection;
  if (selection.rangeCount === 0) {
    return;
  }
  const common = selection.getRangeAt(0).commonAncestorContainer;
  const element =
    common instanceof Element ? common : (common.parentElement as Element);
  if (element.closest(pieces) === null) {
    return;
  }
  (event.clipboardData as DataTransfer).setData(
    "text/plain",
    selection.toString().replaceAll("−", "-"),
  );
  event.preventDefault();
}

// The classes of a piece of money, and with no value, the words screen readers hear for it: its own, or
// MoneyProvider's. With neither, it throws, so the app finds out while it builds.
function useValue(
  piece: string,
  {
    isEmpty,
    emptyLabel,
    size,
    className,
  }: {
    isEmpty: boolean;
    emptyLabel: string | undefined;
    size: ValueSize;
    className: string | undefined;
  },
): { className: string; label: string | undefined } {
  const words = useContext(MoneyContext);
  // One listener serves every piece, as adding the same one again does nothing. It stays after the last piece, and
  // does nothing then.
  useEffect(() => {
    document.addEventListener("copy", copyWithHyphen);
  }, []);
  const label = emptyLabel ?? words.emptyLabel;
  if (isEmpty && label === undefined) {
    throw new Error(
      `${piece}: no value needs an emptyLabel, on it or on MoneyProvider.`,
    );
  }
  return {
    className: cn("whitespace-nowrap", sizes[size], className),
    label,
  };
}

export { useValue, type ValueSize };
