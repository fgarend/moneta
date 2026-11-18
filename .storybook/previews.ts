// What a link with onPreview does, the same for each piece that takes it: a plain press and Enter call it and go
// nowhere, not even through the app's router, and a press with a modifier is left to the browser, which opens a tab.
import { expect, userEvent, waitFor } from "storybook/test";

type Spy = (...args: unknown[]) => unknown;

async function checksPreview(
  link: HTMLElement,
  onPreview: Spy,
  navigate: Spy,
): Promise<void> {
  // A listener on the link runs after the piece's own, in the capture phase, and before React Aria's, which stops
  // the click at the link. It sees whether the piece stopped the browser, and then stops it itself, so the test's
  // page stays where it is.
  let wasStopped = false;
  const watch = (event: MouseEvent) => {
    wasStopped = event.defaultPrevented;
    event.preventDefault();
  };
  link.addEventListener("click", watch);
  try {
    await userEvent.click(link);
    await expect(onPreview).toHaveBeenCalledTimes(1);
    await expect(wasStopped).toBe(true);
    await expect(navigate).not.toHaveBeenCalled();

    await waitFor(() => expect(link).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await expect(onPreview).toHaveBeenCalledTimes(2);
    await expect(navigate).not.toHaveBeenCalled();

    // One user, so the key held is still held as the pointer clicks.
    const user = userEvent.setup();
    await user.keyboard("{Control>}");
    await user.click(link);
    await user.keyboard("{/Control}");
    await expect(onPreview).toHaveBeenCalledTimes(2);
    await expect(wasStopped).toBe(false);
    await expect(navigate).not.toHaveBeenCalled();
  } finally {
    link.removeEventListener("click", watch);
  }
}

export { checksPreview };
