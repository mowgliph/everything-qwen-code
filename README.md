# Everything Agents Skills

[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)](https://github.com/mowgliph/everything-agents-skills/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mowgliph/everything-agents-skills?style=flat)](https://github.com/mowgliph/everything-agents-skills/stargazers)

**Sistema universal de skills, agentes, comandos, hooks y rules para múltiples AI Coding CLIs.**

Compatible con: **Qwen Code**, **OpenCode**, **Gemini CLI**, **GitHub Copilot**, **Kilo Code**

---

## Quick Start

```bash
git clone https://github.com/mowgliph/everything-agents-skills.git
cd everything-agents-skills
./scripts/install.sh
```

---

## CLI Soportados

| CLI | Skills | Agentes | Commands | Hooks | Rules |
|-----|--------|---------|----------|-------|-------|
| Qwen Code | ✓ | ✓ | ✓ | ✓ | ✓ |
| OpenCode | ✓ | ✓ | - | - | ✓ |
| Gemini CLI | ✓ | - | - | - | - |
| Copilot | - | - | - | - | ✓ |
| Kilo Code | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Qué Incluye

- **393 Skills** - workflows para cada tipo de desarrollo
- **37 Agentes** - especializados por tarea
- **67 Commands** - slash commands
- **14 Rules** - estándares de código

---

## Estructura

```
everything-agents-skills/
├── skills/           # Skills universales (393)
├── agents/           # Agentes universales (37)
├── commands/         # Comandos universales (67)
├── hooks/            # Hooks universales (2)
├── rules/            # Reglas de código (14)
├── cli-configs/      # Configs por CLI
│   ├── qwen/
│   ├── opencode/
│   ├── gemini/
│   └── copilot/
├── scripts/
│   ├── install.sh     # Instalador interactivo
│   ├── detect-cli.sh # Detecta CLIs
│   └── uninstall.sh  # Desinstalador
└── SKILLS.md
```

---

## Instalación

```bash
./scripts/install.sh
```

Seleccionar el CLI a instalar:
- [1] Qwen Code
- [2] OpenCode
- [3] Gemini CLI
- [4] Copilot
- [5] Instalar todos

## Desinstalación

```bash
./scripts/uninstall.sh
# o
./scripts/uninstall.sh --all
```

---

## Licencia

MIT License - ver [LICENSE](LICENSE)
