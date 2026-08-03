---
name: specops:health
description: Diagnose the planning directory's health and optionally repair issues
argument-hint: "[--repair]"
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---
<objective>
Verify the integrity of the `.planning/` directory and report actionable issues. Checks for missing files, invalid config, inconsistent state, and orphaned plans.
</objective>

<execution_context>
@.opencode/workflows/health.md
</execution_context>

<process>
Execute the health-check workflow in @.opencode/workflows/health.md end to end.
Parse the --repair flag from the arguments and pass it to the workflow.
</process>
