#!/usr/bin/env node
/**
 * MCP Catalog Tests
 *
 * TDD: Write tests FIRST, then implement
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('MCP Catalog', () => {
  describe('getMcpCatalog', () => {
    it('should return all MCP servers', () => {
      const catalog = require('../../scripts/lib/mcp-catalog').getMcpCatalog();
      assert.ok(Array.isArray(catalog), 'Should return an array');
      assert.ok(catalog.length > 10, 'Should have more than 10 MCPs');
    });

    it('should include required fields for each MCP', () => {
      const catalog = require('../../scripts/lib/mcp-catalog').getMcpCatalog();
      catalog.forEach(mcp => {
        assert.ok(mcp.id, `MCP should have id: ${JSON.stringify(mcp)}`);
        assert.ok(mcp.name, `MCP should have name: ${JSON.stringify(mcp)}`);
        assert.ok(typeof mcp.command === 'string' || mcp.type === 'http', `MCP should have command or type: ${JSON.stringify(mcp)}`);
        assert.ok(typeof mcp.requiresApiKey === 'boolean', `MCP should have requiresApiKey boolean: ${JSON.stringify(mcp)}`);
        assert.ok(mcp.category, `MCP should have category: ${JSON.stringify(mcp)}`);
      });
    });
  });

  describe('getFreeMcpServers', () => {
    it('should return only MCPs without API key requirement', () => {
      const freeMcps = require('../../scripts/lib/mcp-catalog').getFreeMcpServers();
      assert.ok(Array.isArray(freeMcps), 'Should return an array');
      freeMcps.forEach(mcp => {
        assert.strictEqual(mcp.requiresApiKey, false, `Free MCP should not require API key: ${mcp.id}`);
      });
    });

    it('should include recommended free MCPs by default', () => {
      const freeMcps = require('../../scripts/lib/mcp-catalog').getFreeMcpServers(true);
      const ids = freeMcps.map(m => m.id);
      assert.ok(ids.includes('context7'), 'Should include context7');
      assert.ok(ids.includes('memory'), 'Should include memory');
      assert.ok(ids.includes('sequential-thinking'), 'Should include sequential-thinking');
    });

    it('should return all free MCPs when recommendedOnly is false', () => {
      const allFree = require('../../scripts/lib/mcp-catalog').getFreeMcpServers(false);
      const recommended = require('../../scripts/lib/mcp-catalog').getFreeMcpServers(true);
      assert.ok(allFree.length >= recommended.length, 'All free should be >= recommended');
    });
  });

  describe('getMcpByCategory', () => {
    it('should return MCPs filtered by category', () => {
      const devMcps = require('../../scripts/lib/mcp-catalog').getMcpByCategory('dev');
      assert.ok(Array.isArray(devMcps), 'Should return an array');
      devMcps.forEach(mcp => {
        assert.strictEqual(mcp.category, 'dev', `Should be dev category: ${mcp.id}`);
      });
    });

    it('should return empty array for unknown category', () => {
      const unknown = require('../../scripts/lib/mcp-catalog').getMcpByCategory('unknown-category-xyz');
      assert.ok(Array.isArray(unknown), 'Should return an array');
      assert.strictEqual(unknown.length, 0, 'Should be empty for unknown category');
    });
  });

  describe('getMcpById', () => {
    it('should return MCP by ID', () => {
      const mcp = require('../../scripts/lib/mcp-catalog').getMcpById('context7');
      assert.ok(mcp, 'Should find MCP by ID');
      assert.strictEqual(mcp.id, 'context7', 'Should return correct MCP');
    });

    it('should return null for unknown ID', () => {
      const mcp = require('../../scripts/lib/mcp-catalog').getMcpById('unknown-mcp-xyz');
      assert.strictEqual(mcp, null, 'Should return null for unknown ID');
    });
  });

  describe('getMcpCategories', () => {
    it('should return category counts', () => {
      const categories = require('../../scripts/lib/mcp-catalog').getMcpCategories();
      assert.ok(typeof categories === 'object', 'Should return an object');
      assert.ok(Object.keys(categories).length > 0, 'Should have at least one category');
      Object.values(categories).forEach(count => {
        assert.ok(count > 0, 'Category count should be positive');
      });
    });
  });

  describe('getPaidMcpServers', () => {
    it('should return only MCPs with API key requirement', () => {
      const paidMcps = require('../../scripts/lib/mcp-catalog').getPaidMcpServers();
      assert.ok(Array.isArray(paidMcps), 'Should return an array');
      paidMcps.forEach(mcp => {
        assert.strictEqual(mcp.requiresApiKey, true, `Paid MCP should require API key: ${mcp.id}`);
      });
    });
  });
});
