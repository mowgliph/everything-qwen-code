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
PURPLE='\033[0;35m'
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
        return
    fi
    
    mkdir -p "$(dirname "$dest")"
    
    if [ -L "$dest" ]; then
        rm "$dest"
    elif [ -e "$dest" ]; then
        mv "$dest" "$dest.bak"
    fi
    
    ln -s "$src" "$dest"
    log "Linked: $dest"
}

install_gemini() {
    header "Configuring Gemini CLI"
    local gemini_dir="$HOME_DIR/.gemini"
    mkdir -p "$gemini_dir/agents" "$gemini_dir/skills"
    
    # Link workspace agents and skills
    for agent in "$PROJECT_ROOT/agents"/*.md; do [ -e "$agent" ] && safe_link "$agent" "$gemini_dir/agents/$(basename "$agent")"; done
    for skill in "$PROJECT_ROOT/skills"/*; do [ -d "$skill" ] && safe_link "$skill" "$gemini_dir/skills/$(basename "$skill")"; done

    # Link workspace .gemini configs and settings.json
    [ -d "$PROJECT_ROOT/.gemini" ] && for cfg in "$PROJECT_ROOT/.gemini"/*; do 
        [[ "$(basename "$cfg")" != "agents" && "$(basename "$cfg")" != "skills" ]] && safe_link "$cfg" "$gemini_dir/$(basename "$cfg")"
    done
    [ -f "$PROJECT_ROOT/cli-configs/gemini/settings.json" ] && safe_link "$PROJECT_ROOT/cli-configs/gemini/settings.json" "$gemini_dir/settings.json"
    
    success "Gemini CLI configured!"
}

install_qwen() {
    header "Configuring Qwen Code"
    local qwen_dir="$HOME_DIR/.qwen"
    mkdir -p "$qwen_dir/agents" "$qwen_dir/skills" "$qwen_dir/commands" "$qwen_dir/hooks" "$qwen_dir/rules"
    
    for item in agents skills commands hooks rules; do
        for file in "$PROJECT_ROOT/$item"/*; do [ -e "$file" ] && safe_link "$file" "$qwen_dir/$item/$(basename "$file")"; done
    done
    
    if [ -d "$PROJECT_ROOT/cli-configs/qwen/mcp-configs" ]; then
        mkdir -p "$qwen_dir/mcp-configs"
        for mcp in "$PROJECT_ROOT/cli-configs/qwen/mcp-configs"/*; do [ -e "$mcp" ] && safe_link "$mcp" "$qwen_dir/mcp-configs/$(basename "$mcp")"; done
    fi
    success "Qwen Code configured!"
}

install_opencode() {
    header "Configuring OpenCode"
    local opencode_dir="$HOME_DIR/.opencode"
    mkdir -p "$opencode_dir/agents" "$opencode_dir/skills" "$opencode_dir/rules"
    
    for item in agents skills rules; do
        for file in "$PROJECT_ROOT/$item"/*; do [ -e "$file" ] && safe_link "$file" "$opencode_dir/$item/$(basename "$file")"; done
    done
    [ -f "$PROJECT_ROOT/cli-configs/opencode/.mcp.json" ] && safe_link "$PROJECT_ROOT/cli-configs/opencode/.mcp.json" "$opencode_dir/.mcp.json"
    success "OpenCode configured!"
}

install_kilo() {
    header "Configuring Kilo Code"
    local kilo_dir="$HOME_DIR/.kilo"
    mkdir -p "$kilo_dir/agents" "$kilo_dir/skills" "$kilo_dir/commands" "$kilo_dir/hooks" "$kilo_dir/rules" "$kilo_dir/contexts"
    
    for item in agents skills commands hooks rules contexts; do
        for file in "$PROJECT_ROOT/$item"/*; do [ -e "$file" ] && safe_link "$file" "$kilo_dir/$item/$(basename "$file")"; done
    done
    [ -f "$PROJECT_ROOT/.mcp.json" ] && safe_link "$PROJECT_ROOT/.mcp.json" "$kilo_dir/mcp.json"
    success "Kilo Code configured!"
}

install_copilot() {
    header "Configuring GitHub Copilot"
    local copilot_dir="$HOME_DIR/.github/copilot"
    mkdir -p "$copilot_dir/skills"
    
    for skill in "$PROJECT_ROOT/skills"/*; do [ -d "$skill" ] && safe_link "$skill" "$copilot_dir/skills/$(basename "$skill")"; done
    success "GitHub Copilot configured!"
}

install_claude() {
    header "Configuring Claude Code"
    local claude_dir="$HOME_DIR/.claude"
    mkdir -p "$claude_dir/skills" "$claude_dir/agents"
    
    for skill in "$PROJECT_ROOT/skills"/*; do [ -d "$skill" ] && safe_link "$skill" "$claude_dir/skills/$(basename "$skill")"; done
    for agent in "$PROJECT_ROOT/agents"/*.md; do [ -e "$agent" ] && safe_link "$agent" "$claude_dir/agents/$(basename "$agent")"; done
    success "Claude Code configured!"
}

main() {
    show_banner
    
    echo -e "\n${BOLD}Detected CLIs:${NC}"
    detect_cli "gemini" "Gemini CLI" || true
    detect_cli "qwen" "Qwen Code" || true
    detect_cli "opencode" "OpenCode" || true
    detect_cli "kilo" "Kilo Code" || true
    detect_cli "gh" "GitHub CLI (for Copilot)" || true
    detect_cli "claude" "Claude Code" || true
    
    echo -e "\n${BOLD}Choose installation mode:${NC}"
    echo "[1] Install EVERYTHING (idempotent symlinks)"
    echo "[2] Install Gemini only"
    echo "[3] Install Qwen only"
    echo "[4] Install OpenCode only"
    echo "[5] Install Kilo only"
    echo "[6] Install Copilot only"
    echo "[7] Install Claude only"
    echo "[0] Cancel"
    
    read -p "Select: " choice
    
    case $choice in
        1) install_gemini; install_qwen; install_opencode; install_kilo; install_copilot; install_claude ;;
        2) install_gemini ;;
        3) install_qwen ;;
        4) install_opencode ;;
        5) install_kilo ;;
        6) install_copilot ;;
        7) install_claude ;;
        0) exit 0 ;;
        *) error "Invalid choice" ;;
    esac
    
    header "Final Steps"
    log "Symlinks created. Any changes in this workspace will automatically reflect in your global CLI configs."
    log "Restart your CLI sessions to ensure everything is loaded."
    success "Installation process finished successfully!"
}

main "$@"
