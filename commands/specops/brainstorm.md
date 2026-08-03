# specops:brainstorm

> Brainstorm: explore user intent, requirements, and design before doing any creative work

## Trigger conditions

When the user wants to:
- Create a new feature
- Build a new component
- Add new functionality
- Modify existing behavior

## Execution flow

1. **Explore project context** — check files, docs, recent commits
2. **Ask clarifying questions** — one at a time, to understand purpose/constraints/success criteria
3. **Propose 2-3 approaches** — including trade-offs and your recommended option
4. **Present the design** — sections scaled to complexity, getting user approval after each section
5. **Write the design doc** — save to `docs/plans/YYYY-MM-DD-<topic>-design.md` and commit
6. **Transition to implementation** — invoke the writing-plans skill to create an implementation plan

## Constraints

<HARD-GATE>
Do not invoke any implementation skill, write any code, scaffold any project, or take any implementation action until the design has been presented and approved by the user. This applies to every project, regardless of complexity.
</HARD-GATE>

## Usage examples

```
/specops:brainstorm design a user login feature
/specops:brainstorm build a real-time chat component
/specops:brainstorm implement a payment flow
```

## Output

- Design doc: `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Implementation plan: created via the writing-plans skill
