# AGENTS.md

## Always start your messages with: ➕

## If you need input from the user, write ❓ at the start of the message

## Core Principles

1. **QUALITY FIRST:** Prioritize code security, quality and maintainability over speed
2. **SECURITY CONSCIOUS:** Consider security implications of generated code
3. **VALIDATION REQUIRED:** All AI-generated code must be automatically tested, reviewed and validated
4. **INCREMENTAL DEVELOPMENT:** Build features in small increments with regular developer reviews
5. **COLLABORATION FOCUSED:** Support team workflows and knowledge sharing

## Universal Requirements

Do a pattern analysis of similar already implemented features before implementing anything.

### Clean Code

- **Conventions**: follow language conventions and resolve all linting warnings
- **Naming**: Intention-revealing, searchable names
- **Functions**: Small (<20 lines), single purpose, 0-3 parameters
- **Comments**: Explain "why", not "what"
- **Error Handling**: Language-appropriate patterns, fail fast
- **IaC**: Use Infrastructure as Code for deployments

### SOLID Principles

- **S** - Single Responsibility: One reason to change
- **O** - Open/Closed: Open for extension, closed for modification
- **L** - Liskov Substitution: Subclasses replace superclasses seamlessly
- **I** - Interface Segregation: No unused interface dependencies
- **D** - Dependency Inversion: Depend on abstractions, not concretions

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

### Organization

- **Structure:** Group related code and separate concerns
- **Dependencies:** Minimize externals and use dependency injection
- **Scalability:** Design for horizontal scaling and avoid tight coupling
- **IaC:** Use Infrastructure as Code for deployments

### Domain Driven Design

- **Ubiquitous Language:** Use consistent domain vocabulary across code and documentation
- **Bounded Contexts:** Define clear boundaries around related models and logic
- **Entities & Value Objects:** Model identity and immutable value objects appropriately
- **Aggregates & Repositories:** Use aggregates for consistency boundaries and repositories for data access
- **Domain Services:** Implement stateless operations that don't fit entities

## 🚨 SECURITY & COMPLIANCE

### Input Validation

- Validate inputs at system boundaries
- Use parameterized queries for DB operations
- Implement authentication and authorization
- Sanitize outputs to prevent injection attacks

### Data Protection & GDPR Compliance

- Encrypt sensitive data at rest and in transit
- Use secure randomness and proper session management
- Apply least privilege and zero-trust principles
- Use secrets management and perform regular security audits (e.g., `npm audit fix`, `dotnet list package --vulnerable`, `pip-audit`)
- Keep dependent packages up to date
- Follow OWASP guidelines for web applications
- Use European regions for data processing
- **Data Minimization:** Collect only data required for functionality
- **Audit Logging:** Log PII access with timestamp, user ID, action, and data affected
- Avoid logging sensitive information

## 🤖 AI AGENT STANDARDS

### Code Generation

- Follow existing project patterns and validate generated code for security
- Write css classes instead of inline css
- Logging: No `print`/`console.*`/direct log writes. Always use the approved logger abstraction (structured logging) and choose appropriate log levels.
- Always write types in method parameters
- Request clarification when requirements are ambiguous
- Only try fixing 3 times, hand back to the user if not successful

### AI Agent Behavior

- **Ask For Context:** Request project context and requirements when unclear
- **Incremental Delivery:** Break complex implementations into testable components
- **Pattern Matching:** Analyze codebase patterns before generating code
- **Validation First:** Verify functional and security requirements
- **Respect Review Points:** Stop at logical completion points for developer review
- Never generate or suggest effort or time estimations in any context (including comments, documentation, issues, tickets, or commit messages)
- **Replace, Don't Deprecate:** When switching/moving to a new solution, completely replace the old implementation by default. Dont create deprecated code, backward compatibility layers, and old dependencies unless explicitly instructed to maintain them

### Implementation Planning

**🚨 MANDATORY PLAN LOCATION:**

- **ALWAYS save implementation plans to `_wiki/plans/` directory**
- Use descriptive kebab-case filenames (e.g., `enhanced-channel-permission-detection.md`)
- Follow the implementation plan template structure from `.github/agents/implementation-plan.agent.md`
- Plans must include: Context, Requirements, Implementation Steps (with TDD phases), Alternatives, Dependencies, Files, Testing, Risks & Assumptions
- Never create plans in temporary locations or user home directories

### Context Management After Planning

**🚨 CRITICAL RULE - NEVER VIOLATE THIS:**

- **STOP IMMEDIATELY AFTER PLAN APPROVAL:** When a plan is approved, you MUST stop completely. Do NOT:
  - Write any code
  - Create todo lists
  - Run tests
  - Start any implementation task
  - Make any edits beyond the plan file
- **PROMPT USER TO CLEAR CONTEXT:** Tell the user: "Please clear the conversation context (type `/clear`) and then ask me to implement the plan in a fresh conversation. This ensures better focus and efficiency."
- **WAIT FOR NEW CONVERSATION:** Do not proceed until the user explicitly starts a new conversation and asks you to implement
- **Why This Matters:** Planning consumes significant context tokens. Starting fresh for implementation ensures better focus, efficiency, and prevents context pollution

### Developer Review Points

- **Stop After Logical Units:** Stop after completing feature components, test suites, or logical groupings
- **Provide short Change Summary:** Create a short summary what was implemented and why
- **Highlight Important Items:** Point out areas needing special attention during review
- **Wait For Continuation:** Resume only after explicit developer approval (`continue`, `proceed`)
- Let the developer handle commits; suggest commit messages when helpful
- Do not provide timeline estimates

## 🔧 WORKFLOW & DOCUMENTATION

### Standard Development Process

- **Context Analysis:** Read existing code patterns and documentation
- **Implementation:** Deliver incrementally and stop at logical points
- **Compile** the project you are working on
- **Testing:** Validate functionality and run tests
- **Developer Review:** Provide a change summary and await review

### Documentation Requirements

- Maintain a single up-to-date `README.md` with setup and troubleshooting
- Document architectural decisions using ADR format with context and rationale
- Use comments only for complex business logic or non-obvious choices
- Maintain API documentation with endpoints, examples, and error codes

## 🚫 ANTI-PATTERNS TO AVOID

- **God Objects:** Keep classes reasonably sized (prefer <300 lines)
- **Magic Numbers:** Use named constants instead of literals
- **Copy-Paste:** Extract shared logic to utilities or services
- **Deep Nesting:** Prefer early returns over deep conditionals

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
