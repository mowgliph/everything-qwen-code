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
