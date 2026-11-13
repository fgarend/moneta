// How an IconTile behaves where it sits, which the piece around it says, as a title takes its level from its section.
// Internal: IconTile reads it, and Item gives it, as docs/decisions/components.md says.
import { createContext } from "react";

type TileShape = "square" | "circle";
type TileSize = "sm" | "default" | "lg";
type TileVariant = "default" | "solid" | "gold";

interface TilePlace {
  shape?: TileShape;
  size?: TileSize;
  variant?: TileVariant;
  // Where it sits among the parent's parts, as its alignment.
  className?: string;
  // Its size where the parent changes it, as a compact list's, when no size is given by hand.
  sizeClassName?: string;
}

const TilePlace = createContext<TilePlace>({});

export { TilePlace, type TileShape, type TileSize, type TileVariant };
