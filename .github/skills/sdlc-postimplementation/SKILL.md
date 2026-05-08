---
name: sdlc-postimplementation
description: Run a focused post-implementation inspect-and-adapt pass and update persistent project guidance based on lessons learned. Use this skill after integration or when the user requests retrospective improvements.
# This Skill was only an Idea. We are not yet sure if it is useful or how well it works in practice.
---

# SDLC Post-Implementation

## Use this skill when

- Implementation/integration work finished and process learning should be captured
- The user asks for retrospective actions, workflow improvements, or documentation adaptation

## Do not use this skill when

- Core delivery tasks are still in progress
- There are no concrete observations to turn into actionable improvements

## Inputs

- Completed story/plan artifacts
- Relevant conversation context and change history

## Steps

1. Identify what changed in process, architecture understanding, and agent workflow.
2. Convert observations into concrete actions with owners and expected outcomes.
3. Update persistent guidance only where evidence supports the change:
	- `plans/agents.md`
	- `_wiki/architecture.md`
	- `.github/copilot-instructions.md`
4. Prefer minimal, high-signal updates over broad rewrites.

## Output

- A short inspect/adapt summary
- Concrete follow-up actions
- Updated project guidance files when justified

## Handoff

- Request manual review with `❓STOP` before closing the retrospective