---
name: specops:reapply-patches
description: Reapply local modifications after an update
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

<purpose>
After a SpecOps update wipes and reinstalls files, this command merges the user's previously saved local modifications back into the new version. Uses smart comparison to handle cases where the upstream file has also changed.
</purpose>

<process>

## Step 1: Detect backed-up patches

Check the local patches directory:

```bash
# Global install (path is templated at install time)
PATCHES_DIR=~/.config/opencode/specops-local-patches
# Local install fallback
if [ ! -d "$PATCHES_DIR" ]; then
  PATCHES_DIR=./.opencode/specops-local-patches
fi
```

Read `backup-meta.json` from the patches directory.

**If no patches are found:**
```
No local patches found. Nothing to reapply.

Local patches are saved automatically after you run /specops:update
(if you had modified any SpecOps workflow, command, or agent files).
```
Exit.

## Step 2: Show the patch summary

```
## Local patches to reapply

**Backed up from:** v{from_version}
**Current version:** {read VERSION file}
**Files modified:** {count}

| # | File | Status |
|---|------|------|
| 1 | {file_path} | Pending |
| 2 | {file_path} | Pending |
```

## Step 3: Merge each file

For each file in `backup-meta.json`:

1. **Read the backed-up version** (the user's modified copy, from `specops-local-patches/`)
2. **Read the freshly installed version** (the updated current file)
3. **Compare and merge:**

   - If the new file is identical to the backup: skip (the modification was already merged upstream)
   - If the new file differs: identify the user's changes and apply them to the new version

   **Merge strategy:**
   - Read both versions in full
   - Identify the sections the user added or modified (look for genuine additions, not just diffs from path substitution)
   - Apply the user's additions/modifications to the new version
   - If the section the user modified has also changed upstream: flag it as a conflict, show both versions, and ask the user which to keep

4. **Write the merged result** to the install location
5. **Report status:**
   - `Merged` — the user's changes applied cleanly
   - `Skipped` — the change was already present upstream
   - `Conflict` — the user chose a resolution

## Step 4: Update the manifest

After reapplying, regenerate the file manifest so future updates correctly detect these user modifications:

```bash
# The manifest will be regenerated on the next /specops:update
# For now, just record which files were modified
```

## Step 5: Cleanup options

Ask the user:
- "Keep the patch backup for reference?" → keep `specops-local-patches/`
- "Clean up the patch backup?" → delete the `specops-local-patches/` directory

## Step 6: Report

```
## Patches reapplied

| # | File | Status |
|---|------|------|
| 1 | {file_path} | ✓ Merged |
| 2 | {file_path} | ○ Skipped (already upstream) |
| 3 | {file_path} | ⚠ Conflict resolved |

{count} file(s) updated. Your local modifications are active again.
```

</process>

<success_criteria>
- [ ] All backed-up patches have been processed
- [ ] User modifications have been merged into the new versions
- [ ] Conflicts have been resolved with user input
- [ ] Status for each file has been reported
</success_criteria>
