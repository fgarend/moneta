// What a link does with the app's onPreview: a plain press, or Enter, opens the preview in place of going to its page,
// stopping the browser and, as React Aria then sees the click stopped, the app's router; a press with a modifier is
// left to the browser, which opens the page in a new tab or window. Internal: Link and TickerChip read it.
// docs/decisions/components.md says why it is so.
import type { MouseEvent } from "react";
import type { FocusableElement } from "react-aria-components";

// A link may take a preview only with a page to keep for a new tab.
type Previewed =
  | {
      /** Its page, at the app's address. */
      href?: string;
      onPreview?: never;
    }
  | {
      href: string;
      /** What a plain press opens in place of the page, as a summary in your own panel. */
      onPreview?: () => void;
    };

const primaryButton = 0;

// The click a link takes in its capture phase, which sees the browser's own click, by a pointer or by Enter, before
// React Aria does, so stopping it there stops the browser and, as React Aria then sees it stopped, the app's router.
function previewOnClick(
  onPreview: (() => void) | undefined,
): ((event: MouseEvent<FocusableElement>) => void) | undefined {
  if (onPreview === undefined) {
    return undefined;
  }
  return (event) => {
    if (
      event.button !== primaryButton ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onPreview();
  };
}

export { type Previewed, previewOnClick };
