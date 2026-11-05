// Every story, the one list the checks that go through all of them read.
import { composeStories } from "@storybook/react-vite";

const modules = import.meta.glob<Parameters<typeof composeStories>[0]>(
  "../src/**/*.stories.tsx",
  { eager: true },
);
const stories = Object.values(modules).flatMap((module) =>
  Object.values(composeStories(module)),
);

export { stories };
