# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Project goal

See `spec/taskboard.spec.md` for the full spec: target architecture, data
access approach, the 10 AXI principles, and the toolset this build stays
inside.

## Phase plan

Phases are dispatched one at a time, in order, each verified before the next
is dispatched. This is a pointer to the arc, not a re-explanation — each
phase's own brief carries its detail.

0. Baseline (this phase): spec correction, phase-plan recorded, environment verified.
1. Data layer: PostgreSQL schema via `pg-axi`.
2. Web Awesome frontend scaffold (wa-card, wa-badge, wa-button, wa-input, wa-dialog, wa-toast; three-column board).
3. Wire frontend to data; decide and implement the real backend shape.
4. Source-control/review workflow via `gh-axi` (branch/PR flow already in use through no-mistakes; call out anything axi-taskboard-specific).
5. Browser testing via `chrome-devtools-axi`.
6. Containerization via `docker-axi`.
7. Kubernetes deployment via `kubernetes-axi`.
8. Quota-aware multi-harness dispatch practice via `quota-axi`.
9. Human review practice via `lavish-axi`.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
