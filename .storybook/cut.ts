// Which texts a change to the page cuts: pushed out of a box around them that cannot scroll, so out of reach. The
// checks of text spacing and of reflow share it, each with its own change.

// Hidden from the screen on purpose, for screen readers, as Tailwind's sr-only and React Aria both do it.
const hidden = "inset(50%)";
// An area that scrolls lets everything be reached; any other has lost what does not fit.
const reachable = ["auto", "scroll"];

// The boxes that can lose a text, up to the first it can be scrolled to in, which keeps it within reach.
function boxesAround(text: Node, root: Element): Element[] {
  const boxes: Element[] = [];
  for (
    let box = text.parentElement;
    box && box !== root;
    box = box.parentElement
  ) {
    const { overflowX, overflowY } = getComputedStyle(box);
    if (reachable.includes(overflowX) || reachable.includes(overflowY)) {
      break;
    }
    boxes.push(box);
  }
  return boxes;
}

function rectOf(text: Node): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(text);
  return range.getBoundingClientRect();
}

// How far a text goes past a box around it, where that loses it.
function past(text: DOMRect, box: Element): number {
  const { overflowX, overflowY } = getComputedStyle(box);
  const edge = box.getBoundingClientRect();
  return Math.max(
    reachable.includes(overflowX)
      ? 0
      : Math.max(text.right - edge.right, edge.left - text.left),
    reachable.includes(overflowY)
      ? 0
      : Math.max(text.bottom - edge.bottom, edge.top - text.top),
  );
}

// The texts shown now, neither hidden on purpose nor drawn with no width, as a column hidden on a narrow table.
function shownTexts(root: Element): Node[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Node[] = [];
  while (walker.nextNode()) {
    const boxes = boxesAround(walker.currentNode, root);
    const shown = !boxes.some(
      (box) => getComputedStyle(box).clipPath === hidden,
    );
    if (shown && rectOf(walker.currentNode).width > 0) {
      texts.push(walker.currentNode);
    }
  }
  return texts;
}

function distance(text: Node, root: Element): number {
  return Math.max(
    0,
    ...boxesAround(text, root).map((box) => past(rectOf(text), box)),
  );
}

// The texts shown now that the change cuts, as the page is now its changed state: undo takes the page back before
// it, and redo makes it again. Only what the change itself pushes out counts, as a text may already pass a box,
// closed in a panel that opens.
async function cutByChange(
  root: Element,
  {
    undo,
    redo,
  }: { undo: () => void | Promise<void>; redo: () => void | Promise<void> },
): Promise<(string | null)[]> {
  const texts = shownTexts(root);
  await undo();
  const before = texts.map((text) => distance(text, root));
  await redo();
  return texts
    .filter((text, index) => distance(text, root) > (before[index] ?? 0) + 1)
    .map((text) => text.textContent);
}

export { cutByChange };
