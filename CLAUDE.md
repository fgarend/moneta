# Working on Moneta

Moneta is a component library for money interfaces, on shadcn, in React and
TypeScript. It is generic, and meant to be reused by any app. It is the source of truth
for components: an app consumes final pieces and builds its screens from them, and what
it lacks is added here. It is built in small steps, each decided with the user before it
is made.

## Read first

1. `docs/ROADMAP.md`: where the work is now, and everything planned or deferred,
   in order.
2. `docs/decisions/`: what holds today, by topic, and why.
3. `docs/updating.md`: when and how versions move.
4. `docs/accessibility.md`: how each WCAG criterion is checked.

## The rule

Start from how shadcn already does it, and ask whether to adapt to it. Only if
not, add behaviour or code of our own. For each need, stop at the first step that
gives the right result:

| | To change a shadcn piece | To make something new |
| --- | --- | --- |
| 1 | **Use it as it is,** and adapt ourselves | **Use what exists** |
| 2 | **A value or rule in `theme.css`** | **Compose,** with Tailwind only |
| 3 | **Edit its file, recorded in the commit** | **Own code,** with its reason |

- **It does not override:** WCAG 2.2 AA, money shown exactly, no arbitrary spacing or
  colour in own pieces, no default text in a piece, fictitious data.
- **Raw until reviewed.** A shadcn piece may enter untouched, listed as raw with its known gaps.
  WCAG and default text are what its review answers for, and 1.0 needs every piece reviewed.
- **It must make sense, both ways.** A difference from a reference is not by itself a
  reason to edit. The default theme is meant to be beautiful, and whoever uses Moneta
  can replace it, so what carries its look, such as the gold, the sidebar and the
  money's type, earns an edit.

## Rules

- **Never guess.** Before stating what exists, what was done or what was
  discussed, check it: read the files, the history, the roadmap and the decisions.
  If it cannot be checked, say so instead of assuming.
- **Check before recording.** Verify versions, names and facts about tools in their
  official sources before writing them into a decision or a build file. shadcn
  changes often, so check it again each time.
- **No unilateral decisions.** Any choice that affects the repository is raised as
  a question, with a recommendation, and decided by the user.
- **One point per question.** Never bundle several choices into one question to
  approve at once.
- **Think before recommending.** Research official sources and known patterns, look
  at this repository, and argue against your own recommendation.
- **See the whole.** Think of every component, not this one, above all in what
  crosses them: sizes, spacing, density, states, light and dark. Stop and review the
  whole from time to time. Check that each responsibility sits in the right place.
- **Keep it simple.** Nothing beyond what the step needs. The user pushes back on
  over-engineering, and the goal is to build apps faster.
- **Independent.** Moneta knows no app that uses it. What needs to be created is in
  the roadmap. An app or a prototype, which the user points to, can guide what comes
  next and inspire a piece, but its name, screens and rules stay out of this repository.
- **A reference is a guide to criticize.** "A prototype uses it" and "nobody asks for
  it" are facts to report, not reasons to decide.
- **Always think of the corner cases:** empty (no content, no optional part) and
  excess (more items than the screen holds, long text, narrow and short screens).
- **Each tool is decided in the commit that introduces it,** not ahead of time. The
  pipeline this repository starts with is the one exception.
- **Decisions are recorded when adopted,** by the commit that first depends on them,
  in the way `docs/decisions/process.md` says.
- **Small steps.** One step at a time, one commit per step, each leaving the
  repository working. Do not work ahead.
- **Stay in scope.** Anything found along the way that is outside the step goes into
  the roadmap instead of being fixed on the side.
- **Nothing discussed is lost.** Whatever is deferred in a conversation goes into
  `docs/ROADMAP.md` right away.
- **Test first.** Write the test cases, show them failing, then implement. For
  code copied from shadcn, that means a story that fails on our edit, not on a
  missing file. Do not test again what React Aria already tests. Behaviour that users
  of a piece depend on gets a story, whoever wrote the code.
- **Accessibility in the open.** Every piece's proposal and report say which WCAG
  criteria apply, which have a check and which do not. An axe run that passes
  silently does not count as saying it.
- **Fictitious data only.** Never real data, not even anonymized.
- **Restricted where it can be.** The repository is public, but what can be limited
  to those with permission, such as settings and logs, should be.
- **English in the repository.** Code, names, documentation and commits are in
  English. Talk to the user in Portuguese.
- **Commit only when the user approves.** Conventional messages (`feat:`, `fix:`,
  `docs:`, `chore:`…). Never add `Co-Authored-By`, `Claude-Session` or any other
  attribution trailer. The user merges.
- **One branch per step,** from `main` up to date, kept on top of it by rebase, never
  by merge. Stage by path, and never run `git add -A`.

## The rhythm of a step

1. Propose the step and list its open points. A piece starts with its analysis, as
   `docs/decisions/process.md` says, discussed before any code. An item from milestone 2
   on starts with `make outdated`, and the proposal says what it found, as
   `docs/updating.md` asks.
2. The user decides them, one at a time.
3. Write the tests and show them failing. In a step without code, write the
   checks or the document to review instead.
4. Implement, then show the tests passing. `make check` passes before the pull request opens.
5. The user approves each commit. Claude pushes the step's branch and opens its pull request,
   and the user merges it once `checks` passes.

`docs/ROADMAP.md` is updated in the commit of each step, so a new session can resume
from it.

## Talking to the user

- Be concise, in simple terms, plain words first.
- One point per message, the most important first.
- Keep each message at one level of abstraction. Do not mix principles with
  implementation details.
- No rush: others build on this, so the user wants clarity on each point.
