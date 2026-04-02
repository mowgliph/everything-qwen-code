# MCP Auto-Install Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Crear un script que configure automáticamente MCPs gratuitos durante la instalación global de ECC con `bin/eqw-install`, permitiendo también configuración manual posterior.

**Architecture:** El script `setup-mcp-servers.js` se ejecutará automáticamente desde `bin/eqw-install` después de copiar los archivos de configuración. Usará un catálogo de MCPs en `mcp-catalog.js` para identificar cuáles son gratuitos y configurarlos individualmente en `.mcp.json`.

**Tech Stack:** Node.js, fs, path, JSON manipulation, MCP Protocol configuration.

---

## Contexto Actual

- **Script de instalación:** `bin/eqw-install`
- **Configuración MCP actual:** `.mcp.json` (6 MCPs configurados manualmente)
- **Catálogo de referencia:** `.qwen/mcp-configs/mcp-servers.json` (27 MCPs)
- **Problema:** Los MCPs no se configuran automáticamente durante la instalación

## Solución

1. Crear `scripts/lib/mcp-catalog.js` - Catálogo de MCPs con metadata
2. Crear `scripts/lib/mcp-installer.js` - Lógica de instalación por MCP
3. Crear `scripts/setup-mcp-servers.js` - Script principal con CLI
4. Modificar `bin/eqw-install` - Integrar llamada al script de MCPs
5. Crear `commands/setup-mcps.md` - Documentación del comando

---

### Task 1: Crear el Catálogo de MCPs

**Files:**
- Create: `scripts/lib/mcp-catalog.js`
- Test: `tests/lib/mcp-catalog.test.js`

**Step 1: Write the failing test**

```javascript
// tests/lib/mcp-catalog.test.js
const { getMcpCatalog, getFreeMcpServers, getMcpByCategory } = require('../../scripts/lib/mcp-catalog');

describe('MCP Catalog', () => {
  describe('getMcpCatalog', () => {
    it('should return all MCP servers', () => {
      const catalog = getMcpCatalog();
      expect(catalog.length).toBeGreaterThan(10);
    });
  });

  describe('getFreeMcpServers', () => {
    it('should return only MCPs without API key requirement', () => {
      const freeMcps = getFreeMcpServers();
      freeMcps.forEach(mcp => {
        expect(mcp.requiresApiKey).toBe(false);
      });
    });
  });

  describe('getMcpByCategory', () => {
    it('should return MCPs filtered by category', () => {
      const searchMcps = getMcpByCategory('search');
      expect(searchMcps.length).toBeGreaterThan(0);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/lib/mcp-catalog.test.js`
Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

Crear el catálogo en `scripts/lib/mcp-catalog.js` con:
- `getMcpCatalog()` - Retorna todos los MCPs
- `getFreeMcpServers(recommendedOnly)` - Retorna MCPs gratuitos
- `getMcpByCategory(category)` - Filtra por categoría
- `getMcpById(id)` - Busca por ID
- `getMcpCategories()` - Lista categorías

**Step 4: Run test to verify it passes**

Run: `node --test tests/lib/mcp-catalog.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add scripts/lib/mcp-catalog.js tests/lib/mcp-catalog.test.js
git commit -m "feat: create MCP catalog with free and API-key servers"
```

---

### Task 2: Crear el Instalador de MCPs

**Files:**
- Create: `scripts/lib/mcp-installer.js`
- Test: `tests/lib/mcp-installer.test.js`

**Step 1: Write the failing test**

