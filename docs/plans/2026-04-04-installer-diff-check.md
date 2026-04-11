# Installer Diff-Check System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add file diff detection and interactive user prompts to the eqw-install script so it never silently overwrites user customizations.

**Architecture:** Add helper functions to `bin/eqw-install` for file comparison, unified diff display, interactive prompts, and CLI flag parsing. Modify `copyDir()` and `copyFile()` to check for diffs before overwriting.

**Tech Stack:** Node.js built-in modules only (fs, path, os, readline)

---

### Task 1: Add Core Utility Functions

**Files:**
- Modify: `bin/eqw-install`

**Step 1: Add the utility functions**

Add these functions to `bin/eqw-install` before the `main()` function:

```javascript
/**
 * Check if two files have different content.
 * Returns true if files differ.
 */
function filesDiffer(src, dest) {
  if (!fs.existsSync(dest)) return true;
  try {
    const srcContent = fs.readFileSync(src);
    const destContent = fs.readFileSync(dest);
    return !srcContent.equals(destContent);
  } catch (err) {
    return true; // If we can't read, assume different
  }
}

/**
 * Format bytes to human-readable size.
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

/**
 * Generate a simple unified diff between two files (first 15 lines).
 */
function showUnifiedDiff(src, dest) {
  try {
    const srcLines = fs.readFileSync(src, 'utf8').split('\n');
    const destLines = fs.readFileSync(dest, 'utf8').split('\n');
    const maxLen = Math.max(srcLines.length, destLines.length);
    const diffLines = [];

    for (let i = 0; i < Math.min(maxLen, 30); i++) {
      const srcLine = srcLines[i] || '';
      const destLine = destLines[i] || '';
      if (srcLine !== destLine) {
        if (destLine) diffLines.push(`- ${destLine}`);
        if (srcLine) diffLines.push(`+ ${srcLine}`);
      }
    }

    if (diffLines.length === 0) return '  (no visible diff)';
    return diffLines.slice(0, 15).join('\n') +
      (diffLines.length > 15 ? '\n  ...' : '');
  } catch (err) {
    return '  (could not generate diff)';
  }
}

/**
 * Parse CLI arguments for flags.
 * Returns { force: bool, backup: bool, dryRun: bool }
 */
function parseArgs(argv) {
  return {
    force: argv.includes('--force'),
    backup: argv.includes('--backup'),
    dryRun: argv.includes('--dry-run'),
  };
}

/**
 * Check if stdin is a TTY (interactive terminal).
 */
function isInteractive() {
  return process.stdin.isTTY;
}
```

**Step 2: Verify syntax**

Run: `node -c bin/eqw-install`
Expected: No output (syntax OK)

**Step 3: Commit**

```bash
git add bin/eqw-install
git commit -m "feat: add diff-check utility functions to installer

Adds filesDiffer, formatSize, showUnifiedDiff, parseArgs, isInteractive.
No behavior change yet — just utility functions.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 2: Add Interactive Prompt Function

**Files:**
- Modify: `bin/eqw-install`

**Step 1: Add the prompt function**

Add after the utility functions from Task 1:

```javascript
/**
 * Interactive prompt for file conflicts.
 * Returns: 'overwrite' | 'skip' | 'all-overwrite' | 'quit'
 */
function showDiffPrompt(relPath, src, dest, flags) {
  const srcStat = fs.statSync(src);
  const destStat = fs.statSync(dest);
  const srcSize = formatSize(srcStat.size);
  const destSize = formatSize(destStat.size);

  log(`\n⚠ File differs: ${relPath}`, 'yellow');
  log(`  Local: ${destSize} | Incoming: ${srcSize}`, 'yellow');

  if (flags.dryRun) {
    log('  [DRY RUN] Would prompt for overwrite', 'cyan');
    return 'skip';
  }

  if (!isInteractive()) {
    logWarn(`Non-interactive mode: skipping ${relPath}`);
    return 'skip';
  }

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    const ask = () => {
      rl.question('  [O]verwrite  [S]kip  [D]iff  [A]ll overwrite  [Q]uit\n  > ', (answer) => {
        const choice = answer.trim().toLowerCase();
        switch (choice) {
          case 'o':
            rl.close();
            resolve('overwrite');
            break;
          case 's':
            rl.close();
            resolve('skip');
            break;
          case 'd':
            const diff = showUnifiedDiff(src, dest);
            log(`\n${diff}\n`, 'cyan');
            ask();
            break;
          case 'a':
            rl.close();
            resolve('all-overwrite');
            break;
          case 'q':
            rl.close();
            resolve('quit');
            break;
          default:
            ask();
            break;
        }
      });
    };
    ask();
  });
}
```

**Step 2: Verify syntax**

Run: `node -c bin/eqw-install`
Expected: No output (syntax OK)

**Step 3: Commit**

```bash
git add bin/eqw-install
git commit -m "feat: add interactive diff prompt to installer

Prompts user with [O]verwrite/[S]kip/[D]iff/[A]ll/[Q]uit when files differ.
Supports --dry-run flag and non-interactive mode detection.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 3: Modify copyFile to Use Diff Check

**Files:**
- Modify: `bin/eqw-install`

**Step 1: Replace the copyFile function**

Replace the existing `copyFile` function:

