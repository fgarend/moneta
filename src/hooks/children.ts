// A piece's own children, those in a fragment among them too, as a part written under a condition. Internal: Card and
// Alert read their title from them.
import { Children, Fragment, isValidElement, type ReactNode } from "react";

function partsOf(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? partsOf(child.props.children)
      : [child],
  );
}

export { partsOf };
