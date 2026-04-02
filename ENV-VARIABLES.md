# Variables de Entorno de Everything Qwen Code (EQW)

Este documento lista todas las variables de entorno disponibles para configurar el comportamiento de EQW.

## Variables Principales

### `EQW_HOOK_PROFILE`

Controla el perfil de activación de hooks.

- **Valores:** `minimal` | `standard` | `strict`
- **Default:** `standard`
- **Descripción:**
  - `minimal` - Solo hooks esenciales de seguridad y lifecycle
  - `standard` - Balanceado (default)
  - `strict` - Máxima vigilancia con reminders adicionales

**Ejemplo:**
```bash
export EQW_HOOK_PROFILE=strict
```

---

### `EQW_DISABLED_HOOKS`

Desactiva hooks específicos por ID.

- **Valores:** Lista separada por comas de IDs de hooks
- **Default:** (ninguno - todos activados)
- **Descripción:** Permite desactivar hooks individuales sin editar `hooks.json`

**Ejemplo:**
```bash
export EQW_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"
```

---

## Variables Opt-In (Features Opcionales)

### `EQW_ENABLE_INSAITS`

Activa el monitor de seguridad InsAIts AI.

- **Valores:** `1` (activado) | `0` o no definido (desactivado)
- **Default:** Desactivado
- **Requisito:** `pip install insa-its`
- **Descripción:** Escaneo de seguridad para inputs de herramientas de alta señal. Bloquea hallazgos críticos, advierte en no-críticos, y escribe logs de auditoría.

**Ejemplo:**
```bash
export EQW_ENABLE_INSAITS=1
```

---

### `EQW_GOVERNANCE_CAPTURE`

Activa la captura de eventos de gobernanza.

- **Valores:** `1` (activado) | `0` o no definido (desactivado)
- **Default:** Desactivado
- **Descripción:** Captura eventos como secretos, violaciones de políticas, y solicitudes de aprobación en la base de datos de estado.

**Ejemplo:**
```bash
export EQW_GOVERNANCE_CAPTURE=1
```

---

### `EQW_SESSION_ID`

ID de sesión para correlación de eventos de gobernanza.

- **Valores:** String arbitrario
- **Default:** Auto-generado
- **Descripción:** Permite correlacionar eventos de gobernanza con una sesión específica.

**Ejemplo:**
```bash
export EQW_SESSION_ID="mi-sesion-2024-04-02"
```

---

## Variables de Configuración de Hooks

### `EQW_QUALITY_GATE_FIX`

Activa el modo de reparación automática en el quality gate.

- **Valores:** `true` | `false`
- **Default:** `false`
- **Descripción:** Cuando está activado, intenta reparar automáticamente problemas de calidad detectados.

**Ejemplo:**
```bash
export EQW_QUALITY_GATE_FIX=true
```

---

### `EQW_QUALITY_GATE_STRICT`

Activa el modo estricto del quality gate.

- **Valores:** `true` | `false`
- **Default:** `false`
- **Descripción:** En modo estricto, el quality gate falla por problemas menores que de otro modo solo generarían advertencias.

**Ejemplo:**
```bash
export EQW_QUALITY_GATE_STRICT=true
```

---

## Variables de Configuración de MCP Health Check

### `EQW_MCP_CONFIG_PATH`

Ruta personalizada al archivo de configuración de MCP.

- **Valores:** Ruta absoluta al archivo JSON
- **Default:** `~/.claude/settings.json` o `~/.claude.json`
- **Descripción:** Permite especificar una ubicación personalizada para la configuración de MCP servers.

**Ejemplo:**
```bash
export EQW_MCP_CONFIG_PATH="/path/to/mcp-config.json"
```

---

### `EQW_MCP_HEALTH_STATE_PATH`

Ruta personalizada al archivo de estado de health check.

- **Valores:** Ruta absoluta al archivo JSON
- **Default:** `~/.claude/mcp-health-cache.json`
- **Descripción:** Almacena el estado de salud de los MCP servers (healthy/unhealthy, backoff, etc.).

**Ejemplo:**
```bash
export EQW_MCP_HEALTH_STATE_PATH="/path/to/health-state.json"
```

---

### `EQW_MCP_HEALTH_TIMEOUT_MS`

Timeout para health checks de MCP servers.

- **Valores:** Número en milisegundos
- **Default:** `5000` (5 segundos)
- **Descripción:** Tiempo máximo de espera para respuestas de health check.

**Ejemplo:**
```bash
export EQW_MCP_HEALTH_TIMEOUT_MS=10000
```

---

### `EQW_MCP_HEALTH_TTL_MS`

TTL (Time To Live) para entradas de estado de salud.

