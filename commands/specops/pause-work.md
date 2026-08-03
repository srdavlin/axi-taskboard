---
name: specops:pause-work
description: Create a context handoff when pausing work mid-phase
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Create a `.continue-here.md` handoff file to preserve complete work state across sessions.

Route to the pause-work workflow, which handles:
- Detecting the current phase from recent files
- Full state gathering (location, completed work, remaining work, decisions, blockers)
- Creating a handoff file with all context sections
- Committing to Git as WIP
- Resume instructions
</objective>

<execution_context>
@.opencode/workflows/pause-work.md
</execution_context>

<context>
State and phase progress are gathered within the workflow via targeted reads.
</context>

<process>
**Follow the pause-work workflow** at `@.opencode/workflows/pause-work.md`.

That workflow handles all the logic, including:
1. Phase directory detection
2. State gathering and user clarification
3. Writing the timestamped handoff file
4. Git commit
5. Confirmation and resume instructions
</process>
