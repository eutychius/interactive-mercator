<#
.SYNOPSIS
Installs project dependencies

.DESCRIPTION
This script installs project dependencies for a Node.js project.
Generated automatically by Agentic.Engineering CLI.

.NOTES
Project Type: Node.js
Safe to run repeatedly: Yes
#>

# Set error action preference to stop on errors
$ErrorActionPreference = "Stop"

try {
    # Capture install output in memory so successful runs stay quiet, but failures still show details.
    $installOutput = npm install 2>&1 | Out-String

    # Check if the command succeeded
    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
        Write-Host "Dependencies successful" -ForegroundColor Green
    } else {
        if ($installOutput) {
            Write-Host $installOutput.TrimEnd()
        }
        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Error executing command: $_"
    exit 1
}