```javascript
// tests/lib/mcp-installer.test.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const { configureMcpServer, mergeMcpConfig, generateMcpConfig } = require('../../scripts/lib/mcp-installer');

describe('MCP Installer', () => {
  let tempDir;
  let mcpConfigPath;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-test-'));
    mcpConfigPath = path.join(tempDir, 'mcp.json');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('generateMcpConfig', () => {
    it('should generate config for npx-based MCP', () => {
      const mcp = { id: 'context7', command: 'npx', args: ['-y', 'test'], env: null, url: null };
      const config = generateMcpConfig(mcp);
      expect(config.command).toBe('npx');
    });

    it('should generate config for HTTP-type MCP', () => {
      const mcp = { id: 'vercel', type: 'http', url: 'https://mcp.vercel.com' };
      const config = generateMcpConfig(mcp);
      expect(config.type).toBe('http');
      expect(config.url).toBe('https://mcp.vercel.com');
    });
  });

  describe('mergeMcpConfig', () => {
    it('should create new config if file does not exist', () => {
      const newServer = { id: 'context7', config: { command: 'npx', args: ['-y', 'test'] } };
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      expect(result.success).toBe(true);
    });

    it('should not duplicate existing servers', () => {
      const initial = { mcpServers: { context7: { command: 'npx' } } };
      fs.writeFileSync(mcpConfigPath, JSON.stringify(initial, null, 2));
      const newServer = { id: 'context7', config: { command: 'npx', args: ['new'] } };
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      expect(result.skipped).toBe(true);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/lib/mcp-installer.test.js`
Expected: FAIL

**Step 3: Write minimal implementation**

Crear `scripts/lib/mcp-installer.js` con:
- `generateMcpConfig(mcp)` - Genera config para .mcp.json
- `mergeMcpConfig(configPath, newServer)` - Mergea con existente
- `configureMcpServer(configPath, mcp)` - Configura MCP individual
- `configureMultipleMcpServers(configPath, mcps)` - Configura múltiples
- `getMcpInstallationStatus(configPath, catalog)` - Estado de instalación

**Step 4: Run test to verify it passes**

Run: `node --test tests/lib/mcp-installer.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add scripts/lib/mcp-installer.js tests/lib/mcp-installer.test.js
git commit -m "feat: create MCP installer with merge and individual config support"
```

---

### Task 3: Crear Script CLI de Configuración de MCPs

**Files:**
- Create: `scripts/setup-mcp-servers.js`
- Test: `tests/scripts/setup-mcp-servers.test.js`

**Step 1: Write the failing test**

```javascript
// tests/scripts/setup-mcp-servers.test.js
const { execSync } = require('child_process');

describe('setup-mcp-servers.js CLI', () => {
  it('should show help with --help', () => {
    const output = execSync('node ../../scripts/setup-mcp-servers.js --help', { encoding: 'utf8' });
    expect(output).toContain('Usage:');
    expect(output).toContain('--auto');
  });

  it('should list MCPs with --list', () => {
    const output = execSync('node ../../scripts/setup-mcp-servers.js --list', { encoding: 'utf8' });
    expect(output).toContain('MCP Servers Catalog');
    expect(output).toContain('context7');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/scripts/setup-mcp-servers.test.js`
Expected: FAIL

**Step 3: Write minimal implementation**

Crear `scripts/setup-mcp-servers.js` con:
- `--auto` - Instala todos los MCPs gratuitos recomendados
- `--list` - Lista todos los MCPs disponibles
- `--status` - Muestra estado de instalación
- `--install <id>` - Instala MCP específico
- `--category <name>` - Instala por categoría
- `--help` - Muestra ayuda

**Step 4: Run test to verify it passes**

Run: `node --test tests/scripts/setup-mcp-servers.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add scripts/setup-mcp-servers.js tests/scripts/setup-mcp-servers.test.js
git commit -m "feat: create MCP setup CLI with auto, list, status, and install modes"
```

---

### Task 4: Integrar en bin/eqw-install

**Files:**
- Modify: `bin/eqw-install`

**Step 1: Add MCP configuration after config files**

Después de la sección "Install config files" y antes de "Summary", agregar:

