#!/bin/bash
set -euo pipefail

#################################
# VALIDATE AGENTS - Agent Configuration Validator
# 
# Valida que todos los archivos de agentes cumplan con la especificación:
# - Campo requerido: name
# - Campo requerido: description
# - Campos opcionales: model
# - Campos PROHIBIDOS: color, tags, version
#################################

IDES=("claude" "copilot" "kilo" "gemini" "opencode")
PROJECT_AGENTS="/home/mowgli/everything-agents-skills/agents"
ERRORS=0
WARNINGS=0

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=================================================="
echo "VALIDATE AGENTS - Agent Configuration Validator"
echo "=================================================="
echo ""

# Función: validar un archivo de agente
validate_agent() {
    local filepath=$1
    local filename=$(basename "$filepath")
    local errors=0
    local file_errors=()
    
    # Verificar que es un archivo .md
    if [[ ! "$filename" =~ \.md$ ]]; then
        return
    fi
    
    # Extraer el frontmatter YAML
    local frontmatter=$(head -10 "$filepath" | sed -n '/^---$/,/^---$/p')
    
    # Verificar campos requeridos
    if ! echo "$frontmatter" | grep -q "^name:"; then
        file_errors+=("MISSING: campo 'name' requerido")
        errors=$((errors + 1))
    fi
    
    if ! echo "$frontmatter" | grep -q "^description:"; then
        file_errors+=("MISSING: campo 'description' requerido")
        errors=$((errors + 1))
    fi
    
    # Verificar campos prohibidos
    local prohibited=("color" "tags" "version")
    for field in "${prohibited[@]}"; do
        if echo "$frontmatter" | grep -q "^${field}:"; then
            file_errors+=("PROHIBITED: campo '$field' no permitido en especificación de Claude")
            errors=$((errors + 1))
        fi
    done
    
    # Reportar errores
    if [ $errors -gt 0 ]; then
        echo -e "${RED}✗${NC} $filename"
        for error in "${file_errors[@]}"; do
            echo "    $error"
        done
        return $errors
    else
        echo -e "${GREEN}✓${NC} $filename"
        return 0
    fi
}

# Validar proyecto principal
echo "VALIDANDO PROYECTO PRINCIPAL:"
echo "Dir: $PROJECT_AGENTS"
echo ""

total_errors=0
for agent_file in "$PROJECT_AGENTS"/*.md; do
    if [ -f "$agent_file" ]; then
        validate_agent "$agent_file"
        total_errors=$((total_errors + $?))
    fi
done

echo ""
echo "VALIDANDO CARPETAS IDE:"
echo ""

# Validar cada IDE
for ide in "${IDES[@]}"; do
    ide_agents_dir="/home/mowgli/.${ide}/agents"
    
    if [ -d "$ide_agents_dir" ]; then
        echo ".$ide/agents:"
        ide_errors=0
        
        for agent_file in "$ide_agents_dir"/*.md; do
            if [ -f "$agent_file" ]; then
                validate_agent "$agent_file"
                ide_errors=$((ide_errors + $?))
            fi
        done
        
        total_errors=$((total_errors + ide_errors))
        echo ""
    fi
done

echo "=================================================="
if [ $total_errors -eq 0 ]; then
    echo -e "${GREEN}✓ VALIDACIÓN EXITOSA${NC}"
    echo "  Todos los agentes cumplen la especificación"
    exit 0
else
    echo -e "${RED}✗ VALIDACIÓN FALLÓ${NC}"
    echo "  Errores encontrados: $total_errors"
    exit 1
fi
