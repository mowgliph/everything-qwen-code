# /setup-mcps

Configure MCP servers for Everything Qwen Code.

## Usage

```bash
# Auto-install all recommended free MCP servers
node scripts/setup-mcp-servers.js --auto

# List all available MCPs
node scripts/setup-mcp-servers.js --list

# Show installation status
node scripts/setup-mcp-servers.js --status

# Install specific MCP by ID
node scripts/setup-mcp-servers.js --install context7

# Install by category
node scripts/setup-mcp-servers.js --category dev

# Interactive mode (coming soon)
node scripts/setup-mcp-servers.js --interactive
```

## Available Categories

- `dev` - Development tools
- `search` - Search engines
- `browser` - Browser automation
- `cloud` - Cloud platforms
- `database` - Database integrations
- `documentation` - Documentation access
- `memory` - Persistent memory
- `reasoning` - Reasoning and thinking
- `automation` - Automation tools
- `files` - Filesystem access
- `ai` - AI/ML services
- `security` - Security tools

## Free Tier MCPs (Auto-Installed)

These MCPs are configured automatically during `eqw-install`:

| MCP | Description | Type | Recommended |
|-----|-------------|------|-------------|
| context7 | Documentación en vivo de librerías | npx | ⭐ |
| memory | Memoria persistente entre sesiones | npx | ⭐ |
| sequential-thinking | Razonamiento paso a paso | npx | ⭐ |
| playwright | Automatización de navegadores | npx | ⭐ |
| duckduckgo | Búsqueda web privada | npx | ⭐ |
| filesystem | Acceso a archivos locales | npx | ⭐ |
| vercel | Deployments en Vercel | HTTP | ⭐ |
| cloudflare-docs | Documentación Cloudflare | HTTP | |
| cloudflare-workers-builds | Builds de Workers | HTTP | |
| cloudflare-workers-bindings | Bindings de Workers | HTTP | |
| cloudflare-observability | Observabilidad Cloudflare | HTTP | |

## MCPs Requiring API Key

These MCPs are available but NOT auto-installed. Use `--install <id>` to configure manually:

| MCP | API Key | Free Tier | Get Key |
|-----|---------|-----------|---------|
| github | GITHUB_PERSONAL_ACCESS_TOKEN | ✅ Free | https://github.com/settings/tokens |
| firecrawl | FIRECRAWL_API_KEY | 500 credits/month | https://firecrawl.dev |
| exa | EXA_API_KEY | Limited requests | https://exa.ai |
| supabase | SUPABASE_PROJECT_REF | Free tier available | https://supabase.com |
| fal-ai | FAL_KEY | Initial credits | https://fal.ai |
| browserbase | BROWSERBASE_API_KEY | Limited sessions | https://browserbase.com |

### Example: Installing MCP with API Key

```bash
node scripts/setup-mcp-servers.js --install github

# Then edit ~/.qwen/mcp.json to add your actual API key:
# "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
```

## Configuration Location

MCP configuration is stored in `~/.qwen/mcp.json`

Example configuration:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "vercel": {
      "type": "http",
      "url": "https://mcp.vercel.com"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github@2025.4.8"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    }
  }
}
```

## Output Examples

### `--list` Output
```
📋 MCP Servers Catalog
============================================================

AUTOMATION
----------------------------------------
  • playwright ⭐
    Browser automation and web scraping

DEV
----------------------------------------
  • context7 ⭐
    Live documentation and code examples
  • memory ⭐
    Persistent memory for AI assistants
```

### `--status` Output
```
📊 MCP Installation Status
============================================================

Installed (8):
  ✓ context7 - Live documentation and code examples
  ✓ memory - Persistent memory for AI assistants
  ✓ sequential-thinking - Step-by-step reasoning

Available (15):
  Free Tier:
    ○ playwright
    ○ duckduckgo
    ○ filesystem
  
  Requires API Key:
    ○ github (GITHUB_PERSONAL_ACCESS_TOKEN)
    ○ firecrawl (FIRECRAWL_API_KEY)
```

### `--auto` Output
```
🔌 Installing Recommended Free MCP Servers...

✓ MCP: context7
✓ MCP: memory
✓ MCP: sequential-thinking
✓ MCP: playwright
✓ MCP: duckduckgo

✓ 5 MCP server(s) configured
```

## Troubleshooting

### MCP not working after install

1. Check if MCP is configured:
   ```bash
   node scripts/setup-mcp-servers.js --status
   ```

2. Verify configuration in `~/.qwen/mcp.json`:
   ```bash
   cat ~/.qwen/mcp.json | grep -A 10 '"context7"'
   ```

3. Restart Qwen Code to reload MCP configuration

### Want to remove an MCP

Edit `~/.qwen/mcp.json` and remove the server entry:
```json
{
  "mcpServers": {
    // Remove the entry you don't want
  }
}
```

Then restart Qwen Code.

### API Key not working

1. Verify the API key is valid:
   ```bash
   # Test your API key with curl
   curl -H "Authorization: Bearer YOUR_KEY" https://api.example.com/test
   ```

2. Check environment variable name matches exactly
3. Restart Qwen Code after updating keys

### Conflicting MCP versions

If you have multiple versions of the same MCP:
```bash
# Check which version is installed
cat ~/.qwen/mcp.json | grep -A 5 '"context7"'

# Update to latest version
node scripts/setup-mcp-servers.js --install context7
```

## Related Commands

- `/help` - Show all available commands
- `/docs` - Lookup documentation via Context7 MCP
- `/setup-pm` - Configure package manager preferences

## Resources

- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [Glama MCP Directory](https://glama.ai/mcp/servers)
- [Best of MCP Servers](https://github.com/tolkonepiu/best-of-mcp-servers)
