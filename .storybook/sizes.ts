// The scale every control a row holds follows, by shadcn's names: 32, 36 and 40 px, as docs/guidelines.md says.
const scale = { sm: 32, default: 36, lg: 40 } as const;

type Size = keyof typeof scale;

const sizes = Object.keys(scale) as Size[];

// An element's height, in whole pixels.
function height(element: Element): number {
  return Math.round(element.getBoundingClientRect().height);
}

export { height, type Size, scale, sizes };
