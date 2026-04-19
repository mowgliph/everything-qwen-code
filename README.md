# 🚀 Everything Agents Skills

> **The Ultimate Universal AI Coding Assistant Framework**  
> 44 Specialized Agents • 391+ Skills • 13 Language Rules • Multi-CLI Support

[![Version](https://img.shields.io/badge/version-0.4.0-blue.svg)](https://github.com/mowgliph/everything-agents-skills/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mowgliph/everything-agents-skills?style=flat)](https://github.com/mowgliph/everything-agents-skills/stargazers)
[![Agents](https://img.shields.io/badge/agents-44-green.svg)](#-44-specialized-agents)
[![Skills](https://img.shields.io/badge/skills-391+-purple.svg)](#-391-skills)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Installation](#-installation)
- [44 Specialized Agents](#-44-specialized-agents)
- [391+ Skills Available](#-391-skills)
- [Supported IDEs](#-supported-ides)
- [Language Rules](#-language-rules)
- [MCPs & Integrations](#-mcps--integrations)
- [Architecture](#-architecture)
- [Credits & Acknowledgments](#-credits--acknowledgments)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Everything Agents Skills** is a comprehensive, universal framework for AI coding assistants. Built to work seamlessly across multiple CLI platforms, it provides:

- **44 Specialized Agents** for targeted tasks (code review, security analysis, testing, deployment)
- **391+ Production-Ready Skills** covering every aspect of software development
- **13 Language Rule Sets** ensuring code quality and consistency
- **Multi-CLI Support** - write once, run everywhere

### Why This Project?

- 🎯 **Unified Experience** - Same skills across Qwen, OpenCode, Gemini, Copilot, Kilo
- 🔧 **Production-Ready** - Battle-tested workflows for real-world development
- 🧠 **Intelligent Agents** - Specialized agents for every task
- 📦 **Easy Installation** - Single command to add 391+ skills
- 🔄 **Always Updated** - Continuous improvement and expansion

---

## 🚀 Installation

### Quick Start (Recommended)

```bash
# Clone repository
git clone https://github.com/mowgliph/everything-agents-skills.git
cd everything-agents-skills

# Run interactive installer
./scripts/install.sh
```

### Install 391+ Skills Directly

```bash
# Using npm (Recommended)
npx skill add https://github.com/mowgliph/everything-agents-skills.git

# Or using yarn
yarn skill add https://github.com/mowgliph/everything-agents-skills.git

# Or clone and install manually
git clone https://github.com/mowgliph/everything-agents-skills.git
cd everything-agents-skills
npm install && npm run setup
```

### Supported IDEs Setup

See [IDE-Specific Configuration](#-supported-ides) below for platform-specific instructions.

---

## 🧠 44 Specialized Agents

Each agent is purpose-built for specific tasks:

### Code Quality & Review
- **code-reviewer** - Comprehensive code review with security checks
- **security-reviewer** - Security vulnerability analysis
- **security-analyst** - Threat modeling and risk assessment
- **spec-reviewer** - API and specification review

### Language-Specific Reviewers
- **typescript-reviewer** - TypeScript/JavaScript expertise
- **python-reviewer** - Python code analysis
- **java-reviewer** - Java/Spring patterns
- **go-reviewer** - Go concurrency patterns
- **rust-reviewer** - Rust memory safety
- **kotlin-reviewer** - Kotlin/Android patterns
- **cpp-reviewer** - C++ systems programming
- **js-reviewer** - JavaScript frameworks
- **flutter-reviewer** - Flutter/Dart mobile

### Build & Deployment
- **build-error-resolver** - Generic build failures
- **cpp-build-resolver** - C++ compilation issues
- **java-build-resolver** - Java/Maven/Gradle issues
- **go-build-resolver** - Go build errors
- **rust-build-resolver** - Rust cargo issues
- **kotlin-build-resolver** - Kotlin compiler errors
- **pytorch-build-resolver** - PyTorch setup issues

### Development & Architecture
- **architect** - System design and architecture
- **feature-analyst** - Feature research and feasibility
- **planner** - Feature implementation planning
- **refactor-cleaner** - Dead code removal
- **performance-optimizer** - Performance optimization
- **docs-lookup** - Documentation search

### Testing & Quality
- **tdd-guide** - Test-driven development
- **e2e-runner** - End-to-end testing
- **database-reviewer** - Database design review
- **healthcare-reviewer** - HIPAA/healthcare compliance

### Specialized Tools
- **accessibility-auditor** - WCAG accessibility compliance
- **web-quality-auditor** - Web performance auditing
- **markdown-reviewer** - Markdown formatting
- **agent-evaluator** - AI agent performance testing
- **gan-evaluator**, **gan-generator**, **gan-planner** - ML model workflows
- **opensource-forker** - GitHub repository forking
- **opensource-packager** - Package publishing
- **opensource-sanitizer** - Code sanitization
- **harness-optimizer** - Test harness optimization
- **chief-of-staff** - Project leadership assistant
- **loop-operator** - Workflow orchestration
- **doc-updater** - Documentation maintenance

---

## 🛠️ 391+ Skills

The complete skill library covers:

### Architecture & Design
- API design principles
- Hexagonal architecture
- Clean architecture patterns
- CQRS implementation
- Event sourcing patterns
- Microservices patterns
- And 50+ more architectural patterns

### Frontend Development
- React modernization
- Next.js patterns
- React Native design
- Responsive design
- Tailwind design systems
- Web components
- Animation libraries (Framer Motion)

### Backend Development
- FastAPI templates
- Node.js patterns
- Django patterns
- Flask patterns
- Express.js patterns
- GraphQL implementation
- REST API design

### Database & Data
- PostgreSQL optimization
- Database migration patterns
- Data quality frameworks
- Embedding strategies
- Vector index tuning
- SQL optimization

### DevOps & Infrastructure
- Kubernetes patterns
- Istio traffic management
- Docker containerization
- Terraform modules
- CI/CD automation
- GitHub Actions workflows
- Prometheus monitoring

### Security
- OAuth2 implementation
- JWT authentication
- GDPR compliance
- PCI compliance
- STRIDE threat modeling
- Security scanning (SAST)

### Testing & Quality
- E2E testing patterns
- JavaScript testing
- Python testing
- Accessibility testing
- Performance optimization

### Languages & Frameworks
- TypeScript advanced types
- Python design patterns
- Go concurrency
- Rust async patterns
- Java patterns
- Kotlin patterns
- C++ patterns

**[View Complete Skills List →](SKILLS.md)**

---

## 🖥️ Supported IDEs

| IDE | Skills | Agents | Commands | Hooks | Rules | Status |
|-----|--------|--------|----------|-------|-------|--------|
| **Qwen Code** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | Stable |
| **GitHub Copilot** | ✅ Full | ✅ 44 | - | - | ✅ Full | **NEW** |
| **Kilo Code** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | Stable |
| **OpenCode** | ✅ Full | ✅ Full | - | - | ✅ Full | Stable |
| **Gemini CLI** | ✅ Full | - | - | - | ✅ Full | Beta |

### IDE-Specific Configuration

#### GitHub Copilot CLI
```bash
# Install Copilot CLI first
npm install -g @github/copilot-cli

# Add skills
npx skill add https://github.com/mowgliph/everything-agents-skills.git

# All 44 agents are now available
```

#### Qwen Code
```bash
# Install Qwen Code
# Visit: https://qwencode.com/install

# Clone and setup
git clone https://github.com/mowgliph/everything-agents-skills.git
cd everything-agents-skills
./scripts/install.sh
# Select option [1]
```

#### Kilo Code
```bash
./scripts/install.sh  # Select option [5]
```

---

## 📋 Language Rules

Code quality rules for 13 languages/frameworks:

- **common** - Universal code quality standards
- **typescript** - TypeScript/JavaScript best practices
- **python** - Python coding standards (PEP 8+)
- **java** - Java/Spring framework patterns
- **golang** - Go idiomatic patterns
- **rust** - Rust safety and performance
- **kotlin** - Kotlin/Android standards
- **cpp** - C++ systems programming
- **csharp** - C# .NET patterns
- **php** - PHP modern standards
- **perl** - Perl best practices
- **swift** - Swift/iOS development
- **zh** - Chinese coding standards

---

## 🔌 MCPs & Integrations

MCPs (Model Context Protocols) supported:

### Configured MCPs
- GitHub API integration
- Documentation lookup
- Code analysis
- Research APIs

### Available in CLI Configs
```
cli-configs/
├── copilot/
│   └── mcp-configs/
├── qwen/
│   └── mcp-configs/
└── opencode/
    └── .mcp.json
```

---

## 📁 Project Structure

```
everything-agents-skills/
├── agents/                 # 44 Specialized agents
├── skills/                 # 391+ Skills (dev patterns, workflows)
├── rules/                  # 13 Language-specific rule sets
├── commands/               # CLI commands
├── hooks/                  # Pre/post-commit hooks
├── contexts/               # Development contexts
├── cli-configs/            # IDE-specific configurations
│   ├── copilot/
│   ├── qwen/
│   ├── kilo/
│   ├── gemini/
│   └── opencode/
├── manifests/              # Install profiles & components
├── docs/                   # Comprehensive documentation
├── scripts/                # Installation & automation
└── tests/                  # Test suite
```

---

## 🏗️ Architecture

### Multi-CLI Abstraction Layer

The project implements a **unified abstraction** over 5+ AI coding CLIs:

```
┌─────────────────────────────────────────┐
│   Skills, Agents, Commands, Hooks       │
│  (Universal, platform-agnostic)         │
├─────────────────────────────────────────┤
│       CLI Adapter Layer                 │
├──────────┬──────────┬──────────┬────────┤
│  Qwen    │ Copilot  │  Kilo    │ Gemini │
│  Code    │   CLI    │  Code    │  CLI   │
└──────────┴──────────┴──────────┴────────┘
```

### Installation Strategy

1. **Direct Installation** - Skills synced to IDE-specific directories
2. **Git Integration** - Hooks for automatic sync
3. **NPM Registry** - Installation via `npx skill add`
4. **Interactive Installer** - `./scripts/install.sh`

---

## 💡 Use Cases

### 🎯 For Developers
- Consistent development experience across IDEs
- 44 agents specialized for every development task
- 391+ skills for any coding problem
- Automated code review and quality checks

### 🏢 For Teams
- Shared coding standards across organization
- Unified skill library for all team members
- Language-specific rules enforcement
- Centralized CLI configuration

### 🔧 For DevOps
- Deployment automation
- Infrastructure as Code patterns
- CI/CD workflow templates
- Container orchestration skills

---

## 📚 Credits & Acknowledgments

This project builds upon and integrates the exceptional work and architectural patterns from:

### 🙌 Superpowers
> **Repository:** [https://github.com/superpowers/superpowers](https://github.com/superpowers/superpowers)

The skill activation and management system is built upon Superpowers' innovative agent framework architecture. We're using their core specifications for skill declaration, lifecycle management, and agent orchestration patterns.

**Key Inspiration:**
- Agent context management
- Skill composition patterns
- State machine architecture

### 🔮 Everything Claude Code
> **Repository:** [https://github.com/mowgliph/everything-claude-code](https://github.com/mowgliph/everything-claude-code)

The multi-IDE compatibility layer and universal CLI abstraction patterns are derived from Everything Claude Code's groundbreaking work in creating platform-agnostic AI assistant frameworks.

**Key Patterns:**
- Cross-IDE skill synchronization
- Unified configuration management
- IDE-specific adapter patterns

### 📦 Gstack
> **Repository:** [https://github.com/gstack/gstack](https://github.com/gstack/gstack)

The project orchestration, automated workflows, and agent harness construction patterns are built on Gstack's powerful project lifecycle management framework.

**Key Features Used:**
- Workflow orchestration patterns
- Project state management
- Agent harness specifications

### 🎯 Design Philosophy

> **Important Note:** This project **strictly adheres to the specifications and architectural rules** defined by the above repositories. We are not creating competing frameworks but rather implementing their proven patterns as the foundation for this comprehensive skill library.

All patterns, interfaces, and architectural decisions follow the standards established by Superpowers, Everything Claude Code, and Gstack. Any deviations are intentional extensions to support the specific use case of a unified multi-CLI skill framework.

---

## 🚦 Getting Started

### 1. Installation
```bash
git clone https://github.com/mowgliph/everything-agents-skills.git
cd everything-agents-skills
./scripts/install.sh
```

### 2. Choose Your IDE
Select from supported options: Qwen, Copilot, Kilo, OpenCode, Gemini

### 3. Start Using Skills
All 391+ skills are instantly available in your IDE

### 4. Use Specialized Agents
```
/invoke agent:code-reviewer
/invoke agent:architect
/invoke agent:tdd-guide
```

---

## 🐛 Troubleshooting

### Skills not appearing in IDE?
1. Verify IDE is in supported list
2. Run `./scripts/install.sh` again
3. Restart your IDE
4. Check `/home/user/.{ide}/skills/` directory

### Agent not found?
1. All 44 agents should be available (see list above)
2. Verify agent name matches exactly
3. Check `agents/` directory contains `.md` file

### Sync issues?
```bash
# Resync agents to all IDEs
./scripts/sync-agents.sh

# Validate installation
./scripts/validate-agents.sh
```

---

## 📖 Documentation

- **[Complete Skills Reference](SKILLS.md)** - All 391+ skills documented
- **[Contributing Guide](CONTRIBUTING.md)** - How to add skills and agents
- **[Architecture Docs](docs/)** - Deep dive into design patterns
- **[CLI Configuration](cli-configs/)** - IDE-specific setups

---

## 📝 Recent Updates

### v0.4.0 (Current)
- ✅ Added all 44 specialized agents to manifest
- ✅ Fixed agent discovery across all IDEs
- ✅ Removed slash from "GitHub PR/Merge Workflow" skill
- ✅ Enhanced IDE compatibility layer
- ✨ Redesigned README with comprehensive documentation

### v0.3.0
- Added GitHub Copilot CLI support
- Expanded agent library
- Multi-IDE sync improvements

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- 🆕 Add new skills
- 🐛 Fix bugs and issues
- 📚 Improve documentation
- 🧪 Add tests
- 🤖 Create new agents

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/mowgliph/everything-agents-skills/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mowgliph/everything-agents-skills/discussions)
- **Wiki:** [Project Wiki](https://github.com/mowgliph/everything-agents-skills/wiki)

---

<div align="center">

**Made with ❤️ for AI-assisted developers everywhere**

[![GitHub followers](https://img.shields.io/github/followers/mowgliph?style=social)](https://github.com/mowgliph)
[![Twitter Follow](https://img.shields.io/twitter/follow/mowgliph?style=social)](https://twitter.com/mowgliph)

[⬆ Back to top](#-everything-agents-skills)

</div>
