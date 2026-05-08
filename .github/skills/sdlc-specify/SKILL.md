---
name: sdlc-specify
description: Build and refine a clear user story for significant changes before design or coding starts. Use this skill when requirements are unclear, scope is uncertain, or acceptance criteria need to be defined.
---

# SDLC Specify

## Use this skill when

- A significant change is proposed but the user story is not ready
- Scope, constraints, or acceptance criteria are ambiguous
- The user asks for story definition or requirement clarification

## Do not use this skill when

- A reviewed story already exists and work should move to design/implementation

## Inputs

- `SpecPurpose` (what change should be achieved)
- `_wiki/architecture.md`

## Steps

1. Clarify `SpecPurpose` with the user in one concise statement.
2. Read `.github/agents/analyse-us.agent.md` and follow its required output format.
3. Run `runSubagent` for analysis using `SpecPurpose` and `_wiki/architecture.md`.
4. Save the returned markdown as `_wiki/UserStories/US00X_Kurzbezeichnung.md`.
5. Request user review with `❓STOP`.
6. Read `.github/agents/challenge-us.agent.md` and run the challenge flow against the story file.
7. Ask only the highest-value clarification questions, then request feedback with `❓STOP`.
8. Integrate approved answers into the story while preserving structure and traceability.

## Output

- A reviewable user story with clearer scope and acceptance criteria
- Explicit unresolved questions (if any)
