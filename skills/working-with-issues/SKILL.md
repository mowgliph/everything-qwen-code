---
name: working-with-issues
description: Process GitHub issues in batches with systematic implementation workflow. Use when implementing multiple GitHub issues, security remediation tasks, feature backlogs, or any batch of tracked work items. Triggers on phrases like "process issues", "implement batch of issues", "work on issues #X-#Y", "close multiple issues", or when given a batch selector for GitHub issues.
---

# Working with Issues

Systematic batch processing of GitHub issues with mandatory design-first approach, isolated feature branches, and automatic issue closure.

## Quick Start

```bash
# Process last 5 open issues
working-with-issues --batch "last 5" --repo usipipo-agent

# Process issues by label
working-with-issues --batch "label:critical" --repo usipipo-backend

# Process specific phase
working-with-issues --batch "phase-1" --repo usipipo-agent --base main
```

## When to Use This Skill

Use this skill when:
- Implementing multiple GitHub issues in one session
- Working through security remediation backlogs
- Processing feature requests systematically
- Closing bugs in batches
- Any workflow requiring systematic issue implementation with traceability

**DO NOT use** for single issues — use `fix-issue` skill instead.

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ISSUE BATCH WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  STEP 1  │────▶│  STEP 2  │────▶│  STEP 3  │────▶│  STEP 4  │
    │   Load   │     │   Todo   │     │  Process │     │ Summary  │
    │  Issues  │     │   List   │     │  Issues  │     │  Report  │
    └──────────┘     └──────────┘     └────┬─────┘     └──────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
              ┌─────▼─────┐         ┌─────▼─────┐         ┌─────▼─────┐
              │ Brainstorm│         │ Implement │         │  Cleanup  │
              │  Design   │         │  + Tests  │         │  Branch   │
              └─────┬─────┘         └─────┬─────┘         └─────┬─────┘
                    │                     │                     │
              ┌─────▼─────┐         ┌─────▼─────┐         ┌─────▼─────┐
              │   User    │         │  Commit   │         │   Next    │
              │  Approve  │         │ + Push    │         │  Issue    │
              └───────────┘         └───────────┘         └───────────┘
```

## Input Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `batch_selector` | Yes | - | How to select issues (see Batch Selectors below) |
| `repository` | Yes | - | Repository name (e.g., "usipipo-agent") |
| `base_branch` | No | `main` | Base branch for feature branches |

### Batch Selectors

```bash
# By count
"last 5"              # Last 5 open issues
"first 3"             # First 3 open issues
"all"                 # All open issues (max 100)

# By label
"label:critical"      # Issues with critical label
"label:phase-1"       # Issues in phase 1
"label:bug"           # Bug issues only

# By state
"all open"            # All open issues
"all closed"          # All closed issues (for verification)

# By milestone
"milestone:v1.0"      # Issues in v1.0 milestone

# Custom query
"is:open label:security author:mowgliph"  # Custom GitHub search
```

## Step-by-Step Implementation

### Step 1: Load Issues

Fetch issues from GitHub using `gh` CLI:

```bash
# List issues by label
gh issue list --state open --label "phase-1" --limit 10 --json number,title,labels

# Get specific issue details
gh issue view 22 --json title,body,labels,comments

# Custom search
gh issue list --state open --search "is:open label:critical" --limit 20
```

**Expected Output:**
```json
[
  {
    "number": 22,
    "title": "Secure API Key Validation & Format",
    "labels": [{"name": "critical"}, {"name": "security"}]
  }
]
```

**Action:** Parse and display summary:
```
📋 Processing Batch: Phase 1 - Critical Security Fixes
======================================================
Repository: uSipipo-Team/usipipo-agent
Base Branch: main
Issues Found: 4

Loaded Issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🔴 #22: Secure API Key Validation & Format (Critical)
 🔴 #23: TLS Configuration Hardening (Critical)
 🔴 #24: Enhanced Rate Limiting Strategy (Critical)
 🔴 #25: Security Event Logging (Critical)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Create Todo List

Add all issues to structured todo list with status tracking:

