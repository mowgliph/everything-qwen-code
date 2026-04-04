# Plan-to-Issues Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a skill that parses writing-plans output files and converts each task into a GitHub issue with auto-detected labels and structured bodies.

**Architecture:** Two-component system: (1) Python parser script that extracts tasks and detects labels, (2) SKILL.md that orchestrates the workflow using the parser and `gh` CLI. TDD approach with unit tests for the parser.

**Tech Stack:** Python 3, regex, `gh` CLI, pytest

---

### Task 1: Plan Parser Core

**Files:**
- Create: `.qwen/skills/plan-to-issues/scripts/parse_plan.py`
- Test: `.qwen/skills/plan-to-issues/scripts/test_parse_plan.py`

**Step 1: Write the failing test**

Create `.qwen/skills/plan-to-issues/scripts/test_parse_plan.py`:

```python
import unittest
from parse_plan import extract_tasks

class TestExtractTasks(unittest.TestCase):
    def test_extract_single_task(self):
        plan = """# Test Plan
---
### Task 1: Add API endpoint

**Files:**
- Create: `src/api/users.py`

**Step 1: Write test**
```python
def test_users_endpoint():
    pass
```

**Step 2: Run test**
Run: pytest tests/test_users.py
"""
        tasks = extract_tasks(plan)
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['number'], 1)
        self.assertEqual(tasks[0]['title'], 'Add API endpoint')
        self.assertIn('Create: `src/api/users.py`', tasks[0]['files'])
        self.assertEqual(len(tasks[0]['steps']), 2)

    def test_extract_multiple_tasks(self):
        plan = """# Test Plan
---
### Task 1: Add user model

**Files:**
- Create: `src/models/user.py`

**Step 1: Write test**
test

**Step 2: Implement**
code

### Task 2: Add user tests

**Files:**
- Create: `tests/test_user.py`

**Step 1: Write test**
test code
"""
        tasks = extract_tasks(plan)
        self.assertEqual(len(tasks), 2)
        self.assertEqual(tasks[0]['title'], 'Add user model')
        self.assertEqual(tasks[1]['title'], 'Add user tests')

    def test_no_tasks(self):
        plan = "# Just a heading\n---\nNo tasks here."
        tasks = extract_tasks(plan)
        self.assertEqual(tasks, [])

if __name__ == '__main__':
    unittest.main()
```

**Step 2: Run test to verify it fails**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest test_parse_plan.py -v`
Expected: FAIL with "ModuleNotFoundError: No module named 'parse_plan'"

**Step 3: Write minimal implementation**

Create `.qwen/skills/plan-to-issues/scripts/parse_plan.py`:

```python
#!/usr/bin/env python3
"""Parse writing-plans output and extract tasks."""

import re
import sys
import json


def extract_tasks(plan_text: str) -> list[dict]:
    """Extract task blocks from a plan markdown file.
    
    Returns list of dicts with keys: number, title, files, steps
    """
    task_pattern = re.compile(
        r'^### Task (\d+): (.+)$',
        re.MULTILINE
    )
    
    tasks = []
    matches = list(task_pattern.finditer(plan_text))
    
    for i, match in enumerate(matches):
        number = int(match.group(1))
        title = match.group(2).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(plan_text)
        body = plan_text[start:end]
        
        files_match = re.search(r'\*\*Files:\*\*\n(.*?)(?=\n\*\*Step|\Z)', body, re.DOTALL)
        files = files_match.group(1).strip() if files_match else ''
        
        steps = re.findall(r'\*\*Step \d+: (.+?)\*\*\n(.*?)(?=\*\*Step |\Z)', body, re.DOTALL)
        steps = [{'title': s[0].strip(), 'content': s[1].strip()} for s in steps]
        
        tasks.append({
            'number': number,
            'title': title,
            'files': files,
            'steps': steps,
        })
    
    return tasks


def detect_labels(task: dict) -> list[str]:
    """Auto-detect labels from task content."""
    label_map = {
        'testing': ['test', 'pytest', 'failing', 'TDD', 'unittest'],
        'api': ['API', 'endpoint', 'route', 'handler'],
        'frontend': ['UI', 'component', 'frontend', 'view', 'template'],
        'database': ['database', 'schema', 'migration', 'query', 'model'],
        'security': ['auth', 'security', 'validation', 'token', 'permission'],
        'documentation': ['docs', 'README', 'changelog', 'documentation'],
        'refactor': ['refactor', 'cleanup', 'dead code', 'restructure'],
        'devops': ['config', 'env', 'deploy', 'CI', 'CD', 'pipeline'],
        'enhancement': ['feat', 'add', 'new', 'feature'],
        'bug': ['fix', 'bug', 'error', 'patch'],
    }
    
    searchable = f"{task['title']} {task['files']} "
    searchable += ' '.join(s['title'] + ' ' + s['content'] for s in task['steps'])
    
    labels = []
    for label, keywords in label_map.items():
        if any(kw.lower() in searchable.lower() for kw in keywords):
            labels.append(label)
    
    return labels if labels else ['task']


