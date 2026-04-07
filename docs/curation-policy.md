# Curation Policy

## What This Catalog Tries To Do

This project curates small package behaviors that are useful to vendor into a
repo as local code.

The goal is:

- preserve behavior locally
- keep code readable and inspectable
- reduce package overhead for small, sticky utilities

The goal is not:

- to re-implement every package from scratch
- to promise universal compatibility
- to act as a security guarantee for sensitive code

Packages and snippets solve different problems.
Packages are good at distribution and ongoing maintenance.
Snippets are good at local understanding and control.

## What Gets Included

The strongest candidates are packages or package slices that are:

- small or narrowly scoped
- widely used or persistently embedded in old codebases
- valuable to copy into a repo as a single file or small bundle
- understandable enough to review locally
- testable with representative runtime behavior

Snippets are selected to minimize hidden dependencies and side effects, but
correctness in your context is not guaranteed.

Examples:

- lodash micro-packages
- monolith extractions from lodash
- tiny legacy shims and probes
- decode-only or otherwise narrowly scoped cuts from larger packages

## What Usually Does Not Get Included

These are lower priority or excluded by default:

- large application frameworks
- packages whose value is mostly build tooling or ecosystem plumbing
- broad security-sensitive APIs without a narrow scoped cut
- snippets that cannot be tested in a meaningful way

## Raw And Normalized

Each snippet can expose:

- `raw`
  - the published package file as-is, or a source-faithful extracted bundle
- `normalized`
  - a packaging-oriented conversion for easier Node.js and Bun copy-paste use

Normalization should preserve behavior.
It may change module shape, file extension, or bundled helper layout.

## License Handling

Using a copied snippet is not the same thing as leaving a dependency installed
in `node_modules`.

If you copy source into your own repo, preserve the relevant license and
attribution notices for that copied code.

In practice, this catalog tries to make that easier by exposing:

- source package
- source version
- source reference
- license
- published package and repository links

This keeps the technical copy local while still keeping the social connection to
upstream visible.

## Security-Sensitive Packages

Security-sensitive packages are handled more narrowly than tiny utilities.

The preferred approach is:

- cut one method or one clearly bounded behavior
- state what is intentionally excluded
- test the exact runtime contract that is exposed

For example, `jsonwebtoken` is currently represented as `decode` only.
That snippet does not verify signatures, enforce claims, or make security
decisions safe by itself.

These snippets also do not automatically receive upstream security updates.
Vendored code can become outdated. You are responsible for tracking upstream
changes and security fixes.

## Testing Requirement

The more a snippet diverges from "published file copied as-is", the more
testing is required.

- simple vendored snippets
  - need import and representative behavior tests
- extracted, bundled, or version-pinned snippets
  - need runtime contract tests
  - should check export shape when relevant

## Practical Bias

This is a curated registry, not an exhaustive mirror.

Preference goes to snippets that make the idea legible:

- you can read them
- you can copy them
- you can own the behavior in your repo

Once copied, that ownership includes maintenance responsibility.
