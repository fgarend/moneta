# The manual accessibility script

What no test here can do: a screen reader, a real keyboard, real zoom and real themes
(`docs/accessibility.md`). Its first run comes with the stable API, in item 6.1. Each piece
adds its rows here. Whatever fails goes into `docs/ROADMAP.md` as a fault to fix.

## Before starting

- `make storybook` serves the gallery. Open each story below on a page of its own,
  `<http://localhost:6006/iframe.html?viewMode=story&id=components-form-input-button--default>`, with its name
  after `id=`, so Tab stays in the story.
- A story's own checks run as it opens, and may leave focus anywhere: click an empty part
  of the page once, to start from the top of it.
- **Safari:** in its settings, Advanced, turn on "Press Tab to highlight each item on a
  webpage". Without it, Tab skips links.
- **macOS:** in System Settings, Keyboard, turn on "Keyboard navigation".

## 1. Keyboard alone, in Safari and Chrome

After that first click, leave the mouse alone.

| Story | Do | Expect |
| --- | --- | --- |
| `components-form-input-button--default` | Tab to the button | Focus reaches it, with a ring you can see whole |
| | Tab onward | Focus leaves: nothing traps it |

## 2. VoiceOver, in Safari

Command-F5 turns it on and off. VO is Control-Option. VO-Right Arrow moves on to the next
item, and VO-Space bar acts on it.

| Story | Do | Expect to hear |
| --- | --- | --- |
| `components-form-input-button--default` | Move to the button | Its name once, and that it is a button |

## 3. Zoom, in Safari and Chrome

With a window of 1280 by 800, Command-Plus to 200%, and then to 400%.

| Story | Expect |
| --- | --- |
| `components-form-input-button--default` | Nothing cut, and no sideways scrolling of the page |

Turn a phone or an emulated window to both orientations: every story works in both
(WCAG 1.3.4).

## 4. Forced colours

In Chrome's DevTools, Rendering, "Emulate CSS media feature `forced-colors`", choose
`forced-colors:active`. On Windows, a contrast theme, in Edge and Firefox, is better: the
tests here emulate it already, and only this is the real thing.

| Story | Expect |
| --- | --- |
| `components-form-input-button--default` | The button can be told from the page, and its focus ring seen |

## 5. Touch, on a phone, if the gallery can be reached from one

| Story | Do | Expect |
| --- | --- | --- |
| `components-form-input-button--default` | Tap the button | It acts, and no tooltip or other state stays behind |

## The runs

| Date | Who | System and browsers | Parts | Result |
| --- | --- | --- | --- | --- |
| | | | | Not run yet |
