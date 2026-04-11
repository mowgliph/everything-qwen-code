# OMEGA Memory — Configuration Guide

**OMEGA** is a local-first memory system for AI coding agents. It provides persistent, cross-session learning by automatically capturing decisions, lessons, and context to prevent context loss and repeated mistakes.

**Version:** 1.4.3 | **License:** Apache-2.0 | **Repo:** [omega-memory/omega-memory](https://github.com/omega-memory/omega-memory)

---

## Overview

OMEGA stores memories locally in SQLite (`~/.omega/omega.db`) with semantic search via ONNX embeddings. No API keys, no cloud accounts, no Docker containers — everything runs locally.

### Key Features

- **Semantic memory** — Store and retrieve coding decisions, lessons, and preferences
- **Cross-session persistence** — Memories survive restarts
- **Auto-capture** — Hooks automatically extract decisions and lessons from conversations
- **Knowledge graph** — Entity relationships and context tracking
- **Fail-open semantics** — Hooks never block the session if the daemon is unavailable

---

## Installation

### Install via uv (recommended)

```bash
uv tool install omega-memory
```

### Setup and model download

```bash
omega setup --download-model   # Downloads bge-small-en-v1.5 (~130MB)
omega doctor                   # Verify installation
```

### Storage locations

| Path | Purpose |
|------|---------|
| `~/.omega/` | OMEGA home (config, database, logs) |
| `~/.omega/config.json` | Configuration file |
| `~/.omega/omega.db` | SQLite database (created on first use) |
| `~/.omega/hook.sock` | Unix domain socket for hook daemon |
| `~/.cache/omega/models/bge-small-en-v1.5-onnx/` | Embedding model |

---

## MCP Server Configuration

### Global MCP config (`~/.qwen/settings.json`)

```json
{
  "mcpServers": {
    "omega-memory": {
      "command": "/home/mowgli/.local/share/uv/tools/omega-memory/bin/python",
      "args": ["-m", "omega.server.mcp_server"]
    }
  }
}
```

**Important:** Use the full Python path from the uv tool installation, not `uvx`. The `omega doctor` command reports the correct path.

### Why not `uvx`?

The template config uses `uvx omega-memory serve`, but the production path is the direct Python interpreter with `-m omega.server.mcp_server`. This avoids uvx resolution overhead on every MCP connection and matches the path reported by `omega doctor`.

---

## Hooks Configuration

OMEGA hooks dispatch via `fast_hook.py` to a daemon UDS socket (`~/.omega/hook.sock`). All hooks have fail-open semantics — if the daemon is unavailable, the hook completes without error.

### Hooks added to `~/.qwen/hooks/hooks.json`

| Hook Event | Command | Purpose | Timeout |
|---|---|---|---|
| `SessionStart` | `fast_hook.py session_start` | Welcome briefing with relevant memories, preferences, and context | 5s |
| `Stop` | `fast_hook.py assistant_capture` | Auto-capture assistant responses, decisions, and lessons | 3s |
| `Stop` | `fast_hook.py session_stop` | Session summary and state persistence | 5s |
| `PostToolUse` | `fast_hook.py surface_memories` | Surface relevant memories after Edit/Write/Bash/Read | 5s |
| `UserPromptSubmit` | `fast_hook.py auto_capture` | Auto-capture user prompts, decisions, and error patterns | 3s |

### Hook details

#### `omega:session-start` (SessionStart)

Runs at the beginning of each session. Calls `omega_welcome()` internally to generate a context briefing with:
- Relevant user preferences for the current project
- Recent lessons learned
- Active reminders
- Recent task checkpoints
- Summary of the previous session

#### `omega:assistant-capture` (Stop)

Runs after each assistant response. Captures high-value content (decisions, lessons, error patterns) without requiring explicit user commands.

#### `omega:session-stop` (Stop)

Runs at session end. Generates a session summary for future context recall.

#### `omega:surface-memories` (PostToolUse)

Runs after file edits, writes, bash commands, and reads. Surfaces relevant stored memories based on the files and commands involved.

#### `omega:auto-capture` (UserPromptSubmit)

Runs when the user submits a prompt. Analyzes the conversation to extract decisions, lessons, and error patterns automatically.

**Note:** `UserPromptSubmit` may not be supported by all Qwen Code versions. The hook is configured but will silently skip if the event is not fired.

---

## OMEGA MCP Tools (15 total)

The MCP server exposes these memory tools:

| Tool | Purpose |
|------|---------|
| `omega_welcome` | Session welcome briefing |
| `omega_protocol` | Operating protocol for coordination |
| `store_memory` | Store a new memory with metadata |
| `query_memories` | Semantic search for relevant memories |
| `list_memories` | List all memories with filters |
| `delete_memory` | Remove a specific memory |
| `update_memory` | Update an existing memory |
| `store_preference` | Store a user/coding preference |
| `query_preferences` | Retrieve preferences for current project |
| `store_lesson` | Record a lesson learned |
| `query_lessons` | Search past lessons |
| `store_checkpoint` | Save task/project checkpoint |
| `query_checkpoints` | Retrieve past checkpoints |
| `query_entities` | Search entity relationships |
| `store_entity` | Record a new entity |

---

## Configuration File

`~/.omega/config.json`:

```json
{
  "storage_path": "/home/mowgli/.omega",
  "model_dir": "/home/mowgli/.cache/omega/models/bge-small-en-v1.5-onnx",
  "version": "0.1.0",
  "entity_scoping": {
    "enabled": false
  }
}
```

### Config options

| Key | Description |
|-----|-------------|
| `storage_path` | Root directory for OMEGA data |
| `model_dir` | Path to ONNX embedding model |
| `entity_scoping.enabled` | Scope memories to specific entities (files, modules) |

---

## Verification

```bash
omega doctor
```

Expected output for a healthy setup:

```
✓ omega 1.4.3 imported
✓ omega.bridge imported
✓ Embedding generation works
✓ MCP server available
✓ Python: <uv-tools-path>/bin/python
✓ OMEGA home: ~/.omega
```

Warnings about "SessionStart hook not configured" refer to **Claude Code** detection, not Qwen. The hooks are configured in `~/.qwen/hooks/hooks.json`.

---

## Troubleshooting

### MCP server won't connect

1. Verify the Python path matches `omega doctor` output
2. Ensure `omega-memory` is installed: `uv tool list | grep omega`
3. Check the embedding model exists: `ls ~/.cache/omega/models/bge-small-en-v1.5-onnx/`

### Hooks not firing

1. Verify hooks exist in `~/.qwen/hooks/hooks.json`
2. Check for errors: `cat ~/.omega/hooks.log` (if present)
3. The daemon socket must be active (MCP server running)

### Model download failed

```bash
omega setup --download-model
```

This downloads `bge-small-en-v1.5` (recommended over the older `all-MiniLM-L6-v2`).

### Database not created

The `omega.db` file is created on first memory operation. No manual creation needed.

---

## Pro Features (Optional)

OMEGA offers a Pro tier ($19/mo) with 98 additional tools including:
- Multi-agent coordination (53 tools)
- Knowledge base management
- Entity management
- Oracle queries
- Cloud sync via your own Supabase

The free tier (15 tools) covers all core memory functionality.

---

## Related Documentation

- [ENV-VARIABLES.md](ENV-VARIABLES.md) — EQW environment variables
- [hooks/README.md](../.qwen/hooks/README.md) — Qwen hooks documentation
- [omega-memory GitHub](https://github.com/omega-memory/omega-memory) — Official repository
