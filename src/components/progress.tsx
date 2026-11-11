"use client";

import { cn } from "cn";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  Label as LabelPrimitive,
  type LabelProps,
  ProgressBar as ProgressPrimitive,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components";

type ProgressContextValue = {
  percentage?: number;
  isIndeterminate: boolean;
  valueText?: string;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a Progress.");
  }

  return context;
}

function ProgressContent({
  children,
  percentage,
  isIndeterminate,
  valueText,
}: ProgressContextValue & {
  children?: ReactNode;
}) {
  const context = useMemo(
    () => ({ percentage, isIndeterminate, valueText }),
    [percentage, isIndeterminate, valueText],
  );

  return (
    <ProgressContext value={context}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressContext>
  );
}

function Progress({
  className,
  children,
  ...props
}: Omit<ProgressPrimitiveProps, "children" | "className"> & {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <ProgressPrimitive
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <ProgressContent
          percentage={percentage}
          valueText={valueText}
          isIndeterminate={isIndeterminate}
        >
          {children}
        </ProgressContent>
      )}
    </ProgressPrimitive>
  );
}

function ProgressTrack({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  style,
  ...props
}: ComponentProps<"span">) {
  const { percentage, isIndeterminate } = useProgress();

  return (
    <span
      data-slot="progress-indicator"
      className={cn(
        "h-full bg-primary transition-all",
        // With no value, a part of the bar runs across it, or stands still, dashed, with less motion.
        isIndeterminate && "progress-run",
        className,
      )}
      style={{
        ...style,
        ...(isIndeterminate ? {} : { width: `${percentage}%` }),
      }}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({
  className,
  children,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  children?: (value: string) => ReactNode;
}) {
  const { valueText } = useProgress();
  const shown =
    children !== undefined && valueText !== undefined
      ? children(valueText)
      : valueText;
  return (
    <span
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className,
      )}
      data-slot="progress-value"
      {...props}
    >
      {shown}
    </span>
  );
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
};
