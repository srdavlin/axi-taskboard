# Quota-aware dispatch practice (`quota-axi`)

Phase 8 practice writeup: no app code changed here — `quota-axi` is a
dispatch-time tool a supervisor runs before picking which agent harness/
account handles the next unit of work, not something the taskboard app
imports.

## What `quota-axi` reports, and why a supervisor needs it

A multi-harness supervisor juggles several agent accounts (Claude, Codex,
Cursor, Copilot, Grok, Kimi); any one of them can run out of quota mid-build,
stalling whatever it's holding. `quota-axi [--json] [--provider <name>]`
reports, per provider:

- `state.status` — `fresh` (usable data just read), `stale`, `error`, or
  `auth_required`. The latter two are **normal, common outcomes**, not
  failures to explain away: they mean this host has no working credential
  for that provider, so there's nothing to route to it.
- `windows` — the provider's actual quota windows (e.g. Claude's
  `five_hour` session window and `seven_day` week window), each with
  `percentRemaining` and `resetsAt`.
- `quotaSemantics` — how a provider's windows combine into one effective
  number. For Claude, `effectiveAvailability` is the **minimum** across all
  bounding windows (a model is gated by both its session and weekly window
  at once). When no windows exist, `quotaSemantics.status` is `unknown` and
  `effectiveAvailability` is empty — there's no number to compute.

A supervisor's dispatch rule from this data: route to the candidate with
usable `state.status` and the highest `effectivePercentRemaining`; treat
`auth_required`/`error`/`unknown` providers as not currently dispatchable,
full stop.

## This build's crewmate harness set vs. what `quota-axi` can report on

This build's verified crewmate harnesses (per `no-mistakes doctor`, run this
session): **claude**, **opencode**, **pi** are installed and runnable here;
**codex** is listed as a `quota-axi` provider but not installed as a runnable
agent binary on this host. **pi-signed**, **grok**, **kimi** are not
installed here either.

`quota-axi --provider <name>` only accepts a fixed provider set:
**claude, codex, cursor, copilot, grok, kimi**. Running it against
`opencode` or `pi` fails outright with `unsupported provider` — those two
crewmate harnesses have **no quota-axi coverage at all**, which is a
different and stronger statement than "unavailable": there is no code path
in `quota-axi` for them, so a supervisor can never get a quota answer for
opencode/pi from this tool regardless of credentials. `pi-signed` isn't a
distinct provider either. Of the providers `quota-axi` does know about,
`grok` and `kimi` are supported providers but had no working credential on
this host this session (see below).

## Worked example: this session's real `quota-axi --json` output

Run on 2026-08-01 (`quota-axi --json`, full output also captured via
`quota-axi --full` for the `attempts` detail):

| provider | state.status | windows | effectivePercentRemaining |
|---|---|---|---|
| claude | `fresh` | `five_hour` 96%, `seven_day` 97% | 96 (bounded by `five_hour`) |
| codex | `error` (`Codex quota unavailable`, tried `oauth`+`cli-rpc`) | none | unknown |
| cursor | `auth_required` (sign-in required) | none | unknown |
| copilot | `auth_required` (sign-in required) | none | unknown |
| grok | `auth_required` (sign-in required) | none | unknown |
| kimi | `auth_required` (`kimi_credential_unavailable`) | none | unknown |

**Dispatch decision today: claude, and only claude.** It's the sole provider
with `fresh` state and real windows — 96% remaining on its binding `five_hour`
session window, next reset 2026-08-02T01:39:59Z. Every other `quota-axi`-
known provider (codex, cursor, copilot, grok, kimi) has no usable quota data
on this host right now — five different auth/error reasons, not five
variations on "fine." That claude is the only dispatchable candidate is
itself the correct quota-aware outcome for this session, not a fallback that
needs excusing.

## Standing rule

Per this build's own history, firstmate never guesses or silently falls
back when a candidate's quota data can't be established — it stops and
reports that candidate's `state.status`/error instead of assuming headroom
or routing around it quietly.
