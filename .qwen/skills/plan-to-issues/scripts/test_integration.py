#!/usr/bin/env python3
"""Integration test: parse a realistic plan file and verify output."""

import json
import subprocess
import tempfile
import os
import unittest

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
    unittest.main()
