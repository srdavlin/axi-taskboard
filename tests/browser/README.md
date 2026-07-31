# Browser tests

`golden-path.sh` drives the live app end-to-end through `chrome-devtools-axi`
(create → move open→in_progress→done → edit title/body/priority → delete),
verifying every mutation against `/api/tasks` (not just optimistic UI state),
plus two edge cases: the empty-title client-side validation, and the
`wa-toast`-unavailable-on-free-CDN fallback banner noted in AGENTS.md.

## Prerequisites

The app stack must already be running — `docker compose up -d` now brings up
both Postgres and the backend (see AGENTS.md "Containerization"); see
AGENTS.md "Backend service" for the alternative of running the backend
directly on the host instead.

The script also requires the board to be empty (`curl localhost:3001/api/tasks`
returns `[]`) — it refuses to run otherwise, since it asserts on task counts.

## Run it

```
bash tests/browser/golden-path.sh
```

No system Chrome install is required: if `CHROME_DEBUG_PORT` (default 9223)
isn't already serving a Chrome remote-debugging endpoint, the script downloads
a headless Chrome via `@puppeteer/browsers` into `CHROME_CACHE_DIR` (default
`/tmp/axi-taskboard-browser-tests/chrome-cache`), launches it, and tears it
down on exit. Point `CHROME_DEBUG_PORT` at an already-running Chrome (e.g. one
you started for interactive debugging) to reuse it instead.

## Sharp edges (discovered writing this script)

- `chrome-devtools-axi click/fill` refs must be passed as `@g<gen>:<id>`
  (the `@`-prefixed form shown in the CLI's own follow-up hints), not the
  bare `uid=g<gen>:<id>` text a snapshot line starts with — passing the bare
  form silently no-ops instead of erroring.
- Web Awesome custom elements (`wa-button`, etc.) upgrade asynchronously
  after navigation or a DOM mutation; a snapshot taken immediately after
  `open` can still show them as plain `StaticText` rather than their real
  `button` role. The script's `settle` helper (`wait 400`) covers this —
  don't remove it without re-verifying against a slower CI runner.
- The frontend has no UI control for `priority` (create/edit dialogs only
  expose title/body — see `frontend/app.js`), so that check goes through
  `PATCH /api/tasks/:id` directly and confirms the badge on reload.