```markdown
## Issue Batch: Phase 1 Security Fixes

| Status | Issue | Title | Label |
|--------|-------|-------|-------|
| [ ] | #22 | Secure API Key Validation | 🔴 Critical |
| [ ] | #23 | TLS Configuration Hardening | 🔴 Critical |
| [ ] | #24 | Enhanced Rate Limiting | 🔴 Critical |
| [ ] | #25 | Security Event Logging | 🔴 Critical |
```

### Step 3: Process Each Issue

For each issue in the batch, follow this sequence:

#### 3.1 Brainstorming (MANDATORY)

**ALWAYS invoke `brainstorming` skill before any implementation:**

```
🧠 Brainstorming: In progress...
```

The brainstorming skill will:
- Analyze the issue requirements
- Propose design approach
- Identify affected files
- Suggest implementation strategy

**Wait for user approval before proceeding.**

#### 3.2 User Approval

Present design summary and wait for explicit approval:

```
📋 Design Summary:
- Add API key format validation (regex: ^agent_[a-zA-Z0-9]{32}$)
- Use constant-time comparison (crypto/subtle)
- Files: internal/api/middleware.go, internal/utils/validation/apikeys.go

⏳ Aprobación del usuario... [ESPERANDO]
```

**DO NOT proceed without user approval.**

#### 3.3 Create Feature Branch

```bash
# Checkout base branch
git checkout main
git pull origin main

# Create isolated feature branch
git checkout -b feature/issue-22-api-key-validation
```

**Branch naming convention:**
```
feature/issue-{NNN}-{short-kebab-case-name}
```

#### 3.4 Implementation

Write code following best practices:
- Follow Clean/Hexagonal architecture
- Add tests first (TDD)
- Use existing project patterns
- Keep functions <50 lines
- Add error handling

```
💻 Implementation: In progress...
✅ Implementation complete (156 lines added)
```

#### 3.5 Run Tests

```bash
# Run project tests
pytest tests/
# or
go test ./...
# or
npm test

# Verify specific test file
pytest tests/test_api_key_validation.py -v
```

```
🧪 Tests: Running...
✅ Tests passed (5/5 passing)
```

**If tests fail:** Mark issue as blocked, log error, continue to next issue.

#### 3.6 Commit

