#!/usr/bin/env bash
# Takes shadcn's updates into our pieces and style sheet by a three-way merge: our file, shadcn's as last taken in
# upstream/shadcn/, and shadcn's as it comes now, so what only shadcn changed comes in by itself, and what both changed
# is left marked for a person. Run by make shadcn-update, for every piece or for PIECE=<name>, in the container.
set -euo pipefail

# The CLI and the package of the style sheet, at the version docs/updating.md moves.
shadcn="shadcn@4.23.0"
base="upstream/shadcn"

# The CLI writes each piece as this project would have it, in a throwaway copy, one piece per call, as several in one
# call sometimes left a "use client" in one of them, on 2026-11-09.
scratch=$(mktemp -d)
cp components.json package.json tsconfig.json "$scratch/"
mkdir -p "$scratch/src/styles"
cp src/styles/theme.css "$scratch/src/styles/"
ln -s /app/node_modules "$scratch/node_modules"

# shadcn's file as our formatter and safe fixes would leave it at our file's path, so they never show as a change.
as_ours() {
  local out
  out=$(pnpm exec biome check --write --stdin-file-path="$2" < "$1" 2> /dev/null) || true
  if [[ -n $out ]]; then
    printf '%s\n' "$out"
  else
    cat "$1"
  fi
}

# shadcn's file without its "use client" line, which the CLI adds or drops at random, as docs/decisions/base.md says.
without_directive() {
  sed '1{/^"use client"$/{N;d}}' "$1"
}

# Merges one file, and keeps shadcn's new version as the next base. Prints the file when both changed the same lines.
merge() {
  local ours=$1 last=$2
  without_directive "$3" > "$scratch/taken"
  without_directive "$last" > "$scratch/kept"
  if cmp -s "$scratch/kept" "$scratch/taken"; then
    return
  fi
  as_ours "$scratch/kept" "$ours" > "$scratch/last"
  as_ours "$scratch/taken" "$ours" > "$scratch/now"
  git merge-file -L ours -L "shadcn as last taken" -L "shadcn now" "$ours" "$scratch/last" "$scratch/now" ||
    echo "Conflict, to settle by hand: $ours"
  cp "$scratch/taken" "$last"
  echo "Updated: $ours"
}

pieces=${PIECE:-$(basename -s .tsx "$base"/*.tsx)}
for piece in $pieces; do
  (cd "$scratch" && pnpm dlx "$shadcn" add "$piece" --yes --overwrite > /dev/null 2>&1)
  ours=$(find src/components -name "$piece.tsx")
  merge "$ours" "$base/$piece.tsx" "$(find "$scratch/src" -name "$piece.tsx")"
done

if [[ -z ${PIECE:-} ]]; then
  node -e 'fetch(process.argv[1]).then((r) => r.text()).then((t) => process.stdout.write(t))' \
    "https://cdn.jsdelivr.net/npm/$shadcn/dist/tailwind.css" > "$scratch/shadcn.css"
  merge src/styles/shadcn.css "$base/shadcn.css" "$scratch/shadcn.css"
fi
