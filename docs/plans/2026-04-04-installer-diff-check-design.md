# Installer Diff-Check System Design

> **Status:** Approved | **Date:** 2026-04-04 | **Author:** Jelvys

## Goal

Before overwriting any file in `~/.qwen/`, the installer compares source vs destination and prompts the user if they differ. Prevents silent loss of user customizations.

## Architecture

### Flow

```
copyDir() / copyFile()
  ↓
fileExists(dest)?
  ↓ NO → copy directly
  ↓ YES
filesDiffer(src, dest)?
  ↓ NO → skip silently (identical)
  ↓ YES
showPrompt(file, diffSummary)
  ↓
User chooses: [O]verwrite / [S]kip / [D]iff / [A]ll overwrite / [Q]uit
```

### Diff Detection

- Simple content comparison: `fs.readFileSync(src) !== fs.readFileSync(dest)`
- If contents differ, show:
  - File path (relative)
  - Size difference (e.g., "local: 2.3KB → incoming: 3.1KB")
  - On `[D]iff`: show unified diff (first 15 lines)

### Prompt Format

```
⚠ File differs: skills/tdd-workflow/SKILL.md
  Local: 2.3KB | Incoming: 3.1KB
  [O]verwrite  [S]kip  [D]iff  [A]ll overwrite  [Q]uit
  > _
```

### CLI Flags

| Flag | Behavior |
|------|----------|
| (none) | Interactive mode — prompt on each diff |
| `--force` | Bypass all prompts, overwrite everything |
| `--backup` | Create `.bak` copies before overwriting |
| `--dry-run` | Show all differences without making changes |

### Non-Interactive Mode

When stdin is not a TTY (piped input, CI/CD):
- Default to **skip** changed files
- Print warning for each skipped file
- `--force` overrides to overwrite

## Implementation

### New Functions in `bin/eqw-install`

| Function | Purpose |
|----------|---------|
| `filesDiffer(src, dest)` | Returns true if file contents differ |
| `formatSize(bytes)` | Human-readable file size |
| `showDiffPrompt(relPath, src, dest)` | Interactive prompt with options |
| `showUnifiedDiff(src, dest)` | Generate simple unified diff (first 15 lines) |
| `parseArgs(argv)` | Parse `--force`, `--backup`, `--dry-run` flags |

### Modified Functions

| Function | Change |
|----------|--------|
| `copyDir()` | Check each file for diff before copying |
| `copyFile()` | Check for diff, prompt if differs |

### Dependencies

None — uses only Node.js built-in modules (`fs`, `path`, `os`, `readline`).

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Dest file doesn't exist | Copy directly (no prompt) |
| Files are identical | Skip silently |
| User presses Ctrl+C | Exit gracefully, report what was done |
| Non-interactive stdin | Skip changed files, warn |
| `--force` flag | Overwrite all without prompts |
| `--backup` flag | Copy dest to `dest.bak` before overwrite |
| `--dry-run` flag | Show all differences, make no changes |

## Files to Modify

| File | Change |
|------|--------|
| `bin/eqw-install` | Add diff-check logic, prompt functions, CLI flags |

## Testing

- Unit tests for `filesDiffer()`, `formatSize()`, `parseArgs()`
- Integration test: run installer with modified local file, verify prompt appears
- Test `--force`, `--backup`, `--dry-run` flags
- Test non-interactive mode (piped stdin)
