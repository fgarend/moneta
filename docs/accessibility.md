# Accessibility

The target is **WCAG 2.2, level AA**, for a piece used as documented. Why is in
[`decisions/accessibility.md`](decisions/accessibility.md). A library cannot make a
product conform by itself: the app answers for its names, titles, language and content.

**Every piece's proposal and report go through this page:** which criteria apply, which
have a check and which do not. Saying so is the point, since axe passing says little by
itself.

## How each criterion is checked

Every check here runs in `make check` and in continuous integration, except the script,
which is run by hand.

- **axe:** in every story, in the three browsers, in light and in dark. A violation fails it, unless it is a raw
  piece's gap written in [`pieces.md`](pieces.md). What it reports as incomplete, such as text
  on a gradient, does not fail.
- **story:** a check in a story's `play` function.
- **every story:** text spacing, and forced colours, which no criterion names but which
  people rely on, on all stories, with the same exception. Forced colours run in both modes. They look at what a story draws
  before its `play`, so not at an open overlay.
- **script:** by hand, in [`accessibility-script.md`](accessibility-script.md), whose last
  section says which runs there have been.
- **test:** a test of its own, named in the notes.
- **coming:** a check planned, with its roadmap item.
- **app:** the app's to meet, as it depends on its words or its content.
- **none yet:** no check, even where a raw piece does this. A piece's review brings it.

| Criterion | How | Notes |
| --- | --- | --- |
| 1.1.1 Non-text Content | axe | |
| 1.2.1 Audio-only and Video-only | app | |
| 1.2.2 Captions (Prerecorded) | app | |
| 1.2.3 Audio Description or Media Alternative | app | |
| 1.2.4 Captions (Live) | app | |
| 1.2.5 Audio Description | app | |
| 1.3.1 Info and Relationships | axe, story | Stories find elements by role and name, Section's the level of its titles, Table's name and its rows' titles, and the words for no value or a hidden one, and the minus, of Amount, Percent and Quantity |
| 1.3.2 Meaningful Sequence | script | |
| 1.3.3 Sensory Characteristics | app | |
| 1.3.4 Orientation | script | Nothing here locks it |
| 1.3.5 Identify Input Purpose | none yet | With the form controls (Actions and forms) |
| 1.4.1 Use of Color | story, coming, app | Link's underline, and the sidebar's current page (Sidebar). A value's tone only adds colour, and its sign or words are the app's |
| 1.4.2 Audio Control | app | |
| 1.4.3 Contrast (Minimum) | axe, test | axe on flat colours, and `test/theme.test.ts` on the theme's pairs, both modes, a value's tones among them |
| 1.4.4 Resize Text | script | |
| 1.4.5 Images of Text | app | |
| 1.4.10 Reflow | story, coming, script | Section's story at 320 px, Amount on one line in a narrow column, Table's columns hidden or scrolled in its own area at 320 px, and the application's structure (Sidebar) |
| 1.4.11 Non-text Contrast | test, story, coming | `test/theme.test.ts` on borders and focus, both modes, and Pagination's current page in `--input`. Field (Actions and forms) and charts (Charts) to come |
| 1.4.12 Text Spacing | every story | All three browsers |
| 1.4.13 Content on Hover or Focus | none yet | With Tooltip (Overlays) |
| 2.1.1 Keyboard | none yet | React Aria's in the raw pieces, and no story goes by keyboard; with each family's review |
| 2.1.2 No Keyboard Trap | none yet, script | With the overlays (Overlays) |
| 2.1.4 Character Key Shortcuts | none yet | |
| 2.2.1 Timing Adjustable | none yet | |
| 2.2.2 Pause, Stop, Hide | none yet | |
| 2.3.1 Three Flashes or Below Threshold | none yet | |
| 2.4.1 Bypass Blocks | coming | The sidebar's skip link (Sidebar) |
| 2.4.2 Page Titled | app | |
| 2.4.3 Focus Order | none yet | |
| 2.4.4 Link Purpose (In Context) | axe, test, app | axe finds a link with no name, and `test/link.test.ts` that `Link` asks for what it holds; its words are the app's |
| 2.4.5 Multiple Ways | app | |
| 2.4.6 Headings and Labels | app | |
| 2.4.7 Focus Visible | test | `.storybook/focus.test.tsx`, on 13 pieces, in 3 browsers and in forced colours |
| 2.4.11 Focus Not Obscured (Minimum) | none yet | |
| 2.5.1 Pointer Gestures | none yet | |
| 2.5.2 Pointer Cancellation | none yet | |
| 2.5.3 Label in Name | story, app | Pagination's Previous and Next named by their words; elsewhere the visible name and the accessible one |
| 2.5.4 Motion Actuation | none yet | |
| 2.5.7 Dragging Movements | none yet | |
| 2.5.8 Target Size (Minimum) | axe, story | Table's sortable headers, at least 24 px tall |
| 3.1.1 Language of Page | app | |
| 3.1.2 Language of Parts | app | |
| 3.2.1 On Focus | none yet | |
| 3.2.2 On Input | none yet | With the form controls (Actions and forms) |
| 3.2.3 Consistent Navigation | app | |
| 3.2.4 Consistent Identification | app | |
| 3.2.6 Consistent Help | app | |
| 3.3.1 Error Identification | none yet | With the form controls (Actions and forms) |
| 3.3.2 Labels or Instructions | none yet | With the form controls (Actions and forms) |
| 3.3.3 Error Suggestion | app | |
| 3.3.4 Error Prevention (Legal, Financial, Data) | app | Heavy in a money interface: review and confirm |
| 3.3.7 Redundant Entry | app | |
| 3.3.8 Accessible Authentication (Minimum) | app | |
| 4.1.2 Name, Role, Value | axe, story | |
| 4.1.3 Status Messages | story, coming | Table's selection bar, a status whose text changes with the count, and Pagination's summary; Alert (Display) to come |

## Corner cases

A piece's stories show what it does in each of these that applies:

- **Empty:** no content, each optional part left out, nothing selected.
- **Too much:** more items than the room, in height and in width.
- **Long text:** a long name, a word with no spaces, another language.
- **Narrow and short screens:** 320px wide, and very short, as at a high zoom.
- **Input:** keyboard alone, touch alone, a pointer crossing it.
- **Preferences:** forced colours and text spacing, checked on every story. Reduced
  motion, unchecked, though raw pieces animate. Larger text.
