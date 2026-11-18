// WCAG's contrast between an element's text and what is painted under it, as the browser draws both: its own
// background over each one behind it, up to the first that is opaque. A canvas turns any colour the browser writes,
// with its alpha, into the red, green and blue it paints, so a tint or a mix reads as it shows.
const opaque = 255;
const lowChannel = 0.039_28;
const lowDivisor = 12.92;
const offset = 0.055;
const scale = 1.055;
const power = 2.4;
const weights = [0.2126, 0.7152, 0.0722] as const;
const ambient = 0.05;
const decimals = 100;

function painted(layers: string[]): number[] {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context === null) {
    throw new Error("No canvas to paint on");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 1, 1);
  for (const layer of layers) {
    context.fillStyle = layer;
    context.fillRect(0, 0, 1, 1);
  }
  return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)];
}

function alphaOf(colour: string): number {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context === null) {
    throw new Error("No canvas to paint on");
  }
  context.fillStyle = colour;
  context.fillRect(0, 0, 1, 1);
  return context.getImageData(0, 0, 1, 1).data[3] ?? 0;
}

function luminance(rgb: number[]): number {
  return rgb.reduce((sum, value, index) => {
    const share = value / opaque;
    const linear =
      share <= lowChannel
        ? share / lowDivisor
        : ((share + offset) / scale) ** power;
    return sum + linear * (weights[index] ?? 0);
  }, 0);
}

// The backgrounds behind an element, its own first, out to the first that covers what is under it.
function backgrounds(element: Element): string[] {
  const layers: string[] = [];
  for (
    let current: Element | null = element;
    current !== null;
    current = current.parentElement
  ) {
    const { backgroundColor } = getComputedStyle(current);
    layers.unshift(backgroundColor);
    if (alphaOf(backgroundColor) === opaque) {
      break;
    }
  }
  return layers;
}

function contrast(element: Element): number {
  const under = backgrounds(element);
  const text = painted([...under, getComputedStyle(element).color]);
  const [light, dark] = [luminance(text), luminance(painted(under))].sort(
    (a, b) => b - a,
  );
  return (
    Math.round(
      (((light ?? 0) + ambient) / ((dark ?? 0) + ambient)) * decimals,
    ) / decimals
  );
}

export { contrast };
