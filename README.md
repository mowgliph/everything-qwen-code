# Everything Qwen Code

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/mowgliph/everything-qwen-code/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mowgliph/everything-qwen-code?style=flat)](https://github.com/mowgliph/everything-qwen-code/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/mowgliph/everything-qwen-code)](https://github.com/mowgliph/everything-qwen-code/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/mowgliph/everything-qwen-code)](https://github.com/mowgliph/everything-qwen-code/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/mowgliph/everything-qwen-code)](https://github.com/mowgliph/everything-qwen-code/graphs/contributors)
[![GitHub forks](https://img.shields.io/github/forks/mowgliph/everything-qwen-code)](https://github.com/mowgliph/everything-qwen-code/network)
[![Last commit](https://img.shields.io/github/last-commit/mowgliph/everything-qwen-code)](https://github.com/mowgliph/everything-qwen-code/commits/main)
[![Repository size](https://img.shields.io/github/repo-size/mowgliph/everything-qwen-code)](https://github.com/mowgliph/everything-qwen-code)

**The performance optimization system for Qwen Code. From production experience.**

Not just configs. A complete system: skills, agents, hooks, rules, and MCP configurations. Production-ready agents, skills, hooks, rules, and MCP configurations evolved over 10+ months of intensive daily use building real products.

Built exclusively for **Qwen Code**.

---

## Quick Start

### Installation

**Option 1: Global Installation (Recommended)**

Installs EQW to your global `~/.qwen/` directory for use across all workspaces:

```bash
# One-line installation with npx
npx eqw-install

# Or install via npm
npm install -g everything-qwen-code
```

**Option 2: Install from GitHub**

Install globally directly from GitHub repository:

```bash
# Install from GitHub
npm install -g github:mowgliph/everything-qwen-code

# Run the installer
eqw-install
```

**Option 3: Local Installation**

Clone and install in a specific workspace:

```bash
# Clone the repository
git clone https://github.com/mowgliph/everything-qwen-code.git
cd everything-qwen-code

# Install dependencies
npm install
```

### Usage

1. **Agents**: 36 specialized agents for different tasks
   - `planner` - Implementation planning
   - `architect` - System design
   - `code-reviewer` - Code quality review
   - `security-reviewer` - Security analysis
   - `tdd-guide` - Test-driven development

2. **Skills**: 151 skills for specialized workflows
   - `brainstorming` - Design before implementation
   - `writing-plans` - Create implementation plans
   - `security-review` - Security checklist
   - `tdd-workflow` - TDD enforcement

3. **Commands**: 68 slash commands
   - `/create-skill` - Create new skill
   - `/create-agent` - Create new agent
   - `/code-review` - Review code
   - `/test` - Run tests

---

## What's Included

### 36 Agents

Specialized agents for every software development task:

**Planning & Architecture:**
- `planner` - Implementation planning
- `architect` - System architecture
- `chief-of-staff` - Strategic planning

**Code Review:**
- `code-reviewer` - General code review
- `security-reviewer` - Security analysis
- `typescript-reviewer` - TypeScript/JavaScript
- `python-reviewer` - Python
- `go-reviewer` - Go
- `java-reviewer` - Java
- `kotlin-reviewer` - Kotlin
- `rust-reviewer` - Rust
- `cpp-reviewer` - C++

**Build & Debug:**
- `build-error-resolver` - Fix build errors
- `tdd-guide` - Test-driven development

**Documentation:**
- `doc-updater` - Update documentation
- `docs-lookup` - API documentation

*(See `.agents/` for complete list)*

### 151 Skills

Skills for every development workflow:

**Core Engineering:**
- `brainstorming` - Design before code
- `writing-plans` - Implementation plans
- `tdd-workflow` - Test-driven development
- `code-review-excellence` - Code review patterns
- `security-review` - Security checklist

**Language-Specific:**
- `python-patterns`, `python-testing`
- `golang-patterns`, `golang-testing`
- `rust-patterns`, `rust-async-patterns`
- `typescript-advanced-types`
- `kotlin-patterns`, `kotlin-testing`

**Frontend:**
- `frontend-design`, `frontend-patterns`
- `react-modernization`, `react-state-management`
- `responsive-design`, `design-system-patterns`

**Backend:**
- `backend-patterns`, `postgres-patterns`
- `auth-implementation-patterns`
- `microservices-patterns`

*(See `.qwen/skills/` for complete list)*

### Rules for 12+ Languages

Coding standards for:

- TypeScript/JavaScript
- Python
- Go
- Java
- Kotlin
- Rust
- C++
- PHP
- Perl
- Common (all languages)

*(See `.qwen/rules/` for complete list)*

---

## Project Structure

```
everything-qwen-code/
├── .agents/              # 36 agents in Qwen Code format
├── .qwen/                # Qwen Code configuration
│   ├── skills/           # 151 skills
│   ├── commands/         # 68 commands
│   ├── hooks/            # Automated hooks
│   ├── rules/            # Language rules
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
├── .gitignore            # Git ignore rules
├── .mcp.json             # MCP configuration
├── AGENTS.md             # Agent documentation
├── agent.yaml            # Agent configuration
├── CHANGELOG.md          # Changelog
├── package.json          # Package configuration
└── README.md             # This file
```

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

This project was inspired by and forked from the excellent [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) project by [@affaan-m](https://github.com/affaan-m). The original project was built for Claude Code, and this adaptation brings the same powerful patterns, agents, skills, and workflows to **Qwen Code**.

Thanks to the original author for creating an amazing foundation to build upon.

## Links

- [GitHub Repository](https://github.com/mowgliph/everything-qwen-code)
- [Issues](https://github.com/mowgliph/everything-qwen-code/issues)
- [Pull Requests](https://github.com/mowgliph/everything-qwen-code/pulls)
