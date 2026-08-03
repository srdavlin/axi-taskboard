---
name: specops:insert-phase
description: Insert urgent work as a decimal phase (e.g. 72.1) between existing phases
argument-hint: <after> <description>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Insert a decimal phase for urgent work discovered mid-milestone that must be completed between existing integer phases.

Use decimal numbering (72.1, 72.2, etc.) to preserve the logical order of planned phases while accommodating urgent insertions.

Purpose: handle urgent work discovered during execution without renumbering the entire roadmap.
</objective>

<execution_context>
@.opencode/workflows/insert-phase.md
</execution_context>

<context>
Arguments: $ARGUMENTS (format: <after-phase-number> <description>)

The roadmap and state are resolved inside the workflow via `init phase-op` and targeted tool calls.
</context>

<process>
Execute the insert-phase workflow in @.opencode/workflows/insert-phase.md end to end.
Preserve all validation gates (argument parsing, phase validation, decimal calculation, roadmap update).
</process>
