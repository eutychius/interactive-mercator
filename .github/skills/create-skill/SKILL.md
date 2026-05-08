---
name: create-skill
description: Create or refactor an Agent Skill in this repository. Use this skill when the user asks to add a new skill, improve an existing SKILL.md, or align a skill with the current VS Code Agent Skills format, activation metadata, and authoring best practices.
---

# Create Skill

## Use this skill when

- The user asks to create a new skill under `.github/skills/`
- The user asks to improve an existing skill's trigger behavior, clarity, scope, or structure
- The user asks for Agent Skills specification compliance or standardization
- The user asks to make a skill easier for Copilot to auto-discover or use as a slash command
- The request may need a reusable skill, but it is not yet clear whether creating a new skill is the right solution

## Do not use this skill when

- The request is a one-off coding task that does not require reusable skill instructions
- The task is only about implementing product code, not creating reusable agent behavior
- The user already has a suitable existing skill and only needs that skill executed

## Inputs

- The requested capability, workflow, or problem the user wants to solve
- The target skill name or existing skill path, if one exists
- Related repo conventions and neighboring skills under `.github/skills/`
- `.github/skills/create-skill/SKILL_Template.md`
- Current VS Code Agent Skills guidance, especially the documented `SKILL.md` frontmatter fields and body expectations

## Steps

1. Clarify the user's actual need in one concise statement.
	- If the target capability, intended audience, invocation mode, or scope is unclear, ask 1-3 concise follow-up questions with the built-in VS Code Question Tool before choosing or editing a skill.
2. Decide whether to create a new skill, refactor an existing skill, or avoid creating a skill.
3. Review neighboring skills under `.github/skills/` to detect overlap and define clear boundaries.
4. If a skill is justified, create or update `.github/skills/<skill-name>/SKILL.md`.
5. Copy `.github/skills/create-skill/SKILL_Template.md` as the structural baseline.
6. Fill the skill with specific instructions for the real user need.
7. Ensure the frontmatter is valid and intentional:
	- `name` must exactly match the parent directory name.
	- `description` must clearly describe both capability and activation conditions.
	- Only add `argument-hint`, `user-invocable`, and `disable-model-invocation` when they are justified by how the skill should be invoked.
8. Ensure the body explains what the skill helps accomplish, when to use it, the step-by-step workflow, expected outputs, and any included scripts or resources.
9. Ensure the Output as defined in the `Output` section is present.
10. Validate the output against the `Validation` checklist.
11. Follow the Steps in the `Handoff` section.

## Output

- A valid, standardized `SKILL.md` with frontmatter and aligned Markdown body
- A short rationale for why the created or updated skill is the best fit, how it differs from related skills, and how it is expected to be invoked

## Validation

- Check that skill folder name and `name` field match exactly
- Check that skill `name` field uses lowercase alphanumeric plus hyphen only, with no spaces or special characters
- Check that the `description` states both capability and activation conditions with clear keywords
- Check that only documented invocation fields are used unless there is a strong, explicit reason to add nonstandard metadata
- Check that `argument-hint` is only used when manual slash-command invocation benefits from extra user guidance
- Check that `user-invocable` and `disable-model-invocation` match the intended discovery and invocation behavior
- Check that instructions tell the agent what to do, not only what the skill is about
- Check that optional sections and frontmatter fields are justified
- Check that the scope is focused, concrete, and non-overlapping
- Check that the template structure is preserved unless deviation is justified
- Check that the body includes actionable workflow instructions, expected outputs, and references to bundled resources when relevant
- Check that the skill is concise and actionable (target under 200 lines)

## Handoff

- Summarize what changed and why
- List remaining open questions or follow-up actions
- Confirm whether the resulting skill is the best fit for the need and whether it should be auto-loaded, slash-invocable, or both
- Ask whether trigger-eval queries should be added
- Request manual review with `❓STOP`
