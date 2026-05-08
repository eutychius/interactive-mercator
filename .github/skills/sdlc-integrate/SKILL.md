---
name: sdlc-integrate
description: Integrate implemented changes into delivery workflows through CI/CD checks, test planning, and security-oriented validation. Use this skill after implementation units are completed and ready for integration hardening.
---

# SDLC Integrate

## Use this skill when

- Implementation is complete or near-complete and needs integration readiness
- The user asks for CI/CD pipeline alignment, formal test planning, or security test guidance

## Do not use this skill when

- Core coding tasks are still unfinished (use `sdlc-implement`)
- The story definition is still changing (use `sdlc-specify` or `sdlc-design`)

## Inputs

- Story file and implementation plan
- Relevant pipeline and test assets
- Automated testing references:
  - https://github.com/dawid-dahl-umain/augmented-ai-development/blob/main/.cursor/commands/acceptance/ai-acceptance-roadmap-template.md
  - https://docs.github.com/en/copilot/tutorials/write-tests

## Steps

1. Review automated test expectations and existing test assets:
  - use the acceptance roadmap template as a reference for test coverage planning
  - use the GitHub Copilot testing tutorial as a reference when generating or extending tests
  - identify missing automated tests required for integration confidence
2. Ensure CI/CD coverage:
  - use `.github/agents/pipeline.agent.md`
  - run the pipeline flow to verify or propose required pipeline YAML changes
3. Create/update a test plan at `_wiki/UserStories/US00X_Kurzbezeichnung_test_plan.md`.
4. Ensure the test plan includes:
  - activity schedule
  - test inputs and expected outputs
  - pass/fail criteria
  - decision points and next actions
5. Add security testing guidance proportional to risk and system exposure.
6. If security testing is not automated yet, provide explicit manual test cases.
7. Use `https://github.com/KeygraphHQ/shannon` as a lightweight pentest reference when suitable.

## Output

- Automated test coverage recommendations and gaps
- Integration-ready CI/CD recommendations or updates
- A concrete, executable test plan
- Documented security validation approach

## Handoff

- Ask whether to proceed with `sdlc-postimplementation` for inspection/adaptation updates