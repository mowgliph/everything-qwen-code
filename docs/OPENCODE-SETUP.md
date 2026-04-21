# OpenCode Setup Guide

This guide explains how to configure OpenCode with the agents, skills, rules, contexts, and MCP servers from this repository.

---

## Prerequisites

- OpenCode installed (`npm install -g opencode`)
- Node.js 18+
- API keys for MCP servers (see each section below)

---

## Installation Steps

### 1. Create Global Configuration Directory

```bash
mkdir -p ~/.config/opencode/{agents,skills,rules,mcp,contexts}
```

### 2. Copy Repository Files

```bash
# Copy agents
cp -r agents/* ~/.config/opencode/agents/

# Copy skills
cp -r skills/* ~/.config/opencode/skills/

# Copy rules
cp -r rules/* ~/.config/opencode/rules/

# Copy contexts
cp -r contexts/* ~/.config/opencode/contexts/
```

### 3. Create Global opencode.json

Create `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "contextPaths": [
    "~/.config/opencode/contexts"
  ],
  "mcp": {
    "context7": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@2.1.4"]
    },
    "github": {
      "type": "local", 
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@2025.4.8"]
    },
    "memory": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory@2026.1.26"]
    },
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@0.0.69", "--extension"]
    },
    "sequential-thinking": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking@2025.12.18"]
    }
  }
}
```

### 4. Create Global AGENTS.md

Create `~/.config/opencode/AGENTS.md` with common rules from `rules/common/` and reference to agents/skills:

```markdown
# Global OpenCode Rules

This file contains global rules applied to all OpenCode sessions.

## Coding Style

### Immutability (CRITICAL)
ALWAYS create new objects, NEVER mutate existing ones...

## Testing Requirements
Minimum Test Coverage: 80%...

## Git Workflow
Commit Message Format: <type>: <description>...

## Security Guidelines
Mandatory Security Checks before ANY commit...

## Agents Available
Custom agents in ~/.config/opencode/agents/...

## Skills Available
Skills in ~/.config/opencode/skills/...
```

---

## Environment Variables

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Context7 (required for context7 MCP)
export CONTEXT7_API_KEY=your_context7_api_key

# GitHub (optional, for GitHub MCP)
export GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
```

To get a Context7 API key:
1. Go to https://console.upstash.com/
2. Create a new Context7 database
3. Copy the API key

---

## Available Components

### Agents (44 total)

Located in `~/.config/opencode/agents/`:

| Agent | Purpose |
|------|---------|
| code-reviewer | Reviews code for best practices |
| security-reviewer | Security-focused code review |
| tdd-guide | Test-driven development guidance |
| build-error-resolver | Resolve build errors |
| architect | Software architecture assistance |
| planner | Project planning |
| python-reviewer | Python-specific review |
| typescript-reviewer | TypeScript-specific review |
| And more... | See agents directory |

### Skills (390 total)

Located in `~/.config/opencode/skills/`:

| Category | Count |
|----------|-------|
| Programming patterns | ~200 |
| Testing | ~50 |
| API design | ~20 |
| Security | ~15 |
| DevOps | ~25 |
| And more... | See skills directory |

Skills are organized in folders with `SKILL.md` files inside.

### Rules (14 total)

Located in `~/.config/opencode/rules/`:

| Directory | Content |
|----------|---------|
| common/ | Universal rules (coding style, testing, git workflow, security) |
| typescript/ | TypeScript-specific rules |
| python/ | Python-specific rules |
| golang/ | Go-specific rules |
| swift/ | Swift-specific rules |
| rust/ | Rust-specific rules |
| And more... | See rules directory |

### Contexts (3 total)

Located in `~/.config/opencode/contexts/`:

| File | Purpose |
|------|---------|
| dev.md | Development context |
| research.md | Research context |
| review.md | Review context |

### MCP Servers

| Server | Purpose | API Key Required |
|--------|---------|------------------|
| context7 | Context augmentation | Yes |
| github | GitHub integration | Yes |
| memory | Memory server | No |
| playwright | Browser automation | No |
| sequential-thinking | Thinking tools | No |

---

## Verification

Check the installation:

```bash
# Verify files
ls ~/.config/opencode/agents/ | wc -l
ls ~/.config/opencode/skills/ | wc -l

# Test OpenCode
opencode --version
```

---

## Updating

To update from a fresh clone:

```bash
# Pull latest changes
git pull origin main

# Re-copy files (may overwrite customizations)
cp -r agents/* ~/.config/opencode/agents/
cp -r skills/* ~/.config/opencode/skills/
cp -r rules/* ~/.config/opencode/rules/
cp -r contexts/* ~/.config/opencode/contexts/
```

---

## Troubleshooting

### MCP servers not loading

Check:
1. API keys are set: `echo $CONTEXT7_API_KEY`
2. npx works: `npx --version`

### Agents not available

Agents must be referenced in `opencode.json` or used via the Task tool:
```
Use the task tool with agent type from ~/.config/opencode/agents/
```

### Skills not loading

Skills are loaded on-demand by agents. Use the skill tool:
```
skill({ name: "skill-name" })
```

---

## File Structure Summary

```
~/.config/opencode/
├── opencode.json          # Main config (MCP, contextPaths)
├── AGENTS.md           # Global rules
├── agents/             # 44 custom agents
├── skills/             # 390 skills
├── rules/              # 14 rule sets
│   └── common/         # Universal rules
└── contexts/           # 3 context files
```

---

## Additional Resources

- OpenCode docs: https://opencode.ai/docs
- This repository: https://github.com/mowgliph/everything-agents-skills