#!/usr/bin/env node

/**
 * MCP Servers Setup CLI
 * 
 * Command-line interface for configuring MCP servers.
 * Supports auto-installation, manual installation, and status reporting.
 * 
 * Usage:
 *   node scripts/setup-mcp-servers.js --auto              # Install all recommended free MCPs
 *   node scripts/setup-mcp-servers.js --list              # List all available MCPs
 *   node scripts/setup-mcp-servers.js --status            # Show installation status
 *   node scripts/setup-mcp-servers.js --install <id>      # Install specific MCP
 *   node scripts/setup-mcp-servers.js --category <name>   # Install all MCPs in category
 *   node scripts/setup-mcp-servers.js --help              # Show this help
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

// Import catalog and installer
const {
  getMcpCatalog,
  getFreeMcpServers,
  getMcpByCategory,
  getMcpById,
  getMcpCategories
} = require('./lib/mcp-catalog');

const {
  configureMcpServer,
  configureMultipleMcpServers,
  getMcpInstallationStatus
} = require('./lib/mcp-installer');

/**
 * Get path to .qwen directory
 * @returns {string} Path to .qwen directory
 */
function getQwenDir() {
  const home = process.env.HOME || os.homedir();
  return path.join(home, '.qwen');
}

/**
 * Get path to MCP config file
 * @returns {string} Path to mcp.json
 */
function getMcpConfigPath() {
  return path.join(getQwenDir(), 'mcp.json');
}

/**
 * Ensure .qwen directory exists
 */
function ensureQwenDir() {
  const qwenDir = getQwenDir();
  if (!fs.existsSync(qwenDir)) {
    fs.mkdirSync(qwenDir, { recursive: true });
  }
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
MCP Servers Setup CLI

Usage:
  node scripts/setup-mcp-servers.js [options]

Options:
  --auto              Install all recommended free MCP servers
  --list              List all available MCP servers
  --status            Show installation status
  --install <id>      Install specific MCP server by ID
  --category <name>   Install all MCP servers in a category
  --recommended       Show only recommended MCPs (use with --list)
  --help, -h          Show this help message

Examples:
  # Install all recommended free MCPs
  node scripts/setup-mcp-servers.js --auto

  # List all available MCPs
  node scripts/setup-mcp-servers.js --list

  # Show installation status
  node scripts/setup-mcp-servers.js --status

  # Install specific MCP
  node scripts/setup-mcp-servers.js --install context7

  # Install all documentation MCPs
  node scripts/setup-mcp-servers.js --category documentation

  # List only recommended MCPs
  node scripts/setup-mcp-servers.js --list --recommended

MCP Categories:
  ${Object.keys(getMcpCategories()).join(', ')}

Free MCP Servers (auto-installed):
  ${getFreeMcpServers(true).map(mcp => mcp.id).join(', ')}

Note: MCPs marked with [API Key] require API credentials to function.
`);
}

/**
 * List all MCP servers
 * @param {boolean} recommendedOnly - Show only recommended MCPs
 */
function listMcps(recommendedOnly = false) {
  console.log('\n📋 MCP Servers Catalog\n');
  console.log('='.repeat(60));

  const catalog = getMcpCatalog();
  const categoryCounts = getMcpCategories();
  const categories = Object.keys(categoryCounts).sort();

  for (const category of categories) {
    const categoryMcps = getMcpByCategory(category);
    const filteredMcps = recommendedOnly 
      ? categoryMcps.filter(mcp => mcp.recommended)
      : categoryMcps;
    
    if (filteredMcps.length === 0) continue;
    
    console.log(`\n${category.toUpperCase()}`);
    console.log('-'.repeat(40));
    
    for (const mcp of filteredMcps) {
      const apiKeyFlag = mcp.requiresApiKey ? ' [API Key]' : '';
      const recommendedFlag = mcp.recommended ? ' ⭐' : '';
      console.log(`  • ${mcp.id}${apiKeyFlag}${recommendedFlag}`);
      console.log(`    ${mcp.description}`);
    }
  }
  
  const freeCount = getFreeMcpServers(recommendedOnly).length;
  const totalCount = recommendedOnly 
    ? getFreeMcpServers(true).length 
    : catalog.length;
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${totalCount} MCP servers`);
  console.log(`Free (no API key): ${freeCount}`);
  if (recommendedOnly) {
    console.log('Showing: Recommended only');
  }
  console.log();
}

/**
 * Show installation status
 */