def main():
    if len(sys.argv) < 2:
        print("Usage: parse_plan.py <plan_file.md>")
        sys.exit(1)
    
    plan_file = sys.argv[1]
    with open(plan_file, 'r') as f:
        plan_text = f.read()
    
    tasks = extract_tasks(plan_text)
    
    for task in tasks:
        task['labels'] = detect_labels(task)
    
    print(json.dumps(tasks, indent=2))


if __name__ == '__main__':
    main()
```

**Step 4: Run test to verify it passes**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest test_parse_plan.py -v`
Expected: All 3 tests PASS

**Step 5: Commit**

```bash
git add .qwen/skills/plan-to-issues/scripts/parse_plan.py \
        .qwen/skills/plan-to-issues/scripts/test_parse_plan.py
git commit -m "feat: add plan parser with task extraction and label detection

Implements core parsing logic for writing-plans output files.
Extracts task blocks, file references, steps, and auto-detects labels.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 2: Parser CLI Enhancements

**Files:**
- Modify: `.qwen/skills/plan-to-issues/scripts/parse_plan.py`
- Test: `.qwen/skills/plan-to-issues/scripts/test_parse_plan.py`

**Step 1: Write the failing test**

Add to `test_parse_plan.py`:

```python
from parse_plan import find_latest_plan
import os
import tempfile

