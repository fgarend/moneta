// What the stories of overlays share.
import { expect, waitFor } from "storybook/test";

// An overlay fades in, so what it draws counts once nothing around it is see-through. Under load WebKit can stay part
// way for seconds, which says nothing about the piece, so this only waits, and never fails a story.
const fadeIn = 2000;

async function settled(element: Element): Promise<void> {
  await waitFor(
    () => {
      for (
        let node: Element | null = element;
        node;
        node = node.parentElement
      ) {
        expect(getComputedStyle(node).opacity).toBe("1");
      }
    },
    { timeout: fadeIn },
  ).catch(() => undefined);
}

export { settled };
