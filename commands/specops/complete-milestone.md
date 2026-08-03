---
type: prompt
name: specops:complete-milestone
description: Archive a completed milestone and prepare for the next version
argument-hint: <version>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Mark milestone {{version}} as complete, archive it to milestones/, and update ROADMAP.md and REQUIREMENTS.md.

Purpose: create a historical record of released versions, archive the milestone artifacts (roadmap + requirements), and prepare for the next milestone.
Output: milestone archived (roadmap + requirements), PROJECT.md evolved, git tagged.
</objective>

<execution_context>
**Load these files immediately (before proceeding):**

- @.opencode/workflows/complete-milestone.md (primary workflow)
- @.opencode/templates/milestone-archive.md (archive template)
  </execution_context>

<context>
**Project files:**
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/PROJECT.md`

**User input:**

- Version: {{version}} (e.g. "1.0", "1.1", "2.0")
  </context>

<process>

**Follow the complete-milestone.md workflow:**

0. **Check the audit:**

   - Look for `.planning/v{{version}}-MILESTONE-AUDIT.md`
   - If missing or stale: suggest running `/specops:audit-milestone` first
   - If audit status is `gaps_found`: suggest running `/specops:plan-milestone-gaps` first
   - If audit status is `passed`: proceed to step 1

   ```markdown
   ## Pre-flight Check

   {If no v{{version}}-MILESTONE-AUDIT.md:}
   ⚠ No milestone audit found. Run `/specops:audit-milestone` first to verify
   requirements coverage, cross-phase integration, and E2E flows.

   {If audit has gaps:}
   ⚠ Milestone audit found gaps. Run `/specops:plan-milestone-gaps` to create
   phases that close the gaps, or proceed anyway to accept as tech debt.

   {If audit passed:}
   ✓ Milestone audit passed. Proceeding with completion.
   ```

1. **Verify readiness:**

   - Check that every phase in the milestone has a completed plan (SUMMARY.md exists)
   - Show the milestone scope and stats
   - Wait for confirmation

2. **Gather stats:**

   - Count phases, plans, and tasks
   - Compute the git range, file changes, and lines of code
   - Extract the timeline from git log
   - Show the summary, confirm

3. **Extract achievements:**

   - Read the SUMMARY.md files for all phases in the milestone scope
   - Extract 4-6 key achievements
   - Submit for approval

4. **Archive the milestone:**

   - Create `.planning/milestones/v{{version}}-ROADMAP.md`
   - Extract full phase details from ROADMAP.md
   - Populate the milestone-archive.md template
   - Update ROADMAP.md to a single-line linked summary

5. **Archive the requirements:**

   - Create `.planning/milestones/v{{version}}-REQUIREMENTS.md`
   - Mark all v1 requirements as complete (checkboxes checked)
   - Record requirement outcomes (verified, adjusted, dropped)
   - Delete `.planning/REQUIREMENTS.md` (create a fresh one for the next milestone)

6. **Update PROJECT.md:**

   - Add a "Current Status" section including the released version
   - Add a "Next Milestone Goal" section
   - Archive prior content into `<details>` (if this is v1.1+)

7. **Commit and tag:**

   - Stage: MILESTONES.md, PROJECT.md, ROADMAP.md, STATE.md, archive files
   - Commit: `chore: archive v{{version}} milestone`
   - Tag: `git tag -a v{{version}} -m "[milestone summary]"`
   - Ask whether to push the tag

8. **Provide next steps:**
   - `/specops:new-milestone` — start the next milestone (questions → research → requirements → roadmap)

</process>

<success_criteria>

- Milestone archived to `.planning/milestones/v{{version}}-ROADMAP.md`
- Requirements archived to `.planning/milestones/v{{version}}-REQUIREMENTS.md`
- `.planning/REQUIREMENTS.md` deleted (ready for a fresh one for the next milestone)
- ROADMAP.md collapsed to a single-line entry
- PROJECT.md updated with current status
- Git tag v{{version}} created
- Commit succeeded
- User knows the next steps (including that new requirements need to be defined)
  </success_criteria>

<critical_rules>

- **Load the workflow first:** read complete-milestone.md before executing
- **Verify completeness:** every phase must have a SUMMARY.md file
- **User confirmation:** wait for approval at verification gates
- **Archive before deleting:** always create archive files before updating/deleting the originals
- **Single-line summary:** collapsed milestones in ROADMAP.md should be a single linked line
- **Context efficiency:** archiving keeps ROADMAP.md and REQUIREMENTS.md a constant size per milestone
- **New requirements:** the next milestone starts from `/specops:new-milestone`, which includes requirements definition
  </critical_rules>