class TestFindLatestPlan(unittest.TestCase):
    def test_find_latest_plan(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            plans_dir = os.path.join(tmpdir, 'docs', 'plans')
            os.makedirs(plans_dir)
            
            open(os.path.join(plans_dir, '2026-04-01-old.md'), 'w').close()
            open(os.path.join(plans_dir, '2026-04-04-new.md'), 'w').close()
            
            latest = find_latest_plan(plans_dir)
            self.assertIn('2026-04-04-new.md', latest)
    
    def test_no_plans(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            result = find_latest_plan(tmpdir)
            self.assertIsNone(result)
```

**Step 2: Run test to verify it fails**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest test_parse_plan.py::TestFindLatestPlan -v`
Expected: FAIL with "ImportError: cannot import name 'find_latest_plan'"

**Step 3: Write minimal implementation**

Add to `parse_plan.py`:

```python
import os
import glob


def find_latest_plan(plans_dir: str) -> str | None:
    """Find the most recent plan file in docs/plans/."""
    pattern = os.path.join(plans_dir, '*.md')
    files = glob.glob(pattern)
    if not files:
        return None
    return max(files, key=os.path.getmtime)
```

**Step 4: Run test to verify it passes**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest test_parse_plan.py::TestFindLatestPlan -v`
Expected: PASS

**Step 5: Commit**

```bash
git add .qwen/skills/plan-to-issues/scripts/parse_plan.py \
        .qwen/skills/plan-to-issues/scripts/test_parse_plan.py
git commit -m "feat: add find_latest_plan utility for auto-discovery

Supports auto-finding the most recent plan file when no path is given.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 3: SKILL.md

**Files:**
- Create: `.qwen/skills/plan-to-issues/SKILL.md`

**Step 1: Write the skill file**

Create `.qwen/skills/plan-to-issues/SKILL.md`:

```markdown
---
name: plan-to-issues
description: Convert writing-plans output into GitHub issues. Use when asked to "create issues from plan", "convert plan to issues", "create GitHub issues for tasks", or "plan to issues". Parses plan file, auto-detects labels, creates one issue per task.
---

# Plan-to-Issues

Parse a `writing-plans` output file and create one GitHub issue per task with auto-detected labels and structured bodies.

## Quick Start

```bash
# Convert latest plan to issues
plan-to-issues

# Convert specific plan
plan-to-issues --file docs/plans/2026-04-04-my-feature.md

# Specify repository
plan-to-issues --repo owner/repo
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
    echo "❌ No plan file found. Run writing-plans first."
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
```

**Step 2: Verify skill structure**

Run: `ls -la .qwen/skills/plan-to-issues/`
Expected: SKILL.md present, scripts/ directory exists

**Step 3: Commit**

```bash
git add .qwen/skills/plan-to-issues/SKILL.md
git commit -m "feat: add plan-to-issues skill with full workflow

Parses writing-plans output and creates GitHub issues per task.
Includes auto-labeling, structured issue bodies, and summary reports.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 4: Integration Test

**Files:**
- Create: `.qwen/skills/plan-to-issues/scripts/test_integration.py`

**Step 1: Write the failing test**

Create `.qwen/skills/plan-to-issues/scripts/test_integration.py`:

```python
#!/usr/bin/env python3
"""Integration test: parse a realistic plan file and verify output."""

import json
import subprocess
import tempfile
import os

PLAN_CONTENT = """# User Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add user CRUD endpoints with authentication.

**Architecture:** REST API with JWT auth middleware.

**Tech Stack:** FastAPI, PostgreSQL, JWT

---

### Task 1: Create user model

**Files:**
- Create: `src/models/user.py`
- Modify: `src/models/__init__.py`

**Step 1: Write the failing test**

```python
def test_user_creation():
    user = User(email="test@example.com")
    assert user.email == "test@example.com"
```

**Step 2: Run test to verify it fails**

Run: pytest tests/test_user_model.py -v
Expected: FAIL

**Step 3: Write minimal implementation**

```python
class User(Base):
    email = Column(String, unique=True)
```

**Step 4: Run test to verify it passes**

Run: pytest tests/test_user_model.py -v
Expected: PASS

### Task 2: Add authentication middleware

**Files:**
- Create: `src/middleware/auth.py`

**Step 1: Write test for auth validation**

```python
def test_invalid_token_rejected():
    response = client.get("/api/users", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401
```

**Step 2: Implement JWT validation**

```python
def verify_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=["HS256"])
```

### Task 3: Update API documentation

**Files:**
- Modify: `docs/api/README.md`

**Step 1: Add endpoint documentation**

Document all user endpoints with request/response examples.
"""

class TestIntegration(unittest.TestCase):
    def test_full_pipeline(self):
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(PLAN_CONTENT)
            plan_file = f.name
        
        try:
            result = subprocess.run(
                ['python3', 'parse_plan.py', plan_file],
                capture_output=True, text=True,
                cwd=os.path.dirname(os.path.abspath(__file__))
            )
            
            self.assertEqual(result.returncode, 0, f"stderr: {result.stderr}")
            
            tasks = json.loads(result.stdout)
            self.assertEqual(len(tasks), 3)
            
            # Verify task 1
            self.assertEqual(tasks[0]['title'], 'Create user model')
            self.assertIn('database', tasks[0]['labels'])
            self.assertIn('testing', tasks[0]['labels'])
            
            # Verify task 2
            self.assertEqual(tasks[1]['title'], 'Add authentication middleware')
            self.assertIn('security', tasks[1]['labels'])
            self.assertIn('api', tasks[1]['labels'])
            
            # Verify task 3
            self.assertEqual(tasks[2]['title'], 'Update API documentation')
            self.assertIn('documentation', tasks[2]['labels'])
            
        finally:
            os.unlink(plan_file)

if __name__ == '__main__':
    import unittest
    unittest.main()
```

**Step 2: Run test to verify it fails**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest test_integration.py -v`
Expected: FAIL (parser may not handle all edge cases yet)

**Step 3: Fix parser if needed**

If test fails, adjust regex in `parse_plan.py` to handle the realistic plan format.

**Step 4: Run test to verify it passes**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest test_integration.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add .qwen/skills/plan-to-issues/scripts/test_integration.py
git commit -m "test: add integration test for realistic plan parsing

Verifies full pipeline from plan file to parsed tasks with labels.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 5: Update writing-plans Handoff

**Files:**
- Modify: `.qwen/skills/writing-plans/SKILL.md`

**Step 1: Add third execution option**

Read `.qwen/skills/writing-plans/SKILL.md` and find the "Execution Handoff" section.

Replace:

```markdown
## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?"**
```

With:

```markdown
## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Three execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**3. Plan-to-Issues (team workflow)** - Convert plan tasks to GitHub issues for team distribution

**Which approach?"**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Session chosen:**
- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans

**If Plan-to-Issues chosen:**
- **REQUIRED SUB-SKILL:** Use plan-to-issues
- Parses plan and creates one GitHub issue per task
- Auto-detects labels from task content
- Prints summary table with issue URLs
```

**Step 2: Commit**

```bash
git add .qwen/skills/writing-plans/SKILL.md
git commit -m "feat: add Plan-to-Issues as third execution option

Teams can now distribute plan tasks as GitHub issues directly from writing-plans.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 6: Package and Validate

**Files:**
- Run: `.qwen/skills/skill-creator/scripts/package_skill.py`

**Step 1: Run all tests**

Run: `cd .qwen/skills/plan-to-issues/scripts && python -m pytest -v`
Expected: All tests PASS (unit + integration)

**Step 2: Package skill**

Run: `python3 .qwen/skills/skill-creator/scripts/package_skill.py .qwen/skills/plan-to-issues`
Expected: Creates `plan-to-issues.skill` package file

**Step 3: Verify skill is discoverable**

Run: `ls -la .qwen/skills/plan-to-issues/`
Expected: SKILL.md, scripts/ directory with parse_plan.py and tests

**Step 4: Final commit**

```bash
git add .qwen/skills/plan-to-issues/
git commit -m "feat: complete plan-to-issues skill with tests and packaging

Full implementation: parser, label detection, SKILL.md, integration tests.
Updates writing-plans to offer Plan-to-Issues as third execution option.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```
