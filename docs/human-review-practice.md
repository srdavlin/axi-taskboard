# Human review practice (`lavish-axi`)

Phase 9 practice writeup: no app code changed here — like `quota-axi` in
phase 8, `lavish-axi` is a supervisor-side tool a firstmate uses when handing
work to a human, not something the taskboard app imports.

## What `lavish-axi` is for, and why reach for it over plain chat

`lavish-axi` turns a rich HTML artifact into a live review surface: the
human can annotate elements or selected text, queue prompts against them, and
send feedback back through `lavish-axi poll`. A supervisor reaches for it
instead of plain chat when the content is a structured decision or report
that benefits from a visual surface — dense records, a plan with tradeoffs,
a diagram of relationships, a comparison of options — the same class of
"complex response easier to understand visually" case this repo's own
system prompt calls out for phase 9.

## Playbooks surveyed

`lavish-axi playbook <id>` covers seven review shapes:

| id | use when |
|---|---|
| `diagram` | Map relationships, flows, state, architecture |
| `table` | Turn dense records into scan-friendly review surfaces |
| `comparison` | Show options, tradeoffs, current vs. target behavior |
| `plan` | Explain a product or technical plan before implementation |
| `code` | Render source, patches, PR diffs, before/after code |
| `input` | Collect structured user feedback (triage, scope, preferences) |
| `slides` | A deliberate presentation, when slides are explicitly requested |

This build's retrospective used **`plan`** (closest fit: "explain a technical
build before/after implementation") as the base structure — goal, phase-by-
phase approach, outcome — combined with `table` for the merged-PR list and
`diagram` for the phase-dependency flow, matching the tool's own guidance
that one artifact often blends several playbooks.

## The real artifact

`.lavish/phase9-build-retrospective.html` — a genuine build retrospective for
axi-taskboard phases 0–9, built only from material already in this repo: the
phase plan in `AGENTS.md`, the merged PR list (`gh-axi pr list`, PRs #6–#14),
and `docs/quota-dispatch.md`/`tests/browser/README.md`. It includes a Mermaid
phase-pipeline diagram, a per-phase timeline (goal, approach, PR, and the
real `no-mistakes` review-loop catches from each PR's commit history), and a
table of the 9 merged PRs. No screenshots, review comments, or outcomes were
fabricated — the "review-loop catches" listed are pulled directly from
`git log` (e.g. the docker-compose localhost-only port fix, the backend
try/catch fix, the k8s livenessProbe fix).

Design system: DaisyUI + Tailwind (Lavish's CDN default), not axi-taskboard's
own Web Awesome frontend — this artifact is a report about the build, not a
mock of the taskboard's own UI, so there was no existing design system to
match per `lavish-axi design`'s routing rule.

## Standing rule: opening ≠ polling

Per the phase 9 brief, an autonomous one-shot crewmate task **opens an
artifact and confirms it renders** — done here via `lavish-axi
.lavish/phase9-build-retrospective.html` followed by a real
`chrome-devtools-axi` pass (snapshot, console check, screenshot) confirming
no errors and a clean render, then `lavish-axi end`. It does **not** run
`lavish-axi poll` — that call blocks waiting for real captain feedback, which
only makes sense in a live supervisor session with a human on the other end.
No review round-trip happened in this practice run, and none should be
implied — soliciting actual feedback on this artifact is a supervisor-level
action for a later session, not something this task blocks on.
