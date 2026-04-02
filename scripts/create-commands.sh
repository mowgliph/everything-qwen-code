#!/bin/bash
# Create 68 commands for Qwen Code based on documentation

COMMANDS_DIR=".qwen/commands"

# Function to create a command file
create_command() {
    local name=$1
    local description=$2
    local agent=$3
    local content=$4
    
    mkdir -p "$COMMANDS_DIR/$name"
    
    cat > "$COMMANDS_DIR/$name/COMMAND.md" << EOF
---
name: $name
description: "$description"
version: 1.0.0
---

# $name Command

EOF
    
    if [ -n "$agent" ]; then
        echo "This command invokes the **$agent** agent." >> "$COMMANDS_DIR/$name/COMMAND.md"
        echo "" >> "$COMMANDS_DIR/$name/COMMAND.md"
    fi
    
    if [ -n "$content" ]; then
        echo "$content" >> "$COMMANDS_DIR/$name/COMMAND.md"
    else
        echo "## Usage" >> "$COMMANDS_DIR/$name/COMMAND.md"
        echo "" >> "$COMMANDS_DIR/$name/COMMAND.md"
        echo "\`/$name\`" >> "$COMMANDS_DIR/$name/COMMAND.md"
    fi
    
    echo "Created: $name"
}

# Planning & Architecture Commands
create_command "plan" "Create implementation plan before coding" "planner" "Use this command when starting new features or complex refactoring."
create_command "architect" "Design system architecture" "architect" "Use for architectural decisions and system design."
create_command "tdd" "Test-driven development workflow" "tdd-guide" "Enforces RED-GREEN-REFACTOR cycle with 80%+ coverage."
create_command "orchestrate" "Multi-agent handoff for complex tasks" "planner, tdd-guide, code-reviewer, security-reviewer, architect" "Coordinates multiple agents for end-to-end delivery."

# Code Review Commands
create_command "code-review" "Review code for quality and security" "code-reviewer" "Comprehensive review of uncommitted changes."
create_command "security-review" "Security vulnerability analysis" "security-reviewer" "Detects security issues before commit."
create_command "typescript-review" "TypeScript/JavaScript code review" "typescript-reviewer" "TS/JS specific code review."
create_command "python-review" "Python code review" "python-reviewer" "Python specific code review."
create_command "go-review" "Go code review" "go-reviewer" "Go specific code review."
create_command "java-review" "Java/Spring Boot code review" "java-reviewer" "Java specific code review."
create_command "kotlin-review" "Kotlin code review" "kotlin-reviewer" "Kotlin specific code review."
create_command "rust-review" "Rust code review" "rust-reviewer" "Rust specific code review."
create_command "cpp-review" "C++ code review" "cpp-reviewer" "C++ specific code review."

# Build & Debug Commands
create_command "build-fix" "Fix build/type errors" "build-error-resolver" "Resolves compilation and type errors."
create_command "cpp-build" "Fix C++ build errors" "cpp-build-resolver" "C++ specific build error resolution."
create_command "go-build" "Fix Go build errors" "go-build-resolver" "Go specific build error resolution."
create_command "java-build" "Fix Java/Maven/Gradle build errors" "java-build-resolver" "Java specific build error resolution."
create_command "kotlin-build" "Fix Kotlin/Gradle build errors" "kotlin-build-resolver" "Kotlin specific build error resolution."
create_command "rust-build" "Fix Rust build errors" "rust-build-resolver" "Rust specific build error resolution."
create_command "pytorch-build" "Fix PyTorch/CUDA/training errors" "pytorch-build-resolver" "PyTorch specific build error resolution."

# Testing Commands
create_command "e2e" "End-to-end Playwright testing" "e2e-runner" "Runs E2E tests for critical user flows."
create_command "test-coverage" "Analyze test coverage" "" "Verifies 80%+ test coverage requirement."
create_command "eval" "Run eval harness" "eval-harness" "Evaluates agent performance."

# Refactoring Commands
create_command "refactor-clean" "Dead code cleanup" "refactor-cleaner" "Removes unused code and technical debt."
create_command "update-docs" "Update documentation" "doc-updater" "Syncs documentation with code."
create_command "update-codemaps" "Update architecture codemaps" "doc-updater" "Updates architecture documentation."

