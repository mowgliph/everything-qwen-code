#!/bin/bash
# Fix agent descriptions with incomplete text

AGENTS_DIR=".agents"

for agent_file in "$AGENTS_DIR"/*.md; do
    agent_name=$(basename "$agent_file" .md)
    
    # Read the file
    content=$(cat "$agent_file")
    
    # Fix the incomplete description pattern
    # From: user: "Can you help me with " assistant: "I will use the planner agent
    # To:   user: "Can you help me with planner tasks?" assistant: "I'll use the planner agent
    
    # Extract current description
    if [[ $content =~ description:\ \"(.*)\" ]]; then
        old_desc="${BASH_REMATCH[1]}"
        
        # Fix the incomplete phrase
        new_desc=$(echo "$old_desc" | sed "s/user: \"Can you help me with \" assistant: \"I will use the ${agent_name} agent/user: \"Can you help me with ${agent_name} tasks?\" assistant: \"I'll use the ${agent_name} agent/g")
        
        # Also fix "assist you with that" to "assist you"
        new_desc=$(echo "$new_desc" | sed "s/assist you with that/assist you/g")
        
        if [ "$old_desc" != "$new_desc" ]; then
            # Replace in file
            sed -i "s|description: \"$old_desc\"|description: \"$new_desc\"|" "$agent_file"
            echo "Fixed: $agent_name"
        fi
    fi
done

echo "Agent description fix complete!"
