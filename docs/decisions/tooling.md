# Tooling

How the repository runs, and how its versions are chosen.

## What holds today

- **Every command runs in a container.** Each mounts the code, read-only when it only
  checks, so the image never holds a copy of it, and the machine needs only Docker and Make.
- **Every layer starts from Playwright's official image,** which brings Node, the browsers
  and their system packages, frozen by its digest. A build installs nothing from a system's
  sources. pnpm's binary is copied in from pnpm's official image.
- **Images are pinned by tag and digest, in `infra/settings.env` only.** The tag keeps a pin
  readable, and the digest makes it immutable.
- **Actions are pinned by commit,** with the version in a comment, as a tag can move.
- **pnpm is the package manager,** at the version `packageManager` pins, with its image at
  the same version.
- **No version younger than 7 days is used,** for packages, images and actions alike, counted
  from the release of that version. pnpm enforces it for packages, and refuses a version whose
  publish time is missing. Images and actions are checked by hand.
- **Development dependencies have exact versions,** so every update shows in a diff.
- **A dependency enters through pnpm's command line,** never by editing `package.json`, with
  the commands in `docs/updating.md`. A peer's range is the one thing set as it is written.
- **Updates are made by hand,** at the start of each roadmap item from milestone 2 on, as
  `docs/updating.md` says.
- **`make check` runs every check, even after one fails,** and ends with one line per check.
  Continuous integration has one box per check, with the same name, in parallel, and a test
  compares the two lists.
- **Stories run in Storybook, and every test in Vitest,** the browsers through Playwright:
  Chromium, Firefox and WebKit. `test` runs logic and the repository's checks in Node, and
  `stories` everything in a browser, so nothing runs twice.
- **Coverage is 100% on own pieces, each part measured by one check:** `test` measures
  `src/lib/` and `scripts/`, and `stories` everything else but `ui/`, naming what it leaves out, so a new
  folder cannot go unmeasured. Until there is code of that kind, it measures nothing, and its
  rules were proved on planted files.
- **The build is TypeScript alone,** one file per module, with no bundler, and `dist/` stays
  out of git. Tailwind's command line makes the ready-made style sheet, reading only `dist/`.
- **`package` checks what an app receives.** It packs the build into `.package/`, keeps that
  tarball, and a Vitest test installs it in a throwaway app. The test looks at what it holds,
  imports every piece in Node, builds real apps with Vite, with and without Tailwind, to see the styles arrive,
  and checks the types as a bundler and as Node resolve them, with
  `skipLibCheck` off. `exactOptionalPropertyTypes` is off here and there, since shadcn's code and
  React Aria's own types do not pass it.
- **Screenshots are taken at one width, 1280 px,** in Chromium, for each story tagged `visual`.
  They are approved in the commit that changes them.
- **Accepted advisories are listed in `audit.ignore`,** in `pnpm-workspace.yaml`, each with its
  reason and what ends it.
- **`audit.yml` runs `make audit` every week,** and by hand, besides GitHub's alerts.
- **The `Makefile` calls each tool itself,** with no `package.json` scripts, and holds the loop
  of `make check`, which runs on the machine, so not in Node.

## Why

- **Containers,** so a check passes or fails alike on any machine, and in continuous
  integration.
- **Playwright's image,** since the browsers' system packages must be the same on every build
  for screenshots to compare. It is about 4 GB, pulled once per machine.
- **7 days,** since a malicious version is usually found and removed within days. New versions
  and their fixes arrive a week late, and a security fix may enter earlier, as a recorded
  exception.
- **By hand,** since the alternatives below cost more than they save. **What it costs:** the
  moment can be forgotten, which leaves versions one item older. Known vulnerabilities do not
  wait for it.
- **A weekly audit besides the alerts,** since GitHub's documentation says its alerts do not
  read a lockfile like ours, though today they do, as `docs/decisions/delivery.md` says. If that
  stops, nothing would announce it. **What it costs:** it repeats the alerts today, GitHub stops
  a schedule after 60 days with no activity, and a failure only reaches whoever last changed
  the schedule, with notifications on.
- **One box per check,** so a red box says what failed, and `make <box>` repeats it. Each box
  builds the images on a fresh machine, so a run costs more in machine time, though not in
  waiting, since the boxes run together.
- **1280 px,** since it is Tailwind's `xl`, and Playwright's own default. Vitest's default is a
  phone's width, of no use to a library with a sidebar.
- **Coverage split by check,** so each part is measured by the tests meant for it, and a line
  with no test turns one box red. Coverage says a line ran, not that anything looked at it,
  so a story checks what it shows in `play`.
