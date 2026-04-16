---
name: ci-debug-workflow
description: Automated CI/CD failure debugging workflow for GitHub Actions. Fetches logs, invokes systematic-debugging for root cause analysis, then sends findings to brainstorming for solution design. Use when CI workflows fail.
---

# CI Debug Workflow

Automated end-to-end debugging workflow for GitHub Actions failures.

## When to Use This Skill

Use this skill when:
- GitHub Actions CI/CD workflows fail
- Build, test, or deployment jobs error out
- User asks to "check why CI failed" or "fix the build"
- You need to debug workflow failures systematically

## Workflow Overview

This skill orchestrates a three-phase debugging process:

```
Phase 1: Fetch Logs → Phase 2: Systematic Debugging → Phase 3: Brainstorming Solution
```

## Step-by-Step Process

### Phase 1: Fetch Failed Workflow Logs

**Goal:** Get complete error logs from the failed GitHub Actions run.

**Commands:**

```bash
# 1. List recent workflow runs to find the failed one
gh run list --limit 5 --json status,name,headBranch,updatedAt,databaseId

# 2. Get logs from the failed run (replace RUN_ID)
gh run view <RUN_ID> --log > /tmp/ci-logs.txt

# 3. If logs are truncated, fetch specific job logs
gh run view <RUN_ID> --log-failed > /tmp/ci-failed-logs.txt
```

**Extract Key Error Information:**

From the logs, identify:
- **Error message**: The actual failure reason
- **Failing step**: Which job/step failed (test, build, lint, deploy)
- **Stack trace**: Full error output if available
- **Context**: What was running when it failed

**Save Analysis:**

Create a temporary analysis file:

```markdown
# CI Failure Analysis

## Workflow Info
- Run ID: <ID>
- Workflow: <name>
- Branch: <branch>
- Status: failed

## Error Summary
<Extract the key error message>

## Full Logs
<Attach or reference the log file>
```

### Phase 2: Invoke Systematic Debugging

**Goal:** Perform root cause analysis using systematic-debugging methodology.

**Action:**

Invoke the `systematic-debugging` skill:

```
skill: "systematic-debugging"
```

**Provide Context:**

Share with systematic-debugging:
1. The error message extracted from logs
2. The full log output (or path to log file)
3. Recent changes that might be related
4. Any patterns observed (cascade failures, specific step failures)

**Expected Output:**

Systematic debugging will provide:
- Root cause hypothesis
- Evidence gathered from logs
- Pattern analysis (what changed, what's different)
- Recommended solution direction

### Phase 3: Invoke Brainstorming for Solution Design

**Goal:** Generate a robust, concise solution design based on the root cause analysis.

**Action:**

Invoke the `brainstorming` skill:

```
skill: "brainstorming"
```

**Provide Context:**

Share with brainstorming:
1. The root cause analysis from systematic-debugging
2. Project constraints (e.g., "local is for coding only, CI handles everything")
3. Repository structure and workflow patterns
4. Any specific requirements from the user

**Expected Output:**

Brainstorming will provide:
- 2-3 solution approaches with trade-offs
- Recommended approach with reasoning
- Complete design document
- Implementation plan (via writing-plans skill)

## Complete Example Flow

**User Request:** "CI está fallando, revisa los logs"

**Your Actions:**

1. **Fetch logs:**
   ```bash
   gh run list --limit 5
   gh run view 23710675970 --log > /tmp/ci-logs.txt
   ```

2. **Extract error:**
   ```
   Error: github.com/yuehang/log@v0.0.0-...: invalid version:
   git ls-remote ... exit status 128:
   fatal: could not read Username for 'https://github.com'
   ```

3. **Invoke systematic-debugging:**
   ```
   skill: "systematic-debugging"
   ```
   Provide: Error message, full logs, context about go.mod dependencies

4. **Receive root cause:** "Unused dependency in go.mod causing cascade failure"

5. **Invoke brainstorming:**
   ```
   skill: "brainstorming"
   ```
   Provide: Root cause analysis, project constraints (CI handles all Go operations)

6. **Receive design:** "Remove unused dependency from go.mod, CI already has go mod tidy"

7. **Proceed with implementation** (after design approval)

## Key Principles

### 1. Evidence Before Assertions
- Always fetch actual logs before diagnosing
- Don't guess at errors - read the exact message
- Save log files for reference throughout debugging

### 2. Complete Each Phase
- Don't skip from error → fix without root cause analysis
- Don't propose solutions without brainstorming design
- Follow the full chain: logs → debugging → design → implementation

### 3. Context Matters
- Share project constraints with brainstorming (e.g., "local is for coding, CI handles builds")
- Note repository-specific patterns (existing workflows, tooling)
- Consider what's different from previous successful runs

### 4. Document the Chain
- Keep track of run IDs, error messages, hypotheses
- Save analysis files for reference
- Link back to original failure when implementing fix

## Common CI Failure Patterns

| Error Pattern | Likely Cause | Phase 2 Focus |
|--------------|--------------|---------------|
| `could not read Username` | Private/inaccessible dependency | Dependency chain analysis |
| `exit status 128` | Git operation failed | Repository access, auth |
| `module not found` | Missing or stale dependency | go.mod/go.sum sync |
| `test failed` | Code change broke tests | Recent changes, test output |
| `build failed` | Compilation error | Type errors, missing imports |
| `timeout` | Slow test, resource issue | Performance, resource limits |

## Troubleshooting

**If gh commands fail:**
- Check authentication: `gh auth status`
- Verify repository access
- Try alternative: fetch logs via web UI

**If logs are truncated:**
- Use `--log-failed` flag for failed jobs only
- Fetch specific job: `gh run view <RUN_ID> --job <JOB_ID> --log`
- Check GitHub Actions web UI for complete output

**If systematic-debugging doesn't find root cause:**
- Provide more context (recent commits, related files)
- Check if it's environmental (runner issue, external service)
- Consider adding diagnostic instrumentation to workflow

## Related Skills

- **`systematic-debugging`** - Root cause analysis methodology
- **`brainstorming`** - Solution design and approach exploration
- **`writing-plans`** - Implementation planning after design approval
- **`github-actions-templates`** - CI/CD workflow patterns and best practices

## Output Artifacts

After completing this workflow, you should have:

1. ✅ Log files saved (`/tmp/ci-logs.txt` or similar)
2. ✅ Root cause analysis from systematic-debugging
3. ✅ Solution design from brainstorming
4. ✅ Implementation plan (if design approved)

---

**Remember:** This skill orchestrates the debugging process. The actual analysis comes from systematic-debugging and brainstorming skills. Your role is to facilitate the flow and ensure each skill has the context it needs.
