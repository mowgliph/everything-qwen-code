#!/bin/bash
# Detecta CLIs instalados

source "$(dirname "$0")/utils.sh"

echo "=== Detección de CLIs ==="
echo ""

detected=0

if detect_qwen > /dev/null 2>&1; then
    detect_qwen
    detected=$((detected + 1))
else
    echo "✗ Qwen Code (no instalado)"
fi

if detect_opencode > /dev/null 2>&1; then
    detect_opencode
    detected=$((detected + 1))
else
    echo "✗ OpenCode (no instalado)"
fi

if detect_gemini > /dev/null 2>&1; then
    detect_gemini
    detected=$((detected + 1))
else
    echo "✗ Gemini CLI (no instalado)"
fi

if detect_copilot > /dev/null 2>&1; then
    detect_copilot
    detected=$((detected + 1))
else
    echo "✗ Copilot CLI (no instalado)"
fi

echo ""
echo "Total: $detected CLI(s) detectado(s)"
