---
description: Analyzes the project and creates a concise, action-focused README.md grounded in actual code
tools: ['read/readFile', 'edit/createFile', 'edit/editFiles', 'search']
argument-hint: "[TargetFolder]"
---
## mission
Generate a README that answers: What is this? How do I run it? How do I use it? Keep it condensed (150-200 lines), action-focused, zero fluff.

Reference `cli/README.md` in this repository as the gold standard for structure and tone.

## process

### 1. Discover Target Project
- Identify the target project folder (non-Agentic.Engineering project in workspace)
- Read solution files, package descriptors, entrypoints, existing docs
- Understand purpose, tech stack, dependencies, structure

### 2. Analyze
Answer with evidence from code:
1. **What is it?** (1 sentence)
2. **How do I run it?** (Prerequisites with versions → Install commands → Run commands)
3. **How do I use it?** (1-3 realistic examples with actual commands)

### 3. Draft README
Use this structure (adapt to project needs):

```markdown
# [Project Name]
[1 sentence: what this does]

## Prerequisites
- [Requirement with version]
- [Another requirement]

**Verify [installation/access]:**
```bash
[command to test prerequisites]
```
✓ Success → Skip to [Section] | ✗ Failed → Continue

## [Authentication/Setup]
Only if project needs credentials, multi-platform config, or non-trivial setup.

## Installation
**Via [method]:**
```bash
[actual command]
```

### Troubleshooting
- **Error X:** Cause and solution
- **Error Y:** Cause and solution

## Usage
**[Use case 1]:**
```bash
[command]
```

**[Use case 2]:**
```bash
[command]
```

## [Optional: Updates, Configuration, Links]
Only if genuinely needed.
```

**Style rules:**
- **Paragraphs: 1-2 sentences max** — prefer sentence fragments ("PATs = passwords")
- **Symbols:** ✓/✗, →, **bold labels:**
- **Commands:** Copy-pastable, no placeholders like `<replace-me>`
- **Troubleshooting:** Map error codes/messages to solutions (401→PAT expired)
- **Verification upfront:** Include "test access" command before installation

### 4. Quality Gate
Before finalizing, verify:
- **Line count:** 150-200 lines (cli/README.md = 151 with complex auth)
- **No boilerplate:** Cut "robust", "powerful", "flexible", "enterprise-grade", "cutting-edge"
- **Action density:** Every section answers "what do I do?" not "what is this?"
- **Command validation:** Every command works when copy-pasted
- **Error specificity:** No generic "check logs" — map errors to solutions

**What NOT to include:**
- Generic "About This Project" paragraphs
- Feature lists (unless truly differentiating)
- Architecture explanations (belongs in ARCHITECTURE.md)
- Contribution boilerplate (link to CONTRIBUTING.md if it exists)
- "Coming soon" or future plans
- License walls of text (just state the license name)

### 5. Persist
- Create or update `README.md` in target project root
- If README exists, read it first — preserve unique content, integrate new insights
- Keep total length under 200 lines

## constraints
- Target 150-200 lines total (simple projects: ~100, complex setup: ~200)
- No paragraph over 2 sentences (unless showing command output)
- All commands must be copy-pastable and grounded in actual project structure
- No generic template language — every sentence specific to this project
- Must include upfront verification command ("test access first")
- Must include at least one realistic usage example
- Prerequisites must list explicit versions where relevant
- If existing README has valuable content, integrate rather than replace
- Reference `cli/README.md` in this repo for tone and structure
