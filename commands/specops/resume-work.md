---
name: specops:resume-work
description: Resume work from the previous session with full context restoration
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
  - SlashCommand
---

<objective>
Restore full project context to seamlessly continue work from the previous session.

Routes to the resume-project workflow, which handles:

- STATE.md loading (or rebuilding if missing)
- Checkpoint detection (.continue-here file)
- Unfinished-work detection (a PLAN exists but no SUMMARY)
- Status display
- Context-aware routing to the next action
  </objective>

<execution_context>
@.opencode/workflows/resume-project.md
</execution_context>

<process>
**Follow the resume-project workflow**, from `@.opencode/workflows/resume-project.md`.

That workflow handles all the resume logic, including:

1. Project-existence verification
2. STATE.md loading or rebuilding
3. Checkpoint and unfinished-work detection
4. Visual status display
5. Context-aware option presentation (check CONTEXT.md before suggesting plan vs. discuss)
6. Routing to the appropriate next command
7. Session-continuity updates
   </process>