# Documentation Commands
create_command "docs" "Documentation lookup" "docs-lookup" "API and documentation lookup via Context7."

# Language-Specific Test Commands
create_command "go-test" "Go TDD workflow" "tdd-guide" "Go specific test-driven development."
create_command "kotlin-test" "Kotlin TDD workflow" "tdd-guide" "Kotlin specific test-driven development."
create_command "cpp-test" "C++ TDD workflow" "tdd-guide" "C++ specific test-driven development."
create_command "rust-test" "Rust TDD workflow" "tdd-guide" "Rust specific test-driven development."

# Autonomous Loop Commands
create_command "loop-start" "Start autonomous loop" "loop-operator" "Initiates autonomous agent loop."
create_command "loop-status" "Check loop status" "loop-operator" "Monitors autonomous loop execution."

# Continuous Learning Commands
create_command "learn" "Save session learnings" "continuous-learning" "Captures learnings from session."
create_command "learn-eval" "Evaluate and save learnings" "continuous-learning-v2" "Evaluates then saves learnings."
create_command "instinct-import" "Import instincts" "continuous-learning-v2" "Imports learned instincts."
create_command "instinct-export" "Export instincts" "continuous-learning-v2" "Exports learned instincts."
create_command "instinct-status" "Show instinct status" "continuous-learning-v2" "Displays instinct inventory."
create_command "evolve" "Evolve and cluster instincts" "continuous-learning-v2" "Clusters and evolves instincts."
create_command "promote" "Promote instinct to skill" "continuous-learning-v2" "Promotes instinct to skill."
create_command "projects" "List project contexts" "continuous-learning-v2" "Lists project contexts."

# Verification Commands
create_command "checkpoint" "Create verification checkpoint" "verification-loop" "Creates verification checkpoint."
create_command "verify" "Run verification" "verification-loop" "Runs verification checks."

# Harness Commands
create_command "harness-audit" "Audit harness configuration" "" "Reviews harness scorecard."

# Quality Commands
create_command "quality-gate" "Run quality gate checks" "" "Runs quality pipeline checks."

# Model Commands
create_command "model-route" "Get model routing recommendation" "" "Recommends optimal model."

# Multi-Model Commands
create_command "multi-plan" "Multi-model planning" "architect" "Multi-model planning workflow."
create_command "multi-execute" "Multi-model execution" "architect" "Multi-model execution workflow."
create_command "multi-backend" "Multi-model backend services" "architect" "Multi-model backend workflow."
create_command "multi-frontend" "Multi-model frontend services" "architect" "Multi-model frontend workflow."
create_command "multi-workflow" "Multi-model general workflow" "architect" "Multi-model general workflow."

# Session Commands
create_command "save-session" "Save session state" "" "Persists session state."
create_command "resume-session" "Resume session" "" "Resumes previous session."
create_command "sessions" "List session history" "" "Shows session history."

# Utility Commands
create_command "claw" "NanoClaw CLI operations" "" "NanoClaw CLI tool."
create_command "pm2" "PM2 service lifecycle" "" "PM2 process manager."
create_command "setup-pm" "Setup package manager" "" "Configures package manager."
create_command "skill-create" "Create new skill" "" "Scaffolds new skill."
create_command "skill-health" "Check skill health" "" "Validates skill configuration."

# Optimization Commands
create_command "context-budget" "Optimize context usage" "" "Manages context budget."
create_command "prompt-optimize" "Optimize prompts" "" "Improves prompt effectiveness."
create_command "prune" "Prune unused code" "" "Removes unused dependencies and code."

# Rules Commands
create_command "rules-distill" "Distill rules from codebase" "rules-distill" "Extracts rules from existing code."

# Build Commands
create_command "gradle-build" "Fix Gradle build errors" "java-build-resolver" "Gradle specific build resolution."

# DevFleet Commands
create_command "devfleet" "DevFleet operations" "claude-devfleet" "DevFleet integration."

# Aside Commands
create_command "aside" "Create aside documentation" "" "Creates aside documentation."

# Security Commands
create_command "security-scan" "Run security scan" "security-reviewer" "AgentShield security scanning."

echo ""
echo "Command creation complete!"
echo "Total commands created: $(ls -1d $COMMANDS_DIR/*/ 2>/dev/null | wc -l)"
