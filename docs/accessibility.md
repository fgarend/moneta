# Accessibility

The target is **WCAG 2.2, level AA**, for a piece used as documented. Why is in
[`decisions/accessibility.md`](decisions/accessibility.md). A library cannot make a
product conform by itself: the app answers for its names, titles, language and content.

**Every piece's proposal and report go through this page:** which criteria apply, which
have a check and which do not. Saying so is the point: axe finds on average 57% of
issues, by its own count, and has no rule for 1.4.11 or 2.4.7.

## How each criterion is checked

Every check here runs in `make check` and in continuous integration, except the script,
which is run by hand.

- **axe:** in every story, in the three browsers. A violation fails it. What it reports
  as incomplete, such as text on a gradient, does not fail.
- **story:** a check in a story's `play` function.
- **every story:** text spacing, and forced colours, which no criterion names but which
  people rely on, on all stories.
- **script:** by hand, in [`accessibility-script.md`](accessibility-script.md), whose last
  section says which runs there have been.
- **coming:** a check planned, with its roadmap item.
- **app:** the app's to meet, as it depends on its words or its content.
- **none yet:** no piece does this yet, and whichever first does brings the check.

| Criterion | How | Notes |
| --- | --- | --- |
| 1.1.1 Non-text Content | axe | |
| 1.2.1 Audio-only and Video-only | app | |
| 1.2.2 Captions (Prerecorded) | app | |
| 1.2.3 Audio Description or Media Alternative | app | |
| 1.2.4 Captions (Live) | app | |
| 1.2.5 Audio Description | app | |
| 1.3.1 Info and Relationships | axe, story | Stories find elements by role and name |
| 1.3.2 Meaningful Sequence | script | |
| 1.3.3 Sensory Characteristics | app | |
| 1.3.4 Orientation | script | Nothing here locks it |
| 1.3.5 Identify Input Purpose | none yet | With the form controls (4.2) |
| 1.4.1 Use of Color | none yet | With the sidebar's current page (3.1) |
| 1.4.2 Audio Control | app | |
| 1.4.3 Contrast (Minimum) | axe, coming | axe on flat colours; the theme's pairs with 2.2 |
| 1.4.4 Resize Text | script | |
| 1.4.5 Images of Text | app | |
| 1.4.10 Reflow | coming, script | With the application's structure (3.1) |
| 1.4.11 Non-text Contrast | coming | With the theme (2.2) and Field (4.2); charts are deferred |
| 1.4.12 Text Spacing | every story | All three browsers |
| 1.4.13 Content on Hover or Focus | none yet | With Tooltip (4.3) |
| 2.1.1 Keyboard | none yet | The minimal `Button` is the browser's own; with shadcn's (2.1) |
| 2.1.2 No Keyboard Trap | none yet, script | With the sheet and the overlays (3.1, 4.3) |
| 2.1.4 Character Key Shortcuts | none yet | |
| 2.2.1 Timing Adjustable | none yet | |
| 2.2.2 Pause, Stop, Hide | none yet | |
| 2.3.1 Three Flashes or Below Threshold | none yet | |
| 2.4.1 Bypass Blocks | coming | The sidebar's skip link (3.1) |
| 2.4.2 Page Titled | app | |
| 2.4.3 Focus Order | none yet | |
| 2.4.4 Link Purpose (In Context) | axe, app | axe finds a link with no name; its words are the app's |
| 2.4.5 Multiple Ways | app | |
| 2.4.6 Headings and Labels | app | |
| 2.4.7 Focus Visible | coming | With the focus rule of the theme (2.2) |
| 2.4.11 Focus Not Obscured (Minimum) | none yet | |
| 2.5.1 Pointer Gestures | none yet | |
| 2.5.2 Pointer Cancellation | none yet | |
| 2.5.3 Label in Name | app | The visible name and the accessible one |
| 2.5.4 Motion Actuation | none yet | |
| 2.5.7 Dragging Movements | none yet | |
| 2.5.8 Target Size (Minimum) | axe | |
| 3.1.1 Language of Page | app | |
| 3.1.2 Language of Parts | app | |
| 3.2.1 On Focus | none yet | |
| 3.2.2 On Input | none yet | With the form controls (4.2) |
| 3.2.3 Consistent Navigation | app | |
| 3.2.4 Consistent Identification | app | |
| 3.2.6 Consistent Help | app | |
| 3.3.1 Error Identification | none yet | With the form controls (4.2) |
| 3.3.2 Labels or Instructions | none yet | With the form controls (4.2) |
| 3.3.3 Error Suggestion | app | |
| 3.3.4 Error Prevention (Legal, Financial, Data) | app | Heavy in a money interface: review and confirm |
| 3.3.7 Redundant Entry | app | |
| 3.3.8 Accessible Authentication (Minimum) | app | |
| 4.1.2 Name, Role, Value | axe, story | |
| 4.1.3 Status Messages | none yet | With Alert (4.1) |

## Corner cases

A piece's stories show what it does in each of these that applies:

- **Empty:** no content, each optional part left out, nothing selected.
- **Too much:** more items than the room, in height and in width.
- **Long text:** a long name, a word with no spaces, another language.
- **Narrow and short screens:** 320px wide, and very short, as at a high zoom.
- **Input:** keyboard alone, touch alone, a pointer crossing it.
- **Preferences:** forced colours and text spacing, checked on every story. Reduced
  motion, once a piece animates. Larger text.
