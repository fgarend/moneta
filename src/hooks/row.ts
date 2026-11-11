// What a row shares, in a table or a list of rows: a click that follows its title's link, and a fill for its state.
// Internal: Table and Item read it. docs/decisions/components.md says why it is so.
// What a click on a row leaves alone: a control of its own.
const controlTargets =
  "a, button, input, select, textarea, label, [role=button], [role=checkbox], [role=menuitem], [role=switch]";

// A click on an empty part of a row goes to the link in its title, with its keys, so a pointer has the whole row while
// keyboards and screen readers keep one real link; a click that is part of selecting text stays where it is.
function followTitle(row: Element, event: MouseEvent, titleLink: string): void {
  const link = row.querySelector(titleLink);
  const selection = document.getSelection() as Selection;
  if (
    link === null ||
    (event.target as Element).closest(controlTargets) !== null ||
    !selection.isCollapsed
  ) {
    return;
  }
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
    }),
  );
}

// A row's fill: its state, selected or current, at --muted, over the hover each row sets in --row-hover when it opens
// or acts. What sticks over the row draws the same fill, by sticky-fill.
const rowFill =
  "bg-(--row-fill) [--row-fill:var(--row-state,var(--row-hover))] data-selected:[--row-state:var(--muted)] aria-[current=true]:[--row-state:var(--muted)]";

export { followTitle, rowFill };
