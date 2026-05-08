---
name: rapid-prototyping
description: Orchestrate a prototype-first SDLC workflow with multiple agents and isolated context windows. Use this skill when the user asks for a prototype, mockup or proof of concept.
---

# Rapid Prototyping Orchestrator

## Use this skill when

- The user explicitly asks for a prototype, clickable prototype, wireframe, mockup, or proof of concept
- The user wants multiple agents to execute different SDLC stages
- The user wants context isolation between stages to avoid oversized prompts
- The goal is to experience a minimal but functional version of a solution early
- The solution should simulate backend or database behavior with local test data instead of real integrations
- Fast feedback and scope reduction matter more than production-readiness

## Do not use this skill when

- The user wants production code, real integration, or deployment-ready architecture
- The request is a normal feature implementation for an existing system
- Non-functional requirements, platform constraints, security hardening, or operational concerns are central to the request
- The user did not clearly indicate that a prototype is the intended outcome
- The first prototype cycle is already completed and the user is requesting incremental follow-up changes; continue with the normal development loop unless a new prototype cycle is explicitly requested

## Rules
- Follow the Context Isolation Model, Orchestration Safety Rules, and Steps in this skill strictly. If you cannot follow them, stop, explain the issue to the user, and ask for clarification. Do not work around these rules without explicit user approval.

## Inputs

- The prototype request or user story
- The target workspace where the prototype will be created
- Any key user journeys, screens, or interactions that must be demonstrable
- Any domain terms or sample data needed to simulate the workflow

## Context Isolation Model

- Treat each SDLC step as a separate agent invocation in its own fresh context.
- The parent agent MUST start a new agent call for every stage: `critical-thinking`, `implementation-plan`, and `implementation-execution`.
- Do not let one stage continue inside the parent agent's working context once a stage-specific agent is required.
- Do not rely on conversational carry-over between stages; each stage must receive only the minimum required inputs.
- Persist outputs as markdown artifacts under `/_wiki/UserStories/` only after the relevant stage has completed.
- Keep each artifact concise and deterministic.
- Stage ownership is strict:
	- `critical-thinking` Stage refines scope and returns `CRITICAL_*.md` content to the parent agent
	- `implementation-plan` Stage creates task-by-task plan and returns `PLAN_*.md` content to the parent agent
	- `implementation-execution` Stage MUST create prototype code changes and return `IMPL_*.md` content to the parent agent (it runs in the default agent but must still follow the same isolation and output rules)

## Orchestration Safety Rules

- Use tool-driven subagent orchestration via `runSubagent` for every stage.
- For stage prompts in `.github/skills/rapid-prototyping/prompts/`, the parent agent must pass the full prompt text verbatim into the subagent instructions. It may append additional context, but must not omit, shorten, or summarize any part of the stage prompt.
- Subagents must not run terminal commands.
- The parent agent exclusively owns terminal work such as package installation, restore, build, test, dev-server startup, and other approval-prone commands.
- Subagents must return stage artifact content to the parent agent; the parent agent is the only stage-artifact writer.
- Implementation subagents should return any required validation commands to the parent agent instead of executing them.
- Follow-up subagents for fixes or additional changes are recommended only for larger or context-heavy work; small localized fixes can be done directly by the parent agent.
- If a subagent's first implementation attempt does not resolve the issue, prefer having the parent agent complete the follow-up directly unless a new isolated context is clearly valuable.

## Stage State Contract

- Maintain a run-state file per workflow: `/_wiki/UserStories/PROTO_STATE_<timestamp>.md`.
- Every new stage agent chat must start by reading the state file and deciding the current stage before doing work.
- The state file is the source of truth for orchestration, not chat history.
- The parent agent is the orchestrator. Stage agents are isolated workers and must not assume access to prior chat context.
- Stage agents always return stage artifact content to the parent agent. Stage agents do not write stage markdown artifacts.
- The parent agent writes all stage markdown artifacts (`CRITICAL_*.md`, `PLAN_*.md`, `IMPL_*.md`) and updates state transitions.
- The launching prompt for each new chat must include:
	- state file path
	- current stage expectation
	- expected output artifact path
	- completion criteria for that stage

State file minimum fields:

