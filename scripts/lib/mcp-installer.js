/**
 * MCP Installer - Configuration and installation logic for MCP servers
 *
 * Provides functions to generate MCP configurations, merge with existing
 * configs, and install multiple MCP servers with detailed status reporting.
 * 
 * Note: MCPs are now stored in ~/.qwen/settings.json for Qwen Code compatibility.
 */

const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} McpServerConfig
 * @property {string} command - Command to run (e.g., 'npx')
 * @property {string[]} args - Command arguments
 * @property {Record<string, string>} [env] - Environment variables
 * @property {string} [type] - Server type (e.g., 'http')
 * @property {string} [url] - URL for HTTP-type servers
 */

/**
 * @typedef {Object} InstallationResult
 * @property {boolean} success - Whether installation succeeded
 * @property {boolean} skipped - Whether server was already configured
 * @property {string} [message] - Status message
 * @property {string} [error] - Error message if failed
 * @property {string} configPath - Path to config file
 */

/**
 * @typedef {Object} MultiInstallationResult
 * @property {string[]} installed - List of installed server IDs
 * @property {string[]} skipped - List of skipped server IDs
 * @property {string} configPath - Path to config file
 */

/**
 * @typedef {Object} InstallationStatus
 * @property {number} total - Total MCPs in catalog
 * @property {number} installed - Number of installed MCPs
 * @property {number} notInstalled - Number of MCPs not installed
 * @property {number} percentage - Installation percentage (0-100)
 * @property {Object<string, {installed: number, total: number}>} [byCategory] - Breakdown by category
 */

/**
 * Generate MCP server configuration from MCP definition
 * @param {Object} mcp - MCP server definition from catalog
 * @returns {McpServerConfig} Configuration for settings.json
 */
function generateMcpConfig(mcp) {
  const config = {
    command: mcp.command,
    args: mcp.args
  };

  // Add type and url for HTTP-type MCPs
  if (mcp.type === 'http') {
    config.type = 'http';
    config.url = mcp.url;
  }

  // Add environment variables if provided
  if (mcp.env) {
    config.env = mcp.env;
  }

  return config;
}

/**
 * Merge new MCP server configuration with existing config file
 * @param {string} configPath - Path to settings.json
 * @param {Object} newServer - New server to add { id, config }
 * @returns {InstallationResult} Installation result
 */
function mergeMcpConfig(configPath, newServer) {
  try {
    let existingConfig = { mcpServers: {} };

    // Try to read existing config
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      try {
        existingConfig = JSON.parse(content);
      } catch (parseError) {
        return {
          success: false,
          skipped: false,
          error: `Invalid JSON in config file: ${parseError.message}`,
          configPath
        };
      }
    }

    // Ensure mcpServers object exists
    if (!existingConfig.mcpServers) {
      existingConfig.mcpServers = {};
    }

    // Check if server already exists
    if (existingConfig.mcpServers[newServer.id]) {
      return {
        success: true,
        skipped: true,
        message: `Server ${newServer.id} already configured`,
        configPath
      };
    }

    // Add new server - preserve ALL existing config (modelProviders, security, etc.)
    existingConfig.mcpServers[newServer.id] = newServer.config;

    // Write updated config with proper formatting - preserves all existing settings
    fs.writeFileSync(configPath, JSON.stringify(existingConfig, null, 2) + '\n', 'utf8');

    return {
      success: true,
      skipped: false,
      message: `Server ${newServer.id} configured successfully`,
      configPath
    };
  } catch (error) {
    return {
      success: false,
      skipped: false,
      error: error.message,
      configPath
    };
  }
}

/**
 * Configure a single MCP server
 * @param {string} configPath - Path to settings.json
 * @param {Object} mcp - MCP server definition from catalog
 * @returns {InstallationResult} Installation result
 */
function configureMcpServer(configPath, mcp) {
  const config = generateMcpConfig(mcp);
  
  return mergeMcpConfig(configPath, {
    id: mcp.id,
    config
  });
}

/**
 * Configure multiple MCP servers
 * @param {string} configPath - Path to .mcp.json
 * @param {Object[]} mcps - Array of MCP server definitions from catalog
 * @returns {MultiInstallationResult} Installation results with installed/skipped lists
 */
function configureMultipleMcpServers(configPath, mcps) {
  const results = {
    installed: [],
    skipped: [],
    configPath
  };

  for (const mcp of mcps) {
    const result = configureMcpServer(configPath, mcp);
    
    if (result.success) {
      if (result.skipped) {
        results.skipped.push(mcp.id);
      } else {
        results.installed.push(mcp.id);
      }
    }
  }

  return results;
}

/**
 * Get MCP installation status
 * @param {string} configPath - Path to settings.json
 * @param {Object[]} catalog - Array of MCP server definitions from catalog
 * @returns {InstallationStatus} Installation status with counts and percentage
 */
function getMcpInstallationStatus(configPath, catalog) {
  // Read existing config
  let existingServers = new Set();
  
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(content);
      
      if (config.mcpServers) {
        existingServers = new Set(Object.keys(config.mcpServers));
      }
    } catch (error) {
      // If config is invalid, treat as empty
      existingServers = new Set();
    }
  }

  // Count installed vs not installed
  let installedCount = 0;
  const byCategory = {};

  for (const mcp of catalog) {
    // Initialize category stats
    if (mcp.category && !byCategory[mcp.category]) {
      byCategory[mcp.category] = { installed: 0, total: 0 };
    }

    // Count by category
    if (mcp.category) {
      byCategory[mcp.category].total++;
    }

    // Check if installed
    if (existingServers.has(mcp.id)) {
      installedCount++;
      if (mcp.category) {
        byCategory[mcp.category].installed++;
      }
    }
  }

  const total = catalog.length;
  const notInstalled = total - installedCount;
  const percentage = total > 0 ? Math.round((installedCount / total) * 100) : 0;

  return {
    total,
    installed: installedCount,
    notInstalled,
    percentage,
    byCategory: total > 0 ? byCategory : undefined
  };
}

module.exports = {
  generateMcpConfig,
  mergeMcpConfig,
  configureMcpServer,
  configureMultipleMcpServers,
  getMcpInstallationStatus
};
