---
name: specops:demand-analyze
description: Analyze user requirements, break them into feature points, and generate a requirements document
argument-hint: "[--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**Flags:**
- `--auto` — Automatic mode. Analyze directly based on the requirements provided, with no interaction.

**Input types:**
- Requirement text: enter a requirements description directly
- GitHub repository: provide a repo URL, clone it, and analyze its features
- Website: provide a URL, scrape it, and analyze its features
</context>

<objective>
Process the user's input through the requirements analysis workflow:

**Creates:**
- `.specops/requirements.md` — requirements analysis report
- `.specops/demand-analysis.json` — structured requirements data

**Analysis covers:**
- Understanding and breaking down requirements
- Feature point extraction
- Priority ranking
- Dependencies

**After this command:** run `/specops:competitor-analyze` to perform competitor analysis.
</objective>

<execution_context>
@.opencode/skills/demand-analysis/SKILL.md
@.opencode/skills/brainstorming/SKILL.md
</execution_context>

<process>
1. Receive the user's input (requirement text/repository/website)
2. Invoke the demand-analysis skill to perform the analysis
3. Break down feature points and generate the requirements document
4. Update the state file `.specops/state.json`
</process>
