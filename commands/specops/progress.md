---
name: specops:progress
description: Check project progress, show context, and route to the next action (execute or plan)
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - SlashCommand
---
<objective>
Check project progress, summarize recent work and what's next, then intelligently route to the next action — executing an existing plan or creating the next one.

Provide situational awareness before continuing work.
</objective>

<execution_context>
@.opencode/workflows/progress.md
</execution_context>

<process>
Execute the progress workflow in @.opencode/workflows/progress.md end to end.
Preserve all routing logic (routes A through F) and edge-case handling.
</process>
