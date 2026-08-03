---
name: specops:audit-milestone
description: Audit milestone completion against original intent before archiving
argument-hint: "[version]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Task
  - Write
---
<objective>
Verify that a milestone has met its definition of done. Check requirement coverage, cross-phase integration, and end-to-end flows.

**This command is itself the orchestrator.** It reads existing VERIFICATION.md files (phases are verified during execute-phase), rolls up technical debt and deferred gaps, then spawns an integration checker for cross-phase connection checks.
</objective>

<execution_context>
@.opencode/workflows/audit-milestone.md
</execution_context>

<context>
Version: $ARGUMENTS (optional — defaults to the current milestone)

Core planning files are resolved within the workflow (`init milestone-op`), loaded only as needed.

**Completed work:**
Glob: .planning/phases/*/*-SUMMARY.md
Glob: .planning/phases/*/*-VERIFICATION.md
</context>

<process>
Execute the audit-milestone workflow in @.opencode/workflows/audit-milestone.md end to end.
Preserve all workflow gates (scope determination, verification reading, integration checks, requirement coverage, routing).
</process>