```bash
git add .
git commit -m "fix: Add constant-time API key validation (#22)

Fixes #22

## Description
Implement secure API key validation with:
- Format validation using regex pattern
- Constant-time comparison to prevent timing attacks
- Clear error messages for invalid keys

## Changes
- internal/api/middleware.go: Add validation middleware
- internal/utils/validation/apikeys.go: New validation utilities
- tests/test_api_key_validation.py: Add comprehensive tests

## Testing
- Unit tests: 5 tests for validation logic
- Integration tests: API endpoint protection verified

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

**Commit message format:**
```
<type>: <description> (#<issue-number>)

Fixes #<issue-number>

## Description
[Detailed description of changes]

## Changes
- File1: Description of changes
- File2: Description of changes

## Testing
- Test1: What was tested
- Test2: What was tested
```

**Commit types:**
- `fix:` Bug fixes, security patches
- `feat:` New features
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

#### 3.7 Push (Auto-Close)

```bash
git push -u origin feature/issue-22-api-key-validation
```

**Important:** The `Fixes #22` in commit message will automatically close the issue when pushed to a branch that gets merged to main.

For immediate closure (if pushing directly to main or for verification):
```bash
# Manual close with comment
gh issue close 22 --comment "Fixed in commit $(git rev-parse HEAD)"
```

```
🚀 Push: Pushing to origin...
✅ Pushed (issue will auto-close on GitHub)
```

#### 3.8 Cleanup Branch

```bash
# Return to main
git checkout main

# Delete local feature branch
git branch -D feature/issue-22-api-key-validation

# Delete remote branch (if pushed)
git push origin --delete feature/issue-22-api-key-validation
```

```
🧹 Cleanup: Removing branch...
✅ Branch cleaned up
```

### Step 4: Summary Report

After processing all issues:

```
======================================================
Batch Complete: 4/4 issues processed
======================================================

Summary:
✅ 4 issues implemented
✅ 4 commits created
✅ 4 branches cleaned up
✅ 0 issues blocked
✅ 0 issues failed

Commits Created:
  fix: Add constant-time API key validation (#22)  [abc1234]
  fix: Enable TLS verification by default (#23)    [def5678]
  fix: Implement hybrid rate limiting (#24)        [ghi9012]
  fix: Add structured security logging (#25)       [jkl3456]

Next Steps:
  1. Verify issues closed on GitHub: https://github.com/uSipipo-Team/usipipo-agent/issues?q=is%3Aissue+is%3Aclosed
  2. Create PR to merge to main (if needed)
  3. Run full test suite
  4. Begin Phase 2
```

## Error Handling

| Error | Action | Continue? |
|-------|--------|-----------|
| Brainstorming fails | Log error, skip to next issue | ✅ Yes |
| User rejects design | Revise design with brainstorming | ⏸️ Wait |
| Tests fail | Mark as blocked, log failures | ✅ Yes |
| Commit fails | Retry once, then skip | ✅ Yes |
| Push fails | Retry once, check credentials | ✅ Yes |
| Branch cleanup fails | Log warning, continue | ✅ Yes |
| gh CLI not authenticated | Stop batch, prompt auth | ❌ No |

**Error logging format:**
```
❌ Issue #24: BLOCKED
   Reason: Tests failed (3/5 failing)
   Action: Manual review required
   Log: tests/test_output.log
```

## gh CLI Commands Reference

### Issue Operations

```bash
# List open issues
gh issue list --state open --limit 100

# List by label
gh issue list --label "critical" --state open

# List by milestone
gh issue list --milestone "v1.0" --state open

# View issue details
gh issue view <NUMBER> --json title,body,labels,comments

# View with comments
gh issue view 22 --comments

# Close issue
gh issue close <NUMBER> --comment "Fixed in commit abc123"

# Reopen issue
gh issue reopen <NUMBER>

# Add label
gh issue edit <NUMBER> --add-label "blocked"

# Remove label
gh issue edit <NUMBER> --remove-label "blocked"
```

### Branch Operations

```bash
# List branches
git branch -a

# Create branch
git checkout -b feature/issue-22-name

# Delete local branch
git branch -D feature/issue-22-name

# Delete remote branch
git push origin --delete feature/issue-22-name

# Check branch status
git status
```

### Commit Operations

```bash
# Standard commit
git commit -m "fix: Description (#22)"

# Commit with body
git commit -m "fix: Description (#22)

Fixes #22

## Changes
- File: Change description"

# Amend last commit
git commit --amend -m "New message"

# View commit history
git log --oneline -5
```

## Usage Examples

### Example 1: Security Remediation Batch

```
User: Process the last 5 security issues in usipipo-agent

📋 Processing Batch: Last 5 Security Issues
======================================================
Repository: uSipipo-Team/usipipo-agent
Base Branch: main
Issues Found: 5

Loaded Issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🔴 #22: Secure API Key Validation & Format (Critical)
 🔴 #23: TLS Configuration Hardening (Critical)
 🔴 #24: Enhanced Rate Limiting Strategy (Critical)
 🔴 #25: Security Event Logging (Critical)
 🟡 #26: Input Sanitization for User Data (High)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Starting Implementation...
[1/5] 🔴 Issue #22: Secure API Key Validation & Format
...
```

### Example 2: Phase-Based Implementation

```
User: Implement all phase-1 issues for the backend

📋 Processing Batch: Phase 1 Backend Features
======================================================
Repository: uSipipo-Team/usipipo-backend
Base Branch: main
Issues Found: 8

Loaded Issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🟢 #10: Database Schema Design (Phase 1)
 🟢 #11: User Authentication Endpoint (Phase 1)
 🟢 #12: Rate Limiting Middleware (Phase 1)
 ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 3: Bug Fix Sprint

```
User: Fix all open bugs in usipipo-telegram-bot

📋 Processing Batch: Bug Fix Sprint
======================================================
Repository: uSipipo-Team/usipipo-telegram-bot
Base Branch: main
Issues Found: 6

Loaded Issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🟠 #45: Callback Query Timeout (Bug)
 🟠 #46: Message Formatting Error (Bug)
 🟠 #47: Inline Keyboard Not Rendering (Bug)
 ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example 4: Custom Label Filter

```
User: Process all issues labeled "good-first-issue"

📋 Processing Batch: Good First Issues
======================================================
Repository: uSipipo-Team/usipipo-agent
Base Branch: main
Issues Found: 3

Loaded Issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 🟢 #50: Add Logging to Health Check (Good First Issue)
 🟢 #51: Update README Examples (Good First Issue)
 🟢 #52: Fix Typo in Error Messages (Good First Issue)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Integration with Other Skills

| Skill | When to Use |
|-------|-------------|
| `brainstorming` | **MANDATORY** before each issue implementation |
| `tdd-guide` | When writing tests for issue implementation |
| `code-reviewer` | After implementation, before commit |
| `security-reviewer` | For security-related issues |
| `python-reviewer` | For Python code changes |
| `database-reviewer` | For database schema/query changes |
| `GitHub PR/Merge Workflow` | When merging completed batch to main |
| `changelog-generator` | After batch completion for release notes |

## Red Flags & Anti-Patterns

### ❌ Anti-Patterns

1. **Skipping Brainstorming**
   ```
   BAD: "This is simple, I'll just implement it"
   GOOD: Always invoke brainstorming first
   ```

2. **Committing Without Tests**
   ```
   BAD: git commit -m "fix: Thing" (no tests)
   GOOD: Write tests first, verify passing, then commit
   ```

3. **Generic Commit Messages**
   ```
   BAD: git commit -m "fix stuff"
   GOOD: git commit -m "fix: Add API key validation (#22)\n\nFixes #22"
   ```

4. **Working on Main Branch**
   ```
   BAD: Implementing directly on main
   GOOD: Always create feature/issue-NNN branches
   ```

5. **Batching Multiple Issues in One Commit**
   ```
   BAD: One commit for issues #22, #23, #24
   GOOD: Separate commit per issue with Fixes #NNN
   ```

6. **Not Cleaning Up Branches**
   ```
   BAD: Leaving feature branches after merge
   GOOD: Delete branch immediately after push
   ```

### ✅ Best Practices

1. **One Issue, One Branch, One Commit**
2. **Always Include `Fixes #NNN` in Commit**
3. **Run Tests Before Every Commit**
4. **Use Descriptive Branch Names**
5. **Log Errors Clearly When Skipping**
6. **Wait for User Approval After Brainstorming**

## Progress Tracking Template

```
[Current/Total] 🔴 Issue #NNN: Title
────────────────────────────────────────
  🧠 Brainstorming: [In progress | Complete | Failed]
  ✅ Design approved: [Yes | No | Pending]
  📦 Branch: feature/issue-NNN-name
  💻 Implementation: [In progress | Complete]
  🧪 Tests: [Running | Passed | Failed]
  📝 Commit: [Pending | Created: hash]
  🚀 Push: [Pending | Complete]
  🧹 Cleanup: [Pending | Complete]
  
  Status: [COMPLETE | BLOCKED | FAILED]
```

## Troubleshooting

### Issue: gh CLI Not Authenticated

```bash
# Authenticate
gh auth login

# Verify
gh auth status
```

### Issue: Branch Already Exists

```bash
# Delete existing branch
git branch -D feature/issue-22-name
git push origin --delete feature/issue-22-name

# Recreate
git checkout -b feature/issue-22-name
```

### Issue: Commit Doesn't Auto-Close

Verify commit message includes `Fixes #NNN`:
```bash
git log -1 --format=fuller
```

If missing, amend:
```bash
git commit --amend -m "fix: Description

Fixes #22

[rest of message]"
git push --force
```

### Issue: Tests Failing Intermittently

```bash
# Run tests multiple times
pytest tests/ --count=3

# Check for race conditions
pytest tests/ -p no:warnings -v
```

## Related Documentation

- [GitHub Closing Issues via Commit Messages](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
- [gh CLI Documentation](https://cli.github.com/manual/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Branching Best Practices](https://nvie.com/posts/a-successful-git-branching-model/)
