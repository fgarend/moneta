// The head of a page, first in its content: what scopes the page, its title, the page's one heading of level 1, a
// description, and its actions. Its parts follow Section's, and docs/decisions/components.md says why it is so.
import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import { Skeleton } from "#components/skeleton";

/**
 * The head of a page, first in its content: its title, what it shows, and what can be done there.
 *
 * **Use it for**
 *
 * - A page's title, once, as `PageTitle`, with a `PageDescription` that says what the page shows.
 * - What scopes the whole page, as whose accounts or which period, in `PageContext` above the title.
 * - The page's actions in `PageAction`, which go under the description when the header is narrow.
 *
 * **Not recommended**
 *
 * - A label over the title, or the way to the page: the breadcrumb is the `AppHeader`'s.
 * - A part of the page: use `Section`, whose title is a level below.
 */
function PageHeader({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("@container/page-header", className)}
      data-slot="page-header"
      {...props}
    >
      <div className="group/page-header grid items-center gap-x-6 gap-y-2 @sm/page-header:has-data-[slot=page-action]:grid-cols-[1fr_auto]">
        {children}
      </div>
    </div>
  );
}

// What scopes the page, in a row that wraps, 12 px above the title.
function PageContext({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mb-1 flex flex-wrap items-center gap-2 @sm/page-header:col-start-1",
        className,
      )}
      data-slot="page-context"
      {...props}
    />
  );
}

// A title that loads asks for the app's words for it.
type Loading =
  | { isLoading?: false; loadingLabel?: never }
  | { isLoading: boolean; loadingLabel: string };

function PageTitle({
  className,
  isLoading = false,
  loadingLabel,
  children,
}: { className?: string; children?: ReactNode } & Loading) {
  if (isLoading) {
    return (
      <>
        <h1 className="sr-only" data-slot="page-title">
          {loadingLabel}
        </h1>
        <Skeleton
          aria-hidden="true"
          className="h-10 w-72 max-w-full @sm/page-header:col-start-1"
        />
      </>
    );
  }
  return (
    <h1
      // What it holds lies in a row, a mark before its words and a badge after; a mark is 40 px.
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 type-display *:data-[slot=avatar]:size-10 @sm/page-header:col-start-1",
        className,
      )}
      data-slot="page-title"
    >
      {children}
    </h1>
  );
}

function PageDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "max-w-prose type-paragraph text-muted-foreground @sm/page-header:col-start-1",
        className,
      )}
      data-slot="page-description"
      {...props}
    />
  );
}

// At the end, level with the title; under the description when the header is narrower than 384 px, its controls in a
// row that wraps.
function PageAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap items-center gap-2 @sm/page-header:col-start-2 @sm/page-header:row-start-1 @sm/page-header:mt-0 @sm/page-header:group-has-data-[slot=page-context]/page-header:row-start-2",
        className,
      )}
      data-slot="page-action"
      {...props}
    />
  );
}

export { PageAction, PageContext, PageDescription, PageHeader, PageTitle };
