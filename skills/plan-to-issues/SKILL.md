---
name: plan-to-issues
description: Convert writing-plans output into GitHub issues. Use when asked to "create issues from plan", "convert plan to issues", "create GitHub issues for tasks", or "plan to issues". Parses plan file, auto-detects labels, creates one issue per task.
---

# Plan-to-Issues

Parse a `writing-plans` output file and create one GitHub issue per task with auto-detected labels and structured bodies.

## Quick Start

```bash
# Convert latest plan to issues
python3 .qwen/skills/plan-to-issues/scripts/parse_plan.py docs/plans/latest.md

# Create issues via gh CLI (see Step 3)
```

## When to Use

- After `writing-plans` creates a plan and user wants to distribute tasks as issues
- Team workflows where plan tasks need to be trackable and assignable
- Sprint planning from existing plan documents

**DO NOT use** without a plan file — the plan is the source of truth.

## Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   STEP 1    │────▶│   STEP 2    │────▶│   STEP 3    │────▶│   STEP 4    │
│  Find/Load  │     │   Parse &   │     │   Create    │     │  Summary    │
│   Plan      │     │   Label     │     │   Issues    │     │  Report     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Step 1: Find or Load Plan

```bash
# Auto-find latest plan
PLAN_FILE=$(ls -t docs/plans/*.md 2>/dev/null | head -1)

# Or use specified file
PLAN_FILE="${1:-docs/plans/latest.md}"

if [ -z "$PLAN_FILE" ]; then
    echo "No plan file found. Run writing-plans first."
    exit 1
fi
```

## Step 2: Parse and Detect Labels

Run the parser:

```bash
python3 .qwen/skills/plan-to-issues/scripts/parse_plan.py "$PLAN_FILE"
```

Output is JSON array of tasks with labels:

```json
[
  {
    "number": 1,
    "title": "Add API endpoint",
    "files": "- Create: `src/api/users.py`",
    "steps": [{"title": "Write test", "content": "..."}],
    "labels": ["api", "testing", "enhancement"]
  }
]
```

## Step 3: Create Issues

For each task, create a GitHub issue:

```bash
# Build issue body
BODY="## Task: ${TASK_TITLE}
**Plan:** ${PLAN_FILE}
**Files:**
${TASK_FILES}

## Steps
$(for step in "${STEPS[@]}"; do echo "1. ${step}"; done)

## Acceptance Criteria
- [ ] All tests pass
- [ ] Code committed to correct files"

# Create issue
gh issue create \
  --title "Task ${TASK_NUM}: ${TASK_TITLE}" \
  --body "$BODY" \
  --label "$(IFS=,; echo "${LABELS[*]}")"
```

**Expected output per issue:**
```
https://github.com/owner/repo/issues/42
```

## Step 4: Summary Report

After all issues created:

```
======================================================
Plan-to-Issues Complete
======================================================
Plan: docs/plans/2026-04-04-my-feature.md
Issues Created: 5

| #  | Title                    | Labels                    | URL                                    |
|----|--------------------------|---------------------------|----------------------------------------|
| 42 | Task 1: Add API endpoint | api, testing, enhancement | https://github.com/owner/repo/issues/42 |
| 43 | Task 2: Add user model   | database, enhancement     | https://github.com/owner/repo/issues/43 |
| 44 | Task 3: Write tests      | testing                   | https://github.com/owner/repo/issues/44 |
| 45 | Task 4: Add validation   | security, api             | https://github.com/owner/repo/issues/45 |
| 46 | Task 5: Update docs      | documentation             | https://github.com/owner/repo/issues/46 |

Next: Use working-with-issues skill to process these issues in batch.
```

## Label Auto-Detection

Labels are inferred from task content using this mapping:

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

Multiple labels per issue are supported.

## Error Handling

| Error | Action |
|-------|--------|
| No plan file found | Stop with clear message to run writing-plans first |
| Plan has no tasks | Stop with "Plan contains no task blocks" |
| gh not authenticated | Stop with "Run gh auth login first" |
| Issue creation fails | Log error, continue to next task, report in summary |

## Red Flags

- **No plan file** → STOP. Run writing-plans first.
- **gh not authenticated** → STOP. Run `gh auth login`.
- **Empty plan** → STOP. Plan must have at least one `### Task N:` block.

## Integration with Other Skills

| Skill | When to Use |
|-------|-------------|
| `writing-plans` | **PREREQUISITE** — creates the plan this skill parses |
| `working-with-issues` | After issues created — batch process them |
| `fix-issue` | Single issue implementation |
