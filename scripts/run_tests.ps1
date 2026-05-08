<#
.SYNOPSIS
Runs project tests

.DESCRIPTION
This script runs project tests for a Node.js project.
Generated automatically by Agentic.Engineering CLI.

.NOTES
Project Type: Node.js
Safe to run repeatedly: Yes
#>

param(
    [string]$Filter = ""
)

# Set error action preference to stop on errors
$ErrorActionPreference = "Stop"

try {
    # Execute the command
    if ($Filter) { npm test -- --grep="$Filter" } else { npm test }

    # Check if the command succeeded
    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
        Write-Host "Tests successful" -ForegroundColor Green
    } else {
        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Error executing command: $_"
    exit 1
}