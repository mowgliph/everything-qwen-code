# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-04-03

### Added

- **4 New Specialized Agents** migrated from Tier 1 skills:
  - **agent-evaluator** - Benchmark and compare coding agents with pass rate, cost, time, and consistency metrics
  - **web-quality-auditor** - Comprehensive web audits covering performance (40%), accessibility (30%), SEO (15%), and best practices (15%)
  - **accessibility-auditor** - WCAG 2.2 accessibility auditing with automated testing, manual verification, and remediation guidance
  - **security-analyst** - Extract security requirements from threat models, create security user stories, and build compliance mappings
- **feature-analyst Agent** - Comprehensive feature research and analysis across code, product, and technical dimensions
- **QWEN.md** - Project context file for future interactions

### Changed

- **Skills Cleanup**: Removed 5 skills migrated to agents:
  - `agent-eval` → `agent-evaluator`
  - `web-quality-audit` → `web-quality-auditor`
  - `performance` → `performance-optimizer` (existing agent)
  - `wcag-audit-patterns` → `accessibility-auditor`
  - `security-requirement-extraction` → `security-analyst`
- **Agent Count**: 37 → 41 specialized agents
- **Skill Count**: 323 → 318 skills (5 migrated, 18 added from global sync in previous release)
- **AGENTS.md**: Updated version from 1.9.0 to 0.2.1, added 5 new agents to table
- **README.md**: Updated agent counts and listings

### Technical Details

- **Files Modified:** 13 files (4 new agents, 5 deleted skills, AGENTS.md, QWEN.md, VERSION, CHANGELOG.md, migration plan)
- **Migration Plan:** `docs/plans/2026-04-03-skills-to-agents-migration.md`

## [0.2.1] - 2026-04-02

### Added

- **MCP Auto-Install System** - Automatic configuration of MCP servers during global installation:
  - `scripts/lib/mcp-catalog.js` - Centralized catalog of 24+ MCP servers with metadata
  - `scripts/lib/mcp-installer.js` - Installation logic with merge and individual config support
  - `scripts/setup-mcp-servers.js` - CLI with --auto, --list, --status, --install, --category modes
  - **11+ Free MCP Servers** auto-configured (context7, memory, playwright, sequential-thinking, duckduckgo, filesystem, vercel, cloudflare-*)
  - **API Key Warnings** for MCPs requiring credentials
- **Auto-Configuration in eqw-install** - MCPs now configure automatically during `npx eqw-install`
- **Comprehensive Documentation** for MCP setup:
  - `docs/commands/setup-mcps.md` - Usage guide with examples and troubleshooting
  - `docs/plans/2026-04-02-mcp-auto-install.md` - Implementation plan with TDD approach
- **Test Suite for MCPs** - 58 tests (100% passing):
  - `tests/lib/mcp-catalog.test.js` - 11 tests for catalog functions
  - `tests/lib/mcp-installer.test.js` - 21 tests for installer logic
  - `tests/scripts/setup-mcp-servers.test.js` - 26 tests for CLI

### Changed

- **Updated `getMcpCategories()`** - Now returns category counts object instead of array
- **Enhanced `bin/eqw-install`** - Shows MCP auto-configuration progress and summary
- **Improved `setup-mcp-servers.js`** - Fixed category handling and output formatting
- **MCP Configuration Migration** - MCPs now stored in `~/.qwen/settings.json` instead of `~/.qwen/mcp.json` for Qwen Code compatibility:
  - Updated `scripts/setup-mcp-servers.js` to use `settings.json` as config target
  - Updated `scripts/lib/mcp-installer.js` to preserve all existing settings when merging MCPs
  - Updated `bin/eqw-install` to install MCPs to `settings.json`
  - Updated `scripts/harness-audit.js` to check for `settings.json` configuration
  - All existing config sections preserved (`modelProviders`, `security`, `model`, `tools`, `general`)
- **Test Updates** - MCP installer and CLI tests updated to use `settings.json`:
  - `tests/lib/mcp-installer.test.js` - Config path updated
  - `tests/scripts/setup-mcp-servers.test.js` - Config path updated

### Technical Details

- **Files Modified:** 7 files (eqw-install, mcp-catalog.js, mcp-installer.js, setup-mcp-servers.js, harness-audit.js, tests)
- **Tests:** 47 tests passing (100%)

### Quality Gates

- ✅ 58/58 tests passing (100%)
- ✅ TDD methodology followed (tests before implementation)
- ✅ Code review approved
- ✅ Documentation complete

## [0.2.0] - 2026-04-02

### Added

- **36 Specialized Agents** for software development tasks:
  - **Planning & Architecture:** `planner`, `architect`, `chief-of-staff`
  - **Code Review:** `code-reviewer`, `security-reviewer`, `typescript-reviewer`, `python-reviewer`, `go-reviewer`, `java-reviewer`, `kotlin-reviewer`, `rust-reviewer`, `cpp-reviewer`
  - **Build & Debug:** `build-error-resolver`, `tdd-guide`
  - **Documentation:** `doc-updater`, `docs-lookup`
- **151 Skills** for specialized workflows:
  - **Core Engineering:** `brainstorming`, `writing-plans`, `tdd-workflow`, `code-review-excellence`, `security-review`
  - **Language-Specific:** `python-patterns`, `golang-patterns`, `rust-patterns`, `typescript-advanced-types`, `kotlin-patterns`
  - **Frontend:** `frontend-design`, `frontend-patterns`, `react-modernization`, `responsive-design`, `design-system-patterns`
  - **Backend:** `backend-patterns`, `postgres-patterns`, `auth-implementation-patterns`, `microservices-patterns`
- **68 Slash Commands** for common workflows:
  - `/create-skill`, `/create-agent`, `/code-review`, `/test`
- **Automated Hooks** for PreToolUse, PostToolUse, SessionStart, and Stop events
- **Rules for 12+ Languages:** TypeScript, Python, Go, Java, Kotlin, Rust, C++, PHP, Perl, and more
- **14 MCP Server Configurations** for external service integration
- **Comprehensive Documentation:** AGENTS.md, SECURITY.md, CONTRIBUTING.md, CHANGELOG.md
- **Test Suite:** Unit tests, integration tests, and E2E tests
- **Plugin System:** Extensible architecture for custom agents, skills, and commands

### Changed

- Initial release as Everything Qwen Code (forked from Everything Claude Code)
- Rebranded for Qwen Code platform
- Version reset to 0.1.0 for initial release

### Security

- Security policy with vulnerability reporting process
- Secure secrets management guidelines

## Links

- [GitHub Repository](https://github.com/mowgliph/everything-qwen-code)
- [Issues](https://github.com/mowgliph/everything-qwen-code/issues)
- [Pull Requests](https://github.com/mowgliph/everything-qwen-code/pulls)
