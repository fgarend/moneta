// What moves when the reader asks for less motion, in each browser asked for it through the project less-motion:
// nothing moves or changes size but the Spinner, while fades and colours stay, as docs/decisions/theme.md says.
// Every animation and transition the page runs while a piece opens, closes or changes is watched as it starts.
import { composeStory } from "@storybook/react-vite";
import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import alertDialogMeta, {
  Default as AlertDialog,
} from "../src/components/alert-dialog.stories.js";
import { Button } from "../src/components/button.js";
import contextMenuMeta, {
  Default as ContextMenu,
} from "../src/components/context-menu.stories.js";
import dialogMeta, {
  Default as Dialog,
} from "../src/components/dialog.stories.js";
import dropdownMenuMeta, {
  Default as DropdownMenu,
} from "../src/components/dropdown-menu.stories.js";
import hoverCardMeta, {
  Default as HoverCard,
} from "../src/components/hover-card.stories.js";
import popoverMeta, {
  Default as Popover,
} from "../src/components/popover.stories.js";
import { Progress } from "../src/components/progress.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../src/components/select.js";
import sheetMeta, {
  Default as Sheet,
} from "../src/components/sheet.stories.js";
import { Spinner } from "../src/components/spinner.js";
import { Switch } from "../src/components/switch.js";
import tooltipMeta, {
  Default as Tooltip,
} from "../src/components/tooltip.stories.js";
import "./preview.css";

const label = "Fictitious";
// Long enough for the slowest entrance, the Sheet's 200 ms, under load.
const settling = 600;
const opening = 3000;

// What a transition may still change: colour, opacity and a ring's shadow.
const still =
  /^(opacity|color|background-color|border-(top|right|bottom|left)-color|outline-color|text-decoration-color|fill|stroke|box-shadow)$/u;

// Where and how a part is drawn, which moving or resizing changes.
function shapeOf(element: Element): string {
  const { transform, translate, scale, rotate, width, height } =
    getComputedStyle(element);
  return [transform, translate, scale, rotate, width, height].join(" | ");
}

// Whether an animation moves or resizes what it draws: a transition by its property, and an animation by its part at
// its start and halfway, one turn for one that runs for ever.
function moves(animation: Animation): boolean {
  if (animation instanceof CSSTransition) {
    return !still.test(animation.transitionProperty);
  }
  const effect = animation.effect as KeyframeEffect | null;
  if (!effect?.target) {
    return false;
  }
  const { duration } = effect.getComputedTiming();
  // An animation not started yet has no time, and putting none back on a running one throws, leaving it paused.
  const was = animation.currentTime ?? 0;
  const paused = animation.playState === "paused";
  animation.pause();
  animation.currentTime = 0;
  const first = shapeOf(effect.target);
  animation.currentTime = Number(duration) / 2;
  const halfway = shapeOf(effect.target);
  animation.currentTime = was;
  if (!paused) {
    animation.play();
  }
  return first !== halfway;
}

function nameOf(animation: Animation): string {
  const target = (animation.effect as KeyframeEffect | null)?.target;
  const slot = target?.closest("[data-slot]")?.getAttribute("data-slot");
  const what =
    animation instanceof CSSTransition
      ? animation.transitionProperty
      : (animation as CSSAnimation).animationName;
  return `${slot ?? target?.tagName}: ${what}`;
}

// What moves while something happens, each animation judged in the frame it is first seen. The test waits for no
// overlay to finish entering or leaving: in headless WebKit, React Aria can wait for ever on a transition the browser
// cancels, and only what starts matters here; unmounting at the end takes the overlay away.
async function motionDuring(act: () => unknown): Promise<string[]> {
  const seen = new Set<Animation>();
  const moving = new Set<string>();
  let watching = true;
  const look = (): void => {
    for (const animation of document.getAnimations()) {
      if (!seen.has(animation)) {
        seen.add(animation);
        if (moves(animation)) {
          moving.add(nameOf(animation));
        }
      }
    }
    if (watching) {
      requestAnimationFrame(look);
    }
  };
  look();
  await act();
  await new Promise((resolve) => setTimeout(resolve, settling));
  watching = false;
  return [...moving];
}

// Open with focus inside, as Escape counts only then.
async function shown(role: string): Promise<void> {
  await vi.waitFor(
    () => {
      const open = document.querySelector(`[role="${role}"]`);
      if (!open?.contains(document.activeElement)) {
        throw new Error(`No ${role} with focus inside yet.`);
      }
    },
    { timeout: opening },
  );
}

// Leaving, or gone already.
async function leaving(selector: string): Promise<void> {
  await vi.waitFor(
    () => {
      const open = document.querySelector(selector);
      if (open !== null && open.closest("[data-exiting]") === null) {
        throw new Error(`${selector} is not leaving yet.`);
      }
    },
    { timeout: opening },
  );
}

