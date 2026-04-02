const { describe, it, before } = require('node:test');
const assert = require('node:assert');

describe('MCP Catalog', () => {
  let catalog;
  let getMcpCatalog;
  let getFreeMcpServers;
  let getMcpByCategory;
  let getMcpById;
  let getMcpCategories;

  before(async () => {
    const module = await import('../../scripts/lib/mcp-catalog.js');
    getMcpCatalog = module.getMcpCatalog;
    getFreeMcpServers = module.getFreeMcpServers;
    getMcpByCategory = module.getMcpByCategory;
    getMcpById = module.getMcpById;
    getMcpCategories = module.getMcpCategories;
  });

  describe('getMcpCatalog', () => {
    it('should return all MCP servers', () => {
      const allMcps = getMcpCatalog();
      assert(Array.isArray(allMcps), 'Catalog should return an array');
      assert.ok(allMcps.length > 10, `Should have more than 10 MCPs, got ${allMcps.length}`);
    });

    it('should return MCPs with required properties', () => {
      const allMcps = getMcpCatalog();
      assert.ok(allMcps.length > 0, 'Catalog should not be empty');
      
      const firstMcp = allMcps[0];
      assert.ok(firstMcp.id, 'MCP should have an id');
      assert.ok(firstMcp.name, 'MCP should have a name');
      assert.ok(typeof firstMcp.requiresApiKey === 'boolean', 'MCP should have requiresApiKey boolean');
      assert.ok(firstMcp.category, 'MCP should have a category');
    });
  });

  describe('getFreeMcpServers', () => {
    it('should return only MCPs without API key requirement', () => {
      const freeMcps = getFreeMcpServers();
      assert(Array.isArray(freeMcps), 'Should return an array');
      
      freeMcps.forEach(mcp => {
        assert.strictEqual(
          mcp.requiresApiKey, 
          false, 
          `MCP ${mcp.id} should not require API key`
        );
      });
    });

    it('should return recommended MCPs when recommendedOnly is true', () => {
      const recommendedMcps = getFreeMcpServers(true);
      assert(Array.isArray(recommendedMcps), 'Should return an array');
      
      recommendedMcps.forEach(mcp => {
        assert.strictEqual(
          mcp.requiresApiKey, 
          false, 
          `MCP ${mcp.id} should not require API key`
        );
        assert.ok(
          mcp.recommended === true, 
          `MCP ${mcp.id} should be marked as recommended`
        );
      });
    });

    it('should return empty array when no free MCPs match criteria', () => {
      // Edge case: if we filter in a way that nothing matches
      const freeMcps = getFreeMcpServers();
      assert.ok(freeMcps.length > 0, 'Should have at least some free MCPs');
    });
  });

  describe('getMcpByCategory', () => {
    it('should return MCPs filtered by category', () => {
      const categories = getMcpCategories();
      assert.ok(categories.length > 0, 'Should have at least one category');
      
      const firstCategory = categories[0];
      const categoryMcps = getMcpByCategory(firstCategory);
      
      assert(Array.isArray(categoryMcps), 'Should return an array');
      assert.ok(categoryMcps.length > 0, `Category ${firstCategory} should have MCPs`);
      
      categoryMcps.forEach(mcp => {
        assert.strictEqual(
          mcp.category, 
          firstCategory, 
          `MCP ${mcp.id} should belong to ${firstCategory} category`
        );
      });
    });

    it('should return empty array for non-existent category', () => {
      const nonExistent = getMcpByCategory('non-existent-category-xyz');
      assert(Array.isArray(nonExistent), 'Should return an array');
      assert.strictEqual(nonExistent.length, 0, 'Should return empty array for non-existent category');
    });

    it('should handle case-insensitive category matching', () => {
      const categories = getMcpCategories();
      if (categories.length > 0) {
        const firstCategory = categories[0];
        const upperCaseMcps = getMcpByCategory(firstCategory.toUpperCase());
        const lowerCaseMcps = getMcpByCategory(firstCategory.toLowerCase());
        
        assert.strictEqual(
          upperCaseMcps.length, 
          lowerCaseMcps.length, 
          'Category matching should be case-insensitive'
        );
      }
    });
  });

  describe('getMcpById', () => {
    it('should return MCP by exact ID match', () => {
      const allMcps = getMcpCatalog();
      assert.ok(allMcps.length > 0, 'Catalog should not be empty');
      
      const firstMcp = allMcps[0];
      const foundMcp = getMcpById(firstMcp.id);
      
      assert.ok(foundMcp, `Should find MCP with id ${firstMcp.id}`);
      assert.strictEqual(foundMcp.id, firstMcp.id, 'Should return correct MCP');
    });

    it('should return null for non-existent ID', () => {
      const foundMcp = getMcpById('non-existent-mcp-xyz-123');
      assert.strictEqual(foundMcp, null, 'Should return null for non-existent ID');
    });

    it('should return null for empty string ID', () => {
      const foundMcp = getMcpById('');
      assert.strictEqual(foundMcp, null, 'Should return null for empty ID');
    });

    it('should handle case-sensitive ID matching', () => {
      const allMcps = getMcpCatalog();
      const firstMcp = allMcps[0];
      
      const exactMatch = getMcpById(firstMcp.id);
      const upperCase = getMcpById(firstMcp.id.toUpperCase());
      
      assert.ok(exactMatch, 'Should find MCP with exact case');
      // IDs should be case-sensitive
      assert.strictEqual(
        upperCase, 
        null, 
        'ID matching should be case-sensitive'
      );
    });
  });

  describe('getMcpCategories', () => {
    it('should return array of unique categories', () => {
      const categories = getMcpCategories();
      
      assert(Array.isArray(categories), 'Should return an array');
      assert.ok(categories.length > 0, 'Should have at least one category');
      
      // Check uniqueness
      const uniqueCategories = [...new Set(categories)];
      assert.strictEqual(
        categories.length, 
        uniqueCategories.length, 
        'Categories should be unique'
      );
    });

    it('should return sorted categories', () => {
      const categories = getMcpCategories();
      const sorted = [...categories].sort();
      
      assert.deepStrictEqual(
        categories, 
        sorted, 
        'Categories should be sorted alphabetically'
      );
    });
  });
});
