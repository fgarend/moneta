#!/usr/bin/env bash
# Prints package.json's version while it has no tag, a release still to publish, and nothing once it has one. Run on
# GitHub's machines by ci.yml and release.yml, which read the tags there.
set -euo pipefail
# A tag that cannot be read fails at once, rather than waiting for a password nobody types.
export GIT_TERMINAL_PROMPT=0

version=$(sed -n 's/^  "version": "\(.*\)",$/\1/p' package.json)
if [[ ! $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "package.json holds no version X.Y.Z: $version" >&2
  exit 1
fi

status=0
git ls-remote --exit-code --tags origin "refs/tags/v$version" > /dev/null || status=$?
case $status in
  0) ;;
  2) echo "$version" ;;
  *)
    echo "The tags could not be read (status $status)" >&2
    exit 1
    ;;
esac
