# Everything Qwen Code (ECC) â€” Agent Instructions

This is a **production-ready AI coding plugin** providing 41 specialized agents, 318 skills, 68 commands, and automated hook workflows for software development.

**Version:** 0.2.1

## Core Principles

1. **Agent-First** â€” Delegate to specialized agents for domain tasks
2. **Test-Driven** â€” Write tests before implementation, 80%+ coverage required
3. **Security-First** â€” Never compromise on security; validate all inputs
4. **Immutability** â€” Always create new objects, never mutate existing ones
5. **Plan Before Execute** â€” Plan complex features before writing code

## Available Agents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design and scalability | Architectural decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code quality and maintainability | After writing/modifying code |
| security-reviewer | Vulnerability detection | Before commits, sensitive code |
| build-error-resolver | Fix build/type errors | When build fails |
| e2e-runner | End-to-end Playwright testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| spec-reviewer | SDD spec compliance review | Subagent-Driven Development workflows |
| doc-updater | Documentation and codemaps | Updating docs |
| markdown-reviewer | Markdown documentation review | Documentation, READMEs, guides |
| cpp-reviewer | C++ code review | C++ projects |
| cpp-build-resolver | C++ build errors | C++ build failures |
| docs-lookup | Documentation lookup via Context7 | API/docs questions |
| go-reviewer | Go code review | Go projects |
| go-build-resolver | Go build errors | Go build failures |
| kotlin-reviewer | Kotlin code review | Kotlin/Android/KMP projects |
| kotlin-build-resolver | Kotlin/Gradle build errors | Kotlin build failures |
| database-reviewer | PostgreSQL/Supabase specialist | Schema design, query optimization |
| python-reviewer | Python code review | Python projects |
| java-reviewer | Java and Spring Boot code review | Java/Spring Boot projects |
| java-build-resolver | Java/Maven/Gradle build errors | Java build failures |
| loop-operator | Autonomous loop execution | Run loops safely, monitor stalls, intervene |
| harness-optimizer | Harness config tuning | Reliability, cost, throughput |
| rust-reviewer | Rust code review | Rust projects |
| rust-build-resolver | Rust build errors | Rust build failures |
| pytorch-build-resolver | PyTorch runtime/CUDA/training errors | PyTorch build/training failures |
| typescript-reviewer | TypeScript/JavaScript code review | TypeScript/JavaScript projects |
| js-reviewer | JavaScript/Node.js code review | JS/Node.js projects |
| feature-analyst | Feature research and analysis | Analyzing features, competitive research, feasibility studies |
| agent-evaluator | Agent benchmarking and comparison | Comparing coding agents, measuring performance |
| web-quality-auditor | Comprehensive web audits | Performance, accessibility, SEO audits |
| accessibility-auditor | WCAG 2.2 accessibility auditing | Accessibility audits, VPAT compliance |
| security-analyst | Security requirements from threats | Threat modeling, compliance mapping |

## Agent Orchestration

Use agents proactively without user prompt:
- Complex feature requests â†’ **planner**
- Code just written/modified â†’ **code-reviewer**
- Bug fix or new feature â†’ **tdd-guide**
- Architectural decision â†’ **architect**
- Security-sensitive code â†’ **security-reviewer**
- Autonomous loops / loop monitoring â†’ **loop-operator**
- Harness config reliability and cost â†’ **harness-optimizer**

Use parallel execution for independent operations â€” launch multiple agents simultaneously.

## Security Guidelines

**Before ANY commit:**
- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints
- Error messages don't leak sensitive data

**Secret management:** NEVER hardcode secrets. Use environment variables or a secret manager. Validate required secrets at startup. Rotate any exposed secrets immediately.

**If security issue found:** STOP â†’ use security-reviewer agent â†’ fix CRITICAL issues â†’ rotate exposed secrets â†’ review codebase for similar issues.

## Coding Style

**Immutability (CRITICAL):** Always create new objects, never mutate. Return new copies with changes applied.

