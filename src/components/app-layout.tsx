// The app's shell. AppLayout arranges only: the sidebar's column, sticky at full height, beside the main's, and the
// page's bar, sticky at the top where the screen is tall enough. AppMain, AppHeader and AppContent draw themselves,
// whatever the arrangement. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import type { ComponentProps } from "react";

// What sticks: the sidebar at full height, and the bar at the top at z-40, above what sticks inside a piece and below
// the dialogs, on a screen tall enough, where the theme keeps the page's scroll clear of it.
function AppLayout({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-svh",
        "[&>[data-slot=sidebar]]:sticky [&>[data-slot=sidebar]]:top-0 [&>[data-slot=sidebar]]:h-svh",
        "tall:[&_[data-slot=app-header]]:sticky tall:[&_[data-slot=app-header]]:top-0 tall:[&_[data-slot=app-header]]:z-40",
        className,
      )}
      data-slot="app-layout"
      {...props}
    />
  );
}

// The page's landmark, which a SkipLink goes to by its id. It sets the width its bar and content share: 1440 px, or
// the full width once its content asks for it.
function AppMain({ id = "main", className, ...props }: ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "flex min-w-0 flex-1 flex-col outline-none [--app-width:90rem] has-data-[width=full]:[--app-width:100%]",
        className,
      )}
      data-slot="app-main"
      id={id}
      {...props}
    />
  );
}

// The page's bar, inside main: its breadcrumb, its tools and on a phone the sidebar's trigger, on the page's
// background over a line, its row as wide as the content and centred with it.
function AppHeader({
  className,
  children,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      className={cn("h-14 border-b bg-background", className)}
      data-slot="app-header"
      {...props}
    >
      <div
        className="mx-auto flex h-full w-full max-w-(--app-width) items-center gap-3 px-4 md:px-10"
        data-slot="app-header-row"
      >
        {children}
      </div>
    </header>
  );
}

// The bar's tools, at its end.
function AppHeaderActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("ms-auto flex items-center gap-2", className)}
      data-slot="app-header-actions"
      {...props}
    />
  );
}

// The page's content: its margins, its width, and 40 px between its sections.
function AppContent({
  width = "default",
  className,
  ...props
}: ComponentProps<"div"> & {
  // "full" for a page that needs every column, as a wide table's.
  width?: "default" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-(--app-width) flex-col gap-10 px-4 py-10 md:px-10",
        className,
      )}
      data-slot="app-content"
      data-width={width}
      {...props}
    />
  );
}

export { AppContent, AppHeader, AppHeaderActions, AppLayout, AppMain };
