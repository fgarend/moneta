// What every piece of money shares: its text, what it shows with no value or hidden, and a copy of one taking a
// hyphen. Internal: Amount, Percent and Quantity read it. docs/decisions/money.md says why it is so.
import { cn } from "cn";
import { createElement, type ReactNode, useContext, useEffect } from "react";
import { MonetaContext } from "#hooks/moneta";
import { hiddenText } from "#lib/money";

const sizes = { default: "type-amount", lg: "type-amount-lg" };
// Every piece of money, by its data-slot.
const pieces =
  '[data-slot="amount"],[data-slot="percent"],[data-slot="quantity"]';
const dash = "—";

// Good news or bad, as the app says, never read from the sign. With none, the colour of the text around.
const tones = { positive: "text-positive", negative: "text-negative" };

type ValueSize = keyof typeof sizes;
type ValueTone = keyof typeof tones;

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

// A sign that screen readers skip, and the app's words they read in its place.
function wordsFor(symbol: string, label: string): ReactNode {
  return [
    createElement("span", { "aria-hidden": "true", key: "symbol" }, symbol),
    createElement("span", { className: "sr-only", key: "words" }, label),
  ];
}

// The classes of a piece of money, with its tone's colour, and what it shows in place of its value: with values
// hidden, dots, and with no value, a dash, each with the app's words for screen readers. Hidden wins, and drops the
// tone, as a colour says which way a value went. With no words for what it shows, it throws, so the app finds out
// while it builds.
function useValue(
  piece: string,
  {
    isEmpty,
    emptyLabel,
    size,
    tone,
    className,
  }: {
    isEmpty: boolean;
    emptyLabel: string | undefined;
    size: ValueSize;
    tone: ValueTone | undefined;
    className: string | undefined;
  },
): { className: string; words: ReactNode } {
  const provided = useContext(MonetaContext);
  // One listener serves every piece, as adding the same one again does nothing. It stays after the last piece, and
  // does nothing then.
  useEffect(() => {
    document.addEventListener("copy", copyWithHyphen);
  }, []);
  const isHidden = provided.isHidden === true;
  const classes = cn(
    "whitespace-nowrap",
    sizes[size],
    !isHidden && tone && tones[tone],
    className,
  );
  if (isHidden) {
    if (provided.hiddenLabel === undefined) {
      throw new Error(
        `${piece}: a hidden value needs a hiddenLabel on MonetaProvider.`,
      );
    }
    return {
      className: classes,
      words: wordsFor(hiddenText, provided.hiddenLabel),
    };
  }
  if (isEmpty) {
    const label = emptyLabel ?? provided.emptyLabel;
    if (label === undefined) {
      throw new Error(
        `${piece}: no value needs an emptyLabel, on it or on MonetaProvider.`,
      );
    }
    return { className: classes, words: wordsFor(dash, label) };
  }
  return { className: classes, words: null };
}

export { useValue, type ValueSize, type ValueTone };
