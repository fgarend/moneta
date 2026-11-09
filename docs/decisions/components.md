# Components

How Moneta's pieces are shaped, those of its own and the rules that cross every piece. The state of each of shadcn's
pieces is in [`../pieces.md`](../pieces.md), and how a piece is analysed is in [`process.md`](process.md).

## What holds today

### Across pieces

- **Three levels, as shadcn names them.** A token is a value of the theme and depends on nothing. A piece takes its
  content from whoever uses it, shadcn's or our own, and uses tokens and other pieces. A block brings a structure of
  pieces in place, such as a sidebar or a login form, and uses pieces and tokens. Accessibility, language and
  formatting are rules across all three, not a level.
- **An own piece or block lives in `src/components/<name>.tsx`,** beside `ui/`, where shadcn's CLI puts what is not
  `ui`, and an app imports it as `@fgarend/moneta/<name>`. A piece of shadcn's stays in `ui/`, edited or not, so its
  import never moves. Every file there is public, so what is internal lives elsewhere.
- **An own piece is made of parts,** as shadcn's are, and a piece that is only a value takes it as a prop. Its state
  and events take React Aria's names, such as `isDisabled`, `onPress`, and an `onChange` that gives the value.
- **A piece changes its element only through `render`,** under React Aria's rule: the same type of element, one
  element, with its props and ref passed on. Never `asChild` or `as`. A piece offers it only when a need asks.
- **A title takes its level from where it sits.** A `Section` counts one level more for what it holds, a title
  outside any starts at 2, below the page's 1, it stops at 6, and `level` given by hand wins. React Aria's `Heading`
  draws it. Each piece with a title follows this at its review, and a `Dialog` or `Sheet` starts again at 2, as
  React's context crosses portals.
- **Moneta chooses no router.** A piece with a link passes `href`, `routerOptions` and `render` on to React Aria, so
  an app routes through `render` on each link or through `RouterProvider` once at its root.

### Section

- **A titled part of a page, with no box,** whose parts follow `Card`'s header: `Section`, `SectionHeader`,
  `SectionTitle`, `SectionDescription` and `SectionAction`, with its content as children.
- **No landmark.** A `<section>` with no name, which is no `region`, as its title gives the structure.
- **Its title is Tailwind's `text-lg/6 font-semibold`,** the 18/24 the guidelines give a section, with 4 px to its
  description and 16 px between its header and its content.
- **Its action moves under the title when the header is narrower than 384 px,** by a container query on the header,
  so it holds wherever the section sits.

## Why

- **Three levels and not four,** as a composed piece's line with a piece is vague, Atomic Design's best known
  problem, and changes no rule: neither where a file lives, how it is imported, nor what tests it needs.
- **Beside `ui/`,** as the tests already split there: `ui/` is shadcn's, listed in `docs/pieces.md` and outside the
  coverage, and the rest is our own code, at 100% and with no arbitrary classes. **What it costs:** an app sees two
  paths, `ui/button` and `section`, which tell where each came from.
- **`render`,** as React Aria has it on every component and shadcn's pieces use it, and its rule keeps the element's
  meaning, so a button cannot become a `div` unnoticed.
- **A level from where it sits,** as a fixed default per piece is wrong once a `Card` sits in a `Section`, as the
  sample page has. **What it costs:** a level is not seen in the code that uses the piece. The context is internal to
  `section.tsx` until a second piece reads it.
- **No router,** as Moneta knows no app, React Aria's docs recommended `render` on 2026-11-09, and `RouterProvider`
  still works. Table and GridList rows cannot be an `<a>`, so with a router they navigate through `onAction`.
- **No landmark,** as a page of sections would fill the list of landmarks, which the W3C asks to keep for what
  matters, and a screen reader's user moves by headings.

## Alternatives considered

- **Token, piece, composed piece and region.** The roadmap's first proposal.
- **Own pieces in `ui/`.** One path, but our code mixed with shadcn's, file by file.
- **`asChild` or `as`.** Any element for any other, which loses its meaning.
- **A fixed level per piece, or one always given by hand.** Simpler, but wrong or verbose once pieces nest.
- **Section as a `region`,** as a prototype has, or with a prop to make it one.
- **A count beside a section's title and a note at its foot,** as a prototype has. The count waits for Badge,
  in 4.1, and the note for a use.

## History

- 2026-11-09: Written, with the conventions that cross pieces, and Section.
