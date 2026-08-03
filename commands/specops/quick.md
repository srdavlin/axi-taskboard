---
name: specops:quick
description: Execute a quick task with SpecOps guarantees (atomic commits, state tracking) but skip optional agents
argument-hint: "[--full]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - AskUserQuestion
---
<objective>
Execute a small ad-hoc task with SpecOps guarantees (atomic commits, STATE.md tracking).

Quick mode is a short path through the same system:
- Spawns specops-planner (quick mode) + specops-executor
- Quick tasks live in `.planning/quick/`, separate from planned phases
- Updates the STATE.md "Quick Tasks Completed" table (not ROADMAP.md)

**Default:** skips research, the plan checker, and the verifier. Suited to cases where you already know exactly what to do.

**`--full` flag:** enables plan checking (up to 2 iterations) and post-execution verification. Suited to cases where you want quality guarantees without the full milestone process.
</objective>

<execution_context>
@.opencode/workflows/quick.md
</execution_context>

<context>
$ARGUMENTS

Context files are resolved inside the workflow via `init quick` and delegated via `<files_to_read>` blocks.
</context>

<process>
Execute the quick workflow in @.opencode/workflows/quick.md end to end.
Preserve all workflow gates (verification, task description, planning, execution, state updates, commit).
</process>
