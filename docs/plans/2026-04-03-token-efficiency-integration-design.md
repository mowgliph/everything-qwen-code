# Design: Token Efficiency Integration for Qwen Code

**Date:** 2026-04-03  
**Author:** Jelvys Triana (mowgliph)  
**Status:** Approved  

---

## Problem

Qwen Code, like Claude Code, produces verbose output by default:
- Sycophantic openers ("Sure!", "Great question!")
- Closing fluff ("I hope this helps!")
- Em dashes, smart quotes, decorative Unicode that break parsers
- Restating questions before answering
- Unsolicited suggestions beyond scope
- Agreeing with incorrect statements

All of this wastes tokens and adds zero value. The `claude-token-efficient` repo proves ~63% output token reduction is achievable with behavior rules.

## Key Finding: `~/.qwen/rules/` is Dead Weight

Investigation confirmed: **Qwen Code does NOT load `~/.qwen/rules/`**. The directory exists as a carryover from the Everything Claude Code fork but has no loading mechanism:
- `~/.qwen/settings.json` — no `rules` key
- `~/.qwen/QWEN.md` — no reference to `rules/`
- No hook or config references it

The only globally-loaded surfaces are:
- `~/.qwen/QWEN.md` ✅ (context file, loaded every session)
- `~/.qwen/agents/*.md` ✅ (agent definitions)
- `~/.qwen/skills/*/SKILL.md` ✅ (skill definitions)
- `~/.qwen/hooks/hooks.json` ✅ (hook configuration)

**Conclusion:** Token efficiency rules MUST live in `QWEN.md` to be effective.

---

## Architecture

### Three Surfaces

```
┌─────────────────────────────────────────────────────────┐
│ 1. ~/.qwen/QWEN.md (global behavior)                    │
│    - "Token Efficiency" section appended to existing    │
│    - 8 core rules adapted from claude-token-efficient   │
│    - Loaded every session automatically                 │
├─────────────────────────────────────────────────────────┤
│ 2. everything-qwen-code/ (distribution repo)            │
│    - docs/token-efficiency.md (full reference + profiles)│
│    - scripts/merge-token-rules.js (installer utility)   │
├─────────────────────────────────────────────────────────┤
│ 3. bin/eqw-install (installer)                          │
│    - Appends token rules to target QWEN.md if missing   │
│    - Idempotent: skips if section already exists        │
└─────────────────────────────────────────────────────────┘
```

### Surface 1: `~/.qwen/QWEN.md` — Token Efficiency Section

Appended after the existing "Mandatory Workflow" and "Anti-Pattern" sections:

```markdown
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
```

### Surface 2: `everything-qwen-code/` — Distribution Assets

**New files:**

| File | Purpose |
|------|---------|
| `docs/token-efficiency.md` | Full reference with profiles, benchmarks, use cases |
| `scripts/merge-token-rules.js` | Idempotent merge utility for installer |

**`docs/token-efficiency.md`** contains:
- Full rule set (same as above)
- Profile variants (coding, agents, analysis) as optional sections
- Benchmark data from claude-token-efficient
- When it helps vs when it doesn't
- Override rule explanation

**`scripts/merge-token-rules.js`**:
```javascript
// Reads target QWEN.md, checks for "## Token Efficiency" section
// If missing: appends the section
// If present: skips (idempotent)
// Returns: { action: 'appended' | 'skipped', path: '...' }
```

### Surface 3: `bin/eqw-install` — Integration

Modified installer adds a step after config file installation:

```
📝 Installing token efficiency rules...
  ✓ Appended to ~/.qwen/QWEN.md
```

Logic:
1. Read target `~/.qwen/QWEN.md`
2. Check if `## Token Efficiency` section exists (case-insensitive grep)
3. If not: append the section from `docs/token-efficiency.md`
4. If yes: log "Token efficiency rules already present (skipping)"

---

## Profiles (Optional, Future)

The `claude-token-efficient` repo has profile variants. For Qwen Code, these can be implemented as optional sections users can enable:

| Profile | Trigger | Use Case |
|---------|---------|----------|
| **Coding** | Default | Dev projects, code review, debugging |
| **Agents** | `EQW_TOKEN_MODE=agents` | Automation pipelines, multi-agent systems |
| **Analysis** | `EQW_TOKEN_MODE=analysis` | Data analysis, research, reporting |

Profiles are NOT implemented in v1. They are a future enhancement if users request them.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| `~/.qwen/QWEN.md` doesn't exist | Create it with token efficiency section + minimal header |
| `~/.qwen/QWEN.md` not writable | Log error, continue installation (non-fatal) |
| Section already exists | Skip, log "already present" |
| Merge corrupts file | No atomic write — future improvement: write to temp, then rename |

---

## Testing

1. **Unit test:** `scripts/merge-token-rules.js` — test append, skip, missing file scenarios
2. **Integration test:** Run `eqw-install` on clean `~/.qwen/`, verify section present
3. **Idempotency test:** Run `eqw-install` twice, verify no duplicate sections

---

## Trade-offs

| Decision | Rationale |
|----------|-----------|
| QWEN.md over rules/ | rules/ is not loaded by Qwen Code — confirmed dead |
| Single section, no profiles | Keep v1 minimal; profiles add complexity without proven demand |
| Idempotent append | Safe for re-runs; no data loss on existing configs |
| No automatic benchmark | Benchmarks are directional; users can measure their own savings |

---

## Input Token Cost

The token efficiency section adds ~150 words (~200 tokens) to every session's input context. Per `claude-token-efficient` benchmarks, this is offset after ~2-3 output-heavy interactions. For casual single-query sessions, it's a net increase — but for the target audience (developers using Qwen Code daily), the net is strongly positive.

---

## References

- [claude-token-efficient](https://github.com/drona23/claude-token-efficient) — source of behavior rules
- [GitHub #3382 - Sycophancy bug](https://github.com/anthropics/claude-code/issues/3382) — 350+ upvotes
- [GitHub #20542 - Verbose output wastes tokens](https://github.com/anthropics/claude-code/issues/20542)
