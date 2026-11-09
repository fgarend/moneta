# Commands for the repository. They call the real tools, and hold no build logic: the one loop here is make check's,
# which runs on the machine. Each target picks the service of infra/compose.yaml it runs in, with the values of
# infra/settings.env. Must work with GNU Make 3.81, the version that ships with macOS.

COMPOSE := docker compose --env-file infra/settings.env -f infra/compose.yaml
# Runs a command in a service, building its image first. The code is mounted read-only, and the folders mounted over it
# must exist in it first, even in a fresh clone.
RUN := mkdir -p node_modules .vitest coverage dist .package storybook-static && $(COMPOSE) run --rm --build
# What make check runs, fastest first. .github/workflows/ci.yml has one box per name, and stories one per browser.
CHECKS := lint types test stories package storybook-build

.PHONY: help check $(CHECKS) check-release release-notes install format update-screenshots storybook images clean \
	outdated audit shadcn-update

help: ## List the commands
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' Makefile

##@ Checks

check: ## Every check below, before a pull request. Runs them all, then says which failed
	@failed=0; summary=""; \
	for name in $(CHECKS); do \
		if $(MAKE) --no-print-directory $$name; then line="ok     $$name"; else line="failed $$name"; failed=1; fi; \
		summary="$$summary$$line\n"; \
	done; \
	printf "\n$$summary"; exit $$failed

lint: ## Formatting and lint rules, with Biome
	$(RUN) tools pnpm exec biome ci --error-on-warnings

types: ## The types, with TypeScript: the library's code, then everything around it
	$(RUN) tools sh -c 'pnpm exec tsc && pnpm exec tsc -p tsconfig.tools.json'

test: ## Logic and the repository's checks, in Node, with the coverage of src/lib and scripts
	$(RUN) tools pnpm exec vitest run --coverage

stories: ## Every story in the browsers, with axe, its screenshot and the coverage of everything else. BROWSER=webkit runs one
	$(RUN) tools pnpm exec vitest run --mode stories --coverage $(if $(BROWSER),--project '*($(BROWSER))')

package: ## The build, packed into .package, with that tarball installed and checked in a throwaway app
	$(RUN) package sh -c 'rm -rf dist/* .package/* && pnpm exec tsc -p tsconfig.build.json && \
		mkdir dist/styles && cp src/styles/*.css dist/styles/ && \
		pnpm exec tailwindcss -i dist/styles/build.css -o dist/styles/compiled.css --minify && rm dist/styles/build.css && \
		pnpm pack --pack-destination .package && pnpm exec vitest run --mode package && ls .package/*'

storybook-build: ## Build the gallery as a static site in storybook-static, as each release publishes it
	$(RUN) gallery sh -c 'rm -rf storybook-static/* && pnpm exec storybook build --output-dir storybook-static'

##@ Release

check-release: ## Whether package.json's version can be released. VERSION=X.Y.Z also compares it with that
	$(RUN) tools node scripts/check-release.ts $(VERSION)

release-notes: ## Print a version's notes from CHANGELOG.md, and nothing else on standard output. VERSION=X.Y.Z
	@$(COMPOSE) build --quiet tools >&2
	@mkdir -p .vitest coverage && $(COMPOSE) run --rm -T tools node scripts/extract-release-notes.ts $(VERSION)

##@ Development

install: ## Install what package.json lists, updating pnpm-lock.yaml and node_modules
	$(RUN) install pnpm install

format: ## Format the files and apply the safe lint fixes, in place
	$(RUN) tools-write pnpm exec biome check --write

shadcn-update: ## Take shadcn's updates into the pieces and shadcn.css by a three-way merge; PIECE=<name> takes one
	$(RUN) -e PIECE=$(PIECE) tools-write scripts/shadcn-update.sh

# Vitest never removes the screenshot of a renamed or deleted story, so the folder goes first.
update-screenshots: ## Write the approved screenshots again, to review a visual change in the diff
	$(RUN) tools-write sh -c 'rm -rf .storybook/__screenshots__ && pnpm exec vitest run --mode stories --project visual --project visual-dark --update'

storybook: ## Serve the gallery of stories at http://localhost:6006 (STORYBOOK_PORT), until stopped with Ctrl+C
	$(RUN) --service-ports storybook

images: ## Build the images every command runs in
	$(COMPOSE) build

clean: ## Remove the project's images, tagged or not. Keeps node_modules and pnpm's store
	docker image prune --all --force --filter label=com.docker.compose.project=moneta

##@ Dependencies

outdated: ## The dependencies with a newer version past the release age. Fails when it finds one, or on an error
	$(RUN) tools pnpm outdated

audit: ## The known vulnerabilities in the dependencies, of any severity. Fails when it finds one, or on an error
	$(RUN) tools pnpm audit
