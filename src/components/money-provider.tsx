// Once, at the app's root: the app's own words that its pieces of money need, such as what screen readers hear for an
// amount with no value. docs/decisions/money.md says why it is so.
import type { ReactNode } from "react";
import { MoneyContext } from "#lib/money";

function MoneyProvider({
  emptyLabel,
  children,
}: {
  emptyLabel?: string;
  children: ReactNode;
}) {
  return (
    <MoneyContext.Provider value={{ emptyLabel }}>
      {children}
    </MoneyContext.Provider>
  );
}

export { MoneyProvider };
