---
name: specops:set-profile
description: Switch the model profile for SpecOps agents (quality/balanced/budget)
argument-hint: <profile>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Switch the model profile used by SpecOps agents. Controls which Claude model each agent uses, balancing quality against token consumption.

Routes to the set-profile workflow, which handles:
- Argument validation (quality/balanced/budget)
- Creating the config file if it's missing
- Updating the profile in config.json
- Displaying a model table for confirmation
</objective>

<execution_context>
@.opencode/workflows/set-profile.md
</execution_context>

<process>
**Follow the set-profile workflow** from `@.opencode/workflows/set-profile.md`.

The workflow handles all the logic, including:
1. Argument validation
2. Ensuring the config file exists
3. Reading and updating the config
4. Generating the model table from MODEL_PROFILES
5. Displaying the confirmation
</process>
