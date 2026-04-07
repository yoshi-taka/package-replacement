# Normalization Policy

## Purpose

This project publishes two snippet variants:

- `raw`
  - the published package file as-is, or a source-faithful extracted bundle
- `normalized`
  - a rule-based packaging transform that keeps behavior intact while making the
    snippet easier to copy into Node.js and Bun projects

`normalized` is not a rewrite.
Its purpose is packaging compatibility, not behavioral reinterpretation.

## Runtime Target

The current runtime targets are:

- `node`
- `bun`

Browser-specific optimization, edge runtimes, and broad bundler compatibility are
not the initial goal.

## Definition Of Rule-Based Normalization

Rule-based normalization means changing packaging shape without changing runtime
semantics or the observable behavior contract.

Principles:

- transforms are executed by code, not by hand
- open-ended AI rewriting is not used for normalization
- allowed transforms are explicitly whitelisted
- applied transforms can be recorded in snippet metadata

## Allowed Transforms

The following transforms are allowed:

- convert `module.exports = x` to `export default x`
- convert `exports.foo = foo` to named exports
- change `.js` outputs to `.ts`
- adjust import and export syntax
- remove trivial distribution-only wrappers
- add minimal typing only when it is directly recoverable from source metadata
- make formatting-only changes that do not affect runtime behavior

## Forbidden Transforms

The following are not normalization:

- logic changes
- removing or simplifying branches
- deleting or merging helpers for convenience
- replacing behavior with native APIs
- optimization or “improvement” passes
- shortening or rewriting code for style
- manual or AI meaning-based rewrites

If a change crosses that line, it is a reimplementation, not a normalized variant.

## Tooling

Normalization is enforced with code.

Current direction:

- `recast` for codemod-style transforms
- small project-owned transforms instead of broad generic conversion pipelines

Today, the minimal codemod converts `module.exports = x` into `export default x`
and writes a `normalized.ts` file from `raw.js`.

## Why Not AI Conversion

This project needs a clear trust boundary.

Users should be able to understand what changed between `raw` and `normalized`.
That is easier to explain and defend when transforms are programmatic, small, and
explicitly listed.

## Variant Semantics

### `raw`

- preserves the published package shape or a source-faithful extracted bundle
- is the closest representation of the upstream artifact used by this catalog

### `normalized`

- starts from `raw`
- applies rule-based packaging transforms
- is intended to be easier to copy into modern Node.js and Bun repos

`raw` remains the source-facing reference point.

## Metadata Requirements

Each variant should include:

- `distributionKind`
- `moduleFormat`
- `language`
- `file`
- `note`

Normalized variants should also record:

- `normalizations`
- `runtimeTargets`

## Current MVP Rule

For now:

- `raw` preserves the published file or extracted bundle
- `normalized` provides an easier ESM/TS copy-paste target for Node.js and Bun
- only rule-based transforms are allowed
- full lint portability across all downstream repos is not guaranteed