```javascript
// After installing config files, configure MCP servers
log('\n🔌 Configuring MCP servers...\n', 'bright');

const { getFreeMcpServers } = require('./scripts/lib/mcp-catalog');
const { configureMultipleMcpServers } = require('./scripts/lib/mcp-installer');

const mcpConfigPath = path.join(QWEN_DIR, 'mcp.json');
const freeMcps = getFreeMcpServers(true);
const mcpResults = configureMultipleMcpServers(mcpConfigPath, freeMcps);

for (const id of mcpResults.installed) {
  logSuccess(`MCP: ${id}`);
}

logSuccess(`${mcpResults.installed.length} MCP server(s) configured`);
if (mcpResults.skipped.length > 0) {
  logInfo(`${mcpResults.skipped.length} MCP server(s) already configured`);
}
```

**Step 2: Update summary to mention MCPs**

En la sección "What's included", agregar:
```javascript
log('   • 11+ free MCP servers auto-configured', 'cyan');
```

**Step 3: Verify installation works**

Run: `node bin/eqw-install` (en directorio temporal)
Expected: Debería mostrar MCPs configurándose

**Step 4: Commit**

```bash
git add bin/eqw-install
git commit -m "feat: auto-configure free MCP servers during global installation"
```

---

### Task 5: Crear Documentación del Comando

**Files:**
- Create: `commands/setup-mcps.md`

**Step 1: Write documentation**

Crear `commands/setup-mcps.md` con:
- Usage examples (--auto, --list, --status, --install, --category)
- Lista de categorías disponibles
- Tabla de MCPs gratuitos (auto-instalados)
- Tabla de MCPs con API key (opcionales)
- Ubicación de configuración (~/.qwen/mcp.json)
- Troubleshooting básico

**Step 2: Commit**

```bash
git add commands/setup-mcps.md
git commit -m "docs: add setup-mcps command documentation"
```

---

### Task 6: Verificación Final y Testing

**Files:**
- Create: `tests/scripts/mcp-integration.test.js`

**Step 1: Write integration test**

```javascript
// tests/scripts/mcp-integration.test.js
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('MCP Integration Tests', () => {
  it('should configure MCPs during installation flow', () => {
    const { configureMultipleMcpServers } = require('../../scripts/lib/mcp-installer');
    const { getFreeMcpServers } = require('../../scripts/lib/mcp-catalog');

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-integration-'));
    const mcpConfigPath = path.join(tempDir, '.qwen', 'mcp.json');
    fs.mkdirSync(path.join(tempDir, '.qwen'), { recursive: true });

    const freeMcps = getFreeMcpServers(true);
    const results = configureMultipleMcpServers(mcpConfigPath, freeMcps);

    expect(results.installed.length).toBeGreaterThan(5);
    expect(fs.existsSync(mcpConfigPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    expect(config.mcpServers).toBeDefined();
    expect(Object.keys(config.mcpServers).length).toBeGreaterThan(5);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
```

**Step 2: Run all tests**

Run: `npm test -- tests/lib/mcp-catalog.test.js tests/lib/mcp-installer.test.js tests/scripts/setup-mcp-servers.test.js tests/scripts/mcp-integration.test.js`
Expected: PASS (80%+ coverage)

**Step 3: Manual verification**

```bash
node scripts/setup-mcp-servers.js --auto
cat ~/.qwen/mcp.json
```

**Step 4: Commit**

```bash
git add tests/scripts/mcp-integration.test.js
git commit -m "test: add MCP integration tests"
```

---

## Summary

**Total Tasks:** 6
**Estimated Time:** 2-3 hours
**Files to Create:** 7
**Files to Modify:** 1

**Testing Strategy:**
- Unit tests for catalog and installer libs
- CLI tests for setup-mcp-servers.js
- Integration tests for full installation flow
- Manual verification of auto-install

**TDD Compliance:**
- All tests written before implementation
- Red-Green-Refactor cycle for each task
- 80%+ code coverage required

**Post-Implementation:**
1. Run full test suite: `npm test`
2. Manual test: `node bin/eqw-install` (en directorio temporal)
3. Verify MCPs configured: `node scripts/setup-mcp-servers.js --status`
4. Create PR with changelog entry

---

Plan complete and saved to `docs/plans/2026-04-02-mcp-auto-install.md`.

**Two execution options:**

**1. Subagent-Driven (this session)** - Dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
