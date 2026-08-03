---
name: specops:cleanup
description: Archive phase directories for completed milestones
---
<objective>
Archive phase directories for completed milestones into `.planning/milestones/v{X.Y}-phases/`.

Use this when `.planning/phases/` has accumulated too many directories from historical milestones.
</objective>

<execution_context>
@.opencode/workflows/cleanup.md
</execution_context>

<process>
Follow the cleanup workflow in @.opencode/workflows/cleanup.md.
Identify completed milestones, show a dry-run summary, and archive after confirmation.
</process>
