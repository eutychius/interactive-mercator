---
description: 'Analyze and refactor a file in the project context for clarity, consistency, and minimal complexity — without changing behavior.'
tools: ['read/readFile', 'edit/editFiles', 'search']
argument-hint: '[TargetFile]'
---

## Mission

Refactor [TargetFile] so the code is minimal, unambiguous, consistent, and easy to maintain — as if the project were built from scratch by someone who values clarity above all else. **Never change observable behavior.**

## Pre-Conditions (mandatory, in order)

Before touching any code you **must** complete these steps:

1. **Read `README.md`** — understand purpose, setup, and usage of the project.
2. **Read `_wiki/architecture.md`** — understand architectural style, components, boundaries, and patterns.
3. **Trace all references** of every public symbol (function, class, variable, constant) in [TargetFile]:
   - Who imports / calls it? (other modules, tests, scripts)
   - Who is imported / called by it?
   - Is it referenced in pipeline files (`azure-pipelines.yml`, shell/PS scripts)?
   - Is it referenced in IaC modules (`iac/*.bicep`)?
4. **Map the dependency graph** — understand how [TargetFile] fits into the overall system before proposing any change.

> **Rule:** If you cannot confirm a symbol is used, mark it as a candidate for removal — but verify with a workspace-wide search before deleting.

## Refactoring Rules

Apply these rules strictly, in priority order:

### 1. Remove Dead Code
- Delete unused imports, variables, functions, parameters, classes, and constants.
- Delete commented-out code blocks.
- Verify each removal with a reference search across the entire workspace.

### 2. Simplify
- Remove unnecessary options, parameters, modes, and flags nobody uses.
- Flatten deep nesting with early returns / guard clauses.
- Replace complex conditionals with named boolean variables or small extracted functions.
- Eliminate redundant type conversions, defensive copies, or wrapper calls that add no value.

### 3. Name Everything Clearly
- Names must reveal intent, scope, and unit — no abbreviations, no generic names (`data`, `result`, `tmp`, `val`).
- If a comment is needed to explain a name, rename instead of commenting.
- Align naming style with the rest of the project (check existing modules for conventions).

### 4. One Function — One Job
- Each function does exactly one thing and is < 20 lines.
- 0–3 parameters; use a data class / named tuple if more context is needed.
- Extract sub-steps into well-named helper functions rather than adding comments.

### 5. DRY — Centralize Repeated Logic
- Extract duplicated code into a shared utility or base function.
- Ensure the single source of truth is easy to find and well-named.

### 6. Delete Noise Comments
- Remove comments that restate the code (`# increment counter`).
- Keep only comments that explain *why* — a business rule, a workaround, a non-obvious constraint.

### 7. Consistent Patterns
- Error handling, logging, configuration access, model definitions, and imports must follow the same patterns used in the rest of the project.
- If [TargetFile] deviates from established patterns, align it — do not invent new conventions.

### 8. SOLID Compliance
- **S** — split classes / modules that have more than one reason to change.
- **O** — prefer extending behavior over modifying existing code paths.
- **L** — subclasses must honor the contract of their base.
- **I** — no interface should force a consumer to depend on methods it does not use.
- **D** — depend on abstractions (protocols / interfaces), not concrete implementations.

## Infrastructure & Pipeline Consistency

Every refactoring that changes a file's public interface (renamed export, moved module, changed entrypoint, altered environment variable, modified argument) **must** be reflected in:

- `azure-pipelines.yml` — pipeline steps, script calls, variable references.
- `iac/**/*.bicep` — module parameters, container commands, environment variables.
- `Dockerfile` — entrypoints, copy paths, install commands.
- `scripts/**` — invocation commands, paths, flags.
- Test files — imports, fixture references, mocked paths.

> **Rule:** Search the full workspace for the old name / path before considering a rename done.

## Constraints

- **No behavior changes.** Inputs, outputs, side effects, and error semantics stay identical.
- **All existing tests must pass** after every individual change. Run tests before reporting completion.
- **Small, atomic changes.** Each edit should be independently reviewable and revertible.
- **No new dependencies.** Do not introduce libraries or packages that are not already in the project.
- **Do not move code across bounded contexts** without architectural justification from `_wiki/architecture.md`.

## Deliverable

After refactoring, provide a short summary:

1. **What changed** — list of files modified with a one-line description per file.
2. **What was removed** — dead code, unused parameters, noise comments.
3. **What was renamed** — old name → new name, with reason.
4. **What needs attention** — anything you spotted but intentionally did not change (e.g., behavior change required, cross-team dependency).

Stop here and wait for developer review before proceeding to the next file.
