---
name: specops:research-phase
description: Research how to implement a phase (standalone command — usually use /specops:plan-phase instead)
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Task
---

<objective>
Research how to implement a phase. Spawns a specops-phase-researcher agent with phase context.

**Note:** This is a standalone research command. For most workflows, `/specops:plan-phase` integrates research automatically.

**When to use this command:**
- You want to research first, without planning
- You want to re-research after planning is complete
- You need to investigate before deciding whether a phase is feasible

**Orchestrator role:** Parse the phase, validate it against the roadmap, check for existing research, gather context, spawn the research agent, and present results.

**Why a subagent:** Research burns through context quickly (WebSearch, Context7 queries, source verification). The investigation gets a fresh 200k context. The main context stays lean for user interaction.
</objective>

<context>
Phase number: $ARGUMENTS (required)

Normalize the phase input in step 1 before doing any directory lookups.
</context>

<process>

## 0. Initialize context

```bash
INIT=$(node .opencode/bin/specops-tools.cjs init phase-op "$ARGUMENTS")
```

Extract from the init JSON: `phase_dir`, `phase_number`, `phase_name`, `phase_found`, `commit_docs`, `has_research`, `state_path`, `requirements_path`, `context_path`, `research_path`.

Resolve the researcher model:
```bash
RESEARCHER_MODEL=$(node .opencode/bin/specops-tools.cjs resolve-model specops-phase-researcher --raw)
```

## 1. Validate the phase

```bash
PHASE_INFO=$(node .opencode/bin/specops-tools.cjs roadmap get-phase "${phase_number}")
```

**If `found` is false:** report an error and exit. **If `found` is true:** extract `phase_number`, `phase_name`, `goal` from the JSON.

## 2. Check for existing research

```bash
ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null
```

**If it exists:** offer options: 1) update research, 2) view existing, 3) skip. Wait for a response.

**If it doesn't exist:** continue.

## 3. Gather phase context

Use the paths from INIT (don't inline file contents in the orchestrator context):
- `requirements_path`
- `context_path`
- `state_path`

Show a summary including the phase description and the files the researcher will load.

## 4. Spawn the specops-phase-researcher agent

Research modes: ecosystem (default), feasibility, implementation, comparison.

```markdown
<research_type>
Phase Research — investigating HOW to implement a specific phase well.
</research_type>

<key_insight>
The question is NOT "which library should I use?"

The question is: "What do I not know that I don't know?"

For this phase, discover:
- What's the established architecture pattern?
- What libraries form the standard stack?
- What problems do people commonly hit?
- What's SOTA vs what Claude's training thinks is SOTA?
- What should NOT be hand-rolled?
</key_insight>

<objective>
Research implementation approach for Phase {phase_number}: {phase_name}
Mode: ecosystem
</objective>

<files_to_read>
- {requirements_path} (Requirements)
- {context_path} (Phase context from discuss-phase, if exists)
- {state_path} (Prior project decisions and blockers)
</files_to_read>

<additional_context>
**Phase description:** {phase_description}
</additional_context>

<downstream_consumer>
Your RESEARCH.md will be loaded by `/specops:plan-phase` which uses specific sections:
- `## Standard Stack` → Plans use these libraries
- `## Architecture Patterns` → Task structure follows these
- `## Don't Hand-Roll` → Tasks NEVER build custom solutions for listed problems
- `## Common Pitfalls` → Verification steps check for these
- `## Code Examples` → Task actions reference these patterns

Be prescriptive, not exploratory. "Use X" not "Consider X or Y."
</downstream_consumer>

<quality_gate>
Before declaring complete, verify:
- [ ] All domains investigated (not just some)
- [ ] Negative claims verified with official docs
- [ ] Multiple sources for critical claims
- [ ] Confidence levels assigned honestly
- [ ] Section names match what plan-phase expects
</quality_gate>

<output>
Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
</output>
```

```
Task(
  prompt="First, read ~/.claude/agents/specops-phase-researcher.md for your role and instructions.\n\n" + filled_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Research Phase {phase}"
)
```

## 5. Handle the agent's response

**`## RESEARCH COMPLETE`:** show a summary, offer options: plan the phase, dig deeper, view full content, done.

**`## CHECKPOINT REACHED`:** present it to the user, get a response, spawn a follow-up agent.

**`## RESEARCH INCONCLUSIVE`:** show what was attempted, offer options: add context, try a different mode, do it manually.

## 6. Spawn a follow-up agent

```markdown
<objective>
Continue research for Phase {phase_number}: {phase_name}
</objective>

<prior_state>
<files_to_read>
- .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md (Existing research)
</files_to_read>
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>
```

```
Task(
  prompt="First, read ~/.claude/agents/specops-phase-researcher.md for your role and instructions.\n\n" + continuation_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Continue research Phase {phase}"
)
```

</process>

<success_criteria>
- [ ] Phase validated against the roadmap
- [ ] Existing research checked
- [ ] specops-phase-researcher spawned with context
- [ ] Checkpoints handled correctly
- [ ] User knows the next steps
</success_criteria>
