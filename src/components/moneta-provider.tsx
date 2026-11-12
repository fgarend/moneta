// Once, at the app's root: the app's language, router and time zone, and its own words that the pieces need, and
// whether values are hidden, which the app's own control turns on. docs/decisions/components.md says why it is so.
import { type ComponentProps, type ReactNode, useContext } from "react";
import { I18nProvider, RouterProvider } from "react-aria-components";
import { MonetaContext } from "#hooks/moneta";

type RouterProps = ComponentProps<typeof RouterProvider>;

// The app's router, as React Aria takes it: navigate on a press, and useHref to make a path an address.
type MonetaRouter =
  | { navigate: RouterProps["navigate"]; useHref?: RouterProps["useHref"] }
  | { navigate?: never; useHref?: never };

function MonetaProvider({
  locale,
  navigate,
  useHref,
  timeZone,
  emptyLabel,
  isHidden,
  hiddenLabel,
  children,
}: MonetaRouter & {
  // The app's language, as "pt-BR", for React Aria's words and every value's format. The browser's when not given.
  locale?: string;
  // The zone a moment is shown in, and today is counted in, as "America/Sao_Paulo". The browser's when not given.
  timeZone?: string;
  // What screen readers hear for no value.
  emptyLabel?: string;
  // Every value shows dots, and nothing of it stays in the page.
  isHidden?: boolean;
  // What screen readers hear for a hidden value.
  hiddenLabel?: string;
  children: ReactNode;
}) {
  // One inside another keeps what it is not given, so it never shows what the app hid, nor drops its language, zone
  // or router.
  const outer = useContext(MonetaContext);
  let tree = (
    <MonetaContext.Provider
      value={{
        emptyLabel: emptyLabel ?? outer.emptyLabel,
        isHidden: isHidden ?? outer.isHidden,
        hiddenLabel: hiddenLabel ?? outer.hiddenLabel,
        timeZone: timeZone ?? outer.timeZone,
      }}
    >
      {children}
    </MonetaContext.Provider>
  );
  if (navigate !== undefined) {
    tree = (
      <RouterProvider navigate={navigate} useHref={useHref}>
        {tree}
      </RouterProvider>
    );
  }
  if (locale !== undefined) {
    tree = <I18nProvider locale={locale}>{tree}</I18nProvider>;
  }
  return tree;
}

export { MonetaProvider };
