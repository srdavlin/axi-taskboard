---
name: specops:remove-phase
description: Remove a future phase from the roadmap and renumber subsequent phases
argument-hint: <phase-number>
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---
<objective>
Remove an unstarted future phase from the roadmap, and renumber all subsequent phases to keep a clean linear sequence.

Purpose: cleanly remove work you've decided not to do, without cluttering context with cancelled/deferred markers.
Output: phase deleted, all subsequent phases renumbered, git commit as the historical record.
</objective>

<execution_context>
@.opencode/workflows/remove-phase.md
</execution_context>

<context>
Phase: $ARGUMENTS

The roadmap and state are resolved inside the workflow via `init phase-op` and targeted reads.
</context>

<process>
Execute the remove-phase workflow in @.opencode/workflows/remove-phase.md end to end.
Preserve all validation gates (future-phase check, in-progress-work check), the renumbering logic, and the commit.
</process>
