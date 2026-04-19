# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.0] - 2026-04-19

### Added
- **44 Specialized Agents** now fully integrated and discoverable:
  - All agents properly registered in `install-components.json` manifest
  - Agents available across all supported IDEs: Copilot, Qwen, Kilo, OpenCode, Gemini
  - New agent categories: accessibility, healthcare, opensource, ML workflows, project leadership
- **Redesigned README** with comprehensive documentation:
  - Complete agent catalog with descriptions
  - 391+ skills reference guide
  - IDE-specific installation instructions
  - Architecture and design patterns documentation
  - Multi-CLI abstraction layer overview
- **Credits & Acknowledgments** section:
  - Superpowers framework patterns
  - Everything Claude Code multi-IDE architecture
  - Gstack project orchestration
  - Clear documentation of specification adherence

### Fixed
- **Removed slash from skill name**: `GitHub PR/Merge Workflow` → `GitHub PR Merge Workflow`
  - Updated references in 3 dependent skills (fix-issue, git-workflow-and-versioning, working-with-issues)
  - Fixes parsing issues in skill manifests
- **Agent discovery** - Fixed issue where only 8 agents were being copied to IDEs
  - Extended manifest to include all 44 agent definitions

### Changed
- **Enhanced Documentation**: Multi-section README now covers:
  - Installation options (npm, git, direct)
  - All 44 agents with descriptions and categories
  - Complete skill library overview
  - Language-specific rule sets (13 languages)
  - MCP configurations
- **Better IDE Support Matrix** - Clear status indicators for each platform

### Technical Details
- Files Modified: 5 (README, CHANGELOG, 3 skill references, install manifest)
- Files Enhanced: README.md (~15KB comprehensive docs)
- Agents Registered: 44 (up from 9 in manifest)

## [0.6.0] - 2026-04-11

### Added
- **21 Agent Skills** from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills):
  - `api-and-interface-design`, `browser-testing-with-devtools`, `ci-cd-and-automation`
  - `code-review-and-quality`, `code-simplification`, `context-engineering`
  - `debugging-and-error-recovery`, `deprecation-and-migration`, `documentation-and-adrs`
  - `frontend-ui-engineering`, `git-workflow-and-versioning`, `idea-refine`
  - `incremental-implementation`, `performance-optimization`, `planning-and-task-breakdown`
  - `security-and-hardening`, `shipping-and-launch`, `source-driven-development`
  - `spec-driven-development`, `test-driven-development`, `using-agent-skills`
- **Cross-reference** in `git-workflow-and-versioning` pointing to `github-pr-merge-workflow`
- **Documentation**: CONFIGURATION.md, OMEGA-MEMORY-SETUP.md, installer diff check plans

### Changed
- **github-pr-merge-workflow**: Removed self-approval step — direct merge after disabling branch protection as admin/collaborator

### Technical Details
- **Files Created:** 30 files
- **Files Modified:** 2 files
- **Lines Added:** ~7,367 lines

## [0.5.0] - 2026-04-10

### Added
- **37 Local Skills** synced from `~/.qwen/skills/`:
  - `autoplan`, `browse`, `canary`, `careful`, `checkpoint`, `codex`, `cso`
  - `design-consultation`, `design-html`, `design-review`, `design-shotgun`
  - `devex-review`, `document-release`, `framer-motion-animator`, `freeze`
  - `gstack-upgrade`, `guard`, `health`, `investigate`, `land-and-deploy`
  - `learn`, `office-hours`, `open-gstack-browser`, `pair-agent`
  - `plan-ceo-review`, `plan-design-review`, `plan-devex-review`, `plan-eng-review`
  - `qa`, `qa-only`, `retro`, `review`, `setup-browser-cookies`, `setup-deploy`
  - `ship`, `unfreeze`
- **Magic MCP (21st.dev)** — UI component generation with `@21st-dev/magic`
  - Added to `.mcp.json` and `mcp-configs/mcp-servers.json`
  - Uses `$MAGIC_API_KEY` environment variable
- **Context7 MCP** — Added `$CONTEXT7_API_KEY` environment variable support

## [0.4.0] - 2026-04-04

### Added

- **3 New Specialized Agents**:
  - **js-reviewer** - JavaScript/Node.js code review (prototype pollution, callback hell, sync I/O, missing timeouts)
  - **markdown-reviewer** - Markdown documentation review (broken links, heading structure, stale content, formatting)
  - **spec-reviewer** - SDD spec compliance review (missing requirements, extra work, misunderstandings)
- **plan-to-issues Skill** — Converts `writing-plans` output files into GitHub issues with auto-detected labels
  - Parser (`scripts/parse_plan.py`) extracts task blocks from plan markdown files
  - Auto-detects labels from task content (10 categories: testing, api, frontend, database, security, documentation, refactor, devops, enhancement, bug)
  - 11 tests passing (10 unit + 1 integration)
  - Packaged as `skills-packages/plan-to-issues.skill`
- **Plan-to-Issues as 3rd execution option** in `writing-plans` skill handoff

### Changed

- **Agent Count**: 37 → 41 specialized agents (3 new + 1 from previous release)
- **writing-plans/SKILL.md** — Updated execution handoff to offer 3 options: Subagent-Driven, Parallel Session, Plan-to-Issues
- **AGENTS.md** — Registered 3 new agents in Available Agents table
- **QWEN.md** — Added branch protection rule to Git Workflow section (NEVER commit directly to main)
- **ENV-VARIABLES.md** — Moved to `docs/` directory
- **Project Structure** — Added `skills-packages/` directory for packaged skill files

### Technical Details

- **Files Modified:** 10+ files (3 new agents, plan-to-issues skill, AGENTS.md, QWEN.md, writing-plans/SKILL.md, README.md, CHANGELOG.md, VERSION)
- **Tests:** 11 tests passing for plan-to-issues parser
- **PRs:** #11 (plan-to-issues), #12 (branch protection rule), #13 (project reorg), #14 (3 new agents)

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
