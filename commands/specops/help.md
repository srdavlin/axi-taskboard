---
name: specops:help
description: Show available SpecOps commands and usage guidance
---
<objective>
Display the full SpecOps command reference.

Output only the reference content below. Do not add:
- Project-specific analysis
- Git status or file context
- Suggested next steps
- Any commentary beyond the reference itself
</objective>

<execution_context>
@.opencode/workflows/help.md
</execution_context>

<process>
Output the full SpecOps command reference from @.opencode/workflows/help.md.
Display the reference content directly — no additions or modifications.
</process>
