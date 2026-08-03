---
name: specops:add-todo
description: Capture an idea or task from the current conversation context as a to-do item
argument-hint: [optional description]
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
Capture ideas, tasks, or issues that surface during a SpecOps session as structured to-do items for later handling.

Routes to the add-todo workflow, which handles:
- Directory structure creation
- Extracting content from arguments or the conversation
- Inferring the domain from file paths
- Duplicate detection and resolution
- Creating the to-do file with frontmatter
- STATE.md updates
- Git commit
</objective>

<execution_context>
@.opencode/workflows/add-todo.md
</execution_context>

<context>
Argument: $ARGUMENTS (optional to-do description)

State is resolved inside the workflow via `init todos` and targeted reads.
</context>

<process>
**Follow the add-todo workflow** from `@.opencode/workflows/add-todo.md`.

The workflow handles all the logic, including:
1. Ensuring the directory exists
2. Checking existing domains
3. Content extraction (from arguments or conversation)
4. Domain inference
5. Duplicate check
6. File creation and slug generation
7. STATE.md update
8. Git commit
</process>
