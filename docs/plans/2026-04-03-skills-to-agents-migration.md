# Tier 1 Skills → Agents Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert 5 Tier 1 skills into specialized agents and remove the original skill directories.

**Architecture:** Create 4 new agent markdown files in `.agents/`, update AGENTS.md and README.md with new counts, delete 5 skill directories, and commit incrementally.

**Tech Stack:** Markdown agent configs, bash for file operations, git for version control.

---

## Phase 1: Create New Agents

### Task 1: Create agent-evaluator agent

**Files:**
- Create: `.agents/agent-evaluator.md`

**Step 1: Create the agent-evaluator.md file**

Create `.agents/agent-evaluator.md` with content extracted and adapted from `.qwen/skills/agent-eval/SKILL.md`. The agent should specialize in evaluating and comparing coding agents with metrics (pass rate, cost, time, consistency).

**Step 2: Commit**

```bash
git add .agents/agent-evaluator.md
git commit -m "feat: add agent-evaluator for coding agent benchmarking"
```

---

### Task 2: Create web-quality-auditor agent

**Files:**
- Create: `.agents/web-quality-auditor.md`

**Step 1: Create the agent-web-quality-auditor.md file**

Create `.agents/web-quality-auditor.md` combining capabilities from `.qwen/skills/web-quality-audit/SKILL.md`. The agent should perform comprehensive web audits covering performance (40%), accessibility (30%), SEO (15%), and best practices (15%).

**Step 2: Commit**

```bash
git add .agents/web-quality-auditor.md
git commit -m "feat: add web-quality-auditor for comprehensive web audits"
```

---

### Task 3: Create accessibility-auditor agent

**Files:**
- Create: `.agents/accessibility-auditor.md`

**Step 1: Create the agent-accessibility-auditor.md file**

Create `.agents/accessibility-auditor.md` from `.qwen/skills/wcag-audit-patterns/SKILL.md`. The agent should specialize in WCAG 2.2 accessibility auditing with automated testing, manual verification, and remediation guidance.

**Step 2: Commit**

```bash
git add .agents/accessibility-auditor.md
git commit -m "feat: add accessibility-auditor for WCAG 2.2 compliance"
```

---

### Task 4: Create security-analyst agent

**Files:**
- Create: `.agents/security-analyst.md`

**Step 1: Create the agent-security-analyst.md file**

Create `.agents/security-analyst.md` from `.qwen/skills/security-requirement-extraction/SKILL.md`. The agent should extract security requirements from threat models, create security user stories, and build compliance mappings.

**Step 2: Commit**

```bash
git add .agents/security-analyst.md
git commit -m "feat: add security-analyst for threat-to-requirement extraction"
```

---

## Phase 2: Update Documentation

### Task 5: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md`

**Step 1: Update agent count**

Change line 3 from:
```
This is a **production-ready AI coding plugin** providing 37 specialized agents, 323 skills, 68 commands, and automated hook workflows for software development.
```
To:
```
This is a **production-ready AI coding plugin** providing 41 specialized agents, 318 skills, 68 commands, and automated hook workflows for software development.
```

**Step 2: Add new agents to the table**

Add after the `feature-analyst` row:
```
| agent-evaluator | Agent benchmarking and comparison | Comparing coding agents, measuring performance |
| web-quality-auditor | Comprehensive web audits | Performance, accessibility, SEO audits |
| accessibility-auditor | WCAG 2.2 accessibility auditing | Accessibility audits, VPAT compliance |
| security-analyst | Security requirements from threats | Threat modeling, compliance mapping |
```

**Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md with 4 new agents (41 total)"
```

---

### Task 6: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Update agent count references**

Search for "36" and "37" in README.md and update to "41".

**Step 2: Add new agents to listings**

Add the 4 new agents to the agent listings sections.

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README.md with new agent count"
```

---

## Phase 3: Remove Original Skills

### Task 7: Delete skill directories

**Files:**
- Delete: `.qwen/skills/agent-eval/`
- Delete: `.qwen/skills/web-quality-audit/`
- Delete: `.qwen/skills/performance/`
- Delete: `.qwen/skills/wcag-audit-patterns/`
- Delete: `.qwen/skills/security-requirement-extraction/`

**Step 1: Remove skills**

```bash
rm -rf .qwen/skills/agent-eval
rm -rf .qwen/skills/web-quality-audit
rm -rf .qwen/skills/performance
rm -rf .qwen/skills/wcag-audit-patterns
rm -rf .qwen/skills/security-requirement-extraction
```

**Step 2: Verify removal**

```bash
ls .qwen/skills/ | grep -E "agent-eval|web-quality-audit|performance|wcag-audit|security-requirement" || echo "✅ All skills removed"
```

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove 5 skills migrated to agents

Removed skills:
- agent-eval → agent-evaluator
- web-quality-audit → web-quality-auditor
- performance → performance-optimizer (existing agent)
- wcag-audit-patterns → accessibility-auditor
- security-requirement-extraction → security-analyst"
```

---

## Phase 4: Verify and Finalize

### Task 8: Final verification

**Step 1: Count agents and skills**

```bash
echo "Agents: $(ls .agents/ | wc -l)"
echo "Skills: $(ls .qwen/skills/ | wc -l)"
```

Expected: 41 agents, 318 skills

**Step 2: Verify AGENTS.md consistency**

Check that all 41 agents in `.agents/` are listed in the AGENTS.md table.

**Step 3: Final commit if needed**

```bash
git status
# If clean, we're done
```

---

## Summary

| Phase | Tasks | Expected Result |
|-------|-------|-----------------|
| 1: Create Agents | 4 commits | 4 new agent files |
| 2: Update Docs | 2 commits | AGENTS.md, README.md updated |
| 3: Remove Skills | 1 commit | 5 skill directories deleted |
| 4: Verify | 0-1 commits | 41 agents, 318 skills |

**Total: 7-8 commits**
