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
