# The repository's environment, one image in layers. docs/decisions/tooling.md says why.
# Each default names only the image's family, never used: Compose always passes the pinned image, and stops when
# infra/settings.env has none. It is there so Docker's check finds a base image.
ARG PLAYWRIGHT_IMAGE=mcr.microsoft.com/playwright
ARG PNPM_IMAGE=ghcr.io/pnpm/pnpm

# pnpm's official image, only as the source of its standalone binary.
FROM ${PNPM_IMAGE} AS pnpm

# Node, the browsers and pnpm: every other layer starts here.
FROM ${PLAYWRIGHT_IMAGE} AS base
COPY --from=pnpm /opt/pnpm /opt/pnpm
RUN ln -s /opt/pnpm/pnpm /usr/local/bin/pnpm
WORKDIR /app

# The dependencies, exactly as the lockfile lists them.
# pnpm's store is a build cache, so a change to the lockfile downloads only what is new.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=moneta-pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile
