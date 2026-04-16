# Kilo Code CLI Configuration

Esta carpeta contiene la configuración específica para Kilo Code CLI.

## Estructura

```
kilo/
├── mcp-configs/     # Configuraciones de servidores MCP
└── README.md        # Este archivo
```

## Installation

Ejecuta el instalador desde la raíz del proyecto:

```bash
./scripts/install.sh
```

Selecciona la opción [5] para instalar Kilo Code.

## Configuración

Kilo Code busca sus skills, agentes, commands, hooks, y rules en:

- Global: `~/.kilo/`
- Project: `./.kilo/` (opcional)

El instalador crea symlinks a esta configuración en `~/.kilo/`.