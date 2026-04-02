const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('setup-mcp-servers.js CLI', () => {
  let tempDir;
  let originalHome;
  let testQwenDir;
  let scriptPath;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-cli-test-'));
    testQwenDir = path.join(tempDir, '.qwen');
    fs.mkdirSync(testQwenDir, { recursive: true });
    originalHome = process.env.HOME;
    process.env.HOME = tempDir;
    // Use absolute path to script
    scriptPath = path.join(__dirname, '../../scripts/setup-mcp-servers.js');
  });

  afterEach(() => {
    process.env.HOME = originalHome;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  const runCli = (args) => {
    return execSync(`node "${scriptPath}" ${args}`, {
      encoding: 'utf8',
      env: { ...process.env, HOME: tempDir }
    });
  };

  describe('--help flag', () => {
    it('should show help with --help', () => {
      const output = runCli('--help');
      
      assert.ok(output.includes('Usage:'), 'Should show usage');
      assert.ok(output.includes('--auto'), 'Should mention --auto');
      assert.ok(output.includes('--list'), 'Should mention --list');
      assert.ok(output.includes('--status'), 'Should mention --status');
      assert.ok(output.includes('--install'), 'Should mention --install');
      assert.ok(output.includes('--category'), 'Should mention --category');
    });

    it('should show help with -h', () => {
      const output = runCli('-h');
      
      assert.ok(output.includes('Usage:'), 'Should show usage');
    });

    it('should show help when no arguments provided', () => {
      const output = runCli('');
      
      assert.ok(output.includes('Usage:'), 'Should show usage');
    });
  });

  describe('--list flag', () => {
    it('should list all MCPs', () => {
      const output = runCli('--list');
      
      assert.ok(output.includes('MCP Servers Catalog'), 'Should show catalog header');
      assert.ok(output.includes('context7'), 'Should list context7');
      assert.ok(output.includes('memory'), 'Should list memory');
      assert.ok(output.includes('playwright'), 'Should list playwright');
    });

    it('should show MCP categories', () => {
      const output = runCli('--list');
      
      assert.ok(output.includes('documentation'), 'Should show documentation category');
      assert.ok(output.includes('search'), 'Should show search category');
      assert.ok(output.includes('automation'), 'Should show automation category');
    });

    it('should indicate which MCPs require API keys', () => {
      const output = runCli('--list');
      
      // Should mention API key requirement somehow
      assert.ok(
        output.includes('API') || output.includes('api') || output.includes('Key'),
        'Should indicate API key requirements'
      );
    });

    it('should show MCP count', () => {
      const output = runCli('--list');
      
      assert.ok(
        output.match(/\d+/) || output.includes('total') || output.includes('Total'),
        'Should show MCP count'
      );
    });
  });

  describe('--status flag', () => {
    it('should show installation status', () => {
      const output = runCli('--status');
      
      assert.ok(output.includes('Installation Status') || output.includes('Status'), 'Should show status header');
      assert.ok(output.includes('%') || output.includes('percentage') || output.includes('installed'), 'Should show percentage');
    });

    it('should show 0% when nothing is installed', () => {
      const output = runCli('--status');
      
      // Fresh install should show 0%
      assert.ok(output.includes('0%') || output.includes('0 /') || output.includes('not installed'), 'Should show 0% initially');
    });

    it('should show detailed breakdown by category', () => {
      const output = runCli('--status');
      
      assert.ok(
        output.includes('Category') || output.includes('category') || output.includes('by'),
        'Should show category breakdown'
      );
    });
  });

  describe('--auto flag', () => {
    it('should install recommended free MCPs', () => {
      const output = runCli('--auto');
      
      assert.ok(output.includes('Installing') || output.includes('Configuring') || output.includes('installed'), 'Should mention installation');
      assert.ok(output.includes('context7') || output.includes('memory') || output.includes('playwright'), 'Should install recommended MCPs');
    });

    it('should create settings.json config file', () => {
      runCli('--auto');

      const mcpConfigPath = path.join(testQwenDir, 'settings.json');
      assert.ok(fs.existsSync(mcpConfigPath), 'Should create settings.json');

      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.ok(config.mcpServers, 'Should have mcpServers');
      assert.ok(Object.keys(config.mcpServers).length > 0, 'Should have installed MCPs');
    });

    it('should only install free MCPs (no API key required)', () => {
      runCli('--auto');

      const mcpConfigPath = path.join(testQwenDir, 'settings.json');
      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      
      // Verify installed MCPs don't require API keys
      const installedIds = Object.keys(config.mcpServers);
      assert.ok(installedIds.length > 0, 'Should have installed MCPs');
      
      // None of the installed MCPs should be API-key only ones
      assert.ok(!installedIds.includes('tavily'), 'Should not install tavily (requires API key)');
      assert.ok(!installedIds.includes('openai'), 'Should not install openai (requires API key)');
    });

    it('should show success message with count', () => {
      const output = runCli('--auto');
      
      assert.ok(
        output.includes('installed') || output.includes('configured') || output.includes('Success'),
        'Should show success message'
      );
      assert.ok(
        output.match(/\d+/),
        'Should show count of installed MCPs'
      );
    });
  });

  describe('--install flag', () => {
    it('should install specific MCP by ID', () => {
      const output = runCli('--install context7');
      
      assert.ok(
        output.includes('context7') && (output.includes('installed') || output.includes('Configured')),
        'Should install context7'
      );

      const mcpConfigPath = path.join(testQwenDir, 'settings.json');
      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      assert.ok(config.mcpServers.context7, 'Should have context7 configured');
    });

    it('should handle non-existent MCP ID', () => {
      try {
        runCli('--install non-existent-mcp-xyz');
        assert.fail('Should throw error for non-existent MCP');
      } catch (error) {
        assert.ok(
          error.message.includes('not found') || error.message.includes('Not found') || error.message.includes('error'),
          'Should show error for non-existent MCP'
        );
      }
    });

    it('should handle MCP requiring API key with warning', () => {
      const output = runCli('--install tavily');
      
      // Should either install with warning or refuse with message
      assert.ok(
        output.includes('API') || output.includes('api') || output.includes('warning') || output.includes('Warning') || output.includes('requires'),
        'Should mention API key requirement'
      );
    });

    it('should skip already installed MCP', () => {
      // Install once
      runCli('--install context7');
      
      // Try to install again
      const output = runCli('--install context7');
      
      assert.ok(
        output.includes('already') || output.includes('skipped') || output.includes('Skipping') || output.includes('exists'),
        'Should mention already installed'
      );
    });
  });

  describe('--category flag', () => {
    it('should install all MCPs in a category', () => {
      const output = runCli('--category documentation');

      assert.ok(
        output.includes('documentation') || output.includes('installed'),
        'Should install documentation category MCPs'
      );

      const mcpConfigPath = path.join(testQwenDir, 'settings.json');
      const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));

      // Should have at least one documentation MCP
      assert.ok(
        config.mcpServers.context7 || config.mcpServers['cloudflare-docs'],
        'Should have documentation MCP installed'
      );
    });

    it('should handle non-existent category', () => {
      try {
        runCli('--category non-existent-category');
        assert.fail('Should handle non-existent category');
      } catch (error) {
        assert.ok(
          error.message.includes('not found') || 
          error.message.includes('No MCPs') || 
          error.message.includes('error') ||
          error.message.includes('No MCP'),
          'Should show error for non-existent category'
        );
      }
    });

    it('should handle case-insensitive category names', () => {
      const outputUpper = runCli('--category DOCUMENTATION');
      const outputLower = runCli('--category documentation');
      
      // Both should work (may install same MCPs, which is fine)
      assert.ok(
        outputUpper.includes('documentation') || outputUpper.includes('installed') || outputUpper.includes('skipped'),
        'Should handle uppercase category'
      );
      assert.ok(
        outputLower.includes('documentation') || outputLower.includes('installed') || outputLower.includes('skipped'),
        'Should handle lowercase category'
      );
    });
  });

  describe('--recommended flag', () => {
    it('should list only recommended MCPs', () => {
      const output = runCli('--list --recommended');
      
      assert.ok(output.includes('Recommended') || output.includes('recommended'), 'Should mention recommended');
      // Should show fewer MCPs than full list
      assert.ok(output.includes('context7'), 'Should include context7 (recommended)');
      assert.ok(output.includes('memory'), 'Should include memory (recommended)');
    });
  });

  describe('error handling', () => {
    it('should handle invalid config file gracefully', () => {
      const mcpConfigPath = path.join(testQwenDir, 'settings.json');
      fs.writeFileSync(mcpConfigPath, 'invalid json {{{', 'utf8');
      
      try {
        const output = runCli('--status');
        // Should handle gracefully, maybe show 0% or error message
        assert.ok(output, 'Should not crash');
      } catch (error) {
        // Or show error message
        assert.ok(
          error.message.includes('Invalid') || error.message.includes('error') || error.message.includes('parse'),
          'Should show parse error'
        );
      }
    });

    it('should handle missing .qwen directory', () => {
      // Remove .qwen dir
      fs.rmSync(testQwenDir, { recursive: true, force: true });
      
      const output = runCli('--auto');
      
      // Should create directory or handle gracefully
      assert.ok(
        fs.existsSync(testQwenDir) || output.includes('error') || output.includes('Error'),
        'Should handle missing directory'
      );
    });
  });

  describe('output formatting', () => {
    it('should use consistent output format', () => {
      const listOutput = runCli('--list');
      const statusOutput = runCli('--status');
      
      // Both should have some structure
      assert.ok(listOutput.length > 50, 'List output should have content');
      assert.ok(statusOutput.length > 20, 'Status output should have content');
    });

    it('should provide helpful error messages', () => {
      // When --install is called without argument, it shows help
      const output = runCli('--install');
      
      // Should show usage with helpful information
      assert.ok(
        output.includes('Usage') || 
        output.includes('install') || 
        output.includes('Options'),
        'Should show helpful error message or usage'
      );
    });
  });
});
