---
name: skill-name (must exactly match the parent folder name, max 64 chars, lowercase letters, numbers, and '-' only)
description: Describe what the skill does, when to use it, and which keywords or trigger phrases should help an agent select it. Be specific about both capability and use case. (max 1024 chars)
# Optional fields supported by VS Code Agent Skills. Uncomment only when they are truly needed.
# argument-hint: [context or arguments the user should provide when invoking /skill-name]
# user-invocable: true/false (Default: true)
# disable-model-invocation: true/false (Default: false)
# compatibility: Requires specific tools, packages, network access, or agent capabilities
# license: Proprietary. LICENSE.txt has complete terms
# metadata:
#   owner: team-name
#   version: "1.0"
---

# Skill Title

Briefly state the capability this skill provides and, if useful, mention key resources in this folder using relative links.

## Use this skill when

- The user asks for [primary capability or workflow]
- The request mentions [keywords, tools, artifacts, systems, or trigger phrases]
- The task benefits from reusable domain-specific instructions
- ...

## Do not use this skill when

- The request is a one-off task better handled directly
- The task belongs to [another skill, tool, or workflow]
- The necessary inputs or prerequisites are missing
- ...

## Inputs

List of Inputs needed for this Skill.
- What the user must provide
- Optional or derived context
- Relevant files, systems, tools, or constraints the skill depends on
- Any required prompts/agent files, scripts, examples, or reference assets

## Steps

1. Gather context from required files first:
	- Read referenced prompt or agent files (for example `.github/agents/*.agent.md`).
	- Read relevant architecture, story, or plan documents before taking action.
2. Choose and execute the workflow actions required by this skill:
	- Run `runSubagent` when deep analysis or specialized flows are needed.
	- Read additional files to resolve assumptions before making changes.
	- Execute scripts (for example from `scripts/`) when repeatable automation is part of the workflow.
	- Follow or execute prompt-driven instructions when prompt files are part of the skill package.
	- Reference files in this skill directory with relative links when the agent should open or use them.
3. Perform tasks in a deterministic order and keep scope aligned to this skill's purpose.
4. Produce and persist results as defined in the `Output` section.
5. Validate results against required checks, acceptance criteria, and constraints.
6. Complete transition actions exactly as defined in the `Handoff` section (including `❓STOP` when applicable).

## Output

List of desired output of the skill.
- The primary deliverable this skill produces
- Any saved files, summaries, or supporting artifacts like scripts, prompts, examples, and other assets necessary for the skill's function
- Any assumptions, unresolved questions, or risks that should be surfaced

## Handoff

List of desired actions after the skill was used.
- State what was completed
- List open questions or follow-up actions
- Point to the next step, if there is one

## Optional Additions
List of other headers that might be useful. Delete this section from the actual skill.
- `## Examples` for common input and output patterns
- `## Edge Cases` for failure modes and safe handling
- `## References` when the skill depends on files in `references/`, `scripts/`, or `assets/`
- `## Validation` when the skill should run checks or recommend validation steps
- `## Execution` when the skill should explicitly define subagents, prompts, scripts, and tool usage order
