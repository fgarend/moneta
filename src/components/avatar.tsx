import { cn } from "cn";
import { type ComponentProps, type ReactNode, useState } from "react";

/**
 * A person's picture, or their initials while it loads or when there is none, beside their name. It is hidden from
 * screen readers, as the name beside it in words is what is heard.
 *
 * **Use it for**
 *
 * - A person beside their name, in a row, a cell, a choice or a page's head.
 * - A row's start in an `Item`, where it takes the row's size, 40 px or 32 in a compact list, as an `IconTile`.
 * - A person's state, in `AvatarBadge`: an icon of its own shape and the app's words, which a screen reader hears. It
 *   is not drawn at 24 px, where its words are still heard.
 * - The holders of a joint account, in `AvatarGroup`, named by the app's words, as "Ana, Bruno and 3 more", with
 *   `AvatarGroupCount` for those not shown.
 *
 * **Not recommended**
 *
 * - Alone, with no name beside it: its picture and initials are hidden from screen readers, so the name is in words.
 * - A kind, as a category or an account's type: use `IconTile`.
 * - An institution's logo: a square form, to come with a use.
 * - A state by colour alone: its badge takes an icon and words.
 */
function Avatar({
  className,
  size,
  ...props
}: ComponentProps<"span"> & {
  /** 24 px, 32 or 40. In a list's row, the row's size when none is given: 40, or 32 in a compact list. */
  size?: "default" | "sm" | "lg";
}) {
  return (
    <span
      data-slot="avatar"
      data-size={size ?? "default"}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        size === undefined &&
          "in-data-[slot=item]:size-10 in-data-[slot=item]:in-data-[density=compact]:size-8",
        className,
      )}
      {...props}
    />
  );
}

type ImageState = "loading" | "loaded" | "error";

// Over its initials, which show while it loads and when it fails; a new picture is tried again. Hidden from screen
// readers, so it takes no alt.
function AvatarImage({
  className,
  src,
  ...props
}: Omit<ComponentProps<"img">, "alt">) {
  const [state, setState] = useState<ImageState>(src ? "loading" : "error");
  const [shown, setShown] = useState(src);
  if (src !== shown) {
    setShown(src);
    setState(src ? "loading" : "error");
  }
  return (
    <img
      alt=""
      data-slot="avatar-image"
      data-state={state}
      onLoad={() => setState("loaded")}
      onError={() => setState("error")}
      className={cn(
        "peer absolute inset-0 z-1 aspect-square size-full rounded-full object-cover data-[state=error]:hidden data-[state=loading]:opacity-0",
        className,
      )}
      src={src}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs peer-data-[state=loaded]:hidden",
        className,
      )}
      {...props}
    />
  );
}

// An icon of its own shape at the avatar's corner, and the app's words, heard though the rest is hidden; at 24 px only
// its words.
function AvatarBadge({
  className,
  label,
  children,
  ...props
}: ComponentProps<"span"> & {
  /** The state in the app's words, as "Holder", which a screen reader hears. */
  label: string;
  /** Its icon, of the state's own shape. */
  children?: ReactNode;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        data-slot="avatar-badge"
        className={cn(
          "absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-(--surface) select-none",
          "group-data-[size=sm]/avatar:hidden",
          "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
          "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
          className,
        )}
        {...props}
      >
        {children}
      </span>
      <span className="sr-only">{label}</span>
    </>
  );
}

/**
 * Avatars side by side, as the holders of a joint account, heard as the app's words; each ringed in the colour of the
 * surface it sits on.
 */
function AvatarGroup({
  className,
  ...props
}: ComponentProps<"span"> & {
  /** Who they are, in the app's words, as "Ana, Bruno and 3 more", which a screen reader hears. */
  "aria-label": string;
}) {
  return (
    <span
      data-slot="avatar-group"
      role="img"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-(--surface)",
        className,
      )}
      {...props}
    />
  );
}

// How many more there are, as "+3", hidden from screen readers, as the group's words say it.
function AvatarGroupCount({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-(--surface) group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