- `run_id`: unique timestamp-based id
- `current_stage`: `critical-thinking | implementation-plan | implementation-execution | done`
- `next_stage`: next expected stage
- `input_artifacts`: list of required inputs for current stage
- `output_artifact`: single required output for current stage
- `status`: `not-started | in-progress | completed | blocked`
- `last_updated_utc`: ISO-8601 timestamp

## Steps

1. Confirm that the request is explicitly for a prototype.
2. Create a story artifact in `/_wiki/UserStories/` with a timestamped file name.
3. Initialize `PROTO_STATE_<timestamp>.md` and set:
	- `current_stage: critical-thinking`
	- `next_stage: implementation-plan`
	- `status: not-started`
4. Run the `critical-thinking` subagent against the story artifact in a fresh context by passing the full text of `.github/skills/rapid-prototyping/prompts/stage-prompt-critical-thinking.md` verbatim (no summarization or omissions).
5. If the critical-thinking subagent returns questions about scope or critical decisions, ask the user directly unless you can answer them from the original request. Then recall the subagent with the feedback or make the returned artifact adjustment directly if the answer is clear, simple, and does not raise new questions.
6. The parent agent writes the returned critical-thinking output to `CRITICAL_*.md` and updates the state to `current_stage: implementation-plan`, `status: in-progress`, and include `CRITICAL_*.md` as completed artifact.
7. Run the `implementation-plan` subagent in a new fresh context by passing the full text of `.github/skills/rapid-prototyping/prompts/stage-prompt-implementation-plan.md` verbatim (no summarization or omissions).
8. The parent agent writes the returned implementation-plan output to `PLAN_*.md` and updates the state to `current_stage: implementation-execution`, `status: in-progress`, and include `PLAN_*.md` as completed artifact.
9. Run a new `implementation-execution` subagent (with the default agent) in a new fresh context and provide:
	- full text of stage prompt `.github/skills/rapid-prototyping/prompts/stage-prompt-implementation-execution.md` verbatim (no summarization or omissions)
	- required stage outputs for execution: `CRITICAL_*.md` and `PLAN_*.md`
	- full text of `.github/skills/rapid-prototyping/prompts/design-guide.md` as mandatory style guidance for implementation execution
10. The parent agent writes the returned implementation-execution stage summary to `IMPL_*.md`. The implementation-execution subagent still creates and edits prototype code files as needed.
11. The parent agent must execute required install/build/test/run commands after the implementation-execution subagent completes, handle any approval prompts, and evaluate the results.
12. If validation fails:
	- use a follow-up implementation-execution subagent for larger or context-heavy fixes
	- use the parent agent directly for small fixes or changes
	- if a follow-up subagent attempt still struggles, the parent agent should finish the work directly
13. Mark state as `current_stage: done`, `next_stage: none`, `status: completed` when workflow closes.
14. Stop before productionization work such as real integrations, hardening, migration design, or scalability work unless the user explicitly expands scope.
15. Run it so the user can test it immediately.

## Output

- A workspace prepared for prototype-oriented agent behavior
- A reduced-scope challenge artifact (`CRITICAL_*.md`)
- A reduced-scope implementation plan for a clickable prototype (`PLAN_*.md`)
- An implementation execution artifact (`IMPL_*.md`)
- A concise record of excluded scope, assumptions, and fake integration boundaries

## Validation

- The request was explicitly identified as prototype work
- Each SDLC stage was run in a separate agent invocation
- Each SDLC stage used its designated agent in a fresh context as defined by the workflow
- Each stage consumed only the minimum required prior artifacts
- Each stage started by reading and validating `PROTO_STATE_*.md`
- State transitions were updated after every stage completion
- The critical-thinking stage explicitly decided whether persisted local test data is needed and, when needed, described the required representative data assets
- The implementation plan begins with a dedicated stage for generating required local data assets unless the prototype flow clearly does not need persisted sample data
- The prototype demonstrates the main user journeys with an interactable UI
- Real integrations were replaced with local simulated data sources
- The implemented scope stays intentionally narrow and customer-feedback oriented
- The plan and implementation avoid unnecessary production concerns

## Handoff

- Summarize the prototype scope that was included and explicitly excluded
- State which local data files or fake services simulate external systems
- State which SDLC stage is complete and which artifact was produced
- Include the current `PROTO_STATE_*.md` snapshot
- Ask whether to continue to `implementation` or refine the current stage
- Request manual review with `❓STOP`