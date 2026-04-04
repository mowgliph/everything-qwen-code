# Token Efficiency Integration Implementation Plan

> **For Qwen:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Add token efficiency behavior rules to Qwen Code's global config and the everything-qwen-code distribution system.

**Architecture:** Three surfaces — (1) `~/.qwen/QWEN.md` gets a "Token Efficiency" section, (2) `everything-qwen-code/` gets a reference doc + merge utility, (3) `bin/eqw-install` auto-appends rules during installation.

**Tech Stack:** Node.js (installer), Markdown (rules), JavaScript (merge utility)

---

## Implementation Steps

### Task 1: Create `scripts/merge-token-rules.js`

**Files:**
- Create: `scripts/merge-token-rules.js`
- Test: `tests/test-merge-token-rules.js`

**Step 1: Write the merge utility**

Create `scripts/merge-token-rules.js` that:
- Reads a target `QWEN.md` file path
- Checks if `## Token Efficiency` section exists (case-insensitive)
- If missing: appends the section
- If present: returns `{ action: 'skipped' }`
- If file doesn't exist: creates it with minimal header + token section

```javascript
#!/usr/bin/env node

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
```

**Step 2: Commit**

```bash
git add scripts/merge-token-rules.js
git commit -m "feat: add token efficiency merge utility"
```

---

### Task 2: Write Tests for `merge-token-rules.js`

**Files:**
- Create: `tests/test-merge-token-rules.js`

**Step 1: Write tests**

```javascript
const fs = require('fs');
const path = require('path');
const os = require('os');
const { mergeTokenRules, TOKEN_SECTION } = require('../scripts/merge-token-rules');

const TEST_DIR = path.join(os.tmpdir(), 'eqw-token-rules-test-' + Date.now());

function setup() {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

function teardown() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

function testAppend() {
  setup();
  const targetPath = path.join(TEST_DIR, 'QWEN.md');
  
  // Create existing file with content
  fs.writeFileSync(targetPath, '# Test\n\nSome content\n', 'utf8');
  
  const result = mergeTokenRules(targetPath);
  
  if (result.action !== 'appended') {
    throw new Error(`Expected 'appended', got '${result.action}'`);
  }
  
  const content = fs.readFileSync(targetPath, 'utf8');
  if (!content.includes('## Token Efficiency')) {
    throw new Error('Token Efficiency section not found after append');
  }
  
  teardown();
  console.log('✓ testAppend passed');
}

function testSkipIfExists() {
  setup();
  const targetPath = path.join(TEST_DIR, 'QWEN.md');
  
  // Create file with existing token section
  fs.writeFileSync(targetPath, '# Test\n\n## Token Efficiency\n\nAlready here\n', 'utf8');
  
  const result = mergeTokenRules(targetPath);
  
  if (result.action !== 'skipped') {
    throw new Error(`Expected 'skipped', got '${result.action}'`);
  }
  
  teardown();
  console.log('✓ testSkipIfExists passed');
}

function testCreateIfMissing() {
  setup();
  const targetPath = path.join(TEST_DIR, 'missing', 'QWEN.md');
  
  const result = mergeTokenRules(targetPath);
  
  if (result.action !== 'created') {
    throw new Error(`Expected 'created', got '${result.action}'`);
  }
  
  const content = fs.readFileSync(targetPath, 'utf8');
  if (!content.includes('## Token Efficiency')) {
    throw new Error('Token Efficiency section not found in created file');
  }
  
  teardown();
  console.log('✓ testCreateIfMissing passed');
}

function testNoDuplicateOnReRun() {
  setup();
  const targetPath = path.join(TEST_DIR, 'QWEN.md');
  
  fs.writeFileSync(targetPath, '# Test\n\nSome content\n', 'utf8');
  
  // Run twice
  mergeTokenRules(targetPath);
  mergeTokenRules(targetPath);
  
  const content = fs.readFileSync(targetPath, 'utf8');
  const matches = content.match(/## Token Efficiency/g);
  
  if (matches && matches.length > 1) {
    throw new Error(`Token Efficiency section appears ${matches.length} times (expected 1)`);
  }
  
  teardown();
  console.log('✓ testNoDuplicateOnReRun passed');
}

// Run all tests
try {
  testAppend();
  testSkipIfExists();
  testCreateIfMissing();
  testNoDuplicateOnReRun();
  console.log('\nAll 4 tests passed');
  process.exit(0);
} catch (err) {
  console.error('Test failed:', err.message);
  process.exit(1);
}
```

