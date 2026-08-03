---
name: specops:new-project
description: Initialize a new project through deep context gathering and PROJECT.md
argument-hint: "[--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---
<context>
**Flags:**
- `--auto` — automatic mode. After the setup questions, runs research → requirements → roadmap with no further interaction. Expects an idea document to be provided via an @ reference.
</context>

<objective>
Initialize a new project through a unified flow: questions → research (optional) → requirements → roadmap.

**Creates:**
- `.planning/PROJECT.md` — project context
- `.planning/config.json` — workflow preferences
- `.planning/research/` — domain research (optional)
- `.planning/REQUIREMENTS.md` — scoped requirements
- `.planning/ROADMAP.md` — phase structure
- `.planning/STATE.md` — project memory

**After this command:** run `/specops:plan-phase 1` to start executing.
</objective>

<execution_context>
@.opencode/workflows/new-project.md
@.opencode/references/questioning.md
@.opencode/references/ui-brand.md
@.opencode/templates/project.md
@.opencode/templates/requirements.md
</execution_context>

<process>
Execute the new-project workflow in @.opencode/workflows/new-project.md end to end.
Preserve all workflow gates (verification, approval, commit, routing).
</process>
