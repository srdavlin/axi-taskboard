---
name: specops:full-pipeline
description: Full pipeline — requirements analysis → competitor analysis → feature analysis → technology selection
argument-hint: "<input-type> [input-content]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**Input types:**
- `requirement` — requirement text
- `repository` — GitHub repository URL
- `website` — website URL

**Examples:**
- `/specops:full-pipeline requirement I want to build a blog system`
- `/specops:full-pipeline repository https://github.com/facebook/react`
- `/specops:full-pipeline website https://notion.so`
</context>

<objective>
Run the complete 4-stage pipeline:

**Stages:**
1. Requirements analysis → generates REQUIREMENTS.md
2. Competitor analysis → generates COMPETITOR_REPORT.md
3. Feature analysis → generates FEATURE_MAP.md
4. Technology selection → generates TECH_SELECTION.md + ROADMAP.md

**Final deliverables:**
- Complete requirements analysis report
- Competitor analysis report
- Feature map
- Technology selection report
- Implementation roadmap
</objective>

<execution_context>
@.opencode/skills/demand-analysis/SKILL.md
@.opencode/skills/competitor-search/SKILL.md
@.opencode/skills/feature-search/SKILL.md
@.opencode/skills/tech-selection/SKILL.md
</execution_context>

<process>
1. Receive the input and determine its type
2. Stage 1: requirements analysis
3. Stage 2: competitor analysis
4. Stage 3: feature analysis
5. Stage 4: technology selection
6. Generate all deliverable documents

Each stage updates the state file `.specops/state.json`
</process>
