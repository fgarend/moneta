// What MonetaProvider holds for the pieces, beside the language and the router, which React Aria's own providers
// hold: the app's words for a value with none or hidden, whether values are hidden, and the zone of a moment and of
// today. Internal: the pieces and the hooks read it. docs/decisions/components.md says why it is so.
import { createContext } from "react";

type MonetaSettings = {
  emptyLabel?: string | undefined;
  isHidden?: boolean | undefined;
  hiddenLabel?: string | undefined;
  timeZone?: string | undefined;
};

const MonetaContext = createContext<MonetaSettings>({});

export { MonetaContext, type MonetaSettings };
