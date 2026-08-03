---
name: specops:add-tests
description: Generate tests for a completed phase based on UAT criteria and the implementation
argument-hint: "<phase> [additional instructions]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
argument-instructions: |
  Parse the argument as a phase number (integer, decimal, or letter suffix), plus optional free-text instructions.
  Example: /specops:add-tests 12
  Example: /specops:add-tests 12 focus on edge cases in the pricing module
---
<objective>
Generate unit tests and E2E tests for a completed phase, using its SUMMARY.md, CONTEXT.md, and VERIFICATION.md as the spec.

Analyze the implementation files, classify them into TDD (unit tests), E2E (browser tests), or Skip categories, show the user the test plan for approval, then generate tests following the RED-GREEN convention.

Output: test files committed with the message `test(phase-{N}): add unit and E2E tests from add-tests command`
</objective>

<execution_context>
@.opencode/workflows/add-tests.md
</execution_context>

<context>
Phase: $ARGUMENTS

@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>
Execute the add-tests workflow in @.opencode/workflows/add-tests.md end to end.
Preserve all workflow gates (classification approval, test plan approval, RED-GREEN verification, gap reporting).
</process>
