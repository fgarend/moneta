import { cn } from "cn";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { LinkButton } from "#components/button";

// Its name, as a page may hold more than one: a label, or a heading it points to.
type PaginationName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

// The app's summary at the start, the pages at the end. Narrow, by its own width, only Previous, the current page and
// Next stay, as arrows.
function Pagination({
  className,
  ...props
}: Omit<ComponentProps<"nav">, "aria-label" | "aria-labelledby"> &
  PaginationName) {
  return (
    <nav
      data-slot="pagination"
      className={cn(
        "@container/pagination flex w-full flex-wrap items-center justify-end gap-x-4 gap-y-2",
        className,
      )}
      {...props}
    />
  );
}

// The app's words for the rows shown, as "15–28 of 142", in a status heard when the page changes and focus stays.
function PaginationSummary({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="pagination-summary"
      className={cn("me-auto text-sm text-muted-foreground", className)}
      role="status"
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  );
}

// Narrow, a page but the current one, and a gap, step aside.
function PaginationItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="pagination-item"
      className={cn(
        "@max-sm/pagination:has-data-[slot=pagination-ellipsis]:hidden @max-sm/pagination:has-[[data-slot=pagination-link]:not([aria-current=page])]:hidden",
        className,
      )}
      {...props}
    />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Omit<ComponentProps<typeof LinkButton>, "variant">;

// A page, the current one outlined as a field is, at 3:1, and a link that goes nowhere dimmed.
function PaginationLink({
  className,
  isActive,
  size = "icon",
  href,
  isDisabled,
  ...props
}: PaginationLinkProps) {
  return (
    <LinkButton
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(
        isActive && "border-input",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      // A link that goes nowhere keeps no address, which a middle click would still open.
      href={isDisabled ? undefined : href}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

// Previous and Next, named by the app's words, which narrow are heard and not seen, beside an arrow that turns when
// the page reads from the right.
type StepProps = Omit<ComponentProps<typeof PaginationLink>, "children"> & {
  children: ReactNode;
};

function PaginationPrevious({ className, children, ...props }: StepProps) {
  return (
    <PaginationLink
      size="default"
      className={cn(
        "ps-1.5! @max-sm/pagination:size-9 @max-sm/pagination:px-0!",
        className,
      )}
      data-slot="pagination-previous"
      {...props}
    >
      <ChevronLeftIcon className="rtl:rotate-180" data-icon="inline-start" />
      <span className="@max-sm/pagination:sr-only">{children}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, children, ...props }: StepProps) {
  return (
    <PaginationLink
      size="default"
      className={cn(
        "pe-1.5! @max-sm/pagination:size-9 @max-sm/pagination:px-0!",
        className,
      )}
      data-slot="pagination-next"
      {...props}
    >
      <span className="@max-sm/pagination:sr-only">{children}</span>
      <ChevronRightIcon className="rtl:rotate-180" data-icon="inline-end" />
    </PaginationLink>
  );
}

// A gap between pages, which cannot be pressed, so it says nothing.
function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden={true}
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
};
