---
name: specops:list-phase-assumptions
description: Show Claude's assumptions about a phase's approach before planning begins
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
---

<objective>
Analyze a phase and show Claude's assumptions about technical approach, implementation order, scope boundaries, risk areas, and dependencies.

Purpose: help the user see Claude's thinking before planning starts — so wrong assumptions can be corrected early.
Output: conversational output only (no files created) — ends with a "What do you think?" prompt
</objective>

<execution_context>
@.opencode/workflows/list-phase-assumptions.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

Project state and roadmap are loaded inside the workflow via targeted reads.
</context>

<process>
1. Validate the phase number argument (error if missing or invalid)
2. Check that the phase exists in the roadmap
3. Follow the list-phase-assumptions.md workflow:
   - Analyze the roadmap description
   - Show assumptions about: technical approach, implementation order, scope, risk, dependencies
   - Present the assumptions clearly
   - Prompt "What do you think?"
4. Gather feedback and provide next steps
</process>

<success_criteria>

- Phase has been validated against the roadmap
- Assumptions have been shown across five areas
- User has been prompted for feedback
- User knows the next steps (discuss context, plan the phase, or correct assumptions)
  </success_criteria>
