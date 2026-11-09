"use client";

import { cn } from "cn";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
  Breadcrumb as BreadcrumbPrimitive,
  type BreadcrumbProps,
  Breadcrumbs as BreadcrumbsPrimitive,
  type BreadcrumbsProps,
  composeRenderProps,
  Link as LinkPrimitive,
  type LinkProps,
} from "react-aria-components";

function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  );
}

function BreadcrumbList<T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) {
  return (
    <BreadcrumbsPrimitive
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({
  className,
  children,
  separatorClassName,
  ...props
}: BreadcrumbProps & { separatorClassName?: string }) {
  return (
    <BreadcrumbPrimitive
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {composeRenderProps(children, (resolved, { isCurrent }) => (
        <>
          {resolved}
          {!isCurrent && (
            <span
              data-slot="breadcrumb-separator"
              role="presentation"
              aria-hidden="true"
              className={cn("[&>svg]:size-3.5", separatorClassName)}
            >
              <ChevronRightIcon />
            </span>
          )}
        </>
      ))}
    </BreadcrumbPrimitive>
  );
}

function BreadcrumbLink({ className, render, ...props }: LinkProps) {
  return (
    <LinkPrimitive
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      render={render}
      {...props}
    />
  );
}

// The current page, as React Aria's Link draws the last item of a path: a link that is marked and disabled.
function BreadcrumbPage({ className, ...props }: Omit<LinkProps, "href">) {
  return (
    <LinkPrimitive
      data-slot="breadcrumb-page"
      aria-current="page"
      isDisabled={true}
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
};
