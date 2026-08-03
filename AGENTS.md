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
1. Data layer (done): PostgreSQL schema via `pg-axi`. See "Local dev database" below.
   Schema is `sql/schema.sql` (single `tasks` table, matches spec's data model).
   Future phases: no boards/columns table exists yet — status is a `tasks.status`
   check constraint, not a separate entity — add one only if the spec grows to need it.
2. Web Awesome frontend scaffold (done): three-column static/mock board at
   `frontend/index.html` (+ `app.js`, `styles.css`) — no backend wiring yet.
   Web Awesome is brought in via CDN only (no bundler/npm package): see
   `frontend/index.html` `<head>` for the `webawesome@3.10.0` `default.css` +
   `webawesome.loader.js` tags (autoloads components on demand). `wa-toast` is
   a Web Awesome Pro-only component and 404s on the free CDN — `app.js`'s
   `notify()` detects this (`customElements.get('wa-toast')`) and falls back to
   a `wa-callout` banner; keep that fallback if `wa-toast` stays unlicensed.
   Sharp edge: `wa-card`'s header/footer parts only auto-show for content in the
   plain `header`/`footer` slots, not `header-actions`/`footer-actions` alone —
   force them visible via `::part(header)`/`::part(footer)` CSS (see `styles.css`)
   rather than the `with-header`/`with-footer` attributes, which the component
   overwrites on its own detection.
3. Wire frontend to data (done): thin Node backend at `backend/server.js` — no
   framework, just `node:http` + the `pg` client (see "Backend service" below).
   `frontend/app.js` now calls `/api/tasks` instead of using mock data;
   `moveTask`/`saveTask`/`deleteTask` all refetch-and-rerender after mutating.
4. Source-control/review workflow via `gh-axi` (done): documented the
   branch/PR conventions already in use — see "Source control & review" below.
5. Browser testing via `chrome-devtools-axi` (done): repeatable golden-path +
   edge-case coverage at `tests/browser/golden-path.sh` — see "Browser
   testing" below and `tests/browser/README.md`.
6. Containerization via `docker-axi` (done): `backend/Dockerfile` +
   `docker-compose.yml`'s `backend` service — see "Containerization" below.
7. Kubernetes deployment via `kubernetes-axi` (done): plain YAML manifests
   under `k8s/` deploy backend + Postgres to a local `kind` cluster — see
   "Kubernetes deployment" below.
8. Quota-aware multi-harness dispatch practice via `quota-axi` (done): no
   app-code deliverable — see "Quota-aware dispatch" below and
   `docs/quota-dispatch.md`.
9. Human review practice via `lavish-axi` (done): no app-code deliverable —
   see "Human review practice" below and `docs/human-review-practice.md`.
   This is the last phase in the plan — the guided build's phase plan is
   complete.

## Local dev database

Dev Postgres runs via `docker-compose.yml` at the repo root: `docker compose up -d`
(container `axi-taskboard-postgres`, credentials are dev-only, defined in that file —
never reuse them anywhere real). Point `pg-axi` at it with `DATABASE_URL`, e.g.
`postgresql://axitaskboard:axitaskboard-dev-only@localhost:5432/axitaskboard`
(matches the compose file's `POSTGRES_USER`/`PASSWORD`/`DB`).

Schema is applied via `pg-axi query --file sql/schema.sql --execute` (`sql/schema.sql`
is the checked-in source of truth; `pg-axi` is not a migration tool, so re-run this
file by hand — it's idempotent — after any schema change instead of expecting
version tracking).

## Backend service

`backend/server.js` is the thin HTTP service between the static frontend and
Postgres (spec: browsers can't reach Postgres directly, and the frontend has
no build step). It's a single file — `node:http` + the `pg` client, no
framework/ORM — serving both `frontend/` as static files and a JSON API under
`/api/tasks` (GET/POST/PATCH/DELETE, PATCH accepts any of
title/body/status/priority) on one origin, so there's no CORS to configure.
`pg-axi` remains the agent-facing tool for schema/admin work (phase 1); the
backend uses a normal `pg` Pool for its own request path — see the phase 3
brief for why those don't conflict.

Run locally (after `docker compose up -d`, schema already applied — see
"Local dev database" above):

```
cd backend && npm install   # first time only
DATABASE_URL=postgresql://axitaskboard:axitaskboard-dev-only@localhost:5432/axitaskboard \
  node server.js
```

Then open `http://localhost:3001/`. `PORT` and `DATABASE_URL` are both
overridable env vars (see top of `server.js` for defaults).

## Source control & review

Branch/PR flow via `gh-axi` has been in continuous use since phase 0 (PRs
#6-#9); this section makes the convention explicit rather than leaving it
implicit in habit.

- **Branch naming**: `fm/<task-id>`, one branch per phase/task.
- **PR body**: `.github/pull_request_template.md` captures the Intent/
  Verification structure already used organically in PRs #6-#9 — what the
  change does and why, then how it was confirmed to work.
- **Review/merge gate**: this repo has no CI configured (tracked separately
  by issue #5, out of scope until that phase is dispatched). Until then, the
  actual gate is a captain's manual PR review and merge — there is no
  automated check blocking a bad merge, so treat manual review as load-
  bearing, not a formality.

## Browser testing

`tests/browser/golden-path.sh` drives the live app end-to-end through
`chrome-devtools-axi` (create/move/edit/delete plus two edge cases) and
asserts every mutation against `/api/tasks`, not just DOM/optimistic state.
See `tests/browser/README.md` for prerequisites and how to run it — it needs
the stack already up (see "Local dev database" / "Backend service" above)
and an empty board, and it downloads/launches its own headless Chrome if none
is already listening on its debug port, so it needs no system Chrome install.

## Containerization

The whole app (backend + Postgres) now starts with one command:
`docker compose up -d` (or `docker-axi apply --target compose:docker-compose.yml
--environment local-dev --execute`, the `docker-axi`-guarded equivalent).
`backend/Dockerfile` builds the `backend` compose service from a `node:24-alpine`
base with build context set to the repo root (`context: .` in
`docker-compose.yml`, since the image needs both `backend/` and `frontend/`);
it runs the exact same `node server.js` entrypoint as local dev, just inside
the container. The `backend` service's `DATABASE_URL` points at the `postgres`
service by compose network name (not `localhost`) and `depends_on` gates
startup on Postgres's healthcheck. Same host port as before (`3001`) — open
`http://localhost:3001/` after `up`. The Postgres volume
(`axi-taskboard-pgdata`) already persisted across restarts before this phase;
now verified to also persist across the backend container being rebuilt/
recreated alongside it. `tests/browser/golden-path.sh` runs unchanged against
this containerized stack (same port, same empty-board precondition — see
"Browser testing" above).

## Kubernetes deployment

Plain YAML manifests under `k8s/` (no Kustomize/Helm — the app is simple
enough that `kubernetes-axi discover`/`recommend --goal local-dev` pointed at
a manifests dir as the right fit) deploy backend + Postgres to a local `kind`
cluster, mirroring `docker-compose.yml`'s topology: `k8s/postgres.yaml`
(PVC + StatefulSet + Service, dev-only creds from `k8s/postgres-secret.yaml`
rather than plaintext env), `k8s/backend.yaml` (Deployment + Service, image
`axi-taskboard-backend:local` with `imagePullPolicy: Never` since it's loaded
into the node directly, not pulled from a registry).

Cold start against the existing `kind-kind-cluster` context:

```
docker build -t axi-taskboard-backend:local -f backend/Dockerfile .
kind load docker-image axi-taskboard-backend:local --name kind-cluster
kubernetes-axi apply --target manifests-dir:k8s --environment local-dev --execute
```

Schema is not baked into the Postgres image (same posture as local dev/
compose — see "Local dev database" above): after the postgres pod is Ready,
apply it once via `kubectl cp sql/schema.sql axi-taskboard-postgres-0:/tmp/schema.sql`
then `kubernetes-axi exec --pod axi-taskboard-postgres-0 --cmd psql -U axitaskboard
-d axitaskboard -f /tmp/schema.sql --execute`. The backend pod will
crashloop with `relation "tasks" does not exist` until this runs — expected,
not a bug.

Reach the app via `kubernetes-axi port-forward --resource svc/axi-taskboard-backend
--ports <local>:3001 --timeout <n> --execute` (bounded/non-interactive — pick
a `--timeout` covering how long you need it, e.g. 600s for a full browser-test
run), then open `http://localhost:<local>/`. Note the compose stack (see
"Containerization") also binds host `3001`/`5432` — use a different local
port (e.g. `3101`) if it's running alongside the cluster.

Verified: `tests/browser/golden-path.sh` passes unchanged against the
cluster-hosted app with `BASE_URL` pointed at the port-forward (same
empty-board precondition as always). Data survives a Postgres pod
delete/recreate (`kubernetes-axi delete --kind pod --name
axi-taskboard-postgres-0 --confirm axi-taskboard-postgres-0 --execute`) —
the StatefulSet's PVC is what makes that durable, same role the
`axi-taskboard-pgdata` compose volume plays locally.

## Quota-aware dispatch

`quota-axi` reports per-provider quota windows (Claude, Codex, Cursor,
Copilot, Grok, Kimi) so a multi-harness supervisor can route to whichever
candidate has real headroom instead of guessing — see
`docs/quota-dispatch.md` for what each field means, this build's verified
crewmate harness set against what `quota-axi` can report on, and a worked
example from this session's real output.

## Human review practice

`lavish-axi` turns an HTML artifact into a live human review surface
(annotate, queue prompts, `lavish-axi poll` for feedback) — see
`docs/human-review-practice.md` for the playbook survey, the real build
retrospective at `.lavish/phase9-build-retrospective.html`, and the standing
rule that a one-shot crewmate opens/confirms an artifact but never blocks on
`poll` (that's a supervisor-level action).

## Sharp edges

- `pg-axi`'s own client-facing commands (`psql`, `pg_dump`, `pg_isready`, etc.) need
  libpq client tools on PATH; this host didn't have them preinstalled but they were
  available via `brew install libpq` (linuxbrew, keg-only — add
  `/home/linuxbrew/.linuxbrew/opt/libpq/bin` to PATH to use them). If a fresh machine
  lacks both brew and these tools, `pg-axi doctor` will surface exactly what's missing.
- This host has no system Chrome (`chrome-devtools-axi open` fails looking for
  `/opt/google/chrome/chrome`), so `chrome-devtools-axi` needs
  `CHROME_DEVTOOLS_AXI_BROWSER_URL` pointed at a Chrome you launch yourself
  (see `tests/browser/README.md` for the `@puppeteer/browsers` + headless
  launch pattern). Two more sharp edges hit writing that script: pass refs to
  `click`/`fill` as `@g<gen>:<id>` (not the bare `uid=g<gen>:<id>` a snapshot
  line shows), and Web Awesome custom elements upgrade asynchronously so a
  snapshot taken immediately after navigation/mutation needs a short wait
  before its `button`/`textbox` roles are reliable.
- `commands/specops/*.md` was translated by hand from Chinese to English
  (this repo's first commit picked it up verbatim via `npx specops`, an
  npm package that ships Chinese-only command templates — no English
  variant, no locale flag). This is unrelated to the English-language
  `specops` *skill* (`JarvusInnovations/specops` on GitHub, tracked in
  `skills-lock.json`), which is fine as-is. Re-running the npm package's
  init/update against this repo will silently reintroduce Chinese content —
  if that happens, translate again by hand; there's no flag that fixes it.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
