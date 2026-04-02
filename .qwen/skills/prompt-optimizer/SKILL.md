---
name: prompt-optimizer
description: "Skill for prompt-optimizer"
version: 1.0.0
---


## Output Format

Present your analysis in this exact structure. Respond in the same language
as the user's input.

### Section 1: Prompt Diagnosis

**Strengths:** List what the original prompt does well.

**Issues:**

| Issue | Impact | Suggested Fix |
|-------|--------|---------------|
| (problem) | (consequence) | (how to fix) |

**Needs Clarification:** Numbered list of questions the user should answer.
If Phase 0 auto-detected the answer, state it instead of asking.

### Section 2: Recommended ECC Components

| Type | Component | Purpose |
|------|-----------|---------|
| Command | /plan | Plan architecture before coding |
| Skill | tdd-workflow | TDD methodology guidance |
| Agent | code-reviewer | Post-implementation review |
| Model | Sonnet 4.6 | Recommended for this scope |

### Section 3: Optimized Prompt â€” Full Version

Present the complete optimized prompt inside a single fenced code block.
The prompt must be self-contained and ready to copy-paste. Include:
- Clear task description with context
- Tech stack (detected or specified)
- /command invocations at the right workflow stages
- Acceptance criteria
- Verification steps
- Scope boundaries (what NOT to do)

For items that reference blueprint, write: "Use the blueprint skill to..."
(not `/blueprint`, since blueprint is a skill, not a command).

### Section 4: Optimized Prompt â€” Quick Version

A compact version for experienced ECC users. Vary by intent type:

| Intent | Quick Pattern |
|--------|--------------|
| New Feature | `/plan [feature]. /tdd to implement. /code-review. /verify.` |
| Bug Fix | `/tdd â€” write failing test for [bug]. Fix to green. /verify.` |
| Refactor | `/refactor-clean [scope]. /code-review. /verify.` |
| Research | `Use search-first skill for [topic]. /plan based on findings.` |
| Testing | `/tdd [module]. /e2e for critical flows. /test-coverage.` |
| Review | `/code-review. Then use security-reviewer agent.` |
| Docs | `/update-docs. /update-codemaps.` |
| EPIC | `Use blueprint skill for "[objective]". Execute phases with /verify gates.` |

### Section 5: Enhancement Rationale

| Enhancement | Reason |
|-------------|--------|
| (what was added) | (why it matters) |

### Footer

> Not what you need? Tell me what to adjust, or make a normal task request
> if you want execution instead of prompt optimization.

---

## Examples

### Trigger Examples

- "Optimize this prompt for ECC"
- "Rewrite this prompt so Claude Code uses the right commands"
- "å¸®æˆ‘ä¼˜åŒ–è¿™ä¸ªæŒ‡ä»¤"
- "How should I prompt ECC for this task?"

### Example 1: Vague Chinese Prompt (Project Detected)

**User input:**
```
å¸®æˆ‘å†™ä¸€ä¸ªç”¨æˆ·ç™»å½•é¡µé¢
```

**Phase 0 detects:** `package.json` with Next.js 15, TypeScript, Tailwind CSS

