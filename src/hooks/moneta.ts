// What MonetaProvider holds for the pieces, beside the language and the router, which React Aria's own providers
// hold: the app's words for a value with none or hidden, whether values are hidden, and the zone of a moment and of
// today. Internal: the pieces and the hooks read it. docs/decisions/components.md says why it is so.
import { createContext } from "react";

// The kinds of value hiding may hide, in the pieces' own names.
type HiddenKind = "amount" | "percent" | "quantity";

const everyKind: readonly HiddenKind[] = ["amount", "percent", "quantity"];

type MonetaSettings = {
  emptyLabel?: string | undefined;
  isHidden?: boolean | undefined;
  hides?: readonly HiddenKind[] | undefined;
  hiddenLabel?: string | undefined;
  timeZone?: string | undefined;
};

const MonetaContext = createContext<MonetaSettings>({});

// Whether a value of this kind is hidden: values are, and the app hides its kind, every kind unless it says.
function isKindHidden(settings: MonetaSettings, kind: HiddenKind): boolean {
  return (
    settings.isHidden === true && (settings.hides ?? everyKind).includes(kind)
  );
}

export { type HiddenKind, isKindHidden, MonetaContext, type MonetaSettings };
