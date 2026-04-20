#!/bin/bash
# Everything Agents Skills - Unified Universal Installer (Bash Version)
# "La verdad absoluta de la instalación"

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOME_DIR="$HOME"

log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
header() { echo -e "\n${CYAN}${BOLD}=== $1 ===${NC}"; }

show_banner() {
    cat << "BANNER"
╔══════════════════════════════════════════════════════════════╗
║           EVERYTHING AGENTS SKILLS - Unified Bash            ║
║                "The Absolute Truth Installer"                ║
╚══════════════════════════════════════════════════════════════╝
BANNER
}

# Detection functions
detect_cli() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓ $2${NC}"
        return 0
    else
        echo -e "${RED}✗ $2${NC}"
        return 1
    fi
}

# Helper to create symlinks safely
safe_link() {
    local src="$1"
    local dest="$2"
    
    if [ ! -e "$src" ]; then
        warn "Source does not exist: $src"
        return
    fi
    
    mkdir -p "$(dirname "$dest")"
    
    if [ -L "$dest" ]; then
        rm "$dest"
    elif [ -e "$dest" ]; then
        warn "Path exists and is not a symlink: $dest. Backing up to .bak"
        mv "$dest" "$dest.bak"
    fi
    
    ln -s "$src" "$dest"
    log "Linked: $dest -> $src"
}

install_gemini() {
    header "Configuring Gemini CLI"
    local gemini_dir="$HOME_DIR/.gemini"
    mkdir -p "$gemini_dir/agents" "$gemini_dir/skills"
    
    # Link workspace agents to global gemini agents
    for agent in "$PROJECT_ROOT/agents"/*.md; do
        [ -e "$agent" ] || continue
        safe_link "$agent" "$gemini_dir/agents/$(basename "$agent")"
    done
    
    # Link workspace skills to global gemini skills
    # We link the directories in skills/
    for skill in "$PROJECT_ROOT/skills"/*; do
        [ -d "$skill" ] || continue
        safe_link "$skill" "$gemini_dir/skills/$(basename "$skill")"
    done

    # Link workspace .gemini configs if any
    if [ -d "$PROJECT_ROOT/.gemini" ]; then
        for cfg in "$PROJECT_ROOT/.gemini"/*; do
            [ -e "$cfg" ] || continue
            # Avoid linking the directories we already handled
            if [[ "$(basename "$cfg")" != "agents" && "$(basename "$cfg")" != "skills" ]]; then
                safe_link "$cfg" "$gemini_dir/$(basename "$cfg")"
            fi
        done
    fi

    # Link global settings.json from cli-configs/gemini
    if [ -f "$PROJECT_ROOT/cli-configs/gemini/settings.json" ]; then
        safe_link "$PROJECT_ROOT/cli-configs/gemini/settings.json" "$gemini_dir/settings.json"
    fi
    
    success "Gemini CLI configured!"
}

install_qwen() {
    header "Configuring Qwen Code"
    local qwen_dir="$HOME_DIR/.qwen"
    mkdir -p "$qwen_dir/agents" "$qwen_dir/skills" "$qwen_dir/commands" "$qwen_dir/hooks" "$qwen_dir/rules"
    
    # Symlinks for everything
    for item in agents skills commands hooks rules; do
        for file in "$PROJECT_ROOT/$item"/*; do
            [ -e "$file" ] || continue
            safe_link "$file" "$qwen_dir/$item/$(basename "$file")"
        done
    done
    
    # Special config files
    if [ -d "$PROJECT_ROOT/cli-configs/qwen/mcp-configs" ]; then
        mkdir -p "$qwen_dir/mcp-configs"
        for mcp in "$PROJECT_ROOT/cli-configs/qwen/mcp-configs"/*; do
            [ -e "$mcp" ] || continue
            safe_link "$mcp" "$qwen_dir/mcp-configs/$(basename "$mcp")"
        done
    fi
    
    success "Qwen Code configured!"
}

install_opencode() {
    header "Configuring OpenCode"
    local opencode_dir="$HOME_DIR/.opencode"
    mkdir -p "$opencode_dir/agents" "$opencode_dir/skills" "$opencode_dir/rules"
    
    for item in agents skills rules; do
        for file in "$PROJECT_ROOT/$item"/*; do
            [ -e "$file" ] || continue
            safe_link "$file" "$opencode_dir/$item/$(basename "$file")"
        done
    done
    
    if [ -f "$PROJECT_ROOT/cli-configs/opencode/.mcp.json" ]; then
        safe_link "$PROJECT_ROOT/cli-configs/opencode/.mcp.json" "$opencode_dir/.mcp.json"
    fi
    
    success "OpenCode configured!"
}

install_kilo() {
    header "Configuring Kilo Code"
    local kilo_dir="$HOME_DIR/.kilo"
    mkdir -p "$kilo_dir/agents" "$kilo_dir/skills" "$kilo_dir/commands" "$kilo_dir/hooks" "$kilo_dir/rules" "$kilo_dir/contexts"
    
    for item in agents skills commands hooks rules contexts; do
        for file in "$PROJECT_ROOT/$item"/*; do
            [ -e "$file" ] || continue
            safe_link "$file" "$kilo_dir/$item/$(basename "$file")"
        done
    done
    
    if [ -f "$PROJECT_ROOT/.mcp.json" ]; then
        safe_link "$PROJECT_ROOT/.mcp.json" "$kilo_dir/mcp.json"
    fi
    
    success "Kilo Code configured!"
}

main() {
    show_banner
    
    echo -e "\n${BOLD}Detected CLIs:${NC}"
    detect_cli "gemini" "Gemini CLI" || true
    detect_cli "qwen" "Qwen Code" || true
    detect_cli "opencode" "OpenCode" || true
    detect_cli "kilo" "Kilo Code" || true
    
    echo -e "\n${BOLD}Choose installation mode:${NC}"
    echo "[1] Install EVERYTHING (idempotent symlinks)"
    echo "[2] Install Gemini only"
    echo "[3] Install Qwen only"
    echo "[4] Install OpenCode only"
    echo "[5] Install Kilo only"
    echo "[0] Cancel"
    
    read -p "Select: " choice
    
    case $choice in
        1)
            install_gemini
            install_qwen
            install_opencode
            install_kilo
            ;;
        2) install_gemini ;;
        3) install_qwen ;;
        4) install_opencode ;;
        5) install_kilo ;;
        0) exit 0 ;;
        *) error "Invalid choice" ;;
    esac
    
    header "Final Steps"
    log "Symlinks created. Any changes in this workspace will automatically reflect in your global CLI configs."
    log "Restart your CLI sessions to ensure everything is loaded."
    success "Installation process finished successfully!"
}

main "$@"
