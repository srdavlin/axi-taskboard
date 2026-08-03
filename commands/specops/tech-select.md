---
name: specops:tech-select
description: Technology selection — recommend a tech stack and generate a selection report
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
- `--auto` — Automatic mode. Recommend the tech stack directly based on the analysis results

**Inputs:**
- Results from upstream requirements analysis, competitor analysis, and feature analysis
</context>

<objective>
Run the technology selection process:

**Creates:**
- `.specops/tech-selection.md` — technology selection report
- `.specops/roadmap.md` — implementation roadmap

**Analysis covers:**
- Tech stack recommendations
- Option comparison
- Risk assessment
- Implementation plan

**After this command:** run `/specops:plan-phase` to start execution.
</objective>

<execution_context>
@.opencode/skills/tech-selection/SKILL.md
</execution_context>

<process>
1. Receive all upstream analysis results
2. Invoke the tech-selection skill to perform the selection
3. Generate the technology selection report and roadmap
4. Update the state file
</process>
