# Plan-to-Issues Skill Design

> **Status:** Approved | **Date:** 2026-04-04 | **Author:** Jelvys

## Goal

Parse a `writing-plans` output file and create one GitHub issue per task with auto-detected labels and structured bodies. Enables team-oriented workflow where plan tasks become trackable, assignable GitHub issues.

## Architecture

The skill operates as a pipeline:
1. **Parse** — Extract `### Task N: [Name]` blocks from a plan markdown file
2. **Label** — Auto-detect labels from task content using keyword mapping
3. **Create** — Batch create GitHub issues via `gh issue create`
4. **Report** — Print summary table with issue numbers, titles, labels, URLs

## Tech Stack

- Python for plan parsing (`scripts/parse_plan.py`)
- `gh` CLI for GitHub issue creation
- Markdown regex parsing for task extraction
- YAML frontmatter for label configuration

## Label Auto-Detection

| Keywords | Label |
|----------|-------|
| test, pytest, failing, TDD | `testing` |
| API, endpoint, route, handler | `api` |
| UI, component, frontend, view | `frontend` |
| database, schema, migration, query | `database` |
| auth, security, validation | `security` |
| docs, README, changelog | `documentation` |
| refactor, cleanup, dead code | `refactor` |
| config, env, deploy, CI | `devops` |
| feat, add, new | `enhancement` |
| fix, bug, error | `bug` |

Multiple labels per issue are supported (a task can match multiple keyword groups).

## Issue Body Format

```markdown
## Task: [Task Name]
**Plan:** [link to plan file]
**Files:**
- Create: `path/to/file`
- Modify: `path/to/file`

## Steps
1. [Step 1]
2. [Step 2]

## Acceptance Criteria
- [ ] All tests pass
- [ ] Code committed to correct files
```

## Files to Create

| File | Purpose |
|------|---------|
| `.qwen/skills/plan-to-issues/SKILL.md` | Skill instructions and workflow |
| `.qwen/skills/plan-to-issues/scripts/parse_plan.py` | Plan parser + label detector |

## Workflow

```
User: "Convert the latest plan to GitHub issues"
  → Skill finds latest plan in docs/plans/
  → Parses all Task blocks
  → Auto-detects labels per task
  → Creates one issue per task via gh CLI
  → Prints summary table
```

## Integration Points

- **Input:** `writing-plans` output (plan markdown file)
- **Output:** GitHub issues (consumed by `working-with-issues` for batch processing)
- **Dependency:** `gh` CLI authenticated

## Anti-Patterns to Avoid

- Don't create issues without a plan file (plan is source of truth)
- Don't duplicate code snippets in issues (link to plan instead)
- Don't skip label detection (manual labeling defeats the purpose)
- Don't create issues if `gh` is not authenticated (fail fast with clear error)
