---
name: specops:execute-phase
description: Execute all plans in a phase using wave-based parallelization
argument-hint: "<phase-number> [--gaps-only]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - TodoWrite
  - AskUserQuestion
---
<objective>
Execute all plans in a phase using wave-based parallel execution.

The orchestrator stays lean: discover plans, analyze dependencies, group into waves, spawn subagents, collect results. Each subagent loads the full execute-plan context and handles its own plan.

Context budget: ~15% for the orchestrator, 100% fresh for each subagent.
</objective>

<execution_context>
@.opencode/workflows/execute-phase.md
@.opencode/references/ui-brand.md
</execution_context>

<context>
Phase: $ARGUMENTS

**Flags:**
- `--gaps-only` — execute only gap-closure plans (plans with `gap_closure: true` in frontmatter). Use after verify-work creates fix plans.

Context files are resolved inside the workflow via `specops-tools init execute-phase` and each subagent's `<files_to_read>` block.
</context>

<process>
Execute the execute-phase workflow in @.opencode/workflows/execute-phase.md end to end.
Preserve all workflow gates (wave execution, checkpoint handling, verification, status updates, routing).
</process>
