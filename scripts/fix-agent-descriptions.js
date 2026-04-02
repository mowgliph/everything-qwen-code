#!/usr/bin/env node
/**
 * Fix agent descriptions with incomplete text
 */

const fs = require('fs');
const path = require('path');

const agentsDir = path.join(__dirname, '..', '.agents');
const files = fs.readdirSync(agentsDir);

let fixed = 0;

for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const agentName = file.replace('.md', '');
    const filePath = path.join(agentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to match: user: "Can you help me with " assistant: "I will use the {agent} agent
    const oldPattern = new RegExp(
        `(description:.*?user: "Can you help me with )(" assistant: "I will use the ${agentName} agent)`,
        's'
    );
    
    const newReplacement = `$1${agentName} tasks?" assistant: "I'll use the ${agentName} agent`;
    
    const newContent = content.replace(oldPattern, newReplacement);
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed: ${agentName}`);
        fixed++;
    }
}

console.log(`\nAgent description fix complete! Fixed ${fixed} agents.`);
