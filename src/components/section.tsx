// A titled part of a page, with no box of its own: a header with a title, a description and an action, then its
// content. Its parts follow Card's header, and docs/decisions/components.md says why it is so.
import { cn } from "cn";
import { type ComponentProps, createContext, useContext } from "react";
import { Heading, type HeadingProps } from "react-aria-components";

// The level of the nearest section's title. Outside any, a title starts at 2, below the page's 1. Internal until a
// second piece reads it, as docs/decisions/components.md says.
const SectionLevel = createContext(1);
const deepest = 6;

function Section({ className, ...props }: ComponentProps<"section">) {
  const level = useContext(SectionLevel);
  return (
    <SectionLevel.Provider value={Math.min(level + 1, deepest)}>
      <section
        className={cn("flex flex-col gap-4", className)}
        data-slot="section"
        {...props}
      />
    </SectionLevel.Provider>
  );
}

// A container, so the action moves under the title when the header is narrow, wherever the section sits.
function SectionHeader({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("@container/section-header", className)}
      data-slot="section-header"
      {...props}
    >
      <div className="grid items-center gap-x-4 gap-y-1 @sm/section-header:has-data-[slot=section-action]:grid-cols-[1fr_auto]">
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ className, level, ...props }: HeadingProps) {
  const fromSection = useContext(SectionLevel);
  return (
    <Heading
      className={cn("text-lg/6 font-semibold", className)}
      data-slot="section-title"
      level={level ?? fromSection}
      {...props}
    />
  );
}

function SectionDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("type-label text-muted-foreground", className)}
      data-slot="section-description"
      {...props}
    />
  );
}

function SectionAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-1 @sm/section-header:col-start-2 @sm/section-header:row-span-2 @sm/section-header:row-start-1 @sm/section-header:mt-0",
        className,
      )}
      data-slot="section-action"
      {...props}
    />
  );
}

export {
  Section,
  SectionAction,
  SectionDescription,
  SectionHeader,
  SectionTitle,
};
