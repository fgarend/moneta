import type { ComponentProps, ReactElement } from "react";

function Button(props: ComponentProps<"button">): ReactElement {
  return <button type="button" {...props} />;
}

export { Button };
