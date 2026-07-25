# Task Board Spec

## Overview
A web-based task management board with PostgreSQL backend and AXI-compliant CLI.

## Data Model
- tasks: id (serial), title (varchar 255), body (text), status (open|in_progress|done),
  priority (0-3), created_at (timestamptz), updated_at (timestamptz)

## API (CLI commands)
- `task list [--status=X] [--limit=N]` — list tasks with pre-computed count
- `task view <id> [--full]` — view single task with truncation
- `task create --title="..." [--body="..."] [--priority=N]` — create task
- `task update <id> --status=X` — idempotent update
- `task delete <id> --confirm=task` — destructive delete with confirmation

## Frontend
- Web Awesome components: wa-card, wa-badge, wa-button, wa-input, wa-dialog, wa-toast
- Three-column board: Open | In Progress | Done
- Real-time refresh after mutations

## AXI Principles Required
All 10 principles must be demonstrable through the CLI output.

