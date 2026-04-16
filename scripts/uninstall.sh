#!/bin/bash
# Desinstalador

source "$(dirname "$0")/utils.sh"

uninstall_qwen() {
    warn "Desinstalando Qwen Code..."
    rm -rf "$HOME/.qwen/skills" "$HOME/.qwen/commands" "$HOME/.qwen/hooks" "$HOME/.qwen/rules"
    rm -f "$HOME/.qwen/mcp-configs"/*.json 2>/dev/null || true
    success "Qwen Code desinstalado"
}

uninstall_opencode() {
    warn "Desinstalando OpenCode..."
    rm -rf "$HOME/.opencode/skills" "$HOME/.opencode/agents" "$HOME/.opencode/rules"
    rm -f "$HOME/.opencode/.mcp.json"
    success "OpenCode desinstalado"
}

uninstall_gemini() {
    warn "Desinstalando Gemini CLI..."
    rm -rf "$HOME/.config/gemini/skills"
    success "Gemini CLI desinstalado"
}

uninstall_copilot() {
    warn "Desinstalando Copilot..."
    rm -rf "$HOME/.github/copilot"
    success "Copilot desinstalado"
}

echo "╔════════════════════════════════════════╗"
echo "║    DESINSTALAR - Everything Agents    ║"
echo "╚════════════════════════════════════════╝"
echo ""

if [ "$1" == "--all" ]; then
    uninstall_qwen
    uninstall_opencode
    uninstall_gemini
    uninstall_copilot
    exit 0
fi

echo "[1] Desinstalar Qwen Code"
echo "[2] Desinstalar OpenCode"
echo "[3] Desinstalar Gemini CLI"
echo "[4] Desinstalar Copilot"
echo "[0] Salir"
read -p "Selección: " choice

case $choice in
    1) uninstall_qwen ;;
    2) uninstall_opencode ;;
    3) uninstall_gemini ;;
    4) uninstall_copilot ;;
    0) exit 0 ;;
esac
