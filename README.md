# fgarend/moneta

A component library for money interfaces, built on shadcn. It is generic, and meant to be
reused by any app. Before 1.0, most pieces are raw: they meet the repository's checks, but nobody has reviewed them yet.

## Install

Take the file of a [release](https://github.com/fgarend/moneta/releases), with the peers:

```sh
pnpm add https://github.com/fgarend/moneta/releases/download/vX.Y.Z/fgarend-moneta-X.Y.Z.tgz \
  react react-dom react-aria-components lucide-react
```

## Use

```tsx
import "@fgarend/moneta/styles.css";
import { Button } from "@fgarend/moneta/button";
```

The style sheet resets the whole page, and holds only the classes the pieces use.

## Dark

Put the class `dark` on the page's root element, or on any part of the page, in whatever way the app chooses. Set it before the
first paint, or the page flashes light.

## Change the look

Redefine the theme's variables after the import, outside any `@layer`, and again for dark:

```css
:root { --primary: oklch(0.5 0.1 250); --font: "Your Font", sans-serif; }
.dark { --primary: oklch(0.8 0.1 250); }
```

The font is the app's to load when it changes it.

## More

The [gallery](https://fgarend.github.io/moneta/), the
[guidelines](https://github.com/fgarend/moneta/blob/main/docs/guidelines.md), also in the package at `docs/guidelines.md`, the
[state of each piece](https://github.com/fgarend/moneta/blob/main/docs/pieces.md), the
[changelog](https://github.com/fgarend/moneta/blob/main/CHANGELOG.md) and the
[roadmap](https://github.com/fgarend/moneta/blob/main/docs/ROADMAP.md).

## Working on it

Every command runs in a container, so it needs Docker with Compose, and Make. `make help`
lists the commands.

## License

[MIT](LICENSE).
