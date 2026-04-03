# QWEN.md — Everything Qwen Code (EQW)

## Project Overview

**Everything Qwen Code (EQW)** is a production-ready AI coding plugin for Qwen Code, providing **37 specialized agents**, **323 skills**, **68 commands**, and automated **hook workflows** for software development.

Built and evolved over **10+ months of intensive daily use**, this is not just configs — it's a complete system: agents, skills, hooks, rules, and MCP configurations.

**Version:** 0.2.1 | **License:** MIT | **Author:** [mowgliph (Jelvys Triana)](https://github.com/mowgliph)

**Repository:** https://github.com/mowgliph/everything-qwen-code

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `.agents/` | 37 specialized agent configurations (markdown files with prompts) |
| `.qwen/skills/` | 323 domain-specific skills for workflows and patterns |
| `.qwen/commands/` | 68 slash commands |
| `.qwen/hooks/` | Automated hooks for PreToolUse, PostToolUse, SessionStart, Stop events |
| `.qwen/rules/` | Coding standards for 12+ languages |
| `.qwen/mcp-configs/` | MCP server configurations |
| `scripts/` | Utility scripts (MCP setup, health checks, orchestration) |
| `tests/` | Test suite (unit, integration, E2E) |
| `docs/` | Documentation, plans, and design records |
| `contexts/` | Context files |
| `bin/` | CLI entry points (`eqw-install`) |

---

## Agents (37)

Specialized agents for every software development task:

**Planning & Architecture:** `planner`, `architect`, `chief-of-staff`, `feature-analyst`

**Code Review:** `code-reviewer`, `security-reviewer`, `typescript-reviewer`, `python-reviewer`, `go-reviewer`, `java-reviewer`, `kotlin-reviewer`, `rust-reviewer`, `cpp-reviewer`, `database-reviewer`, `flutter-reviewer`

**Build & Debug:** `build-error-resolver`, `tdd-guide`, `go-build-resolver`, `java-build-resolver`, `kotlin-build-resolver`, `rust-build-resolver`, `cpp-build-resolver`, `pytorch-build-resolver`

**Documentation:** `doc-updater`, `docs-lookup`

**Specialized:** `e2e-runner`, `refactor-cleaner`, `loop-operator`, `harness-optimizer`, `performance-optimizer`, `healthcare-reviewer`, `opensource-forker`, `opensource-packager`, `opensource-sanitizer`, `gan-evaluator`, `gan-generator`, `gan-planner`

See `.agents/` for complete agent definitions.

---

## Skills (323)

Skills cover every development workflow:

**Core Engineering:** `brainstorming`, `writing-plans`, `tdd-workflow`, `code-review-excellence`, `security-review`, `debugging-strategies`

**Language-Specific:** `python-patterns`, `python-testing`, `golang-patterns`, `golang-testing`, `rust-patterns`, `rust-async-patterns`, `typescript-advanced-types`, `kotlin-patterns`, `kotlin-testing`, `java-patterns`, `java-testing`

**Frontend:** `frontend-design`, `frontend-patterns`, `react-modernization`, `react-state-management`, `responsive-design`, `design-system-patterns`, `nextjs-app-router-patterns`

**Backend:** `backend-patterns`, `postgres-patterns`, `auth-implementation-patterns`, `microservices-patterns`, `async-python-patterns`

**DevOps & Infra:** `docker-patterns`, `github-actions-templates`, `terraform-module-library`, `k8s-manifest-generator`, `helm-chart-scaffolding`

**Security:** `security-review`, `sast-configuration`, `auth-implementation-patterns`, `secrets-management`

See `.qwen/skills/` for the complete list.

---

## Building and Running

### Installation

```bash
# Global installation (recommended)
npx eqw-install

# Or from GitHub
npm install -g github:mowgliph/everything-qwen-code
eqw-install

# Local installation
git clone https://github.com/mowgliph/everything-qwen-code.git
cd everything-qwen-code
npm install
```

### Running Tests

```bash
# Run all tests
npm test
# or
node tests/run-all.js
```

### Linting

```bash
npm run lint
```

### MCP Server Setup

```bash
# Auto-configure MCP servers
node scripts/setup-mcp-servers.js --auto

# List available MCP servers
node scripts/setup-mcp-servers.js --list

# Check MCP status
node scripts/setup-mcp-servers.js --status
```

---

## Development Conventions

### Core Principles

1. **Agent-First** — Delegate to specialized agents for domain tasks
2. **Test-Driven** — Write tests before implementation, 80%+ coverage required
3. **Security-First** — Never compromise on security; validate all inputs
4. **Immutability** — Always create new objects, never mutate existing ones
5. **Plan Before Execute** — Plan complex features before writing code

### Coding Style

- Functions small (<50 lines), files focused (<800 lines)
- No deep nesting (>4 levels)
- Proper error handling, no hardcoded values
- Readable, well-named identifiers
- Many small files over few large ones (200-400 lines typical, 800 max)
- Organize by feature/domain, not by type

### Testing Requirements

- **Minimum coverage: 80%**
- Unit tests, integration tests, and E2E tests all required
- TDD workflow: write test first (RED) → minimal implementation (GREEN) → refactor (IMPROVE)

### Git Workflow

- Commit format: `<type>: <description>` — Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`
- Conventional commits format
- Comprehensive PR summaries

### Workflow Surface Policy

- `skills/` is the canonical workflow surface
- New workflow contributions should land in `skills/` first
- `commands/` is a legacy slash-entry compatibility surface

---

## Hooks System

Automated hooks run at various lifecycle events:

| Hook Event | Purpose |
|------------|---------|
| `PreToolUse` | Block git hook-bypass, auto-start dev servers, commit quality checks, config protection |
| `PostToolUse` | Audit bash commands, PR logging, quality gates, console.log warnings |
| `SessionStart` | Load previous context, detect package manager |
| `Stop` | Batch format/typecheck, session evaluation, cost tracking, continuous learning |

Hooks are configured in `.qwen/hooks/hooks.json` and can be enabled/disabled via flags.

---

## Architecture

```
everything-qwen-code/
├── .agents/              # 37 agents in Qwen Code format
├── .qwen/                # Qwen Code configuration
│   ├── skills/           # 323 skills
│   ├── commands/         # 68 commands
│   ├── hooks/            # Automated hooks
│   ├── rules/            # Language rules (12+ languages)
│   └── mcp-configs/      # MCP server configs
├── contexts/             # Context files
├── docs/                 # Documentation
├── examples/             # Usage examples
├── manifests/            # Installation manifests
├── plugins/              # Plugins
├── research/             # Research
├── schemas/              # JSON schemas
├── scripts/              # Utility scripts
├── tests/                # Test suite
├── bin/                  # CLI entry points
├── AGENTS.md             # Agent instructions (comprehensive)
├── agent.yaml            # Agent configuration
├── package.json          # Package configuration
└── CHANGELOG.md          # Changelog
```

---

## Key Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Comprehensive agent instructions and guidelines |
| `agent.yaml` | Agent spec configuration |
| `package.json` | NPM package definition, scripts, dependencies |
| `bin/eqw-install` | Global installer script |
| `.qwen/hooks/hooks.json` | Hook configuration |
| `CHANGELOG.md` | Version history |
| `VERSION` | Current version (0.2.1) |

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Acknowledgments

This project was inspired by and forked from [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) by [@affaan-m](https://github.com/affaan-m), adapted for **Qwen Code**.
