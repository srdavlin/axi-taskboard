#!/usr/bin/env bash
# Repeatable browser coverage for the taskboard golden path, driven through
# chrome-devtools-axi. See tests/browser/README.md for prerequisites and how
# to run this.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
API_URL="$BASE_URL/api/tasks"
CHROME_CACHE_DIR="${CHROME_CACHE_DIR:-/tmp/axi-taskboard-browser-tests/chrome-cache}"
CHROME_PROFILE_DIR="${CHROME_PROFILE_DIR:-/tmp/axi-taskboard-browser-tests/chrome-profile}"
DEBUG_PORT="${CHROME_DEBUG_PORT:-9223}"

LAUNCHED_CHROME_PID=""
FAILURES=0

log() { printf '[golden-path] %s\n' "$1"; }
fail() { printf '[golden-path] FAIL: %s\n' "$1" >&2; FAILURES=$((FAILURES + 1)); }
assert_eq() {
  local desc="$1" expected="$2" actual="$3"
  if [[ "$expected" != "$actual" ]]; then
    fail "$desc — expected '$expected', got '$actual'"
  else
    log "ok: $desc"
  fi
}

cda() {
  CHROME_DEVTOOLS_AXI_BROWSER_URL="http://127.0.0.1:${DEBUG_PORT}" npx -y chrome-devtools-axi "$@"
}

# Pull the uid= ref for the first snapshot line matching a pattern, e.g.
# `uid_for 'button "+ New Task"'`. Snapshot refs are per-session/per-generation,
# so they must always be read fresh rather than hardcoded.
uid_for() {
  local pattern="$1"
  cda snapshot 2>&1 | grep -F "$pattern" | head -1 | grep -oP 'uid=\K\S+' | sed 's/^/@/'
}

# Web Awesome custom elements (wa-button, etc.) upgrade asynchronously after
# navigation/render — a snapshot taken immediately after `open` or a DOM
# mutation can still show them as plain StaticText rather than their real
# role, which breaks uid_for lookups. Give them a beat to upgrade.
settle() { cda wait 400 >/dev/null; }

cleanup() {
  if [[ -n "$LAUNCHED_CHROME_PID" ]]; then
    kill "$LAUNCHED_CHROME_PID" 2>/dev/null || true
  fi
  cda stop >/dev/null 2>&1 || true
}
trap cleanup EXIT

ensure_chrome() {
  if curl -fs "http://127.0.0.1:${DEBUG_PORT}/json/version" >/dev/null 2>&1; then
    log "reusing chrome already listening on :${DEBUG_PORT}"
    return
  fi
  mkdir -p "$CHROME_CACHE_DIR" "$CHROME_PROFILE_DIR"
  local chrome_bin
  chrome_bin=$(find "$CHROME_CACHE_DIR" -maxdepth 4 -type f -name chrome -path '*chrome-linux64*' 2>/dev/null | head -1)
  if [[ -z "$chrome_bin" ]]; then
    log "no cached Chrome found — downloading via @puppeteer/browsers"
    (cd "$CHROME_CACHE_DIR" && npx -y @puppeteer/browsers install chrome@stable >/dev/null 2>&1)
    chrome_bin=$(find "$CHROME_CACHE_DIR" -maxdepth 4 -type f -name chrome -path '*chrome-linux64*' 2>/dev/null | head -1)
  fi
  [[ -n "$chrome_bin" ]] || { echo "could not obtain a Chrome executable" >&2; exit 1; }

  "$chrome_bin" --headless=new --remote-debugging-port="$DEBUG_PORT" \
    --remote-debugging-address=127.0.0.1 --no-sandbox --disable-gpu \
    --user-data-dir="$CHROME_PROFILE_DIR" >/tmp/axi-taskboard-browser-tests/chrome.log 2>&1 &
  LAUNCHED_CHROME_PID=$!
  for _ in $(seq 1 20); do
    curl -fs "http://127.0.0.1:${DEBUG_PORT}/json/version" >/dev/null 2>&1 && return
    sleep 0.5
  done
  echo "Chrome did not come up on :${DEBUG_PORT}" >&2
  exit 1
}

