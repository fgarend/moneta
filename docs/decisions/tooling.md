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
- **pnpm is the package manager,** at the version `packageManager` pins, with its image at
  the same version.
- **No version younger than 7 days is used,** for packages and images alike, counted from the
  release of that version. pnpm enforces it for packages, and refuses a version whose publish
  time is missing. Images are checked by hand.
- **Development dependencies have exact versions,** so every update shows in a diff.
- **Updates are made by hand,** at the start of each roadmap item from milestone 2 on, as
  `docs/updating.md` says.

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

## History

- 2026-11-04: Written, with the containers.
