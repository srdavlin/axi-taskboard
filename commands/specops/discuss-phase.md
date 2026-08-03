---
name: specops:discuss-phase
description: Gather phase context before planning through adaptive questioning
argument-hint: "<phase> [--auto]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - Task
---

<objective>
Extract the implementation decisions downstream agents need — researchers and planners will use CONTEXT.md to understand what needs to be investigated and which choices are already locked in.

**How it works:**
1. Analyze the phase to identify gray areas (UI, UX, behavior, etc.)
2. Present the gray areas — the user chooses what to discuss
3. Dig into each selected area until satisfied
4. Create CONTEXT.md, recording decisions that can guide research and planning

**Output:** `{phase_num}-CONTEXT.md` — decisions clear enough that downstream agents don't need to ask the user again
</objective>

<execution_context>
@.opencode/workflows/discuss-phase.md
@.opencode/templates/context.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

The context file is resolved inside the workflow via `init phase-op` and roadmap/state tool calls.
</context>

<process>
1. Validate the phase number (error if missing or not in the roadmap)
2. Check whether CONTEXT.md already exists (if so, offer update/view/skip options)
3. **Analyze the phase** — identify domains and generate phase-specific gray areas
4. **Present the gray areas** — multi-select: which to discuss? (no skip option offered)
5. **Dig into each area** — 4 questions per area, then offer a continue/next option
6. **Write CONTEXT.md** — sections correspond to the discussed areas
7. Suggest next steps (research or planning)

**Key: scope guard**
- Phase boundaries from the roadmap are fixed
- Discussion clarifies how to implement, not whether to add more
- If the user suggests a new feature: "That should be its own phase. I'll note it for later."
- Record deferred ideas — don't drop them, don't act on them

**Domain-aware gray areas:**
Gray areas depend on what's being built. Analyze the phase goal:
- What users see → layout, density, interaction, state
- What users call → responses, errors, auth, versioning
- What users run → output format, flags, modes, error handling
- What users read → structure, tone, depth, flow
- What's being organized → standards, grouping, naming, exceptions

Generate 3-4 **phase-specific** gray areas per phase, not generic categories.

**Exploration depth:**
- Ask 4 questions per area before checking in
- "More questions about [area], or move to the next one?"
- If continuing → ask 4 more, check in again
- Once all areas are done → "Ready to create the context?"

**Don't ask about (Claude handles these itself):**
- Technical implementation
- Architecture choices
- Performance concerns
- Scope expansion
</process>

<success_criteria>
- Gray areas identified through intelligent analysis
- The user chose which areas to discuss
- Each selected area was explored to satisfaction
- Scope creep was redirected into deferred ideas
- CONTEXT.md records decisions, not vague visions
- The user knows what's next
</success_criteria>
