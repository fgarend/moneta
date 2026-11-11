// The level of the nearest section's title, which a title below it takes one more of. Outside any, a section's title
// starts at 2, below the page's 1. Internal: Section and ItemGroup read it, as docs/decisions/components.md says.
import { createContext } from "react";

const SectionLevel = createContext(1);
const deepest = 6;

export { deepest, SectionLevel };
