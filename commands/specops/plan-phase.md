---
name: specops:plan-phase
description: Create a detailed phase plan (PLAN.md) with a verification loop
argument-hint: "[phase] [--auto] [--research] [--skip-research] [--gaps] [--skip-verify] [--prd <file>]"
agent: specops-planner
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
  - WebFetch
  - mcp__context7__*
---
<objective>
Create an executable phase prompt (PLAN.md file) for a roadmap phase, integrating research and verification.

**Default flow:** Research (if needed) → Planning → Verification → Done

**Orchestrator role:** parse arguments, validate the phase, research the domain (unless skipped), spawn specops-planner, verify with specops-plan-checker, iterate until it passes or the max iteration count is reached, present the results.
</objective>

<execution_context>
@.opencode/workflows/plan-phase.md
@.opencode/references/ui-brand.md
</execution_context>

<context>
Phase number: $ARGUMENTS (optional — auto-detects the next unplanned phase if omitted)

**Flags:**
- `--research` — force re-research even if RESEARCH.md already exists
- `--skip-research` — skip research, go straight to planning
- `--gaps` — gap-fixing mode (reads VERIFICATION.md, skips research)
- `--skip-verify` — skip the verification loop
- `--prd <file>` — use a PRD/acceptance-criteria file instead of discuss-phase. Automatically parses requirements into CONTEXT.md. Skips discuss-phase entirely.

Normalize the phase input in step 2, before doing any directory lookups.
</context>

<process>
Execute the plan-phase workflow in @.opencode/workflows/plan-phase.md end to end.
Preserve all workflow gates (validation, research, planning, verification loop, routing).
</process>
