---
name: specops:new-milestone
description: Start a new milestone cycle — update PROJECT.md and route to requirements definition
argument-hint: "[milestone name, e.g., 'v1.1 Notifications']"
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - AskUserQuestion
---
<objective>
Start a new milestone: ask questions → research (optional) → requirements → roadmap.

The brownfield equivalent of new-project. The project already exists and PROJECT.md has history. Gather "what to do next," update PROJECT.md, then run the requirements → roadmap cycle.

**Creates/updates:**
- `.planning/PROJECT.md` — updated with the new milestone goal
- `.planning/research/` — domain research (optional, new features only)
- `.planning/REQUIREMENTS.md` — scoped requirements for this milestone
- `.planning/ROADMAP.md` — phase structure (numbering continues)
- `.planning/STATE.md` — reset for the new milestone

**Afterward:** `/specops:plan-phase [N]` starts execution.
</objective>

<execution_context>
@.opencode/workflows/new-milestone.md
@.opencode/references/questioning.md
@.opencode/references/ui-brand.md
@.opencode/templates/project.md
@.opencode/templates/requirements.md
</execution_context>

<context>
Milestone name: $ARGUMENTS (optional — prompted for if not provided)

Project and milestone context files are resolved inside the workflow (`init new-milestone`) and delegated to subagents via `<files_to_read>` blocks.
</context>

<process>
Execute the new-milestone workflow in @.opencode/workflows/new-milestone.md end to end.
Preserve all workflow gates (validation, questioning, research, requirements, roadmap approval, commit).
</process>
