# Tooling

How the repository runs, and how its versions are chosen.

## What holds today

- **Every command runs in a container,** but `scripts/pending-version.sh`, which `ci.yml` and `release.yml` run on
  GitHub's machines to read the tags there. Each mounts the code, read-only when it only checks, so the image never
  holds a copy of it, and the machine needs only Docker and Make.
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
  compares the two lists. `stories` has one box per browser, which `make stories BROWSER=webkit`
  repeats. With no `BROWSER`, it runs the three at once. `storybook-build`, the gallery a release publishes, is a
  check too.
- **Stories run in Storybook, and every test in Vitest,** the browsers through Playwright:
  Chromium, Firefox and WebKit. `test` runs logic and the repository's checks in Node, and
  `stories` everything in a browser, so nothing runs twice.
- **Coverage is 100% on every piece, each part measured by one check:** `test` measures
  `src/lib/` and `scripts/`, and `stories` everything else, naming what it leaves out, so a new
  folder cannot go unmeasured.
- **The build is TypeScript alone,** one file per module, with no bundler, and `dist/` stays
  out of git. Tailwind's command line makes the ready-made style sheet, reading only `dist/`.
- **`package` checks what an app receives.** It packs the build into `.package/`, keeps that
  tarball, and a Vitest test installs it in a throwaway app. The test looks at what it holds,
  imports every piece in Node, builds real apps with Vite, with and without Tailwind, to see the styles arrive,
  and checks the types as a bundler and as Node resolve them, with
  `skipLibCheck` off. `exactOptionalPropertyTypes` is off here and there, since shadcn's code and
  React Aria's own types do not pass it.
- **Screenshots are taken at one width, 1280 px,** in Chromium, for each story tagged `visual`.
  They are approved in the commit that changes them, and compared pixel by pixel, with no tolerance but the anti-aliasing
  of edges, from the browsers' settings that every project shares.
- **Colour runs in both modes:** axe, the screenshots and forced colours run every story again in dark, in a project of
  their own. The gallery switches the mode with `@storybook/addon-themes`, which puts `.dark` on the page's root. A story
  a test draws as a component runs no effect of Storybook's, so `.storybook/vitest.setup.ts` puts the class there itself.
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
- **One `stories` box per browser,** so a red box names its browser, and re-running the failed
  jobs repeats only it. On 2026-11-09, the release of v0.2.0 stopped on a failure in WebKit alone.
  On the machine, each browser alone took 25 to 45 seconds, and the three at once 93. **What it
  costs:** two more boxes, and each measures its coverage alone, so a line with no test turns
  three boxes red.
- **The gallery's build as a check,** so a change that breaks it shows in its pull request, not at the next release,
  after the merge. **What it costs:** about a minute more per pull request, and the release builds it again.
- **Screenshots in Chromium alone,** since each browser draws a little differently and needs
  images of its own, as Playwright's documentation says, so all three would mean approving each
  visual change six times instead of two. One browser answers whether the look changed. **What it
  costs:** a fault of drawing in Firefox or WebKit alone goes unseen.
- **1280 px,** since it is Tailwind's `xl`, and Playwright's own default. Vitest's default is a
  phone's width, of no use to a library with a sidebar.
- **Screenshots compared exactly,** since Vitest's default tolerance let a colour move unseen, `--primary` from `#2b2e33` to
  `#5a2b33` on 2026-11-06 and the whole dark palette on 2026-11-07. Exact, they caught five planted changes, down to one
  digit of hex, and passed five unchanged runs on 2026-11-08. **What it costs:** a browser that draws text a little
  differently fails every screenshot at once, each to be approved again, and so does any change of colour.
- **Coverage split by check,** so each part is measured by the tests meant for it, and a line
  with no test turns one box red. Coverage says a line ran, not that anything looked at it,
  so a story checks what it shows in `play`.
- **The command line for a dependency,** since it takes the newest version past the release age
  and saves it exact, which a hand edit may not. A peer's range installs nothing, so that reason
  does not reach it.
- **The package's check as a test,** since `test/` already has Node's types and its lint settings,
  and a failure comes with the name of what broke. **What it costs:** a test that installs packages
  needs the registry and a longer time limit, and depends on what the `Makefile` built before it.
- **Dark as a project, and not a story per piece,** since one switch reaches every story, and the axe project is Storybook's
  own pattern for it. Text spacing and focus stay in light, as they measure place and size, which the mode does not change.
  **What it costs:** `make stories` went from 37 to 81 seconds on 2026-11-07, and a visual change is approved twice.
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
- **Dependabot's version updates.** They would open tested pull requests each month, but would not see
  shadcn's registry or `infra/settings.env`, which stay by hand anyway.
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
  tests, for 2 images and 5 actions, which a few commands answer. The hand check can be
  forgotten, and the release's part added actions, so it is weighed again if that hurts.
- **Only GitHub's alerts for vulnerabilities.** One file less, resting on behaviour GitHub's
  documentation denies.
- **The boxes read from the `Makefile` by continuous integration.** One list and no test, but
  one more job to build the matrix, and the names no longer show in `ci.yml`.
- **A target per browser, `make stories-webkit`.** The box's name would stay its command, but the
  six checks would become eight names.
- **The eight boxes in one job, by `include`.** One job, but GitHub's documentation shows no matrix
  of `include` alone, and its rules let a later entry overwrite a value an earlier one added.
- **Vitest's `--browser`.** It stops on a project with no instance of that browser, as the
  screenshots and forced colours have.
- **A lower coverage in one browser.** Coverage says our code ran, which no browser changes, so a
  check left out of one browser is named, not hidden in a percentage.
- **`exactOptionalPropertyTypes` on.** It tells a missing property from an `undefined` one, which own
  pieces lose. Across 61 of shadcn's pieces, tried on 2026-11-06, it gave 29 errors in 18 files, and 13 in the
  dependencies' types, so it would mean those edits and `skipLibCheck`, and no untouched commit would pass.
- **`noUnusedLocals` on.** `alert-dialog` and `label` fail it untouched, and Biome reported all 5 kinds
  of unused code planted in own files on 2026-11-06. It returns in the roadmap's 6.3.
- **A switch of our own,** a toolbar global and a decorator, about 10 lines. No dependency, but code to keep for what
  Storybook's addon does, and its Tailwind guide uses.
- **Dark axe in Chromium alone.** Half the added time, but on 2026-11-07 a planted dark colour failed `breadcrumb` only in
  Firefox and WebKit, and `progress` not in Firefox.
- **Vitest's default tolerance, `threshold: 0.1`.** Nothing to approve again, but three changes of one digit, and the dark
  palette from warm to graphite, passed it unseen.
- **The tolerance at the screenshot's call.** Seen where it compares, but a screenshot written later would start at the
  default.
- **`make add`, and a `make add-peer`.** Both are rare, and a target only wraps the command. Their
  cost is a long command, kept in `docs/updating.md`, that `make help` does not show.

## History

- 2026-11-04 to 2026-11-06: Containers, static checks, stories, coverage, screenshots, the build, the package's
  check, the audit, the release's scripts and a story per file in `ui/`, in the file's older versions in git.
- 2026-11-07: Colour checked in both modes, and the gallery's switch.
- 2026-11-08: Screenshots compared exactly.
- 2026-11-09: One `stories` box per browser, and why screenshots run in Chromium alone.
- 2026-11-09: The gallery's build as a check.
- 2026-11-09: Coverage on every piece, shadcn's too.
