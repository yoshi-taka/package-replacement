# Package Replacement

Copy-first registry for vendoring small package behavior into your repo.

## What This Is

This project explores a `shadcn-style`, copy-first workflow for tiny npm utilities.

Instead of asking users to `npm install` a micro-package, it presents:

- `raw`
  - the upstream package file, or a source-faithful extracted bundle
- `normalized`
  - a rule-based transformed version that is easier to copy into Node.js and Bun projects

`normalized` is a project-specific, rule-based variant. It is not an official
upstream distribution.

The goal is not to re-implement these utilities from scratch.
The goal is to preserve known behavior locally, visibly, and with provenance.

## What This Is Not

This project is not:

- a promise of universal compatibility
- a security guarantee for sensitive code
- a mirror of every npm package

It is a curated registry of copyable behaviors.

Packages are great for distribution.
Snippets are great for understanding and control.
This project focuses on the latter.

## When To Use This

This catalog is most useful when you want:

- a smaller dependency graph
- code you can inspect and audit directly
- a deterministic local copy of behavior already relied on in your repo
- a narrow slice of a package instead of the full package surface

## When Not To Use This

Prefer upstream packages when you want:

- active maintenance and automatic updates
- a broader abstraction, not a narrow behavior slice
- security fixes to arrive through normal dependency upgrades
- upstream support for compatibility work over time

## Current Scope

The current catalog is centered on `lodash`-derived snippets, with the first
non-lodash extracted bundles starting to land.

It includes:

- modular package variants such as `lodash.debounce`, `lodash.get`, `lodash.set`
- monolith extraction experiments cut from the full `lodash` package
- small non-lodash bundles such as `strip-ansi`, `isarray`, and `traverse`
- a first selective `jsonwebtoken` cut as `decode` only

## Snippet Model

Each snippet directory contains:

- `raw.js`
- `normalized.ts`
- `meta.json`

`raw` and `normalized` mean:

- `raw`
  - the published package file as-is, or an extracted bundle from a monolithic package
- `normalized`
  - behavior-preserving packaging changes only, such as `module.exports` to `export default`

## Runtime Target

Normalized snippets are intended to be easy to copy into:

- Node.js projects
- Bun projects

## Tooling

- `bun`
- `Astro`
- `oxlint`
- `oxfmt`
- `recast`

Raw vendored files are excluded from lint and format automation.
Normalized snippets are expected to stay `oxlint` and `oxfmt` clean in this repo.

## Monolith Extraction

This repo also experiments with extracting a single vendorable behavior from a monolithic package.

Current examples:

- `get (from lodash)`
- `set (from lodash)`
- `debounce (from lodash)`

These are produced by:

1. tracing local `require('./...')` dependencies from an entry file
2. bundling the required local helper chain into one `raw.js`
3. generating `normalized.ts` with rule-based transforms

## Curation

See [curation policy](/Users/as/var/localrepos/package-replacement/docs/curation-policy.md)
and [normalization policy](/Users/as/var/localrepos/package-replacement/docs/normalization.md).

The short version:

- include small, sticky, vendorable behaviors
- prefer readable snippets with meaningful runtime tests
- handle security-sensitive packages only as narrow scoped cuts
- keep the social connection to upstream even when the code is copied locally

## License Notes

Copying source into your repo is not the same thing as `npm install`.

When you install a package, license notices usually remain attached to the
package in `node_modules`.

When you copy source into your own repo, you are making a source copy yourself.
That means you should preserve the relevant license and attribution notices for
the copied code.

For permissive licenses like MIT, the practical expectation is:

- keep the copyright notice
- keep the permission notice
- keep provenance so you can tell where the code came from

This project surfaces source package, version, and license metadata to make that
easier, but the final responsibility still sits with the repo that copies the code.

See [THIRD_PARTY_NOTICES.md](/Users/as/var/localrepos/package-replacement/THIRD_PARTY_NOTICES.md)
for the package list currently vendored into this repository.

## Maintenance Notes

Copying source changes the maintenance model.

- this copy is your responsibility once you adopt it
- it does not automatically receive upstream bug fixes or security updates
- vendored code can become outdated, so you are responsible for tracking upstream
  changes and security fixes
- `copiedAt` and source version metadata are there so you can decide when to resync

Upstream remains the source of truth for the original package.
This catalog is a different consumption model, not a replacement for OSS itself.

## Scripts

- `bun run dev`
- `bun run build`
- `bun run deploy:cloudflare`
- `bun run test`
- `bun run lint`
- `bun run fmt`
- `bun run fmt:check`
- `bun run normalize:snippet <slug>`
- `bun run extract:lodash-entry <sourceRoot> <entry> <outputFile>`

## Testing

This repo does not treat all snippets the same.

- simple vendored snippets
  - require at least import and representative behavior tests
- extracted, bundled, or version-pinned snippets
  - require runtime contract tests
  - check that the snippet imports cleanly in Bun
  - check representative behavior
  - check export shape when the package exposes helper methods or attached APIs

In practice, the more we diverge from "published file copied as-is", the more
testing becomes mandatory.

## Development Notes

- do not run `normalize:snippet` and `bun test` in parallel for a newly added snippet
- generate `normalized.ts` first, then run tests

Otherwise the test runner may try to import a snippet before the normalized file
exists, which looks like a code failure even though it is just an execution-order issue.

## Cloudflare Publishing

This site is configured for static deployment on Cloudflare.

- production URL: `https://package-replacement.veritycost.com`
- build command: `bun run build`
- output directory: `dist/`
- runtime config: [wrangler.toml](/Users/as/var/localrepos/package-replacement/wrangler.toml)

Two deployment modes are expected:

- Cloudflare GitHub integration / Workers Builds
- local `bun run deploy:cloudflare` after authenticating Wrangler

The current setup is intentionally minimal and static-only.

## Status

This is an MVP exploration.

The main things already working are:

- snippet catalog pages
- raw / normalized variant switching
- copy-first snippet viewing
- provenance metadata
- codemod-based normalization
- first-pass monolith extraction experiments
