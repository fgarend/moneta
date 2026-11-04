# Commands for the repository. They only call the real tools, and hold no build logic.
# Each target picks the service of infra/compose.yaml it runs in, with the values of infra/settings.env. Must work with
# GNU Make 3.81, the version that ships with macOS.

COMPOSE := docker compose --env-file infra/settings.env -f infra/compose.yaml
# Runs a command in a service, building its image first. The code is mounted read-only, and the folder mounted over it
# must exist in it first, even in a fresh clone.
RUN := mkdir -p node_modules && $(COMPOSE) run --rm --build

.PHONY: help check images clean install outdated audit

help: ## List the commands
	@awk 'BEGIN {FS = ":.*## "} /^##@ / {printf "\n%s\n", substr($$0, 5); next} \
		/^[a-z-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' Makefile

##@ Checks

check: images ## Every check, before a commit. For now, that the images build and the lockfile matches package.json

##@ Development

install: ## After changing package.json: install in a container, updating pnpm-lock.yaml and node_modules
	$(RUN) install pnpm install

images: ## Build the images every command runs in
	$(COMPOSE) build

clean: ## Remove the project's images, tagged or not. Keeps node_modules and pnpm's store
	docker image prune --all --force --filter label=com.docker.compose.project=moneta

##@ Dependencies

outdated: ## The dependencies with a newer version past the release age. Fails when it finds one, or on an error
	$(RUN) tools pnpm outdated

audit: ## The known vulnerabilities in the dependencies, of any severity. Fails when it finds one, or on an error
	$(RUN) tools pnpm audit