**Optimized Prompt (Full):**
```
ä½¿ç”¨é¡¹ç›®çŽ°æœ‰æŠ€æœ¯æ ˆï¼ˆNext.js 15 + TypeScript + Tailwind CSSï¼‰å®žçŽ°ç”¨æˆ·ç™»å½•é¡µé¢ã€‚

æŠ€æœ¯è¦æ±‚ï¼š
- æ²¿ç”¨é¡¹ç›®çŽ°æœ‰çš„ç»„ä»¶ç»“æž„å’Œè·¯ç”±çº¦å®š
- è¡¨å•éªŒè¯ä½¿ç”¨é¡¹ç›®ä¸­å·²æœ‰çš„éªŒè¯æ–¹æ¡ˆï¼ˆæ£€æŸ¥æ˜¯å¦å·²ç”¨ Zod/Yup/å…¶ä»–ï¼‰
- è®¤è¯æ–¹å¼ï¼šæ²¿ç”¨é¡¹ç›®çŽ°æœ‰è®¤è¯æ–¹æ¡ˆï¼ˆå¦‚æ— ï¼Œé»˜è®¤ JWTï¼‰
- åŒ…å«ï¼šé‚®ç®±/å¯†ç ç™»å½•è¡¨å•ã€è¡¨å•éªŒè¯ã€é”™è¯¯æç¤ºã€åŠ è½½çŠ¶æ€ã€å“åº”å¼å¸ƒå±€

å·¥ä½œæµï¼š
1. /plan å…ˆè§„åˆ’ç»„ä»¶ç»“æž„å’Œè®¤è¯æµç¨‹ï¼Œå‚è€ƒçŽ°æœ‰é¡µé¢çš„æ¨¡å¼
2. /tdd æµ‹è¯•å…ˆè¡Œï¼šç¼–å†™ç™»å½•è¡¨å•çš„å•å…ƒæµ‹è¯•å’Œè®¤è¯æµç¨‹çš„é›†æˆæµ‹è¯•
3. å®žçŽ°ç™»å½•é¡µé¢å’Œè®¤è¯é€»è¾‘
4. /code-review å®¡æŸ¥å®žçŽ°
5. /verify éªŒè¯æ‰€æœ‰æµ‹è¯•é€šè¿‡ä¸”é¡µé¢æ­£å¸¸æ¸²æŸ“

å®‰å…¨è¦æ±‚ï¼š
- å¯†ç ä¸æ˜Žæ–‡ä¼ è¾“
- é˜²æ­¢æš´åŠ›ç ´è§£ï¼ˆrate limitingï¼‰
- XSS é˜²æŠ¤
- CSRF token

éªŒæ”¶æ ‡å‡†ï¼š
- æ‰€æœ‰æµ‹è¯•é€šè¿‡ï¼Œè¦†ç›–çŽ‡ 80%+
- é¡µé¢åœ¨ç§»åŠ¨ç«¯å’Œæ¡Œé¢ç«¯æ­£å¸¸æ¸²æŸ“
- ç™»å½•æˆåŠŸè·³è½¬åˆ° dashboardï¼Œå¤±è´¥æ˜¾ç¤ºé”™è¯¯ä¿¡æ¯

ä¸è¦åšï¼š
- ä¸è¦å®žçŽ°æ³¨å†Œé¡µé¢
- ä¸è¦å®žçŽ°å¿˜è®°å¯†ç åŠŸèƒ½
- ä¸è¦ä¿®æ”¹çŽ°æœ‰çš„è·¯ç”±ç»“æž„
```

### Example 2: Moderate English Prompt

**User input:**
```
Add a REST API endpoint for user profile updates with validation
```

**Phase 0 detects:** `go.mod` with Go 1.22, Chi router

**Optimized Prompt (Full):**
```
Add a REST API endpoint for user profile updates (PATCH /api/users/:id).

Tech stack: Go 1.22 + Chi router (detected from project)

Requirements:
- PATCH /api/users/:id â€” partial update of user profile
- Input validation for fields: name, email, avatar_url, bio
- Auth: require valid token, users can only update own profile
- Return 200 with updated user on success
- Return 400 with validation errors on invalid input
- Return 401/403 for auth failures
- Follow existing API patterns in the codebase

Workflow:
1. /plan the endpoint structure, middleware chain, and validation logic
2. /tdd â€” write table-driven tests for success, validation failure, auth failure, not-found
3. Implement following existing handler patterns
4. /go-review
5. /verify â€” run full test suite, confirm no regressions

Do not:
- Modify existing endpoints
- Change the database schema (use existing user table)
- Add new dependencies without checking existing ones first (use search-first skill)
```

### Example 3: EPIC Project

**User input:**
```
Migrate our monolith to microservices
```

**Optimized Prompt (Full):**
```
Use the blueprint skill to plan: "Migrate monolith to microservices architecture"

Before executing, answer these questions in the blueprint:
1. Which domain boundaries exist in the current monolith?
2. Which service should be extracted first (lowest coupling)?
3. Communication pattern: REST APIs, gRPC, or event-driven (Kafka/RabbitMQ)?
4. Database strategy: shared DB initially or database-per-service from start?
5. Deployment target: Kubernetes, Docker Compose, or serverless?

The blueprint should produce phases like:
- Phase 1: Identify service boundaries and create domain map
- Phase 2: Set up infrastructure (API gateway, service mesh, CI/CD per service)
- Phase 3: Extract first service (strangler fig pattern)
- Phase 4: Verify with integration tests, then extract next service
- Phase N: Decommission monolith

Each phase = 1 PR, with /verify gates between phases.
Use /save-session between phases. Use /resume-session to continue.
Use git worktrees for parallel service extraction when dependencies allow.

Recommended: Opus 4.6 for blueprint planning, Sonnet 4.6 for phase execution.
```

---

## Related Components

| Component | When to Reference |
|-----------|------------------|
| `configure-ecc` | User hasn't set up ECC yet |
| `skill-stocktake` | Audit which components are installed (use instead of hardcoded catalog) |
| `search-first` | Research phase in optimized prompts |
| `blueprint` | EPIC-scope optimized prompts (invoke as skill, not command) |
| `strategic-compact` | Long session context management |
| `cost-aware-llm-pipeline` | Token optimization recommendations |