**File organization:** Many small files over few large ones. 200-400 lines typical, 800 max. Organize by feature/domain, not by type. High cohesion, low coupling.

**Error handling:** Handle errors at every level. Provide user-friendly messages in UI code. Log detailed context server-side. Never silently swallow errors.

**Input validation:** Validate all user input at system boundaries. Use schema-based validation. Fail fast with clear messages. Never trust external data.

**Code quality checklist:**
- Functions small (<50 lines), files focused (<800 lines)
- No deep nesting (>4 levels)
- Proper error handling, no hardcoded values
- Readable, well-named identifiers

## Testing Requirements

**Minimum coverage: 80%**

Test types (all required):
1. **Unit tests** â€” Individual functions, utilities, components
2. **Integration tests** â€” API endpoints, database operations
3. **E2E tests** â€” Critical user flows

**TDD workflow (mandatory):**
1. Write test first (RED) â€” test should FAIL
2. Write minimal implementation (GREEN) â€” test should PASS
3. Refactor (IMPROVE) â€” verify coverage 80%+

Troubleshoot failures: check test isolation â†’ verify mocks â†’ fix implementation (not tests, unless tests are wrong).

## Development Workflow

1. **Plan** â€” Use planner agent, identify dependencies and risks, break into phases
2. **TDD** â€” Use tdd-guide agent, write tests first, implement, refactor
3. **Review** â€” Use code-reviewer agent immediately, address CRITICAL/HIGH issues
4. **Capture knowledge in the right place**
   - Personal debugging notes, preferences, and temporary context â†’ auto memory
   - Team/project knowledge (architecture decisions, API changes, runbooks) â†’ the project's existing docs structure
   - If the current task already produces the relevant docs or code comments, do not duplicate the same information elsewhere
   - If there is no obvious project doc location, ask before creating a new top-level file
5. **Commit** â€” Conventional commits format, comprehensive PR summaries

## Workflow Surface Policy

- `skills/` is the canonical workflow surface.
- New workflow contributions should land in `skills/` first.
- `commands/` is a legacy slash-entry compatibility surface and should only be added or updated when a shim is still required for migration or cross-harness parity.

## Git Workflow

**NEVER commit directly to main** — Always create a feature branch (`feat/descriptive-name`) before making changes. If on `main` and need to make changes: `git checkout -b feat/name` first. All changes to `main` must go through a PR.

**Commit format:** `<type>: <description>` â€" Types: feat, fix, refactor, docs, test, chore, perf, ci

**PR workflow:** Analyze full commit history â†' draft comprehensive summary â†' include test plan â†' push with `-u` flag.

## Architecture Patterns

**API response format:** Consistent envelope with success indicator, data payload, error message, and pagination metadata.

**Repository pattern:** Encapsulate data access behind standard interface (findAll, findById, create, update, delete). Business logic depends on abstract interface, not storage mechanism.

**Skeleton projects:** Search for battle-tested templates, evaluate with parallel agents (security, extensibility, relevance), clone best match, iterate within proven structure.

## Performance

**Context management:** Avoid last 20% of context window for large refactoring and multi-file features. Lower-sensitivity tasks (single edits, docs, simple fixes) tolerate higher utilization.

**Build troubleshooting:** Use build-error-resolver agent â†’ analyze errors â†’ fix incrementally â†’ verify after each fix.

## Project Structure

```
agents/          â€” 36 specialized subagents
skills/          â€” 151 workflow skills and domain knowledge
commands/        â€” 68 slash commands
hooks/           â€” Trigger-based automations
rules/           â€” Always-follow guidelines (common + per-language)
scripts/         â€” Cross-platform Node.js utilities
mcp-configs/     â€” 14 MCP server configurations
tests/           â€” Test suite
```

`commands/` remains in the repo for compatibility, but the long-term direction is skills-first.

## Success Metrics

- All tests pass with 80%+ coverage
- No security vulnerabilities
- Code is readable and maintainable
- Performance is acceptable
- User requirements are met