- **Valores:** Número en milisegundos
- **Default:** `300000` (5 minutos)
- **Descripción:** Cuánto tiempo se considera válido un estado de salud antes de requerir refresh.

**Ejemplo:**
```bash
export EQW_MCP_HEALTH_TTL_MS=600000
```

---

### `EQW_MCP_HEALTH_BACKOFF_MS`

Base de backoff para reintentos de health check.

- **Valores:** Número en milisegundos
- **Default:** `30000` (30 segundos)
- **Descripción:** Tiempo base de espera entre reintentos de health check para servers unhealthy.

**Ejemplo:**
```bash
export EQW_MCP_HEALTH_BACKOFF_MS=60000
```

---

### `EQW_MCP_HEALTH_FAIL_OPEN`

Permite continuar si el health check falla.

- **Valores:** `1` (permitir) | `0` (bloquear)
- **Default:** `0` (bloquear)
- **Descripción:** Cuando está activado, permite llamadas a MCP incluso si el health check no responde.

**Ejemplo:**
```bash
export EQW_MCP_HEALTH_FAIL_OPEN=1
```

---

### `EQW_MCP_RECONNECT_COMMAND`

Comando personalizado para reconexión de MCP.

- **Valores:** Comando shell
- **Default:** (ninguno)
- **Descripción:** Comando a ejecutar para intentar reconectar un MCP server unhealthy.

**Ejemplo:**
```bash
export EQW_MCP_RECONNECT_COMMAND="node /path/to/reconnect.js"
```

---

### `EQW_MCP_RECONNECT_TIMEOUT_MS`

Timeout para comandos de reconexión de MCP.

- **Valores:** Número en milisegundos
- **Default:** `30000` (30 segundos)
- **Descripción:** Tiempo máximo de espera para comandos de reconexión.

**Ejemplo:**
```bash
export EQW_MCP_RECONNECT_TIMEOUT_MS=60000
```

---

## Variables de Continuous Learning

### `EQW_OBSERVER_MAX_TURNS`

Número máximo de turnos de observación.

- **Valores:** Número entero
- **Default:** `10`
- **Descripción:** Límite de turnos antes de forzar análisis en el observer loop.

**Ejemplo:**
```bash
export EQW_OBSERVER_MAX_TURNS=20
```

---

### `EQW_OBSERVER_SIGNAL_EVERY_N`

Frecuencia de señales de análisis.

- **Valores:** Número entero
- **Default:** `20`
- **Descripción:** Generar señal de análisis cada N observaciones.

**Ejemplo:**
```bash
export EQW_OBSERVER_SIGNAL_EVERY_N=30
```

---

### `EQW_OBSERVER_ANALYSIS_COOLDOWN`

Cooldown entre análisis consecutivos.

- **Valores:** Número en segundos
- **Default:** `60`
- **Descripción:** Tiempo de espera mínimo entre análisis de observaciones.

**Ejemplo:**
```bash
export EQW_OBSERVER_ANALYSIS_COOLDOWN=120
```

---

### `EQW_OBSERVER_MAX_ANALYSIS_LINES`

Límite de líneas a muestrear para análisis.

- **Valores:** Número entero
- **Default:** `500`
- **Descripción:** Máximo de líneas del final del output para analizar.

**Ejemplo:**
```bash
export EQW_OBSERVER_MAX_ANALYSIS_LINES=1000
```

---

### `EQW_OBSERVE_SKIP_PATHS`

Paths a omitir en observación.

- **Valores:** Lista separada por comas de paths/patrones
- **Default:** (ninguno)
- **Descripción:** Directorios o archivos a excluir del observer.

**Ejemplo:**
```bash
export EQW_OBSERVE_SKIP_PATHS="node_modules,.git,dist"
```

---

### `EQW_SKIP_OBSERVE`

Omite completamente el observer loop.

- **Valores:** `1` (omitir) | `0` (ejecutar)
- **Default:** `0`
- **Descripción:** Desactiva el observer loop para sesiones automatizadas.

**Ejemplo:**
```bash
export EQW_SKIP_OBSERVE=1
```

---

## Variables de Git Hooks

### `EQW_SKIP_GIT_HOOKS`

Omite todos los git hooks de EQW.

- **Valores:** `1` (omitir) | `0` (ejecutar)
- **Default:** `0`
- **Descripción:** Bypass global para todos los git hooks.

**Ejemplo:**
```bash
export EQW_SKIP_GIT_HOOKS=1
```

---

### `EQW_SKIP_PRECOMMIT`

Omite solo el pre-commit hook.

- **Valores:** `1` (omitir) | `0` (ejecutar)
- **Default:** `0`
- **Descripción:** Bypass para el hook pre-commit.

**Ejemplo:**
```bash
export EQW_SKIP_PRECOMMIT=1
```

---

