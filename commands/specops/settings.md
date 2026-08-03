---
name: specops:settings
description: Configure SpecOps workflow toggles and model configuration
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
Interactively configure SpecOps workflow agents and model configuration through a multi-question prompt.

Route to the settings workflow, which handles:
- Ensuring the config exists
- Reading and parsing current settings
- An interactive 5-question prompt (model, research, plan review, verifier, branch strategy)
- Config merging and writing
- Confirmation display and quick command reference
</objective>

<execution_context>
@.opencode/workflows/settings.md
</execution_context>

<process>
**Follow the settings workflow** at `@.opencode/workflows/settings.md`.

That workflow handles all the logic, including:
1. Creating the config file with defaults if missing
2. Reading the current config
3. Displaying interactive settings with pre-selections
4. Parsing answers and merging config
5. Writing the file
6. Displaying confirmation
</process>
