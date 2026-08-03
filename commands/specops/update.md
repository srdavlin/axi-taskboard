---
name: specops:update
description: Update SpecOps to the latest version and show the changelog
allowed-tools:
  - Bash
  - AskUserQuestion
---

<objective>
Check for a SpecOps update, install it if available, and show what changed.

Route to the update workflow, which handles:
- Version detection (local vs. global install)
- npm version check
- Changelog fetching and display
- User confirmation and clean-install warnings
- Update execution and cache clearing
- Restart reminder
</objective>

<execution_context>
@.opencode/workflows/update.md
</execution_context>

<process>
**Follow the update workflow** at `@.opencode/workflows/update.md`.

That workflow handles all the logic, including:
1. Installed version detection (local/global)
2. Checking the latest version via npm
3. Version comparison
4. Changelog fetching and extraction
5. Clean-install warning display
6. User confirmation
7. Update execution
8. Cache clearing
</process>