function showStatus() {
  console.log('\n📊 MCP Installation Status\n');
  console.log('='.repeat(60));
  
  ensureQwenDir();
  const configPath = getMcpConfigPath();
  const catalog = getMcpCatalog();
  
  const status = getMcpInstallationStatus(configPath, catalog);
  
  console.log(`\nOverall Progress: ${status.percentage}%`);
  console.log(`Installed: ${status.installed} / ${status.total}`);
  console.log(`Not Installed: ${status.notInstalled}`);
  
  if (status.byCategory) {
    console.log('\nBy Category:');
    console.log('-'.repeat(40));
    
    for (const [category, catStatus] of Object.entries(status.byCategory)) {
      const catPercentage = catStatus.total > 0 
        ? Math.round((catStatus.installed / catStatus.total) * 100) 
        : 0;
      console.log(`  ${category}: ${catStatus.installed}/${catStatus.total} (${catPercentage}%)`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log();
}

/**
 * Install all recommended free MCPs
 */
function installAuto() {
  console.log('\n🚀 Auto-Installing Recommended Free MCPs\n');
  console.log('='.repeat(60));
  
  ensureQwenDir();
  const configPath = getMcpConfigPath();
  const freeMcps = getFreeMcpServers(true); // Only recommended free MCPs
  
  console.log(`\nInstalling ${freeMcps.length} MCP servers...\n`);
  
  const results = configureMultipleMcpServers(configPath, freeMcps);
  
  for (const id of results.installed) {
    console.log(`  ✓ ${id}`);
  }
  
  if (results.skipped.length > 0) {
    console.log('\nSkipped (already installed):');
    for (const id of results.skipped) {
      console.log(`  ⊘ ${id}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Success: ${results.installed.length} MCP server(s) installed`);
  if (results.skipped.length > 0) {
    console.log(`   Skipped: ${results.skipped.length} MCP server(s) already configured`);
  }
  console.log(`\nConfig file: ${configPath}`);
  console.log();
}

/**
 * Install specific MCP by ID
 * @param {string} mcpId - MCP server ID
 */
function installMcp(mcpId) {
  if (!mcpId) {
    console.error('Error: MCP ID is required');
    console.error('Usage: node scripts/setup-mcp-servers.js --install <id>');
    process.exit(1);
  }
  
  console.log(`\n📦 Installing MCP: ${mcpId}\n`);
  
  const mcp = getMcpById(mcpId);
  
  if (!mcp) {
    console.error(`Error: MCP '${mcpId}' not found`);
    console.error('Use --list to see available MCPs');
    process.exit(1);
  }
  
  // Warn about API key requirement
  if (mcp.requiresApiKey) {
    console.log('⚠️  WARNING: This MCP requires an API key');
    console.log(`   You will need to configure: ${Object.keys(mcp.env || {}).join(', ')}`);
    console.log('   Edit ~/.qwen/mcp.json after installation to add your API key.\n');
  }
  
  ensureQwenDir();
  const configPath = getMcpConfigPath();
  
  const result = configureMcpServer(configPath, mcp);
  
  if (result.success) {
    if (result.skipped) {
      console.log(`⊘ MCP '${mcpId}' is already configured`);
    } else {
      console.log(`✅ MCP '${mcpId}' installed successfully`);
      console.log(`\nConfig file: ${configPath}`);
      
      if (mcp.requiresApiKey) {
        console.log('\n⚠️  Remember to add your API key to the config file!');
      }
    }
  } else {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }
  
  console.log();
}

/**
 * Install all MCPs in a category
 * @param {string} categoryName - Category name
 */
function installCategory(categoryName) {
  if (!categoryName) {
    console.error('Error: Category name is required');
    console.error('Usage: node scripts/setup-mcp-servers.js --category <name>');
    process.exit(1);
  }
  
  const categoryMcps = getMcpByCategory(categoryName);
  
  if (categoryMcps.length === 0) {
    console.error(`Error: No MCPs found in category '${categoryName}'`);
    console.error('Use --list to see available categories');
    process.exit(1);
  }
  
  console.log(`\n📦 Installing MCPs in category: ${categoryName}\n`);
  console.log(`Found ${categoryMcps.length} MCP(s) in this category\n`);
  
  // Warn about API keys
  const apiKeyMcps = categoryMcps.filter(mcp => mcp.requiresApiKey);
  if (apiKeyMcps.length > 0) {
    console.log('⚠️  WARNING: The following MCPs require API keys:');
    for (const mcp of apiKeyMcps) {
      console.log(`   • ${mcp.id}`);
    }
    console.log();
  }
  
  ensureQwenDir();
  const configPath = getMcpConfigPath();
  
  const results = configureMultipleMcpServers(configPath, categoryMcps);
  
  for (const id of results.installed) {
    console.log(`  ✓ ${id}`);
  }
  
  if (results.skipped.length > 0) {
    console.log('\nSkipped (already installed):');
    for (const id of results.skipped) {
      console.log(`  ⊘ ${id}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Success: ${results.installed.length} MCP server(s) installed`);
  if (results.skipped.length > 0) {
    console.log(`   Skipped: ${results.skipped.length} MCP server(s) already configured`);
  }
  console.log(`\nConfig file: ${configPath}`);
  console.log();
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    help: false,
    list: false,
    status: false,
    auto: false,
    install: null,
    category: null,
    recommended: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--list') {
      result.list = true;
    } else if (arg === '--status') {
      result.status = true;
    } else if (arg === '--auto') {
      result.auto = true;
    } else if (arg === '--recommended') {
      result.recommended = true;
    } else if (arg === '--install' && args[i + 1]) {
      result.install = args[++i];
    } else if (arg === '--category' && args[i + 1]) {
      result.category = args[++i];
    }
  }
  
  return result;
}

/**
 * Main entry point
 */
function main() {
  const args = parseArgs();
  
  // Show help if no args or --help
  if (args.help || Object.values(args).every(v => v === false || v === null)) {
    showHelp();
    return;
  }
  
  try {
    if (args.list) {
      listMcps(args.recommended);
    } else if (args.status) {
      showStatus();
    } else if (args.auto) {
      installAuto();
    } else if (args.install) {
      installMcp(args.install);
    } else if (args.category) {
      installCategory(args.category);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run main
main();
