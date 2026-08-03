---
name: specops:check-todos
description: List pending todos and select one to work on
argument-hint: [area filter]
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
List all pending todos, allow selection, load the full context of the selected todo, and route to the appropriate action.

Routes to the check-todos workflow, which handles:
- Todo counting and listing (with area filtering)
- Interactive selection with full context loading
- Roadmap association checking
- Action routing (handle immediately, add to phase, brainstorm, create phase)
- STATE.md updates and git commits
</objective>

<execution_context>
@.opencode/workflows/check-todos.md
</execution_context>

<context>
Arguments: $ARGUMENTS (optional area filter)

Todo status and roadmap associations are loaded inside the workflow via `init todos` and targeted reads.
</context>

<process>
**Follow the check-todos workflow** from `@.opencode/workflows/check-todos.md`.

That workflow handles all the logic, including:
1. Todo existence check
2. Area filtering
3. Interactive listing and selection
4. Full context loading with file summaries
5. Roadmap association checking
6. Action offering and execution
7. STATE.md updates
8. Git commit
</process>
