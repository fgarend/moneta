// Shows what a part threw, in place of the story, so a story can check a piece's own error.
import { Component, type ReactNode } from "react";

class Caught extends Component<{ children: ReactNode }, { message?: string }> {
  override state: { message?: string } = {};

  static getDerivedStateFromError(error: Error): { message: string } {
    return { message: error.message };
  }

  override render(): ReactNode {
    return this.state.message ?? this.props.children;
  }
}

export { Caught };