// Shown, as a hover card and a tooltip, which take no focus.
async function drawn(selector: string): Promise<void> {
  await vi.waitFor(
    () => {
      if (document.querySelector(selector) === null) {
        throw new Error(`No ${selector} yet.`);
      }
    },
    { timeout: opening },
  );
}

function trigger(container: Element): Element {
  return container.querySelector("button, a") as Element;
}

it("runs with less motion asked for", () => {
  expect(matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
});

// Each overlay's story, opened by a click and closed by Escape.
const clicked = [
  ["Dialog", composeStory(Dialog, dialogMeta), "dialog"],
  ["AlertDialog", composeStory(AlertDialog, alertDialogMeta), "alertdialog"],
  ["Sheet", composeStory(Sheet, sheetMeta), "dialog"],
  ["Popover", composeStory(Popover, popoverMeta), "dialog"],
  ["DropdownMenu", composeStory(DropdownMenu, dropdownMenuMeta), "menu"],
] as const;

it.each(clicked)(
  "opens and closes %s with no movement",
  async (_name, Story, role) => {
    const screen = await render(<Story />);

    const motion = await motionDuring(async () => {
      await userEvent.click(trigger(screen.container));
      await shown(role);
      await userEvent.keyboard("{Escape}");
      await leaving(`[role="${role}"]`);
    });

    expect(motion).toEqual([]);
  },
);

it("opens ContextMenu with no movement", async () => {
  const Story = composeStory(ContextMenu, contextMenuMeta);
  const screen = await render(<Story />);

  const motion = await motionDuring(async () => {
    await userEvent.click(trigger(screen.container), { button: "right" });
    await shown("menu");
    await userEvent.keyboard("{Escape}");
    await leaving('[role="menu"]');
  });

  expect(motion).toEqual([]);
});

it("opens Select with no movement", async () => {
  const screen = await render(
    <Select aria-label={label}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem>{label}</SelectItem>
      </SelectContent>
    </Select>,
  );

  const motion = await motionDuring(async () => {
    await userEvent.click(trigger(screen.container));
    await shown("listbox");
    await userEvent.keyboard("{Escape}");
    await leaving('[role="listbox"]');
  });

  expect(motion).toEqual([]);
});

// Tooltip and HoverCard open on hover, and close when the pointer leaves.
const hovered = [
  ["Tooltip", composeStory(Tooltip, tooltipMeta), '[role="tooltip"]'],
  [
    "HoverCard",
    composeStory(HoverCard, hoverCardMeta),
    '[data-slot="hover-card-content"]',
  ],
] as const;

it.each(hovered)(
  "shows and hides %s with no movement",
  async (_name, Story, content) => {
    const screen = await render(<Story />);

    // A pointer moves before it arrives, which React Aria needs to count it as hovering.
    await userEvent.hover(screen.container);
    const motion = await motionDuring(async () => {
      await userEvent.hover(trigger(screen.container));
      await drawn(content);
      await userEvent.unhover(trigger(screen.container));
      await leaving(content);
    });

    expect(motion).toEqual([]);
  },
);

it("switches Switch with no movement", async () => {
  const screen = await render(<Switch aria-label={label} />);

  const motion = await motionDuring(async () => {
    // Its input is hidden, and the label around it takes the click.
    await userEvent.click(
      screen.container.querySelector('[data-slot="switch"]') as Element,
    );
  });

  expect(motion).toEqual([]);
});

it("moves Progress to a new value with no movement", async () => {
  const screen = await render(<Progress aria-label={label} value={20} />);

  const motion = await motionDuring(async () => {
    await screen.rerender(<Progress aria-label={label} value={80} />);
  });

  expect(motion).toEqual([]);
});

it("presses Button with no movement", async () => {
  await render(<Button>{label}</Button>);

  // Held down, as a click is too quick for its press to start moving.
  await userEvent.keyboard("{Tab}");
  const motion = await motionDuring(async () => {
    await userEvent.keyboard("{Space>}");
    await new Promise((resolve) => setTimeout(resolve, settling));
    await userEvent.keyboard("{/Space}");
  });

  expect(motion).toEqual([]);
});

// A loading state where nothing else can be done: a still spinner would look frozen.
it("keeps Spinner spinning", async () => {
  const motion = await motionDuring(async () => {
    await render(<Spinner aria-label={label} />);
  });

  expect(motion).toContain("spinner: spin");
});

// The rule holds on Moneta's pieces only, so an app's own motion is its own.
it("leaves the app's own motion alone", async () => {
  const screen = await render(
    <div style={{ transition: "translate 200ms" }}>{label}</div>,
  );
  const box = screen.container.firstElementChild as HTMLElement;

  const motion = await motionDuring(() => {
    box.style.translate = "16px";
  });

  expect(motion).toEqual(["DIV: translate"]);
});
