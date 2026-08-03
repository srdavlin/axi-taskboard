---
name: specops:competitor-analyze
description: Search for competitors, analyze their features, and generate a competitor report
argument-hint: "[--query <keywords>]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**Flags:**
- `--query` — specify search keywords

**Input:**
- Upstream requirements analysis results
- Or directly-entered competitor keywords
</context>

<objective>
Run the competitor analysis flow:

**Creates:**
- `.specops/competitor-report.md` — competitor analysis report

**Analysis covers:**
- Keyword splitting (Chinese + English)
- Web search for competitors
- GitHub search for related projects
- Competitor feature comparison

**After this command:** run `/specops:feature-analyze` to perform feature analysis.
</objective>

<execution_context>
@.opencode/skills/competitor-search/SKILL.md
</execution_context>

<process>
1. Receive the requirements analysis results
2. Call the competitor-search skill to perform the search
3. Analyze competitor features and generate the report
4. Update the status file
</process>
