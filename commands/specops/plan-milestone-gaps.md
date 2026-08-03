---
name: specops:plan-milestone-gaps
description: Create phases to close all gaps identified in a milestone audit
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---
<objective>
Create all phases needed to close the gaps identified by `/specops:audit-milestone`.

Read MILESTONE-AUDIT.md, group the gaps into logical phases, create phase entries in ROADMAP.md, and offer the option to plan each phase.

One command creates all the fix phases — no need to run `/specops:add-phase` manually for each gap.
</objective>

<execution_context>
@.opencode/workflows/plan-milestone-gaps.md
</execution_context>

<context>
**Audit results:**
Glob: .planning/v*-MILESTONE-AUDIT.md (use the latest one)

Original intent and current planning state are loaded on demand inside the workflow.
</context>

<process>
Execute the plan-milestone-gaps workflow in @.opencode/workflows/plan-milestone-gaps.md end to end.
Preserve all workflow gates (audit loading, prioritization, phase grouping, user confirmation, roadmap update).
</process>
