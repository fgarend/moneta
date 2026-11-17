// The app's own text outside the pieces: a paragraph of its sentences, or a note in the place of something that did not
// come. A `p` with no margin, as what holds it lays the space. docs/decisions/components.md says why it is so.
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ReactNode } from "react";

const textVariants = cva("wrap-break-word", {
  variants: {
    variant: {
      default: "max-w-prose type-paragraph",
      note: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

/**
 * The app's own text, outside the pieces: a paragraph of its sentences, at 14/24 and 65 characters at most, or a note,
 * muted, in the place of something that did not come.
 *
 * **Use it for**
 * - Sentences of your own in a section, a card or a panel, each a `Text`, which the place around lays apart.
 * - A line in the place of what did not come, as "No quote for this day", with `variant="note"`.
 *
 * **Not recommended**
 * - A piece's own text, as an alert's or a dialog's description: use its part, which reads the same step.
 * - What a whole page or area says when it has nothing: use `Empty`.
 * - A title: use the piece's, as `SectionTitle` or `CardTitle`.
 * - A long document from markdown: Text is for an interface's sentences.
 */
function Text({
  variant,
  className,
  children,
}: VariantProps<typeof textVariants> & {
  className?: string;
  /** Your words; a Text with nothing in it says nothing. */
  children: ReactNode;
}) {
  return (
    <p
      data-slot="text"
      data-variant={variant ?? "default"}
      className={cn(textVariants({ variant }), className)}
    >
      {children}
    </p>
  );
}

export { Text };
