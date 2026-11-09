"use client";

import { cn } from "cn";
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import {
  type ToggleButtonGroupProps,
  ToggleButtonGroup as ToggleGroupPrimitive,
} from "react-aria-components";

import { Toggle } from "#components/toggle";

const ToggleGroupContext = createContext<
  Pick<ComponentProps<typeof Toggle>, "variant" | "size"> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: Omit<ToggleButtonGroupProps, "children"> &
  Pick<ComponentProps<typeof Toggle>, "variant" | "size"> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
    children?: ReactNode;
  }) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      orientation={orientation}
      style={{ "--gap": `calc(var(--spacing) * ${spacing})` } as CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-(--gap) rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: ComponentProps<typeof Toggle>) {
  const context = useContext(ToggleGroupContext);

  return (
    <Toggle
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      variant={context.variant || variant}
      size={context.size || size}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        className,
      )}
      {...props}
    >
      {children}
    </Toggle>
  );
}

export { ToggleGroup, ToggleGroupItem };
