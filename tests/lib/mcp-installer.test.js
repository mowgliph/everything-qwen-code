const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('MCP Installer', () => {
  let tempDir;
  let mcpConfigPath;
  let generateMcpConfig;
  let mergeMcpConfig;
  let configureMcpServer;
  let configureMultipleMcpServers;
  let getMcpInstallationStatus;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-test-'));
    mcpConfigPath = path.join(tempDir, '.qwen', 'mcp.json');
    fs.mkdirSync(path.join(tempDir, '.qwen'), { recursive: true });
    
    const module = await import('../../scripts/lib/mcp-installer.js');
    generateMcpConfig = module.generateMcpConfig;
    mergeMcpConfig = module.mergeMcpConfig;
    configureMcpServer = module.configureMcpServer;
    configureMultipleMcpServers = module.configureMultipleMcpServers;
    getMcpInstallationStatus = module.getMcpInstallationStatus;
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('generateMcpConfig', () => {
    it('should generate config for npx-based MCP', () => {
      const mcp = {
        id: 'context7',
        name: 'Context7',
        command: 'npx',
        args: ['-y', '@context7/mcp@latest'],
        env: null,
        url: null
      };
      
      const config = generateMcpConfig(mcp);
      
      assert.strictEqual(config.command, 'npx');
      assert.deepStrictEqual(config.args, ['-y', '@context7/mcp@latest']);
      assert.strictEqual(config.env, undefined);
    });

    it('should generate config for HTTP-type MCP', () => {
      const mcp = {
        id: 'cloudflare-api',
        type: 'http',
        url: 'https://api.cloudflare.com/mcp',
        command: null,
        args: null,
        env: { CLOUDFLARE_API_TOKEN: '<token>' }
      };
      
      const config = generateMcpConfig(mcp);
      
      assert.strictEqual(config.type, 'http');
      assert.strictEqual(config.url, 'https://api.cloudflare.com/mcp');
      assert.ok(config.env, 'Should include env for HTTP MCP');
    });

    it('should include environment variables when provided', () => {
      const mcp = {
        id: 'tavily',
        command: 'npx',
        args: ['-y', '@tavily/mcp@latest'],
        env: { TAVILY_API_KEY: 'test-key' },
        url: null
      };
      
      const config = generateMcpConfig(mcp);
      
      assert.ok(config.env, 'Should include env object');
      assert.strictEqual(config.env.TAVILY_API_KEY, 'test-key');
    });

    it('should handle MCP with null env', () => {
      const mcp = {
        id: 'context7',
        command: 'npx',
        args: ['-y', 'test'],
        env: null,
        url: null
      };
      
      const config = generateMcpConfig(mcp);
      
      assert.strictEqual(config.env, undefined);
    });
  });

  describe('mergeMcpConfig', () => {
    it('should create new config if file does not exist', () => {
      const newServer = {
        id: 'context7',
        config: { command: 'npx', args: ['-y', 'test'] }
      };
      
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.skipped, false);
      assert.ok(result.configPath, 'Should return config path');
    });

    it('should not duplicate existing servers', () => {
      const initial = {
        mcpServers: {
          context7: { command: 'npx', args: ['-y', 'old'] }
        }
      };
      fs.writeFileSync(mcpConfigPath, JSON.stringify(initial, null, 2));
      
      const newServer = {
        id: 'context7',
        config: { command: 'npx', args: ['-y', 'new'] }
      };
      
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.skipped, true);
      assert.strictEqual(result.message, 'Server context7 already configured');
    });

    it('should add new server to existing config', () => {
      const initial = {
        mcpServers: {
          context7: { command: 'npx', args: ['-y', 'context7'] }
        }
      };
      fs.writeFileSync(mcpConfigPath, JSON.stringify(initial, null, 2));
      
      const newServer = {
        id: 'memory',
        config: { command: 'npx', args: ['-y', 'memory'] }
      };
      
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.skipped, false);
      
      const updatedConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.strictEqual(Object.keys(updatedConfig.mcpServers).length, 2);
      assert.ok(updatedConfig.mcpServers.memory, 'Should have memory server');
      assert.ok(updatedConfig.mcpServers.context7, 'Should keep context7 server');
    });

    it('should create mcpServers object if config exists but is empty', () => {
      const initial = {};
      fs.writeFileSync(mcpConfigPath, JSON.stringify(initial, null, 2));
      
      const newServer = {
        id: 'context7',
        config: { command: 'npx', args: ['-y', 'test'] }
      };
      
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      
      assert.strictEqual(result.success, true);
      
      const updatedConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.ok(updatedConfig.mcpServers);
      assert.ok(updatedConfig.mcpServers.context7);
    });

    it('should handle invalid JSON gracefully', () => {
      fs.writeFileSync(mcpConfigPath, 'invalid json {{{');
      
      const newServer = {
        id: 'context7',
        config: { command: 'npx', args: ['-y', 'test'] }
      };
      
      const result = mergeMcpConfig(mcpConfigPath, newServer);
      
      assert.strictEqual(result.success, false);
      assert.ok(result.error, 'Should have error message');
    });
  });

  describe('configureMcpServer', () => {
    it('should configure a single MCP server', () => {
      const mcp = {
        id: 'context7',
        name: 'Context7',
        command: 'npx',
        args: ['-y', '@context7/mcp@latest'],
        env: null,
        url: null
      };
      
      const result = configureMcpServer(mcpConfigPath, mcp);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.skipped, false);
      
      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.ok(config.mcpServers.context7);
      assert.strictEqual(config.mcpServers.context7.command, 'npx');
    });

    it('should skip already configured server', () => {
      const mcp = {
        id: 'context7',
        name: 'Context7',
        command: 'npx',
        args: ['-y', '@context7/mcp@latest'],
        env: null,
        url: null
      };
      
      // Configure once
      configureMcpServer(mcpConfigPath, mcp);
      
      // Try to configure again
      const result = configureMcpServer(mcpConfigPath, mcp);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.skipped, true);
    });

    it('should handle MCP with environment variables', () => {
      const mcp = {
        id: 'tavily',
        name: 'Tavily',
        command: 'npx',
        args: ['-y', '@tavily/mcp@latest'],
        env: { TAVILY_API_KEY: '<your-api-key>' },
        url: null
      };
      
      const result = configureMcpServer(mcpConfigPath, mcp);
      
      assert.strictEqual(result.success, true);
      
      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.ok(config.mcpServers.tavily);
      assert.strictEqual(config.mcpServers.tavily.env.TAVILY_API_KEY, '<your-api-key>');
    });
  });

  describe('configureMultipleMcpServers', () => {
    it('should configure multiple MCP servers', () => {
      const mcps = [
        {
          id: 'context7',
          name: 'Context7',
          command: 'npx',
          args: ['-y', '@context7/mcp@latest'],
          env: null,
          url: null
        },
        {
          id: 'memory',
          name: 'Memory',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-memory@latest'],
          env: null,
          url: null
        }
      ];
      
      const results = configureMultipleMcpServers(mcpConfigPath, mcps);
      
      assert.strictEqual(results.installed.length, 2);
      assert.strictEqual(results.skipped.length, 0);
      assert.ok(results.installed.includes('context7'));
      assert.ok(results.installed.includes('memory'));
      
      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.strictEqual(Object.keys(config.mcpServers).length, 2);
    });

    it('should skip already configured servers', () => {
      const mcps = [
        {
          id: 'context7',
          name: 'Context7',
          command: 'npx',
          args: ['-y', '@context7/mcp@latest'],
          env: null,
          url: null
        },
        {
          id: 'memory',
          name: 'Memory',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-memory@latest'],
          env: null,
          url: null
        }
      ];
      
      // Configure first one
      configureMcpServer(mcpConfigPath, mcps[0]);
      
      // Try to configure both
      const results = configureMultipleMcpServers(mcpConfigPath, mcps);
      
      assert.strictEqual(results.installed.length, 1);
      assert.strictEqual(results.skipped.length, 1);
      assert.ok(results.installed.includes('memory'));
      assert.ok(results.skipped.includes('context7'));
    });

    it('should handle empty MCP list', () => {
      const results = configureMultipleMcpServers(mcpConfigPath, []);
      
      assert.strictEqual(results.installed.length, 0);
      assert.strictEqual(results.skipped.length, 0);
    });

    it('should return detailed results', () => {
      const mcps = [
        {
          id: 'context7',
          name: 'Context7',
          command: 'npx',
          args: ['-y', '@context7/mcp@latest'],
          env: null,
          url: null
        }
      ];
      
      const results = configureMultipleMcpServers(mcpConfigPath, mcps);
      
      assert.ok(results.configPath, 'Should return config path');
      assert.ok(Array.isArray(results.installed), 'Installed should be array');
      assert.ok(Array.isArray(results.skipped), 'Skipped should be array');
    });
  });

  describe('getMcpInstallationStatus', () => {
    it('should return status for installed MCPs', () => {
      const mcps = [
        { id: 'context7', name: 'Context7', requiresApiKey: false },
        { id: 'memory', name: 'Memory', requiresApiKey: false },
        { id: 'tavily', name: 'Tavily', requiresApiKey: true }
      ];
      
      // Install one
      configureMcpServer(mcpConfigPath, {
        id: 'context7',
        name: 'Context7',
        command: 'npx',
        args: ['-y', '@context7/mcp@latest'],
        env: null,
        url: null
      });
      
      const status = getMcpInstallationStatus(mcpConfigPath, mcps);
      
      assert.strictEqual(status.total, 3);
      assert.strictEqual(status.installed, 1);
      assert.strictEqual(status.notInstalled, 2);
      assert.strictEqual(status.percentage, 33); // 1/3 = 33%
    });

    it('should return 0% when nothing is installed', () => {
      const mcps = [
        { id: 'context7', name: 'Context7', requiresApiKey: false },
        { id: 'memory', name: 'Memory', requiresApiKey: false }
      ];
      
      const status = getMcpInstallationStatus(mcpConfigPath, mcps);
      
      assert.strictEqual(status.total, 2);
      assert.strictEqual(status.installed, 0);
      assert.strictEqual(status.notInstalled, 2);
      assert.strictEqual(status.percentage, 0);
    });

    it('should return 100% when all are installed', () => {
      const mcps = [
        { id: 'context7', name: 'Context7', requiresApiKey: false },
        { id: 'memory', name: 'Memory', requiresApiKey: false }
      ];
      
      // Install both
      configureMcpServer(mcpConfigPath, {
        id: 'context7',
        name: 'Context7',
        command: 'npx',
        args: ['-y', '@context7/mcp@latest'],
        env: null,
        url: null
      });
      configureMcpServer(mcpConfigPath, {
        id: 'memory',
        name: 'Memory',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-memory@latest'],
        env: null,
        url: null
      });
      
      const status = getMcpInstallationStatus(mcpConfigPath, mcps);
      
      assert.strictEqual(status.total, 2);
      assert.strictEqual(status.installed, 2);
      assert.strictEqual(status.notInstalled, 0);
      assert.strictEqual(status.percentage, 100);
    });

    it('should handle empty catalog', () => {
      const status = getMcpInstallationStatus(mcpConfigPath, []);
      
      assert.strictEqual(status.total, 0);
      assert.strictEqual(status.installed, 0);
      assert.strictEqual(status.notInstalled, 0);
      assert.strictEqual(status.percentage, 0);
    });

    it('should provide detailed breakdown by category', () => {
      const mcps = [
        { id: 'context7', name: 'Context7', category: 'documentation', requiresApiKey: false },
        { id: 'memory', name: 'Memory', category: 'memory', requiresApiKey: false },
        { id: 'tavily', name: 'Tavily', category: 'search', requiresApiKey: true }
      ];
      
      // Install documentation MCP
      configureMcpServer(mcpConfigPath, {
        id: 'context7',
        name: 'Context7',
        command: 'npx',
        args: ['-y', '@context7/mcp@latest'],
        env: null,
        url: null
      });
      
      const status = getMcpInstallationStatus(mcpConfigPath, mcps);
      
      assert.ok(status.byCategory, 'Should have category breakdown');
      assert.strictEqual(status.byCategory.documentation.installed, 1);
      assert.strictEqual(status.byCategory.documentation.total, 1);
      assert.strictEqual(status.byCategory.memory.installed, 0);
      assert.strictEqual(status.byCategory.memory.total, 1);
    });
  });
});
