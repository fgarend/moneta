// A link past what repeats on every page to where the page's own content starts, as the page's first element: out of
// sight until the keyboard reaches it. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import type { MouseEvent, ReactNode } from "react";

// Focus moves to the target itself, which takes a tabindex while it holds focus, as Safari and VoiceOver may otherwise
// only scroll there and leave the next Tab where it was. The address never takes the fragment, so no router reads it,
// and a target missing from the page leaves everything as it was.
function moveFocus(event: MouseEvent<HTMLAnchorElement>, id: string): void {
  event.preventDefault();
  const target = document.getElementById(id);
  if (target === null) {
    return;
  }
  target.setAttribute("tabindex", "-1");
  target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
    once: true,
  });
  target.focus();
}

function SkipLink({
  href,
  className,
  children,
}: {
  // The id of where it goes, as "#main".
  href: `#${string}`;
  className?: string;
  // Its words, the app's, as "Skip to the content".
  children: ReactNode;
}) {
  return (
    <a
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:inline-flex focus:h-9 focus:items-center focus:rounded-lg focus:bg-primary focus:px-4 focus:text-sm focus:font-medium focus:text-primary-foreground",
        className,
      )}
      data-slot="skip-link"
      href={href}
      onClick={(event) => moveFocus(event, href.slice(1))}
    >
      {children}
    </a>
  );
}

export { SkipLink };