### `EQW_SKIP_PREPUSH`

Omite solo el pre-push hook.

- **Valores:** `1` (omitir) | `0` (ejecutar)
- **Default:** `0`
- **Descripción:** Bypass para el hook pre-push.

**Ejemplo:**
```bash
export EQW_SKIP_PREPUSH=1
```

---

### `EQW_PREPUSH_AUDIT`

Activa auditoría de dependencias en pre-push.

- **Valores:** `1` (activar) | `0` (desactivar)
- **Default:** `0`
- **Descripción:** Ejecuta auditoría de dependencias antes del push.

**Ejemplo:**
```bash
export EQW_PREPUSH_AUDIT=1
```

---

## Variables de Sesión y Recording

### `EQW_SESSION_RECORDING_DIR`

Directorio para grabación de sesiones.

- **Valores:** Ruta absoluta al directorio
- **Default:** (ninguno - desactivado)
- **Descripción:** Directorio donde se guardan las grabaciones de sesiones.

**Ejemplo:**
```bash
export EQW_SESSION_RECORDING_DIR="/path/to/recordings"
```

---

## Variables de Input de Hooks

### `EQW_HOOK_INPUT_TRUNCATED`

Indica si el input del hook fue truncado.

- **Valores:** `1` | `true` | `yes` (truncado) | otros (no truncado)
- **Default:** (auto-detectado)
- **Descripción:** Usado internamente para indicar truncamiento de stdin.

---

### `EQW_HOOK_INPUT_MAX_BYTES`

Límite máximo de bytes para stdin de hooks.

- **Valores:** Número en bytes
- **Default:** `1048576` (1MB)
- **Descripción:** Tamaño máximo de input antes de truncar.

**Ejemplo:**
```bash
export EQW_HOOK_INPUT_MAX_BYTES=524288
```

---

## Variables de Sistema

### `CLAUDE_PLUGIN_ROOT`

Ruta raíz del plugin de EQW.

- **Valores:** Ruta absoluta
- **Default:** Auto-detectado
- **Descripción:** Usado internamente para resolver paths de scripts.

---

### `EQW_UNICODE_SCAN_ROOT`

Ruta para escaneo de seguridad Unicode.

- **Valores:** Ruta absoluta
- **Default:** Directorio de trabajo actual
- **Descripción:** Directorio raíz para escaneo de caracteres Unicode problemáticos.

**Ejemplo:**
```bash
export EQW_UNICODE_SCAN_ROOT="/path/to/scan"
```

---

## Resumen Rápido

### Configuración Recomendada para Desarrollo

```bash
# Perfil balanceado
export EQW_HOOK_PROFILE=standard

# Desactivar reminders molestos
export EQW_DISABLED_HOOKS="pre:bash:tmux-reminder"

# Activar seguridad (opcional)
# export EQW_ENABLE_INSAITS=1

# Activar governance (opcional)
# export EQW_GOVERNANCE_CAPTURE=1
```

### Configuración para CI/CD

```bash
# Perfil minimal para velocidad
export EQW_HOOK_PROFILE=minimal

# Omitir observer para sesiones automatizadas
export EQW_SKIP_OBSERVE=1

# Omitir git hooks si se manejan externamente
export EQW_SKIP_GIT_HOOKS=1
```

### Configuración para Producción

```bash
# Perfil estricto para máxima seguridad
export EQW_HOOK_PROFILE=strict

# Activar todas las características de seguridad
export EQW_ENABLE_INSAITS=1
export EQW_GOVERNANCE_CAPTURE=1
export EQW_QUALITY_GATE_STRICT=true
```

---

## Notas de Migración (ECC → EQW)

**Importante:** Todas las variables que anteriormente usaban el prefijo `ECC_` ahora usan `EQW_`.

**Ejemplos de migración:**

| Antiguo (ECC) | Nuevo (EQW) |
|---------------|-------------|
| `ECC_HOOK_PROFILE` | `EQW_HOOK_PROFILE` |
| `ECC_DISABLED_HOOKS` | `EQW_DISABLED_HOOKS` |
| `ECC_ENABLE_INSAITS` | `EQW_ENABLE_INSAITS` |
| `ECC_GOVERNANCE_CAPTURE` | `EQW_GOVERNANCE_CAPTURE` |
| `ECC_MCP_*` | `EQW_MCP_*` |
| `ECC_OBSERVER_*` | `EQW_OBSERVER_*` |
| `ECC_SKIP_*` | `EQW_SKIP_*` |
| `ECC_QUALITY_GATE_*` | `EQW_QUALITY_GATE_*` |

**Acción requerida:** Actualiza tus archivos `.bashrc`, `.zshrc`, `.env`, o scripts de CI/CD para usar el nuevo prefijo `EQW_`.
