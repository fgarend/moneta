// What the stories of overlays share.
import { expect, waitFor } from "storybook/test";

// An overlay fades in, so what it draws counts once nothing around it is see-through. Its entrance is played to its
// end on each look, as WebKit in a test can leave a new animation at its start, unrendered, at an opacity near 0,
// which made every overlay's story wait the whole two seconds below there, and past a test's time under load; an
// animation that begins after the first look is caught by the next. The wait never fails a story.
const fadeIn = 2000;

// Every animation that ends, played to its end, an entrance or an exit; one that runs for ever, as a spinner's, is
// left as it is.
function finishEntrances(): void {
  for (const animation of document.getAnimations()) {
    if (
      animation.effect?.getComputedTiming().endTime !== Number.POSITIVE_INFINITY
    ) {
      animation.finish();
    }
  }
}

async function settled(element: Element): Promise<void> {
  await waitFor(
    () => {
      finishEntrances();
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

// An overlay closed: gone, or leaving, its exit played to its end on each look. Headless Chromium can leave one
// waiting for an exit, and headless WebKit cancels the transition React Aria then waits on for ever, found on
// 2026-11-12, so leaving is enough to say the piece closed it. The wait fails a story it outlasts.
async function left(find: () => Element | null): Promise<void> {
  await waitFor(
    () => {
      finishEntrances();
      const overlay = find();
      expect(
        overlay === null || overlay.closest("[data-exiting]") !== null,
      ).toBe(true);
    },
    { timeout: fadeIn },
  );
}

export { left, settled };