- **The command line for a dependency,** since it takes the newest version past the release age
  and saves it exact, which a hand edit may not. A peer's range installs nothing, so that reason
  does not reach it.
- **The package's check as a test,** since `test/` already has Node's types and its lint settings,
  and a failure comes with the name of what broke. **What it costs:** a test that installs packages
  needs the registry and a longer time limit, and depends on what the `Makefile` built before it.
- **`dist/` out of git,** since the tarball is built when it is needed, and a change in `src/` is
  not repeated in the diff in files nobody reviews.

## Alternatives considered

- **Node's image, with the browsers' packages from Debian's snapshot service.** It failed in
  continuous integration, as the service answered with 503 errors, and every build with no
  cache would depend on it.
- **A lighter image until a browser is needed.** Simpler for a while, but the environment
  tested first would be replaced later.
- **The images pinned in the `Dockerfile`.** Where update bots look, but trying another image
  would mean editing it.
- **A shorter release age.** One day only catches what is found very quickly.
- **Dependabot's version updates.** They would open tested pull requests each month, but add
  that flow to a repository whose commits go straight to `main`, and would not see shadcn's
  registry or `infra/settings.env`, which stay by hand anyway.
- **Looking at updates only before a release, or right after one.** The first adds change at
  the moment of publishing. The second has no moment before the first release, and comes too
  often when releases come close together.
- **A check in continuous integration that fails on a new version.** It would turn a box red
  with no change in the code.
- **One step that runs `make check` in continuous integration.** Less to keep in step, but a
  failure would be found in the log, not by a box's name.
- **`package.json` scripts between the `Makefile` and each tool.** A second name for the same
  command, and a change to one rebuilds the image's install.
- **`make check`'s loop in a shell script.** A cleaner `Makefile`, but one more file and a second
  way of writing scripts, for a few lines.

- **One `tsconfig` for everything.** Simpler, but the library would see Node's types and pass
  with code that breaks in an app. Three, with the stories apart, would only separate files
  that need the same types.
- **Coverage measured in one run of both checks.** No saving in parallel boxes, and a line
  with no test would turn two boxes red.
- **The package's check as a Node script.** It worked before, but needs its own folder, settings
  and tests.
- **A fixed folder for the throwaway app.** It cannot know which pieces exist, and would repeat the
  versions.
- **`publint` and `arethetypeswrong`.** Two more tools to update for what the app already tries for
  real. They have rules for mistakes the app's test may not think of, so they are weighed again
  if an error in the package gets past it.
- **The build's options in the `Makefile`.** One file less, but the options would have no comment,
  and a test beside the code would enter the tarball.
- **`check-pins`, a script comparing the pins with their newest versions.** 912 lines with its
  tests, for 2 images and 2 actions, which a few commands answer. The hand check can be
  forgotten, and the release's part will add actions, so it is weighed again if that hurts.
- **Only GitHub's alerts for vulnerabilities.** One file less, resting on behaviour GitHub's
  documentation denies.
- **The boxes read from the `Makefile` by continuous integration.** One list and no test, but
  one more job to build the matrix, and the names no longer show in `ci.yml`.
- **`exactOptionalPropertyTypes` on.** It tells a missing property from an `undefined` one, which own
  pieces lose. Across all 61 of shadcn's pieces, it gave 29 errors in 18 files, and 13 in the
  dependencies' types, so it would mean those edits and `skipLibCheck`, and no untouched commit would pass.
- **`noUnusedLocals` on.** `alert-dialog` and `label` fail it untouched, and Biome reported all 5 kinds
  of unused code planted in own files on 2026-11-06. It returns in the roadmap's 6.3.
- **`make add`, and a `make add-peer`.** Both are rare, and a target only wraps the command. Their
  cost is a long command, kept in `docs/updating.md`, that `make help` does not show.

## History

- 2026-11-04: Written, with the containers.
- 2026-11-04: Static checks and their boxes in continuous integration.
- 2026-11-05: Stories, browsers, coverage and screenshots.
- 2026-11-05: The build and the package's check, and `make add` removed.
- 2026-11-05: The weekly audit, the test of the boxes, and actions in the hand checks.
- 2026-11-06: `exactOptionalPropertyTypes` off.
- 2026-11-06: `noUnusedLocals` off until 6.3, and stories per reviewed piece.
- 2026-11-06: The app of `package` builds with Vite.
- 2026-11-06: Tailwind's command line for the ready-made style sheet.
- 2026-11-06: A story per file in `ui/`, raw pieces too.
- 2026-11-06: The release's scripts, covered with `src/lib/` by `test`.
