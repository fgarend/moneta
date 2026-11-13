"use client";

import { cn } from "cn";
import type * as React from "react";
import {
  composeRenderProps,
  Input as InputPrimitive,
} from "react-aria-components";

// The scale's heights, as a row's buttons have them; the input's own size, its width in characters, is not used.
const sizes = { sm: "h-8", default: "h-9", lg: "h-10" };

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<typeof InputPrimitive>, "size"> & {
  size?: keyof typeof sizes;
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={composeRenderProps(className, (resolved) =>
        cn(
          sizes[size],
          "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          resolved,
        ),
      )}
      {...props}
    />
  );
}

export { Input };
