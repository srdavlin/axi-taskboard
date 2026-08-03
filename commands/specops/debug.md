---
name: specops:debug
description: Systematic debugging with persistent state across context resets
argument-hint: [issue description]
allowed-tools:
  - Read
  - Bash
  - Task
  - AskUserQuestion
---

<objective>
Debug an issue using the scientific method and subagent isolation.

**Orchestrator role:** Gather symptoms, spawn the specops-debugger agent, handle checkpoints, spawn follow-up agents.

**Why subagents:** Investigation burns through context quickly (reading files, forming hypotheses, testing). Each investigation gets a fresh 200k context. The main context stays lean for user interaction.
</objective>

<context>
User's issue: $ARGUMENTS

Check for active sessions:
```bash
ls .planning/debug/*.md 2>/dev/null | grep -v resolved | head -5
```
</context>

<process>

## 0. Initialize context

```bash
INIT=$(node .opencode/bin/specops-tools.cjs state load)
```

Extract `commit_docs` from the init JSON. Resolve the debugger model:
```bash
DEBUGGER_MODEL=$(node .opencode/bin/specops-tools.cjs resolve-model specops-debugger --raw)
```

## 1. Check for active sessions

If an active session exists and there is no $ARGUMENTS:
- List sessions with status, hypotheses, and next steps
- Let the user pick a number to resume, or describe a new issue

If $ARGUMENTS was provided or the user described a new issue:
- Continue to symptom gathering

## 2. Gather symptoms (if a new issue)

Use AskUserQuestion to ask one at a time:

1. **Expected behavior** - What should happen?
2. **Actual behavior** - What actually happens?
3. **Error messages** - Are there any errors? (paste or describe)
4. **Timeline** - When did it start? Did it work before?
5. **Reproduction** - How do you trigger it?

Once all are gathered, confirm ready to start investigating.

## 3. Spawn the specops-debugger agent

Fill in the prompt and spawn:

```markdown
<objective>
Investigate issue: {slug}

**Summary:** {trigger}
</objective>

<symptoms>
expected: {expected}
actual: {actual}
errors: {errors}
reproduction: {reproduction}
timeline: {timeline}
</symptoms>

<mode>
symptoms_prefilled: true
goal: find_and_fix
</mode>

<debug_file>
Create: .planning/debug/{slug}.md
</debug_file>
```

```
Task(
  prompt=filled_prompt,
  subagent_type="specops-debugger",
  model="{debugger_model}",
  description="Debug {slug}"
)
```

## 4. Handle the agent's return

**If `## ROOT CAUSE FOUND`:**
- Show the root cause and a summary of the evidence
- Offer options:
  - "Fix now" - spawn a fix subagent
  - "Plan the fix" - suggest /specops:plan-phase --gaps
  - "Fix manually" - done

**If `## CHECKPOINT REACHED`:**
- Show the user the checkpoint details
- Get the user's response
- If the checkpoint type is `human-verify`:
  - If the user confirms it's fixed: let the agent proceed to complete/resolve/archive
  - If the user reports a problem: let the agent go back to investigating/fixing
- Spawn a follow-up agent (see step 5)

**If `## INVESTIGATION INCONCLUSIVE`:**
- Show what was checked and ruled out
- Offer options:
  - "Keep investigating" - spawn a new agent with additional context
  - "Investigate manually" - done
  - "Add more context" - gather more symptoms, spawn again

## 5. Spawn a follow-up agent (after a checkpoint)

When the user responds to a checkpoint, spawn a new agent:

```markdown
<objective>
Continue debugging {slug}. Evidence is in the debug file.
</objective>

<prior_state>
<files_to_read>
- .planning/debug/{slug}.md (Debug session state)
</files_to_read>
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>

<mode>
goal: find_and_fix
</mode>
```

```
Task(
  prompt=continuation_prompt,
  subagent_type="specops-debugger",
  model="{debugger_model}",
  description="Continue debug {slug}"
)
```

</process>

<success_criteria>
- [ ] Checked for active sessions
- [ ] Gathered symptoms (if a new issue)
- [ ] Spawned specops-debugger with context
- [ ] Handled checkpoints correctly
- [ ] Confirmed root cause before fixing
</success_criteria>
