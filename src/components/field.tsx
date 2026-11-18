"use client";

import { cn } from "cn";
import { useContext, useMemo } from "react";
import {
  FieldErrorContext,
  FieldError as FieldErrorPrimitive,
  Group,
  type GroupProps,
  Text,
} from "react-aria-components";

import { Label } from "#components/label";
import { Separator } from "#components/separator";
import { type FieldOrientation, fieldVariants } from "#hooks/field";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

// A group's title, a step below a card's and above a field's label; as a label, a field's label.
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 text-sm leading-5 data-[variant=label]:font-medium data-[variant=legend]:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A label and what it names laid out together, its words below, for what has no field of React Aria around it.
 *
 * **Use it for**
 *
 * - A value or a choice with its title and description, as a row of settings, across with `orientation`.
 * - Several fields together, in a `FieldGroup`, or under a legend, in a `FieldSet`.
 *
 * **Not recommended**
 *
 * - Text typed in: `TextField` links its label, description and error by itself, which `Field` does not.
 * - A box with its card: ChoiceCard is to come.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: Omit<GroupProps, "className"> & {
  className?: string;
  orientation?: FieldOrientation;
}) {
  return (
    <Group
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-5",
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn("group/field-label peer/field-label w-fit", className)}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-5 font-medium group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

// Inside a field of React Aria, its description, which the field links to its box; elsewhere, words under a title.
function FieldDescription({
  className,
  ...props
}: Omit<React.ComponentProps<"p">, "slot">) {
  return (
    <Text
      data-slot="field-description"
      elementType="p"
      slot="description"
      className={cn(
        "text-left text-sm font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span
          className="relative mx-auto block w-fit bg-(--surface) px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}

// Inside a field of React Aria, its error, shown only while the field is invalid and linked to its box, with no alert;
// elsewhere, an alert. Errors given as a list, as a form library gives them, are said once each.
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const inField = useContext(FieldErrorContext) !== null;
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error) =>
          error?.message ? <li key={error.message}>{error.message}</li> : null,
        )}
      </ul>
    );
  }, [children, errors]);
  const look = cn("text-sm font-normal text-destructive", className);

  if (inField) {
    return (
      <FieldErrorPrimitive
        className={look}
        data-slot="field-error"
        elementType="div"
      >
        {content ?? undefined}
      </FieldErrorPrimitive>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div role="alert" data-slot="field-error" className={look} {...props}>
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
