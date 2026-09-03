# AGENTS.md

## If you need input from the user, write ❓ at the start of the message

## Universal Requirements

Do a pattern analysis of similar already implemented features before implementing anything.

### Test Driven Development

Always create automated tests when adding new functionality.
Do not mock or stub the tested class, only its dependencies can be mocked.

- **Red-Green-Refactor:** Write a failing test, make it pass, then refactor
- **Test First:** Write tests before implementation
- **Small Steps:** Incremental development with immediate feedback
- **Design Driver:** Let tests guide API design and structure
- **Regression Safety:** Maintain a comprehensive test suite
- **Documentation:** Use tests as living documentation

### Test Writing Guidelines

- **Use descriptive, outcome-focused names**: Clearly state the behavior and result, e.g. use formats like "returns X when Y" or "throws error when Z".
  - ✅ GOOD: "returns chunks without error when text contains newlines"
  - ❌ BAD: "handles newline characters"
- **Keep assertions aligned with the title**: The test must verify exactly what the name promises.
  - ❌ BAD: "creates objects with different IDs" but only checks the count/length
  - ✅ GOOD: "creates objects with different IDs" and actually verifies the IDs differ
  - ❌ BAD: "applies correct transformation" but only checks the result is truthy
  - ✅ GOOD: "applies correct transformation" and checks the actual transformed values
  - Always verify the specific property/behavior mentioned in the test name.
- **Prefer specific value assertions over type/shape checks**: Expect concrete values, not vague conditions.
  - ✅ GOOD: `assert result.chunks equals ['First.', ' Second.']`
  - ❌ BAD: `assert result.chunks.length > 1`
  - ✅ GOOD: `assert result equals {chunks: ['text'], context: {line: 10}, properties: {}, error: null}`
  - ❌ BAD: `assert result has property 'chunks'`
- **One assertion per concept**: Test one clear idea at a time.
- **Use full comparisons**: Prefer complete expected values over partial matches.
  - Exception: For large objects, match intention-revealing properties.
  - Exception: For long strings, match intention-revealing substrings.
- **Organize and order tests well**: Group related tests with nested suites; start with the happy path, then add edge and error cases.

## 🤖 AI AGENT STANDARDS

### Code Generation

- Follow existing project patterns and validate generated code for security
- Write css classes instead of inline css
- Logging: No `print`/`console.*`/direct log writes. Always use the approved logger abstraction (structured logging) and choose appropriate log levels.
- Always write types in method parameters
- Request clarification when requirements are ambiguous
- Only try fixing 3 times, hand back to the user if not successful


### Implementation Planning

**🚨 MANDATORY PLAN LOCATION:**

- **ALWAYS save implementation plans to `_wiki/plans/` directory**
- Use descriptive kebab-case filenames (e.g., `enhanced-channel-permission-detection.md`)
- Follow the implementation plan template structure from `.github/agents/implementation-plan.agent.md`
- Plans must include: Context, Requirements, Implementation Steps (with TDD phases), Alternatives, Dependencies, Files, Testing, Risks & Assumptions
- Never create plans in temporary locations or user home directories

### Developer Review Points

- **Stop After Logical Units:** Stop after completing feature components, test suites, or logical groupings
- **Provide short Change Summary:** Create a short summary what was implemented and why
- **Highlight Important Items:** Point out areas needing special attention during review
- **Wait For Continuation:** Resume only after explicit developer approval (`continue`, `proceed`)
- Let the developer handle commits; suggest commit messages when helpful
- Do not provide timeline estimates

## ✅ VALIDATION CHECKLIST

Before completing any task:

- Use `scripts/run_installpackages.ps1` if needed.
- Use `scripts/run_build.ps1` to build the project.
- Use `scripts/run_tests.ps1` (optional `-Filter`) to verify behavior.
- Use `scripts/run_formatters.ps1` to run formatting and lint/static analysis.

- [ ] Security requirements applied
- [ ] Tests written and passing
- [ ] GDPR compliance verified
- [ ] Documentation updated
- [ ] Code quality standards met

---

**REMEMBER:** These guidelines are MANDATORY. Always comply with security, testing, and GDPR regulations. Adapt to project needs while maintaining core principles.


## Caveman Mode

Respond terse like smart caveman. Keep technical substance. Kill fluff.

### Style

Drop filler, pleasantries, and hedging. Fragments OK. Use short words when meaning stays exact. Keep technical terms exact. Keep code blocks unchanged. Quote errors exactly.

Pattern: `[thing] [action] [reason]. [next step].`

Professional but tight. Keep full sentences when they help clarity.

### Auto-Clarity

Use normal style for security warnings, irreversible actions, unclear multi-step instructions, technical ambiguity, or when the user asks for clarification.

Resume caveman after clear part done.

### Boundaries

Code, commits, and PRs stay normal. "stop caveman" or "normal mode" disables this until changed again.
