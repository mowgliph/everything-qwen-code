# Configuration Reference

Central index for all EQW configuration files and locations.

---

## Global Configuration (`~/.qwen/`)

| File | Purpose | Managed By |
|------|---------|------------|
| `~/.qwen/settings.json` | Model providers, MCP servers, auth | User / `eqw-install` |
| `~/.qwen/hooks/hooks.json` | Hook definitions (PreToolUse, Stop, etc.) | EQW plugin |
| `~/.qwen/hooks/README.md` | Hook documentation | EQW plugin |

## Project Configuration (`.mcp.json`)

| File | Purpose |
|------|---------|
| `.mcp.json` (project root) | Project-scoped MCP server overrides |
| `.qwen/mcp-configs/mcp-servers.json` | MCP server templates and reference configs |

## External Tool Configurations

| Tool | Config Path | Notes |
|------|-------------|-------|
| **OMEGA Memory** | `~/.omega/config.json` | Local memory system |
| **OMEGA Data** | `~/.omega/omega.db` | SQLite database (auto-created) |
| **OMEGA Model** | `~/.cache/omega/models/bge-small-en-v1.5-onnx/` | ONNX embedding model |
| **OMEGA Socket** | `~/.omega/hook.sock` | Unix domain socket for hook daemon |

---

## MCP Server Configuration

### Active MCP Servers

Defined in `~/.qwen/settings.json` under `mcpServers`:

| Server | Command | Type | API Key |
|--------|---------|------|---------|
| `context7` | `npx @upstash/context7-mcp` | npx | `$CONTEXT7_API_KEY` |
| `filesystem` | `npx @modelcontextprotocol/server-filesystem` | npx | None |
| `magic` | `npx @21st-dev/magic` | npx | `$MAGIC_API_KEY` |
| `omega-memory` | `python -m omega.server.mcp_server` | uv/Python | None |

### Template MCP Servers

Available in `.qwen/mcp-configs/mcp-servers.json` (copy to `settings.json` as needed):

| Server | Type | API Key Required |
|--------|------|-----------------|
| `github` | npx | Yes (`GITHUB_PERSONAL_ACCESS_TOKEN`) |
| `firecrawl` | npx | Yes (`FIRECRAWL_API_KEY`) |
| `supabase` | npx | Yes (project ref) |
| `memory` | npx | None |
| `sequential-thinking` | npx | None |
| `exa-web-search` | npx | Yes (`EXA_API_KEY`) |
| `fal-ai` | npx | Yes (`FAL_KEY`) |
| `browserbase` | npx | Yes (`BROWSERBASE_API_KEY`) |
| `browser-use` | HTTP | Yes (`x-browser-use-api-key`) |
| `vercel` | HTTP | None |
| `clickhouse` | HTTP | None |
| `devfleet` | HTTP | None (localhost) |
| `insaits` | Python | None |
| `evalview` | Python | Optional (`OPENAI_API_KEY`) |
| `confluence` | npx | Yes (email + API token) |
| `laraplugins` | HTTP | None |
| `token-optimizer` | npx | None |
| `playwright` | npx | None |
| `railway` | npx | None |
| `cloudflare-*` | HTTP | None |

---

## Hooks Configuration

### Hook Events Supported

| Event | When It Fires | Can Block? |
|-------|---------------|------------|
| `PreToolUse` | Before tool execution | Yes (exit code 2) |
| `PostToolUse` | After tool execution | No |
| `Stop` | After assistant response | No |
| `SessionStart` | At session begin | No |
| `SessionEnd` | At session end | No |
| `PreCompact` | Before context compaction | No |
| `UserPromptSubmit` | When user submits prompt | No |

### OMEGA Memory Hooks

Added to `~/.qwen/hooks/hooks.json`:

| Hook ID | Event | Command | Timeout |
|---------|-------|---------|---------|
| `omega:session-start` | SessionStart | `fast_hook.py session_start` | 5s |
| `omega:assistant-capture` | Stop | `fast_hook.py assistant_capture` | 3s |
| `omega:session-stop` | Stop | `fast_hook.py session_stop` | 5s |
| `omega:surface-memories` | PostToolUse | `fast_hook.py surface_memories` | 5s |
| `omega:auto-capture` | UserPromptSubmit | `fast_hook.py auto_capture` | 3s |

### EQW Built-in Hooks

See [hooks/README.md](../.qwen/hooks/README.md) for complete documentation.

---

## Environment Variables

See [ENV-VARIABLES.md](ENV-VARIABLES.md) for the complete list.

Key variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `EQW_HOOK_PROFILE` | Hook activation profile | `standard` |
| `EQW_DISABLED_HOOKS` | Comma-separated hook IDs to disable | (none) |
| `CONTEXT7_API_KEY` | Context7 MCP authentication | (required) |
| `MAGIC_API_KEY` | 21st.dev Magic MCP authentication | (required) |
| `OMEGA_CLIENT` | Override OMEGA client detection | (auto-detect) |

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| [OMEGA-MEMORY-SETUP.md](OMEGA-MEMORY-SETUP.md) | OMEGA Memory installation and configuration |
| [ENV-VARIABLES.md](ENV-VARIABLES.md) | Environment variables reference |
| [commands/setup-mcps.md](commands/setup-mcps.md) | MCP server setup script |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues and fixes |
| [SELECTIVE-INSTALL-ARCHITECTURE.md](SELECTIVE-INSTALL-ARCHITECTURE.md) | Selective install design |
| [token-optimization.md](token-optimization.md) | Token usage optimization |
