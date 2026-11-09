import { cn } from "cn";
import {
  composeRenderProps,
  RadioButton,
  type RadioButtonProps,
  RadioField,
  type RadioFieldProps,
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupProps,
} from "react-aria-components";

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  );
}

// React Aria's field, which holds the value, around its button, the label that draws the circle. The field takes no room.
function RadioGroupItem({
  className,
  children,
  ...props
}: Omit<RadioFieldProps, "children" | "className"> & {
  className?: string;
  children?: RadioButtonProps["children"];
}) {
  return (
    <RadioField className="contents" {...props}>
      <RadioButton
        data-slot="radio-group-item"
        className={cn(
          "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-invalid:data-selected:border-primary dark:data-selected:bg-primary",
          className,
        )}
      >
        {composeRenderProps(children, (resolved, { isSelected }) => (
          <>
            <span
              data-slot="radio-group-indicator"
              className="flex size-4 items-center justify-center"
            >
              {isSelected ? (
                <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
              ) : null}
            </span>
            {resolved}
          </>
        ))}
      </RadioButton>
    </RadioField>
  );
}

export { RadioGroup, RadioGroupItem };
