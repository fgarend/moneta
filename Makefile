# Commands for the repository. They call the real tools, and hold no build logic: the one loop here is make check's,
# which runs on the machine. Each target picks the service of infra/compose.yaml it runs in, with the values of
# infra/settings.env. Must work with GNU Make 3.81, the version that ships with macOS.

COMPOSE := docker compose --env-file infra/settings.env -f infra/compose.yaml
# Runs a command in a service, building its image first. The code is mounted read-only, and the folder mounted over it
# must exist in it first, even in a fresh clone.
RUN := mkdir -p node_modules && $(COMPOSE) run --rm --build
# What make check runs, fastest first. .github/workflows/ci.yml has one box per name.
CHECKS := lint types

.PHONY: help check $(CHECKS) install add format images clean outdated audit

help: ## List the commands
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' Makefile

##@ Checks

check: ## Every check below, before a commit. Runs them all, then says which failed
	@failed=0; summary=""; \
	for name in $(CHECKS); do \
		if $(MAKE) --no-print-directory $$name; then line="ok     $$name"; else line="failed $$name"; failed=1; fi; \
		summary="$$summary$$line\n"; \
	done; \
	printf "\n$$summary"; exit $$failed

lint: ## Formatting and lint rules, with Biome
	$(RUN) tools pnpm exec biome ci --error-on-warnings

types: ## The types, with TypeScript
	$(RUN) tools pnpm exec tsc

##@ Development

add: ## Add a development dependency, at its newest version past the release age. PACKAGE=name, or name@version
	$(RUN) install pnpm add -D $(PACKAGE)

install: ## Install what package.json lists, updating pnpm-lock.yaml and node_modules
	$(RUN) install pnpm install

format: ## Format the files and apply the safe lint fixes, in place
	$(RUN) tools-write pnpm exec biome check --write

images: ## Build the images every command runs in
	$(COMPOSE) build

clean: ## Remove the project's images, tagged or not. Keeps node_modules and pnpm's store
	docker image prune --all --force --filter label=com.docker.compose.project=moneta

##@ Dependencies

outdated: ## The dependencies with a newer version past the release age. Fails when it finds one, or on an error
	$(RUN) tools pnpm outdated

audit: ## The known vulnerabilities in the dependencies, of any severity. Fails when it finds one, or on an error
	$(RUN) tools pnpm audit
