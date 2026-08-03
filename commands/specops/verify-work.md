---
name: specops:verify-work
description: Verify built functionality through conversational UAT
argument-hint: "[phase number, e.g., '4']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Edit
  - Write
  - Task
---
<objective>
Verify built functionality through conversational testing with persistent state.

Purpose: confirm from the user's perspective that what Claude built actually works. One test at a time, plain-text responses, no interrogation. When an issue is found, automatically diagnose it, plan a fix, and prepare it for execution.

Output: {phase_num}-UAT.md tracks all test results. If issues are found: diagnosed gaps, with a verified fix plan ready for /specops:execute-phase to execute
</objective>

<execution_context>
@.opencode/workflows/verify-work.md
@.opencode/templates/UAT.md
</execution_context>

<context>
Phase: $ARGUMENTS (optional)
- If provided: test the specific phase (e.g. "4")
- If not provided: check for an active session or prompt for a phase

Context files are resolved inside the workflow (`init verify-work`) and delegated via `<files_to_read>` blocks.
</context>

<process>
Execute the verify-work workflow in @.opencode/workflows/verify-work.md end to end.
Preserve all workflow gates (session management, test display, diagnosis, fix planning, routing).
</process>
