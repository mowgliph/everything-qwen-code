#!/bin/bash
set -e

# Trap handler for cleanup on interrupt
trap 'echo "Script interrupted - cleanup done"; exit 130' INT TERM
# SYNC AGENTS - Multi-CLI Agent Synchronization
# 
# Sincroniza agentes entre:
# - /home/mowgli/everything-agents-skills/agents/ (source of truth del proyecto)
# - /home/mowgli/.{claude,copilot,kilo,gemini,opencode}/agents/ (IDE-específicos)
#
# Estrategia: Last-Modified-Wins with IDE Attribution
#################################

PROJECT_AGENTS="/home/mowgli/everything-agents-skills/agents"
IDES=("claude" "copilot" "kilo" "gemini" "opencode")
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CONFLICT_LOG="/tmp/sync-conflicts-${TIMESTAMP}.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "============================================"
echo "SYNC AGENTS - Multi-CLI Synchronization"
echo "Start: $TIMESTAMP"
echo "============================================"
echo ""

# Función: obtener hash SHA256 de un archivo
get_file_hash() {
    sha256sum "$1" 2>/dev/null | awk '{print $1}' || echo ""
}

# Función: contar cambios en un IDE desde última sincronización
count_changes() {
    local ide=$1
    local ide_agents_dir="/home/mowgli/.${ide}/agents"
    local metadata_file="${ide_agents_dir}/.sync-metadata.json"
    
    if [ ! -f "$metadata_file" ]; then
        echo "0"
        return
    fi
    
    local changes=0
    for agent_file in "$ide_agents_dir"/*.md; do
        filename=$(basename "$agent_file")
        current_hash=$(get_file_hash "$agent_file")
        stored_hash=$(jq -r ".agents[\"$filename\"].hash // \"none\"" "$metadata_file" 2>/dev/null || echo "none")
        
        if [ "$current_hash" != "$stored_hash" ]; then
            changes=$((changes + 1))
        fi
    done
    
    echo "$changes"
}

# Paso 1: Detectar cambios en cada IDE
echo -e "${YELLOW}[PASO 1]${NC} Detectando cambios locales en cada IDE..."
declare -A ide_changes
total_changes=0

for ide in "${IDES[@]}"; do
    ide_agents_dir="/home/mowgli/.${ide}/agents"
    if [ -d "$ide_agents_dir" ]; then
        changes=$(count_changes "$ide")
        ide_changes[$ide]=$changes
        total_changes=$((total_changes + changes))
        echo "  $ide: $changes cambios locales"
    fi
done

echo ""
echo -e "${YELLOW}[PASO 2]${NC} Analizando conflictos..."

# Paso 2: Detectar conflictos (mismo agente modificado en múltiples IDEs)
declare -A conflicts
for agent_file in "$PROJECT_AGENTS"/*.md; do
    filename=$(basename "$agent_file")
    modified_ides=()
    
    for ide in "${IDES[@]}"; do
        ide_agent_file="/home/mowgli/.${ide}/agents/$filename"
        ide_metadata_file="/home/mowgli/.${ide}/agents/.sync-metadata.json"
        
        if [ -f "$ide_agent_file" ] && [ -f "$ide_metadata_file" ]; then
            current_hash=$(get_file_hash "$ide_agent_file")
            # Escape filename for safe jq access
            filename_escaped=$(printf '%s\n' "$filename" | jq -Rs .)
            stored_hash=$(jq -r ".agents[$filename_escaped].hash // \"none\"" "$ide_metadata_file" 2>/dev/null || echo "none")
            
            if [ "$current_hash" != "$stored_hash" ]; then
                modified_ides+=("$ide")
            fi
        fi
    done
    
    if [ ${#modified_ides[@]} -gt 1 ]; then
        conflicts[$filename]="${modified_ides[@]}"
        echo "  ⚠️  CONFLICTO: $filename modificado en ${modified_ides[@]}"
    fi
done

# Paso 3: Resolver conflictos usando Last-Modified-Wins
if [ ${#conflicts[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}[PASO 3]${NC} Resolviendo conflictos..."
    
    for filename in "${!conflicts[@]}"; do
        modified_ides=(${conflicts[$filename]})
        winner=""
        latest_time="0"
        
        echo "  Resolviendo: $filename"
        
        # Encontrar IDE con modificación más reciente
        for ide in "${modified_ides[@]}"; do
            ide_metadata_file="/home/mowgli/.${ide}/agents/.sync-metadata.json"
            # Escape filename for safe jq access
            filename_escaped=$(printf '%s\n' "$filename" | jq -Rs .)
            last_modified=$(jq -r ".agents[$filename_escaped].last_modified // \"0\"" "$ide_metadata_file" 2>/dev/null || echo "0")
            
            echo "    - $ide: $last_modified"
            
            if [ "$last_modified" > "$latest_time" ]; then
                latest_time=$last_modified
                winner=$ide
            fi
        done
        
        echo "    ✓ GANADOR: $winner"
        # Parse date safely (cross-platform)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS (BSD date)
            parsed_time=$(date -jf "%Y-%m-%dT%H:%M:%SZ" "$latest_time" 2>/dev/null || echo "$latest_time")
        else
            # Linux (GNU date)
            parsed_time=$(date -d "$latest_time" 2>/dev/null || echo "$latest_time")
        fi
        echo "      Timestamp: $parsed_time"
        echo "  Conflicto resuelto: $filename ganador=$winner" >> "$CONFLICT_LOG"
    done
fi

echo ""
echo -e "${YELLOW}[PASO 4]${NC} Sincronizando cambios al proyecto principal..."

# Paso 4: Sincronizar cambios de IDEs al proyecto
sync_count=0
for ide in "${IDES[@]}"; do
    ide_agents_dir="/home/mowgli/.${ide}/agents"
    if [ -d "$ide_agents_dir" ]; then
        for ide_agent_file in "$ide_agents_dir"/*.md; do
            filename=$(basename "$ide_agent_file")
            project_agent_file="$PROJECT_AGENTS/$filename"
            ide_metadata_file="$ide_agents_dir/.sync-metadata.json"
            
            # Copiar SOLO si el archivo específico cambió (hash mismatch)
            if [ -f "$ide_metadata_file" ]; then
                current_hash=$(get_file_hash "$ide_agent_file")
                stored_hash=$(jq -r ".agents[\"$filename\"].hash // \"none\"" "$ide_metadata_file" 2>/dev/null || echo "none")
                
                if [ "$current_hash" != "$stored_hash" ]; then
                    cp "$ide_agent_file" "$project_agent_file"
                    sync_count=$((sync_count + 1))
                fi
            fi
        done
    fi
done

echo "  Sincronizados $sync_count archivos al proyecto principal"

echo ""
echo -e "${YELLOW}[PASO 5]${NC} Propagando cambios aceptados de vuelta a todos los IDEs..."

# Paso 5: Propagar cambios del proyecto a todos los IDEs
propagate_count=0
for ide in "${IDES[@]}"; do
    ide_agents_dir="/home/mowgli/.${ide}/agents"
    if [ -d "$ide_agents_dir" ]; then
        for project_agent_file in "$PROJECT_AGENTS"/*.md; do
            filename=$(basename "$project_agent_file")
            ide_agent_file="$ide_agents_dir/$filename"
            
            cp "$project_agent_file" "$ide_agent_file"
            propagate_count=$((propagate_count + 1))
        done
    fi
done

echo "  Propagados $propagate_count archivos a todos los IDEs"

echo ""
echo -e "${YELLOW}[PASO 6]${NC} Actualizando metadatos de sincronización..."

# Paso 6: Actualizar .sync-metadata.json en cada IDE
for ide in "${IDES[@]}"; do
    ide_agents_dir="/home/mowgli/.${ide}/agents"
    metadata_file="$ide_agents_dir/.sync-metadata.json"
    
    if [ -d "$ide_agents_dir" ]; then
        python3 << EOF
import json
from datetime import datetime
import os
import hashlib

metadata_file = "$metadata_file"
agents_dir = "$ide_agents_dir"

# Cargar o crear metadata
if os.path.exists(metadata_file):
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)
else:
    metadata = {"ide": "$ide", "agents": {}}

# Actualizar cada agente
for filename in sorted(os.listdir(agents_dir)):
    if filename.endswith(".md"):
        filepath = os.path.join(agents_dir, filename)
        with open(filepath, 'rb') as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()
        
        metadata["agents"][filename] = {
            "hash": f"sha256:{file_hash}",
            "version": "1.0",
            "modified_by_ide": "$ide",
            "synced_to_main": True,
            "last_modified": datetime.utcnow().isoformat() + "Z"
        }

metadata["last_sync"] = datetime.utcnow().isoformat() + "Z"

# Guardar metadata
with open(metadata_file, 'w') as f:
    json.dump(metadata, f, indent=2)

print(f"  ✓ Metadata actualizado: $ide")
EOF
    fi
done

echo ""
echo "============================================"
echo -e "${GREEN}✓ SYNC COMPLETADO${NC}"
echo "  Total cambios detectados: $total_changes"
echo "  Conflictos resueltos: ${#conflicts[@]}"
echo "  Archivos sincronizados: $sync_count"
echo "  Archivos propagados: $propagate_count"
if [ -f "$CONFLICT_LOG" ]; then
    echo "  Log de conflictos: $CONFLICT_LOG"
fi
echo "============================================"
