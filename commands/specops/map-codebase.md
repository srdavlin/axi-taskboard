---
name: specops:map-codebase
description: Analyze the codebase using parallel mapping agents and generate .planning/codebase/ documentation
argument-hint: "[optional: specific area to map, e.g., 'api' or 'auth']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
  - Task
---

<objective>
Analyze the existing codebase using parallel specops-codebase-mapper agents to generate structured codebase documentation.

Each mapping agent explores one focus area and **writes its documentation directly to** `.planning/codebase/`. The orchestrator only receives confirmations, keeping context usage minimal.

Output: a .planning/codebase/ folder containing 7 structured documents about the state of the codebase.
</objective>

<execution_context>
@.opencode/workflows/map-codebase.md
</execution_context>

<context>
Focus area: $ARGUMENTS (optional — if provided, tells the agents to focus on a specific subsystem)

**Load project state if it exists:**
Check .planning/STATE.md — if the project has already been initialized, load its context

**This command can be run:**
- Before `/specops:new-project` (brownfield codebase) — create the codebase map first
- After `/specops:new-project` (greenfield codebase) — update the codebase map as the code evolves
- Any time to refresh understanding of the codebase
</context>

<when_to_use>
**When to use map-codebase:**
- A brownfield project before initialization (understand the existing code first)
- Refreshing the codebase map after a major change
- Onboarding to an unfamiliar codebase
- Before a major refactor (understand the current state)
- When STATE.md references stale codebase information

**When to skip map-codebase:**
- A greenfield project with no code yet (nothing to map)
- A simple codebase (<5 files)
</when_to_use>

<process>
1. Check whether .planning/codebase/ already exists (offer refresh or skip options)
2. Create the .planning/codebase/ directory structure
3. Spawn 4 parallel specops-codebase-mapper agents:
   - Agent 1: tech focus → writes STACK.md, INTEGRATIONS.md
   - Agent 2: arch focus → writes ARCHITECTURE.md, STRUCTURE.md
   - Agent 3: quality focus → writes CONVENTIONS.md, TESTING.md
   - Agent 4: concerns focus → writes CONCERNS.md
4. Wait for the agents to finish, collecting confirmations (not document content)
5. Verify all 7 documents exist and count their lines
6. Commit the codebase map
7. Suggest next steps (typically: /specops:new-project or /specops:plan-phase)
</process>

<success_criteria>
- [ ] .planning/codebase/ directory created
- [ ] All 7 codebase documents written by the mapping agents
- [ ] Documents follow the template structure
- [ ] Parallel agents completed without errors
- [ ] The user knows the next steps
</success_criteria>
