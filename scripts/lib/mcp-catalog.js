/**
 * MCP Catalog - Centralized registry of MCP servers
 * 
 * Provides functions to query and filter MCP servers by category,
 * API key requirement, and recommendation status.
 */

/**
 * @typedef {Object} McpServer
 * @property {string} id - Unique identifier for the MCP server
 * @property {string} name - Human-readable name
 * @property {string} description - Brief description
 * @property {string} category - Category (documentation, search, development, etc.)
 * @property {boolean} requiresApiKey - Whether API key is required
 * @property {boolean} recommended - Whether this is a recommended MCP
 * @property {string} command - Command to run (e.g., 'npx')
 * @property {string[]} args - Command arguments
 * @property {Record<string, string> | null} env - Environment variables
 * @property {string | null} url - URL for HTTP-type MCPs
 */

/**
 * Complete MCP servers catalog
 * @type {McpServer[]}
 */
const MCP_CATALOG = [
  // === FREE MCP SERVERS (Auto-Install) ===
  
  // Documentation
  {
    id: 'context7',
    name: 'Context7',
    description: 'Live documentation and code examples',
    category: 'documentation',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@context7/mcp@latest'],
    env: null,
    url: null
  },
  {
    id: 'cloudflare-docs',
    name: 'Cloudflare Docs',
    description: 'Cloudflare documentation access',
    category: 'documentation',
    requiresApiKey: false,
    recommended: false,
    command: 'npx',
    args: ['-y', 'cloudflare-docs-mcp@latest'],
    env: null,
    url: null
  },

  // Memory & State
  {
    id: 'memory',
    name: 'Memory',
    description: 'Persistent memory for AI assistants',
    category: 'memory',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory@latest'],
    env: null,
    url: null
  },

  // Reasoning & Thinking
  {
    id: 'sequential-thinking',
    name: 'Sequential Thinking',
    description: 'Step-by-step reasoning and chain of thought',
    category: 'reasoning',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-sequential-thinking@latest'],
    env: null,
    url: null
  },

  // Browser Automation
  {
    id: 'playwright',
    name: 'Playwright',
    description: 'Browser automation and web scraping',
    category: 'automation',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@playwright/mcp@latest'],
    env: null,
    url: null
  },

  // Search & Web
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    description: 'Web search via DuckDuckGo',
    category: 'search',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@duckduckgo/mcp@latest'],
    env: null,
    url: null
  },

  // File System
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: 'Local file system access',
    category: 'filesystem',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem@latest'],
    env: null,
    url: null
  },

  // Cloudflare Platform
  {
    id: 'cloudflare-workers-builds',
    name: 'Cloudflare Workers Builds',
    description: 'Cloudflare Workers build automation',
    category: 'cloudflare',
    requiresApiKey: false,
    recommended: false,
    command: 'npx',
    args: ['-y', 'cloudflare-workers-builds-mcp@latest'],
    env: null,
    url: null
  },
  {
    id: 'cloudflare-workers-bindings',
    name: 'Cloudflare Workers Bindings',
    description: 'Cloudflare Workers bindings management',
    category: 'cloudflare',
    requiresApiKey: false,
    recommended: false,
    command: 'npx',
    args: ['-y', 'cloudflare-workers-bindings-mcp@latest'],
    env: null,
    url: null
  },
  {
    id: 'cloudflare-observability',
    name: 'Cloudflare Observability',
    description: 'Cloudflare observability and monitoring',
    category: 'cloudflare',
    requiresApiKey: false,
    recommended: false,
    command: 'npx',
    args: ['-y', 'cloudflare-observability-mcp@latest'],
    env: null,
    url: null
  },

  // Deployment
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Vercel deployment and management',
    category: 'deployment',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@vercel/mcp@latest'],
    env: null,
    url: null
  },

  // Version Control
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub integration (requires PAT for full functionality)',
    category: 'version-control',
    requiresApiKey: false,
    recommended: true,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github@latest'],
    env: null,
    url: null
  },

  // === API KEY REQUIRED MCP SERVERS ===
  
  // Search (API Key)
  {
    id: 'tavily',
    name: 'Tavily Search',
    description: 'AI-powered search engine',
    category: 'search',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@tavily/mcp@latest'],
    env: { TAVILY_API_KEY: '<your-api-key>' },
    url: null
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Brave search engine integration',
    category: 'search',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search@latest'],
    env: { BRAVE_API_KEY: '<your-api-key>' },
    url: null
  },

  // Database (API Key)
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'MongoDB database operations',
    category: 'database',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@mongodb/mcp@latest'],
    env: { MONGODB_URI: '<your-connection-string>' },
    url: null
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'PostgreSQL database operations',
    category: 'database',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres@latest'],
    env: { DATABASE_URL: '<your-postgres-url>' },
    url: null
  },

  // AI & ML (API Key)
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI API integration',
    category: 'ai',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@openai/mcp@latest'],
    env: { OPENAI_API_KEY: '<your-api-key>' },
    url: null
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Anthropic Claude API',
    category: 'ai',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@anthropic/mcp@latest'],
    env: { ANTHROPIC_API_KEY: '<your-api-key>' },
    url: null
  },

  // Communication (API Key)
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack messaging and collaboration',
    category: 'communication',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-slack@latest'],
    env: { SLACK_BOT_TOKEN: '<your-bot-token>' },
    url: null
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Gmail integration',
    category: 'communication',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-gmail@latest'],
    env: { GMAIL_CREDENTIALS: '<your-credentials>' },
    url: null
  },

  // Maps & Location (API Key)
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Google Maps geocoding and routing',
    category: 'maps',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-google-maps@latest'],
    env: { GOOGLE_MAPS_API_KEY: '<your-api-key>' },
    url: null
  },

  // Note Taking (API Key)
  {
    id: 'notion',
    name: 'Notion',
    description: 'Notion workspace integration',
    category: 'productivity',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-notion@latest'],
    env: { NOTION_API_KEY: '<your-api-key>' },
    url: null
  },
  {
    id: 'evernote',
    name: 'Evernote',
    description: 'Evernote note-taking',
    category: 'productivity',
    requiresApiKey: true,
    recommended: false,
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-evernote@latest'],
    env: { EVERNOTE_API_KEY: '<your-api-key>' },
    url: null
  },

  // HTTP-type MCPs
  {
    id: 'cloudflare-api',
    name: 'Cloudflare API',
    description: 'Cloudflare API via HTTP',
    category: 'cloudflare',
    requiresApiKey: true,
    recommended: false,
    type: 'http',
    command: null,
    args: null,
    env: { CLOUDFLARE_API_TOKEN: '<your-api-token>' },
    url: 'https://api.cloudflare.com/mcp'
  }
];

