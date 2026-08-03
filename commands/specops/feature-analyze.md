---
name: specops:feature-analyze
description: Search for feature points, analyze open-source implementations, and generate a feature map
argument-hint: "[--query <feature point>]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**Flags:**
- `--query` — specify the feature-point search keyword

**Input:**
- Upstream competitor analysis results
- Or a directly-entered feature point description
</context>

<objective>
Run the feature analysis flow:

**Creates:**
- `.specops/feature-map.md` — feature map

**Analysis covers:**
- Calling the feature search API
- Analyzing search results
- Matching open-source implementations
- Assessing feasibility

**After this command:** run `/specops:tech-select` to perform technology selection.
</objective>

<execution_context>
@.opencode/skills/feature-search/SKILL.md
</execution_context>

<process>
1. Receive the competitor analysis results
2. Call the feature-search skill to perform the feature search
3. Analyze open-source implementations and generate the feature map
4. Update the status file
</process>
