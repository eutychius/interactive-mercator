---
name: sdlc-design
description: Prepare architecture and implementation planning artifacts for a user story. Use this skill when the user needs design decisions, pattern analysis, or an implementation plan before coding.
---

# SDLC Design

## Use this skill when

- A story exists and implementation has not started yet
- The user asks for architecture guidance, design decisions, or an implementation plan
- The task needs pattern reuse and consistency with existing architecture

## Do not use this skill when

- The story is still unclear and needs initial clarification first (use `sdlc-specify`)
- The user asked to directly implement approved tasks (use `sdlc-implement`)

## Inputs

- `StoryMarkdownFilePath`
- `_wiki/architecture.md`

## Steps

1. Read `.github/agents/pattern-analyzer.agent.md` and follow its required structure.
2. Run `runSubagent` for the pattern-analyzer flow using:
	- the story file
	- `_wiki/architecture.md`
3. Extract and summarize:
	- reusable patterns
	- architectural constraints
	- conventions to preserve
4. Read `.github/agents/implementation-plan.agent.md` and follow its required structure.
5. Run `runSubagent` for the implementation-plan flow using the same inputs.
6. Save the resulting implementation plan next to the story file with a concise, deterministic filename.
7. Condense only redundant wording; do not remove required decisions, risks, or acceptance mapping.

## Output

- A refined design summary
- A concrete implementation plan linked to the story
- Explicit assumptions and open questions

## Handoff

- Request manual review with `❓STOP`
- Ask user to confirm: architecture fit, scope boundaries, and task ordering
