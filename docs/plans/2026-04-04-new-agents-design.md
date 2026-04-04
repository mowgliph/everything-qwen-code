# New Agents Design: js-reviewer, markdown-reviewer, spec-reviewer

> **Status:** Approved | **Date:** 2026-04-04 | **Author:** Jelvys

## Goal

Add 3 new specialized agents to the project following the existing `.agents/` pattern.

## Architecture

Each agent is a single `.md` file in `.agents/` with YAML frontmatter (`name`, `description`, `color`) and a body containing the agent's core directive and review criteria.

## Agents

### 1. js-reviewer

| Field | Value |
|-------|-------|
| File | `.agents/js-reviewer.md` |
| Color | cyan |
| Scope | Vanilla JS + Node.js (no TypeScript, no framework-specific rules) |

**Review categories:**
- **Security (CRITICAL):** prototype pollution, eval/Function(), insecure deserialization, command injection via child_process
- **Code Quality (HIGH):** callback hell, missing error handling, implicit globals, console.log in production, unhandled promise rejections
- **Node.js Patterns (HIGH):** sync I/O in event loop, missing timeouts on HTTP calls, N+1 queries, error message leakage
- **Performance (MEDIUM):** memory leaks, unbounded arrays, missing stream processing for large data
- **Best Practices (LOW):** magic numbers, poor naming, inconsistent formatting

**No overlap with `typescript-reviewer`** — pure JS patterns only.

### 2. markdown-reviewer

| Field | Value |
|-------|-------|
| File | `.agents/markdown-reviewer.md` |
| Color | green |
| Scope | Markdown documentation files (.md, .mdx) |

**Review categories:**
- **Broken Links (CRITICAL):** internal links to non-existent files, dead anchor references
- **Structure (HIGH):** heading level skips (h1→h3), TOC mismatches, missing title
- **Code Blocks (HIGH):** missing language tags, unclosed fences
- **Stale Content (MEDIUM):** references to removed features, outdated version numbers, deprecated API mentions
- **Formatting (LOW):** trailing whitespace, inconsistent list markers, multiple consecutive blank lines

### 3. spec-reviewer

| Field | Value |
|-------|-------|
| File | `.agents/spec-reviewer.md` |
| Color | yellow |
| Scope | SDD spec compliance — verify implementer built exactly what was requested |

**Review categories:**
- **Missing Requirements (CRITICAL):** what was requested but not implemented
- **Extra Work (HIGH):** what was built but not requested (over-engineering, "nice to haves")
- **Misunderstandings (HIGH):** wrong interpretation of requirements, solved the wrong problem
- **Verification Method:** Read actual code, not implementer's report. Compare line by line.

**Does NOT review code quality** — that's `code-reviewer`'s job. Reports: ✅ Spec compliant or ❌ Issues with file:line references.

## Files to Create

| File | Lines (est.) |
|------|-------------|
| `.agents/js-reviewer.md` | ~80 |
| `.agents/markdown-reviewer.md` | ~60 |
| `.agents/spec-reviewer.md` | ~70 |

## Integration

- Registered in `package.json` agent list (if applicable)
- Referenced in `AGENTS.md` agents table
- Triggered by task tool when file types match (.js/.mjs/.cjs → js-reviewer, .md → markdown-reviewer, SDD workflows → spec-reviewer)
