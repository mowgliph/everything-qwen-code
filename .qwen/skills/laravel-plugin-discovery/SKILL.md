---
name: laravel-plugin-discovery
description: "Skill for laravel-plugin-discovery"
version: 1.0.0
---


## How It Works

### Finding Packages

When the user wants to discover packages for a feature:

1. Use `SearchPluginTool` with relevant keywords
2. Apply filters for health score, Laravel version, or PHP version
3. Review the results with package names, descriptions, and health indicators

### Evaluating Packages

When the user wants to assess a specific package:

1. Use `GetPluginDetailsTool` with the package name
2. Review health score, last updated date, Laravel version support
3. Check vendor reputation and risk indicators

### Checking Compatibility

When the user needs Laravel or PHP version compatibility:

1. Search with `laravel_compatibility` filter set to their version
2. Or get details on a specific package to see its supported versions

---

## Examples

### Example: Find Authentication Packages

```
SearchPluginTool({
  text_search: "authentication",
  health_score: "Healthy"
})
```

Returns packages matching "authentication" with healthy status:
- spatie/laravel-permission
- laravel/breeze
- laravel/passport
- etc.

### Example: Find Laravel 12 Compatible Packages

```
SearchPluginTool({
  text_search: "admin panel",
  laravel_compatibility: "12"
})
```

Returns packages compatible with Laravel 12.

### Example: Get Package Details

```
GetPluginDetailsTool({
  package: "spatie/laravel-permission",
  include_versions: true
})
```

Returns:
- Health score and last activity
- Laravel/PHP version support
- Vendor reputation (risk score)
- Version history
- Brief description

### Example: Find Packages by Vendor

```
SearchPluginTool({
  vendor_filter: "spatie",
  health_score: "Healthy"
})
```

Returns all healthy packages from vendor "spatie".

---

## Filtering Best Practices

### By Health Score

| Health Band | Meaning |
|-------------|---------|
| `Healthy` | Active maintenance, recent updates |
| `Medium` | Occasional updates, may need attention |
| `Unhealthy` | Abandoned or infrequently maintained |
| `Unrated` | Not yet assessed |

**Recommendation**: Prefer `Healthy` packages for production applications.

### By Laravel Version

| Version | Notes |
|---------|-------|
| `13` | Latest Laravel |
| `12` | Current stable |
| `11` | Still widely used |
| `10` | Legacy but common |
| `5`-`9` | Deprecated |

**Recommendation**: Match the target project's Laravel version.

### Combining Filters

```typescript
// Find healthy, Laravel 12 compatible packages for permissions
SearchPluginTool({
  text_search: "permission",
  health_score: "Healthy",
  laravel_compatibility: "12"
})
```

---

## Response Interpretation

### Search Results

Each result includes:
- Package name (e.g. `spatie/laravel-permission`)
- Brief description
- Health status indicator
- Laravel version support badges

### Package Details

The detailed response includes:
- **Health Score**: Numeric or band indicator
- **Last Activity**: When the package was last updated
- **Laravel Support**: Version compatibility matrix
- **PHP Support**: PHP version compatibility
- **Risk Score**: Vendor trust indicators
- **Version History**: Recent release timeline

---

## Common Use Cases

| Scenario | Recommended Approach |
|----------|---------------------|
| "What package for auth?" | Search "auth" with healthy filter |
| "Is spatie/package still maintained?" | Get details, check health score |
| "Need Laravel 12 packages" | Search with laravel_compatibility: "12" |
| "Find admin panel packages" | Search "admin panel", review results |
| "Check vendor reputation" | Search by vendor, check details |

---

## Best Practices

1. **Always filter by health** â€” Use `health_score: "Healthy"` for production projects
2. **Match Laravel version** â€” Always check `laravel_compatibility` matches the target project
3. **Check vendor reputation** â€” Prefer packages from known vendors (spatie, laravel, etc.)
4. **Review before recommending** â€” Use GetPluginDetailsTool for a comprehensive assessment
5. **No API key needed** â€” The MCP is free, no authentication required

---

## Related Skills

- `laravel-patterns` â€” Laravel architecture and patterns
- `laravel-tdd` â€” Test-driven development for Laravel
- `laravel-security` â€” Laravel security best practices
- `documentation-lookup` â€” General library documentation lookup (Context7)

