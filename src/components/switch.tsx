import { cn } from "cn";
import {
  composeRenderProps,
  SwitchButton,
  type SwitchButtonProps,
  SwitchField,
  type SwitchFieldProps,
} from "react-aria-components";

function Switch({
  className,
  size = "default",
  children,
  ...props
}: Omit<SwitchFieldProps, "children" | "className"> & {
  className?: string;
  children?: SwitchButtonProps["children"];
  size?: "sm" | "default";
}) {
  // React Aria's field, which holds the state, around its button, the label that draws the track. The field takes no
  // room.
  return (
    <SwitchField className="contents" {...props}>
      <SwitchButton
        data-slot="switch"
        data-size={size}
        className={cn(
          "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none not-data-selected:bg-input group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-[size=default]:h-4.5 data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 dark:not-data-selected:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-selected:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        )}
      >
        {composeRenderProps(children, (resolved, { isSelected }) => (
          <>
            <span
              data-slot="switch-thumb"
              data-selected={isSelected || undefined}
              className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:not-data-selected:translate-x-0 group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:not-data-selected:translate-x-0 dark:not-data-selected:bg-foreground group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground group-data-[size=default]/switch:data-selected:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-selected:translate-x-[calc(100%-2px)] dark:data-selected:bg-primary-foreground"
            />
            {resolved}
          </>
        ))}
      </SwitchButton>
    </SwitchField>
  );
}

export { Switch };
