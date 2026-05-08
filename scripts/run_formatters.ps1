<#
.SYNOPSIS
Runs code formatting and linting

.DESCRIPTION
This script runs Prettier in write mode and then runs the project linter.

.NOTES
Project Type: Node.js
Safe to run repeatedly: Yes
#>

# Set error action preference to stop on errors
$ErrorActionPreference = "Stop"

try {
    # Buffer command output so success stays quiet and failures show the full npm output.
    $formatOutput = npm run format 2>&1 | Out-String

    if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
        if (-not [string]::IsNullOrWhiteSpace($formatOutput)) {
            Write-Host $formatOutput.TrimEnd()
        }

        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }

    $lintOutput = npm run lint 2>&1 | Out-String

    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
        Write-Host "Formatting and linting successful" -ForegroundColor Green
    } else {
        if (-not [string]::IsNullOrWhiteSpace($lintOutput)) {
            Write-Host $lintOutput.TrimEnd()
        }

        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Error executing command: $_"
    exit 1
}