**Step 2: Run tests**

```bash
node tests/test-merge-token-rules.js
```

Expected output:
```
✓ testAppend passed
✓ testSkipIfExists passed
✓ testCreateIfMissing passed
✓ testNoDuplicateOnReRun passed

All 4 tests passed
```

**Step 3: Commit**

```bash
git add tests/test-merge-token-rules.js
git commit -m "test: add tests for token efficiency merge utility"
```

---

### Task 3: Create `docs/token-efficiency.md` Reference Document

**Files:**
- Create: `docs/token-efficiency.md`

**Step 1: Write the reference document**

```markdown
# Token Efficiency for Qwen Code

> Adapted from [claude-token-efficient](https://github.com/drona23/claude-token-efficient) by Drona Gangarapu.

## The Problem

By default, Qwen Code (like Claude Code) produces verbose output:
- Sycophantic openers ("Sure!", "Great question!")
- Closing fluff ("I hope this helps!")
- Em dashes, smart quotes, Unicode that break parsers
- Restating your question before answering
- Unsolicited suggestions beyond scope
- Agreeing with incorrect statements

All of this wastes tokens. None of it adds value.

## The Fix

Token efficiency rules are installed in your `~/.qwen/QWEN.md` file.
They change output behavior immediately. No code changes needed.

## Rules

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

## Benchmark Results (from claude-token-efficient)

| Test | Baseline | Optimized | Reduction |
|------|----------|-----------|-----------|
| Explain async/await | 180 words | 65 words | 64% |
| Code review | 120 words | 30 words | 75% |
| What is REST API | 110 words | 55 words | 50% |
| Hallucination correction | 55 words | 20 words | 64% |
| **Total** | **465 words** | **170 words** | **~63%** |

## When This Helps

- Daily development work with many interactions
- Code review and debugging sessions
- Automation pipelines and agent loops
- Any output-heavy workflow

## When It Doesn't

- Single short queries (file overhead > output savings)
- Casual one-off use
- Exploratory work where debate and alternatives are the point

## Installation

```bash
# Via eqw-install (automatic)
npx eqw-install

# Manual
node scripts/merge-token-rules.js ~/.qwen/QWEN.md
```

## Profiles (Future)

Different project types need different compression levels. Profiles are planned for a future release:

| Profile | Best For |
|---------|----------|
| **Coding** (default) | Dev projects, code review, debugging |
| **Agents** | Automation pipelines, multi-agent systems |
| **Analysis** | Data analysis, research, reporting |

## Override Rule

User instructions always win. If you explicitly ask for detailed explanation or verbose output, you get it — the rules never fight you.

## References

- [claude-token-efficient](https://github.com/drona23/claude-token-efficient)
- [GitHub #3382 - Sycophancy bug (350+ upvotes)](https://github.com/anthropics/claude-code/issues/3382)
- [GitHub #20542 - Verbose output wastes tokens](https://github.com/anthropics/claude-code/issues/20542)
```

**Step 2: Commit**

```bash
git add docs/token-efficiency.md
git commit -m "docs: add token efficiency reference document"
```

---

### Task 4: Update `bin/eqw-install` to Integrate Token Rules

**Files:**
- Modify: `bin/eqw-install`

**Step 1: Add token rules integration to installer**

Insert this block in `bin/eqw-install` after the "Install config files" section and before "Configure MCP servers":