```javascript
function copyFile(src, dest, relPath, flags, state) {
  if (!fs.existsSync(src)) {
    return false;
  }

  // Destination doesn't exist — copy directly
  if (!fs.existsSync(dest)) {
    if (!flags.dryRun) {
      fs.copyFileSync(src, dest);
    }
    return true;
  }

  // Files are identical — skip
  if (!filesDiffer(src, dest)) {
    return true; // "installed" but no change needed
  }

  // Files differ
  if (flags.force) {
    if (flags.backup) {
      fs.copyFileSync(dest, dest + '.bak');
    }
    if (!flags.dryRun) {
      fs.copyFileSync(src, dest);
    }
    logInfo(`Overwritten: ${relPath} (--force)`);
    return true;
  }

  // Interactive prompt (async — handled by caller)
  return 'prompt';
}
```

**Step 2: Modify copyDir to handle async prompts**

Replace the `copyDir` function:

```javascript
async function copyDir(src, dest, relDir, flags, state) {
  if (!fs.existsSync(src)) {
    return false;
  }

  ensureDir(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const relPath = path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, relPath, flags, state);
    } else {
      const result = copyFile(srcPath, destPath, relPath, flags, state);

      if (result === 'prompt') {
        const action = await showDiffPrompt(relPath, srcPath, destPath, flags);

        switch (action) {
          case 'overwrite':
            if (flags.backup) {
              fs.copyFileSync(destPath, destPath + '.bak');
            }
            if (!flags.dryRun) {
              fs.copyFileSync(srcPath, destPath);
            }
            logSuccess(`Overwritten: ${relPath}`);
            break;
          case 'all-overwrite':
            flags.force = true;
            if (flags.backup) {
              fs.copyFileSync(destPath, destPath + '.bak');
            }
            if (!flags.dryRun) {
              fs.copyFileSync(srcPath, destPath);
            }
            logSuccess(`Overwritten: ${relPath}`);
            break;
          case 'skip':
            logInfo(`Skipped: ${relPath} (keeping local)`);
            break;
          case 'quit':
            logWarn('Installation aborted by user');
            process.exit(0);
            break;
        }
      } else if (result) {
        // Copied or identical
      } else {
        logError(`Failed to install: ${relPath}`);
      }
    }
  }

  return true;
}
```

**Step 3: Make main() async and parse flags**

At the top of `main()`, add:

```javascript
async function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (flags.force) {
    log('\n⚠ FORCE mode: overwriting all files without prompts\n', 'yellow');
  }
  if (flags.backup) {
    log('\n📦 BACKUP mode: creating .bak files before overwrites\n', 'yellow');
  }
  if (flags.dryRun) {
    log('\n🔍 DRY RUN: showing changes without applying\n', 'yellow');
  }
```

Change the directory install loop to use await:

```javascript
    if (await copyDir(srcPath, destPath, dir.dest, flags, {})) {
```

**Step 4: Verify syntax**

Run: `node -c bin/eqw-install`
Expected: No output (syntax OK)

**Step 5: Commit**

```bash
git add bin/eqw-install
git commit -m "feat: integrate diff check into copyDir and copyFile

Files that differ now prompt user instead of silently overwriting.
Supports --force (bypass prompts), --backup (.bak files), --dry-run.
copyDir is now async to handle interactive prompts.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 4: Update Summary and Help Text

**Files:**
- Modify: `bin/eqw-install`

**Step 1: Update the summary section**

Add to the "What's included" section in the summary:

```javascript
  log('   • Safe file updates with diff-check prompts', 'cyan');
  log('   • --force, --backup, --dry-run flags available', 'cyan');
```

**Step 2: Update the "To update later" section**

Replace:

```javascript
  log('\n🔄 To update later, run:', 'bright');
  log('   npx eqw-install\n', 'yellow');
```

With:

```javascript
  log('\n🔄 To update later, run:', 'bright');
  log('   npx eqw-install              # Interactive (safe)', 'yellow');
  log('   npx eqw-install --dry-run    # Preview changes', 'yellow');
  log('   npx eqw-install --force      # Overwrite all', 'yellow');
  log('   npx eqw-install --backup     # Backup before overwrite\n', 'yellow');
```

**Step 3: Verify syntax and test dry-run**

Run: `node -c bin/eqw-install`
Expected: No output (syntax OK)

**Step 4: Commit**

```bash
git add bin/eqw-install
git commit -m "docs: update installer help text with new flags

Adds --force, --backup, --dry-run usage to summary output.
Mentions safe file updates with diff-check prompts.

Co-authored-by: Qwen-Coder <qwen-coder@alibabacloud.com>"
```

---

### Task 5: Manual Testing

**Files:**
- Test: `bin/eqw-install`

**Step 1: Test --dry-run**

Run: `node bin/eqw-install --dry-run`
Expected: Shows "DRY RUN" banner, no files modified

**Step 2: Test --force**

Run: `node bin/eqw-install --force`
Expected: Shows "FORCE mode" banner, overwrites all without prompts

**Step 3: Test interactive mode**

Run: `node bin/eqw-install`
Expected: Prompts for any files that differ between source and ~/.qwen/

**Step 4: Test non-interactive mode**

Run: `echo "" | node bin/eqw-install`
Expected: Skips changed files with warnings, no prompts

**Step 5: Commit any test artifacts if needed**

```bash
git status
# If no changes needed, skip commit
```
