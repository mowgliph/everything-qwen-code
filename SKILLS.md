# SKILLS.md — Everything Agents Skills

## Project Overview

**Everything Agents Skills (EAS)** es un sistema universal de skills, agentes, comandos, hooks y rules para múltiples AI Coding CLIs.

Compatible con: **Qwen Code**, **OpenCode**, **Gemini CLI**, **GitHub Copilot**

**Version:** 0.3.0 | **License:** MIT | **Author:** [mowgliph](https://github.com/mowgliph)

---

## CLI Soportados

| CLI | Skills | Agentes | Commands | Hooks | Rules |
|-----|--------|---------|----------|-------|-------|
| Qwen Code | ✓ | ✓ | ✓ | ✓ | ✓ |
| OpenCode | ✓ | ✓ | - | - | ✓ |
| Gemini CLI | ✓ | - | - | - | - |
| Copilot | - | - | - | - | ✓ |

---

## Estructura

```
everything-agents-skills/
├── skills/                    # Skills universales (393)
├── agents/                   # Agentes universales (37)
├── commands/                 # Comandos universales (67)
├── hooks/                    # Hooks universales (2)
├── rules/                    # Reglas de código (14)
├── contexts/                 # Contextos
├── cli-configs/             # Configs específicas por CLI
│   ├── qwen/                # Configs Qwen
│   ├── opencode/            # Configs OpenCode
│   ├── gemini/              # Configs Gemini
│   └── copilot/             # Configs Copilot
├── docs/                     # Documentación
├── scripts/                  # Scripts de instalación
│   ├── install.sh           # Instalador interactivo
│   ├── detect-cli.sh        # Detecta CLIs instalados
│   └── uninstall.sh         # Desinstalador
└── SKILLS.md               # Este archivo
```

---

## Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/mowgliph/everything-agents-skills.git
cd everything-agents-skills

# Ejecutar instalador interactivo
./scripts/install.sh

# O detectar CLIs instalados
./scripts/detect-cli.sh
```

---

## Skills Disponibles (393)

### Core Engineering
`brainstorming`, `writing-plans`, `tdd-workflow`, `code-review-excellence`, `security-review`, `debugging-strategies`

### Language-Specific
`python-patterns`, `python-testing`, `golang-patterns`, `golang-testing`, `rust-patterns`, `rust-async-patterns`, `typescript-advanced-types`, `kotlin-patterns`, `kotlin-testing`, `java-patterns`, `java-testing`, `cpp-coding-standards`, `swiftui-patterns`

### Frontend
`frontend-design`, `frontend-patterns`, `react-modernization`, `react-state-management`, `responsive-design`, `design-system-patterns`, `nextjs-app-router-patterns`, `tailwind-design-system`

### Backend
`backend-patterns`, `postgres-patterns`, `auth-implementation-patterns`, `microservices-patterns`, `async-python-patterns`, `fastapi-templates`

### DevOps & Infra
`docker-patterns`, `github-actions-templates`, `terraform-module-library`, `k8s-manifest-generator`, `helm-chart-scaffolding`, `gitops-workflow`, `prometheus-configuration`

### Security
`security-review`, `sast-configuration`, `secrets-management`, `auth-implementation-patterns`, `owasp-top-10`

Ver `skills/` para lista completa.

---

## Agentes (37)

### Planning & Architecture
`planner`, `architect`, `chief-of-staff`, `feature-analyst`

### Code Review
`code-reviewer`, `security-reviewer`, `typescript-reviewer`, `python-reviewer`, `go-reviewer`, `java-reviewer`, `kotlin-reviewer`, `rust-reviewer`, `cpp-reviewer`, `database-reviewer`, `flutter-reviewer`

### Build & Debug
`build-error-resolver`, `tdd-guide`, `go-build-resolver`, `java-build-resolver`, `kotlin-build-resolver`, `rust-build-resolver`, `cpp-build-resolver`, `pytorch-build-resolver`

### Specialized
`e2e-runner`, `refactor-cleaner`, `loop-operator`, `harness-optimizer`, `performance-optimizer`, `healthcare-reviewer`, `opensource-forker`, `opensource-packager`, `opensource-sanitizer`

Ver `agents/` para definiciones completas.

---

## Comandos (67)

Slash commands disponibles. Ver `commands/` para lista completa.

---

## Hooks (2)

| Hook | Evento | Propósito |
|------|--------|-----------|
| Config Protection | PreToolUse | Protege configs de modificación accidental |
| Quality Gate | PostToolUse | Verifica calidad de código |

---

## Rules (14)

Estándares de código para múltiples lenguajes:
- Common (universal)
- TypeScript, Python, Go, Rust, Java, Kotlin, C++, Swift, PHP, Ruby, Perl

---

## Instalación por CLI

### Qwen Code
```bash
./scripts/install.sh
# Seleccionar opción 1
```

### OpenCode
```bash
./scripts/install.sh
# Seleccionar opción 2
```

### Gemini CLI
```bash
./scripts/install.sh
# Seleccionar opción 3
```

### Copilot
```bash
./scripts/install.sh
# Seleccionar opción 4
```

---

## Desinstalación

```bash
# Desinstalador interactivo
./scripts/uninstall.sh

# Desinstalar todo
./scripts/uninstall.sh --all
```

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `install.sh` | Instalador interactivo multi-CLI |
| `detect-cli.sh` | Detecta CLIs instalados |
| `uninstall.sh` | Desinstalador |

---

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines.
