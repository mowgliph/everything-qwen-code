# Self-Improvement Loop

This rule implements a feedback loop to continuously reduce errors and improve task execution quality.

## Workflow

After ANY correction or error from the user, follow this workflow:

1. **Register**: Document the error in the project's `docs/LESSONS.md` following the established format
2. **Rule**: Write a concrete rule that prevents the same error
3. **Iterate**: Refine the rules until the mistake rate drops
4. **Review**: At session start, check `docs/LESSONS.md` for relevant errors to the current work

## LESSONS.md Format

Each lesson entry must include:

```markdown
## [NNN] Descriptive Error Title

**Date**: YYYY-MM-DD
**Tags**: category, error-type, affected-component
**Severity**: critical | high | medium | low

### Context
Brief description of the scenario where the error occurred.

### Symptoms
- Observed behavior
- Relevant error messages
- Important logs or traces

### Root Cause
Explanation of what caused the error.

### Solution
Description of how it was resolved.

### Prevention Rule
Concrete rule to prevent this error in the future.

### References
- Related files
- Relevant commits or PRs
- External documentation
```

## Tag Categories

| Category | Description |
|----------|------------|
| `build` | Build or compilation errors |
| `runtime` | Runtime errors |
| `database` | Database or migration issues |
| `frontend` | React/TypeScript errors |
| `backend` | Backend (Go, Python, etc.) errors |
| `auth` | Authentication issues |
| `security` | Security vulnerabilities |
| `config` | Configuration errors |
| `ci-cd` | GitHub Actions pipeline issues |
| `performance` | Performance problems |

## Prevention Rules

- **Never repeat solutions**: If an error was already documented, apply the existing rule
- **Root cause before action**: Only document after investigating the real cause
- **Actionable rules**: Each lesson must have a verifiable, specific rule
- **Immediate update**: Log errors immediately, not "later"
- **Proactive review**: At session start, review relevant lessons for the current work

## Integration with Project Workflow

When working on a project:

1. Check `docs/LESSONS.md` at session start for relevant errors
2. Before implementing complex features, search for related past errors
3. When debugging, consult the lessons document first
4. After fixing any issue, add a new lesson entry

## Cross-Project Learning

Lessons should be transferable:
- Document patterns that apply to multiple projects
- Include general principles vs project-specific details
- Reference language-agnostic best practices