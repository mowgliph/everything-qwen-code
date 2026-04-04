#!/usr/bin/env node

/**
 * Token Efficiency Rules Merge Utility
 *
 * Idempotently appends token efficiency behavior rules to a target QWEN.md file.
 * - If section exists: skips
 * - If file missing: creates with minimal header
 * - If file exists without section: appends
 *
 * Usage: node scripts/merge-token-rules.js [path/to/QWEN.md]
 * Default: ~/.qwen/QWEN.md
 */

const fs = require('fs');
const path = require('path');

const TOKEN_SECTION = `
## Token Efficiency

### Output Behavior
- No sycophantic openers ("Sure!", "Great question!", "Absolutely!")
- No closing fluff ("I hope this helps!", "Let me know if you need anything!")
- No em dashes, smart quotes, or decorative Unicode — use plain hyphens and straight quotes
- No restating the user's question before answering
- No unsolicited suggestions beyond what was asked
- Don't agree with incorrect statements — correct them directly

### Code Output
- Return code first. Explanation after, only if non-obvious
- Simplest working solution — no over-engineering or premature abstractions
- No speculative features or "you might also want..."
- Read files before modifying — never edit blind
- Prefer targeted edits over rewriting whole files
- Don't re-read files already read unless they may have changed

### Review & Debugging
- State the bug. Show the fix. Stop.
- Never speculate without reading the relevant code first
- If cause is unclear: say so. Don't guess.

### User Override
- User instructions always override these rules
- If you explicitly ask for verbose output, you get it
`;

/**
 * Merge token efficiency rules into target QWEN.md
 * @param {string} targetPath - Path to QWEN.md
 * @returns {{ action: 'created'|'appended'|'skipped', path: string }}
 */
function mergeTokenRules(targetPath) {
  const dir = path.dirname(targetPath);

  if (!fs.existsSync(targetPath)) {
    // File doesn't exist — create with minimal header
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = `# Qwen Code Global Context\n\n${TOKEN_SECTION.trim()}\n`;
    fs.writeFileSync(targetPath, content, 'utf8');
    return { action: 'created', path: targetPath };
  }

  const content = fs.readFileSync(targetPath, 'utf8');

  // Check if section already exists
  if (/^##\s+Token\s+Efficiency/im.test(content)) {
    return { action: 'skipped', path: targetPath };
  }

  // Append section
  const updated = content.endsWith('\n') ? content + TOKEN_SECTION.trim() + '\n' : content + '\n' + TOKEN_SECTION.trim() + '\n';
  fs.writeFileSync(targetPath, updated, 'utf8');
  return { action: 'appended', path: targetPath };
}

// CLI usage
if (require.main === module) {
  const targetPath = process.argv[2] || path.join(require('os').homedir(), '.qwen', 'QWEN.md');
  const result = mergeTokenRules(targetPath);
  console.log(JSON.stringify(result));
  process.exit(0);
}

module.exports = { mergeTokenRules, TOKEN_SECTION };
