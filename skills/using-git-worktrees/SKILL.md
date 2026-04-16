---
name: using-git-worktrees
description: Use when starting feature work that needs isolation - creates a temporary branch for implementation work with safety verification
---

# Using Git Worktrees (Simplified: Branch-Only Mode)

## Overview

**Simplified approach:** Create a temporary branch in the current working directory instead of a separate worktree.

**Core principle:** New branch + safety verification = isolated implementation.

**Announce at start:** "I'm creating a temporary branch for isolated implementation work."

## Branch Creation Process

### 1. Generate Branch Name

Use descriptive naming based on the task:

```bash
# Format: feature/<task-name> or fix/<issue-name>
branch_name="feature/$(echo "$TASK" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g' | cut -c1-50)"
```

### 2. Verify Clean Working Directory

```bash
# Check for uncommitted changes
git status --porcelain
```

**If uncommitted changes exist:**
- Ask user to stash or commit first
- OR create branch anyway and warn about carrying over changes

### 3. Create and Switch to Branch

```bash
# Create new branch from current HEAD
git checkout -b "$branch_name"
```

### 4. Verify Branch Created

```bash
# Confirm current branch
git branch --show-current
```

**Expected:** Should output the new branch name.

### 5. Report Ready

```
Temporary branch created: $branch_name
Ready to implement: $TASK
```

## Quick Reference

| Situation | Action |
|-----------|--------|
| Clean working directory | Create branch directly |
| Uncommitted changes | Stash/commit first OR warn and proceed |
| Branch exists | Append timestamp or ask for different name |

## Common Mistakes

### Skipping clean directory check

- **Problem:** Carries over unrelated changes to new branch
- **Fix:** Always check `git status --porcelain` first

### Not verifying branch creation

- **Problem:** May still be on wrong branch
- **Fix:** Always confirm with `git branch --show-current`

## Example Workflow

```
You: I'm using the using-git-worktrees skill to create a temporary branch.

[Check git status - clean]
[Create branch: git checkout -b feature/subscription-user-id-uuid]
[Verify: git branch --show-current outputs "feature/subscription-user-id-uuid"]

Temporary branch created: feature/subscription-user-id-uuid
Ready to implement: Fix SubscriptionPlan user_id from int to UUID
```

## Red Flags

**Never:**
- Skip working directory check
- Proceed without verifying branch was created
- Create branch with uncommitted changes without warning

**Always:**
- Verify clean working directory first
- Confirm branch creation
- Use descriptive branch names

## Integration

**Called by:**
- **brainstorming** (Phase 4) - REQUIRED when design is approved and implementation follows
- **subagent-driven-development** - REQUIRED before executing any tasks
- **executing-plans** - REQUIRED before executing any tasks
- Any skill needing isolated workspace

**Pairs with:**
- **finishing-a-development-branch** - REQUIRED for cleanup after work complete