/**
 * Get all MCP servers from the catalog
 * @returns {McpServer[]} Array of all MCP servers
 */
function getMcpCatalog() {
  return [...MCP_CATALOG];
}

/**
 * Get free MCP servers (no API key required)
 * @param {boolean} recommendedOnly - If true, only return recommended MCPs
 * @returns {McpServer[]} Array of free MCP servers
 */
function getFreeMcpServers(recommendedOnly = false) {
  const freeMcps = MCP_CATALOG.filter(mcp => !mcp.requiresApiKey);
  
  if (recommendedOnly) {
    return freeMcps.filter(mcp => mcp.recommended);
  }
  
  return freeMcps;
}

/**
 * Get MCP servers by category
 * @param {string} category - Category to filter by
 * @returns {McpServer[]} Array of MCP servers in the category
 */
function getMcpByCategory(category) {
  if (!category || typeof category !== 'string') {
    return [];
  }
  
  const normalizedCategory = category.toLowerCase();
  return MCP_CATALOG.filter(
    mcp => mcp.category.toLowerCase() === normalizedCategory
  );
}

/**
 * Get MCP server by ID
 * @param {string} id - MCP server ID
 * @returns {McpServer | null} MCP server or null if not found
 */
function getMcpById(id) {
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  return MCP_CATALOG.find(mcp => mcp.id === id) || null;
}

/**
 * Get all unique categories with MCP counts
 * @returns {Object<string, number>} Object with category names as keys and counts as values
 */
function getMcpCategories() {
  const categories = {};
  MCP_CATALOG.forEach(mcp => {
    categories[mcp.category] = (categories[mcp.category] || 0) + 1;
  });
  return categories;
}

/**
 * Get MCP servers that require API key
 * @returns {McpServer[]} MCP servers requiring API key
 */
function getPaidMcpServers() {
  return MCP_CATALOG.filter(mcp => mcp.requiresApiKey === true);
}

module.exports = {
  getMcpCatalog,
  getFreeMcpServers,
  getPaidMcpServers,
  getMcpByCategory,
  getMcpById,
  getMcpCategories,
  MCP_CATALOG
};