```javascript
// Install token efficiency rules
log('\n📝 Installing token efficiency rules...\n', 'bright');

try {
  const { mergeTokenRules } = require('./scripts/merge-token-rules');
  const qwenMdPath = path.join(QWEN_DIR, 'QWEN.md');
  const result = mergeTokenRules(qwenMdPath);

  if (result.action === 'appended') {
    logSuccess('Appended token efficiency rules to QWEN.md');
  } else if (result.action === 'created') {
    logSuccess('Created QWEN.md with token efficiency rules');
  } else {
    logInfo('Token efficiency rules already present in QWEN.md (skipping)');
  }
} catch (err) {
  logWarn(`Token efficiency installation skipped: ${err.message}`);
}
```

**Step 2: Update the installation summary**

Add to the "What's included" section:

```javascript
log('   • Token efficiency rules in ~/.qwen/QWEN.md', 'cyan');
```

**Step 3: Test the installer**

```bash
# Test on a temp copy of QWEN.md
mkdir -p /tmp/eqw-test-qwen
cp ~/.qwen/QWEN.md /tmp/eqw-test-qwen/QWEN.md
node bin/eqw-install  # Will run against ~/.qwen/ (safe — idempotent)
```

**Step 4: Commit**

```bash
git add bin/eqw-install
git commit -m "feat: integrate token efficiency rules into eqw-install"
```

---

### Task 5: Update `package.json` Scripts

**Files:**
- Modify: `package.json`

**Step 1: Add test script for token rules**

Add to the `scripts` section:

```json
{
  "scripts": {
    "test:token-rules": "node tests/test-merge-token-rules.js"
  }
}
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add test script for token efficiency merge utility"
```

---

### Task 6: Update CHANGELOG.md

**Files:**
- Modify: `CHANGELOG.md`

**Step 1: Add changelog entry**

Add at the top (after the header):

```markdown
## [Unreleased]

### Added
- Token efficiency behavior rules in `~/.qwen/QWEN.md` — reduces output tokens by ~50-63%
- `scripts/merge-token-rules.js` — idempotent merge utility for installer
- `docs/token-efficiency.md` — full reference document with benchmarks
- `bin/eqw-install` now auto-installs token efficiency rules
- Tests for merge utility (4 test cases)
```

**Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: add token efficiency to changelog"
```

---

### Task 7: Final Verification

**Step 1: Run all tests**

```bash
npm test
node tests/test-merge-token-rules.js
```

**Step 2: Verify idempotency**

```bash
# Run merge twice on same file
node scripts/merge-token-rules.js ~/.qwen/QWEN.md
node scripts/merge-token-rules.js ~/.qwen/QWEN.md
# Second run should return { action: 'skipped' }
```

**Step 3: Verify QWEN.md has the section**

```bash
grep -c "Token Efficiency" ~/.qwen/QWEN.md
# Should return 1
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification for token efficiency integration"
```

---

## Testing Strategy

| Test | Type | Command |
|------|------|---------|
| merge-token-rules append | Unit | `node tests/test-merge-token-rules.js` |
| merge-token-rules skip | Unit | Same |
| merge-token-rules create | Unit | Same |
| merge-token-rules no-duplicate | Unit | Same |
| eqw-install idempotency | Integration | Run `npx eqw-install` twice |
| QWEN.md section present | Manual | `grep "Token Efficiency" ~/.qwen/QWEN.md` |

---

## Risks & Mitigations

- **Risk:** Corrupts existing `QWEN.md` on write
  - Mitigation: Simple append only; no complex parsing; future improvement: atomic write via temp file + rename
- **Risk:** Rules conflict with existing behavior rules in `QWEN.md`
  - Mitigation: Token rules are additive — they don't override existing rules, just add new constraints
- **Risk:** Installer fails silently
  - Mitigation: Wrapped in try/catch with warning log; non-fatal failure

---

## Success Criteria

- [ ] `scripts/merge-token-rules.js` passes all 4 unit tests
- [ ] `bin/eqw-install` appends token rules to `~/.qwen/QWEN.md` on fresh install
- [ ] `bin/eqw-install` skips token rules on re-install (idempotent)
- [ ] `docs/token-efficiency.md` exists with full reference
- [ ] `CHANGELOG.md` updated
- [ ] No duplicate sections after multiple runs
