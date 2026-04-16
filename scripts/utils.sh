#!/bin/bash
# Utils para install.sh

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Detectar CLI instalado
detect_qwen() {
    if command -v qwen &> /dev/null; then
        local ver=$(qwen --version 2>/dev/null || echo "desconocida")
        echo "✓ Qwen Code ($ver)"
        return 0
    else
        echo "✗ Qwen Code (no instalado)"
        return 1
    fi
}

detect_opencode() {
    if command -v opencode &> /dev/null; then
        local ver=$(opencode --version 2>/dev/null || echo "desconocida")
        echo "✓ OpenCode ($ver)"
        return 0
    else
        echo "✗ OpenCode (no instalado)"
        return 1
    fi
}

detect_gemini() {
    if command -v gemini &> /dev/null; then
        echo "✓ Gemini CLI"
        return 0
    else
        echo "✗ Gemini CLI (no instalado)"
        return 1
    fi
}

detect_copilot() {
    if command -v copilot &> /dev/null || [ -d "$HOME/.copilot" ]; then
        echo "✓ Copilot CLI"
        return 0
    else
        echo "✗ Copilot CLI (no instalado)"
        return 1
    fi
}

detect_kilo() {
    if command -v kilo &> /dev/null; then
        local ver=$(kilo --version 2>/dev/null || echo "desconocida")
        echo "✓ Kilo Code ($ver)"
        return 0
    else
        echo "✗ Kilo Code (no instalado)"
        return 1
    fi
}

# Obtener ruta del proyecto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
