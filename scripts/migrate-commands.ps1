# scripts/migrate-commands.ps1
param(
    [string]$SourceDir = "C:\Users\informatica\everything-claude-code\commands",
    [string]$DestDir = "C:\Users\informatica\everything-qwen-code\.qwen\commands"
)

$commandDirs = Get-ChildItem -Path $SourceDir -Directory

foreach ($cmdDir in $commandDirs) {
    $cmdName = $cmdDir.Name
    $destCmdDir = Join-Path $DestDir $cmdName

    New-Item -ItemType Directory -Path $destCmdDir -Force | Out-Null

    $cmdFiles = Get-ChildItem -Path $cmdDir.FullName -Filter "*.md"
    if ($cmdFiles.Count -gt 0) {
        $sourceFile = $cmdFiles[0]
        $content = Get-Content $sourceFile.FullName -Raw

        $name = $cmdName
        if ($content -match 'name:\s*(.*?)\s*$'m) {
            $name = $matches[1].Trim()
        }

        $description = "Command for $cmdName"
        if ($content -match 'description:\s*["\']?(.*?)["\']?\s*$'m) {
            $description = $matches[1].Trim()
        }

        $newFrontmatter = @"
---
name: $name
description: "$description"
version: 1.0.0
---

"@

        $body = $content
        if ($content -match '^---\s*\n(.*?)\n---\s*\n(.*)'s) {
            $body = $matches[2]
        }

        "$newFrontmatter$body" | Out-File -FilePath (Join-Path $destCmdDir "COMMAND.md") -Encoding utf8

        Write-Host "Migrated: $cmdName"
    }
}

Write-Host "Command migration complete. $( $commandDirs.Count ) commands converted."
