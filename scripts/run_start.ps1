<#
.SYNOPSIS
Starts the application with dependencies

.DESCRIPTION
This script starts the application with dependencies for a Node.js project.
Generated automatically by Agentic.Engineering CLI.

.NOTES
Project Type: Node.js
Safe to run repeatedly: Yes
#>

# Set error action preference to stop on errors
$ErrorActionPreference = "Stop"

try {
    # Execute the command
    npm run dev

    # Check if the command succeeded
    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
        Write-Host "Startup successful" -ForegroundColor Green
    } else {
        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Error executing command: $_"
    exit 1
}