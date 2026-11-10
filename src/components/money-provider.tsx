// Once, at the app's root: the app's own words that its pieces of money need, and whether values are hidden, which
// the app's own control turns on. docs/decisions/money.md says why it is so.
import { type ReactNode, useContext } from "react";
import { MoneyContext } from "#lib/money";

function MoneyProvider({
  emptyLabel,
  isHidden,
  hiddenLabel,
  children,
}: {
  // What screen readers hear for no value.
  emptyLabel?: string;
  // Every value shows dots, and nothing of it stays in the page.
  isHidden?: boolean;
  // What screen readers hear for a hidden value.
  hiddenLabel?: string;
  children: ReactNode;
}) {
  // One inside another keeps what it is not given, so it never shows what the app hid.
  const outer = useContext(MoneyContext);
  return (
    <MoneyContext.Provider
      value={{
        emptyLabel: emptyLabel ?? outer.emptyLabel,
        isHidden: isHidden ?? outer.isHidden,
        hiddenLabel: hiddenLabel ?? outer.hiddenLabel,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}

export { MoneyProvider };