require_empty_board() {
  local count
  count=$(curl -fs "$API_URL" | python3 -c 'import json,sys;print(len(json.load(sys.stdin)))')
  if [[ "$count" != "0" ]]; then
    echo "refusing to run: $API_URL already has $count task(s) — clear the board first" >&2
    exit 1
  fi
}

main() {
  mkdir -p /tmp/axi-taskboard-browser-tests
  require_empty_board
  ensure_chrome
  cda stop >/dev/null 2>&1 || true
  cda start >/dev/null

  log "== create task =="
  cda open "$BASE_URL/" >/dev/null
  settle
  cda click "$(uid_for 'button "+ New Task"')" >/dev/null
  cda fill "$(uid_for 'textbox "Title *"')" "Golden path task" >/dev/null
  cda fill "$(uid_for 'textbox "Description"')" "Created by golden-path.sh" >/dev/null
  cda click "$(uid_for 'button "Save"')" >/dev/null
  cda wait 500 >/dev/null

  local task_json id
  task_json=$(curl -fs "$API_URL")
  assert_eq "one task persisted after create" "1" "$(echo "$task_json" | python3 -c 'import json,sys;print(len(json.load(sys.stdin)))')"
  id=$(echo "$task_json" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["id"])')
  assert_eq "created task title persisted" "Golden path task" "$(curl -fs "$API_URL/$id" 2>/dev/null | python3 -c 'import json,sys;print(json.load(sys.stdin)["title"])' 2>/dev/null || echo "$task_json" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["title"])')"
  assert_eq "created task starts open" "open" "$(echo "$task_json" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["status"])')"

  log "== move open -> in_progress =="
  cda click "$(uid_for 'button "In Progress ')" >/dev/null
  cda wait 300 >/dev/null
  assert_eq "status moved to in_progress" "in_progress" "$(curl -fs "$API_URL" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["status"])')"

  log "== edit title/body =="
  cda click "$(uid_for 'button "Edit"')" >/dev/null
  cda fill "$(uid_for 'textbox "Title *"')" "Golden path task (edited)" >/dev/null
  cda click "$(uid_for 'button "Save"')" >/dev/null
  cda wait 500 >/dev/null
  assert_eq "title edit persisted" "Golden path task (edited)" "$(curl -fs "$API_URL" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["title"])')"

  log "== edit priority (API-only, no UI control per spec) =="
  curl -fs -X PATCH "$API_URL/$id" -H 'Content-Type: application/json' -d '{"priority":2}' >/dev/null
  cda open "$BASE_URL/" >/dev/null
  settle
  assert_eq "priority badge reflects High after reload" "1" "$(cda snapshot 2>&1 | grep -c 'StaticText "High"')"

  log "== move in_progress -> done =="
  cda click "$(uid_for 'button "Done ')" >/dev/null
  cda wait 300 >/dev/null
  assert_eq "status moved to done" "done" "$(curl -fs "$API_URL" | python3 -c 'import json,sys;print(json.load(sys.stdin)[0]["status"])')"

  log "== delete task =="
  cda click "$(uid_for 'button "Delete"')" >/dev/null
  cda wait 300 >/dev/null
  assert_eq "no tasks remain after delete" "0" "$(curl -fs "$API_URL" | python3 -c 'import json,sys;print(len(json.load(sys.stdin)))')"

  log "== edge case: empty title is rejected client-side =="
  cda click "$(uid_for 'button "+ New Task"')" >/dev/null
  cda click "$(uid_for 'button "Save"')" >/dev/null
  assert_eq "no task created from empty submission" "0" "$(curl -fs "$API_URL" | python3 -c 'import json,sys;print(len(json.load(sys.stdin)))')"
  assert_eq "validation message shown via fallback banner" '"\"Title is required\""' "$(cda eval "() => document.getElementById('callout-fallback').textContent" 2>&1 | grep -oP 'result: \K.*')"

  log "== edge case: wa-toast unavailable, callout fallback active =="
  assert_eq "wa-toast custom element is not defined on the free CDN" '"false"' "$(cda eval "() => !!customElements.get('wa-toast')" 2>&1 | grep -oP 'result: \K.*')"

  if [[ "$FAILURES" -eq 0 ]]; then
    log "ALL CHECKS PASSED"
    exit 0
  else
    log "$FAILURES CHECK(S) FAILED"
    exit 1
  fi
}

main "$@"
