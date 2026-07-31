# Task Board Spec

## Overview
axi-taskboard's real target is a full web-based scheduling application: a Web
Awesome frontend, a PostgreSQL backend, and a Kubernetes deployment. The Task
Board data model and UI described below is phase one of that arc, not the
final shape of the project — later phases extend the data model and add
scheduling features on top of this foundation.

There is no bespoke `task-axi` CLI. Data access goes through `pg-axi` directly,
or through a thin backend service if the frontend needs one beyond what
`pg-axi` can serve directly. Building an AXI-compliant CLI is not a goal of
this project — AXI compliance is demonstrated by the toolset the build uses
(see below), not by a tool the project authors.

## Data Model
- tasks: id (serial), title (varchar 255), body (text), status (open|in_progress|done),
  priority (0-3), created_at (timestamptz), updated_at (timestamptz)

## Data Access
- Reads and writes go through `pg-axi` against the PostgreSQL backend.
- If the frontend needs behavior `pg-axi` cannot provide directly (e.g.
  request-shaping, auth, real-time push), a thin backend service may sit
  between the frontend and `pg-axi` — added only when actually needed, not
  as a foregone conclusion.

## Frontend
- Web Awesome components: wa-card, wa-badge, wa-button, wa-input, wa-dialog, wa-toast
- Three-column board: Open | In Progress | Done
- Real-time refresh after mutations

## AXI Principles
This project demonstrates the 10 AXI principles through its own tooling
choices (which agent-facing CLIs it uses and how), not through a bespoke CLI
built for the purpose:

1. Token-efficient output
2. Minimal default schemas
3. Content truncation
4. Pre-computed aggregates
5. Definitive empty states
6. Structured errors & exit codes
7. Ambient context
8. Content first
9. Contextual disclosure
10. Consistent way to get help

(Source of truth: `principles.yaml` / `.agents/skills/axi/SKILL.md` in
kunchenguid/axi.)

## Toolset
This build stays inside the AXI tool ecosystem:

- The 4 official AXI tools: `gh-axi` (GitHub operations), `chrome-devtools-axi`
  (browser automation/testing), `lavish-axi` (human review surfaces),
  `quota-axi` (harness/model quota awareness).
- Community tools relevant to this project's phases: `pg-axi` (PostgreSQL data
  access, from the data-layer phase onward), `docker-axi` (containerization,
  once that phase starts), `kubernetes-axi` (deployment, from the Kubernetes
  phase onward).

No custom AXI-compliant CLI is built as a goal in itself.
