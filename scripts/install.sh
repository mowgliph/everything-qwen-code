#!/bin/bash
# Instalador interactivo multi-CLI

set -e
source "$(dirname "$0")/utils.sh"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

show_banner() {
    cat << 'BANNER'
╔══════════════════════════════════════════════════════════════╗
║           EVERYTHING AGENTS SKILLS - Multi-CLI               ║
║                    Universal Skill Installer                 ║
╚══════════════════════════════════════════════════════════════╝
BANNER
}

show_menu() {
    cat << 'MENU'

CLIs detectados:

MENU

    detect_qwen 2>/dev/null || echo "✗ Qwen Code (no instalado)"
    detect_opencode 2>/dev/null || echo "✗ OpenCode (no instalado)"
    detect_gemini 2>/dev/null || echo "✗ Gemini CLI (no instalado)"
    detect_copilot 2>/dev/null || echo "✗ Copilot CLI (no instalado)"
    detect_kilo 2>/dev/null || echo "✗ Kilo Code (no instalado)"

    cat << 'OPTIONS'

[1] Instalar Qwen Code
[2] Instalar OpenCode
[3] Instalar Gemini CLI
[4] Instalar Copilot
[5] Instalar Kilo Code
[6] Instalar TODOS los detectados
[7] Desinstalar...
[0] Salir

OPTIONS
}

install_qwen() {
    info "Instalando Qwen Code..."
    
    local qwen_dir="$HOME/.qwen"
    mkdir -p "$qwen_dir/skills" "$qwen_dir/commands" "$qwen_dir/hooks" "$qwen_dir/rules"
    
    # Symlinks
    ln -sf "$PROJECT_ROOT/skills"/* "$qwen_dir/skills/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/commands"/* "$qwen_dir/commands/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/hooks"/* "$qwen_dir/hooks/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/rules"/* "$qwen_dir/rules/" 2>/dev/null || true
    
    # Copiar mcp-configs si existen
    if [ -d "$PROJECT_ROOT/cli-configs/qwen/mcp-configs" ]; then
        mkdir -p "$qwen_dir/mcp-configs"
        cp -r "$PROJECT_ROOT/cli-configs/qwen/mcp-configs/"* "$qwen_dir/mcp-configs/" 2>/dev/null || true
    fi
    
    success "Qwen Code instalado!"
}

install_opencode() {
    info "Instalando OpenCode..."
    
    local opencode_dir="$HOME/.opencode"
    mkdir -p "$opencode_dir/skills" "$opencode_dir/agents" "$opencode_dir/rules"
    
    # Symlinks
    ln -sf "$PROJECT_ROOT/skills/"* "$opencode_dir/skills/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/agents/"* "$opencode_dir/agents/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/rules/"* "$opencode_dir/rules/" 2>/dev/null || true
    
    # Copiar config MCP
    if [ -f "$PROJECT_ROOT/cli-configs/opencode/.mcp.json" ]; then
        cp "$PROJECT_ROOT/cli-configs/opencode/.mcp.json" "$opencode_dir/.mcp.json"
    fi
    
    success "OpenCode instalado!"
}

install_gemini() {
    info "Instalando Gemini CLI..."
    mkdir -p "$HOME/.config/gemini/skills"
    ln -sf "$PROJECT_ROOT/skills/"* "$HOME/.config/gemini/skills/" 2>/dev/null || true
    success "Gemini CLI instalado!"
}

install_copilot() {
    info "Instalando Copilot..."
    mkdir -p "$HOME/.github/copilot"
    cp "$PROJECT_ROOT/cli-configs/copilot/"* "$HOME/.github/copilot/" 2>/dev/null || true
    success "Copilot instalado!"
}

install_kilo() {
    info "Instalando Kilo Code..."
    
    local kilo_dir="$HOME/.kilo"
    mkdir -p "$kilo_dir/skills" "$kilo_dir/commands" "$kilo_dir/agents" "$kilo_dir/hooks" "$kilo_dir/rules" "$kilo_dir/contexts"
    
    # Symlinks
    ln -sf "$PROJECT_ROOT/skills"/* "$kilo_dir/skills/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/commands"/* "$kilo_dir/commands/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/agents"/* "$kilo_dir/agents/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/hooks"/* "$kilo_dir/hooks/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/rules"/* "$kilo_dir/rules/" 2>/dev/null || true
    ln -sf "$PROJECT_ROOT/contexts"/* "$kilo_dir/contexts/" 2>/dev/null || true
    
    # Copiar config MCP
    if [ -f "$PROJECT_ROOT/.mcp.json" ]; then
        cp "$PROJECT_ROOT/.mcp.json" "$kilo_dir/mcp.json"
    fi
    
    success "Kilo Code instalado!"
}

uninstall_menu() {
    cat << 'UNINSTALL'

[1] Desinstalar Qwen Code
[2] Desinstalar OpenCode
[3] Desinstalar Gemini CLI
[4] Desinstalar Copilot
[5] Desinstalar Kilo Code
[0] Volver

UNINSTALL
    read -p "Selección: " choice
    case $choice in
        1) rm -rf "$HOME/.qwen/skills" "$HOME/.qwen/commands" 2>/dev/null; success "Qwen desinstalado";;
        2) rm -rf "$HOME/.opencode/skills" "$HOME/.opencode/agents" 2>/dev/null; success "OpenCode desinstalado";;
        3) rm -rf "$HOME/.config/gemini/skills" 2>/dev/null; success "Gemini desinstalado";;
        4) rm -rf "$HOME/.github/copilot" 2>/dev/null; success "Copilot desinstalado";;
        5) rm -rf "$HOME/.kilo" 2>/dev/null; success "Kilo desinstalado";;
    esac
}

main() {
    show_banner
    
    while true; do
        show_menu
        read -p "Selección: " choice
        
        case $choice in
            1) install_qwen ;;
            2) install_opencode ;;
            3) install_gemini ;;
            4) install_copilot ;;
            5) install_kilo ;;
            6) 
                detect_qwen > /dev/null 2>&1 && install_qwen
                detect_opencode > /dev/null 2>&1 && install_opencode
                detect_gemini > /dev/null 2>&1 && install_gemini
                detect_copilot > /dev/null 2>&1 && install_copilot
                detect_kilo > /dev/null 2>&1 && install_kilo
                success "Todos instalados!"
                ;;
            7) uninstall_menu ;;
            0) echo "¡Hasta luego!"; exit 0 ;;
            *) error "Opción inválida" ;;
        esac
        
        echo ""
        read -p "Presiona Enter para continuar..."
    done
}

main "$@"
