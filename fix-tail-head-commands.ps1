# Windows-compatible script to replace Unix tail/head commands
# Usage: .\fix-tail-head-commands.ps1

Write-Host "🔧 Windows Command Fixes for Studio Roster" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Function to simulate tail command
function Get-Tail {
    param(
        [Parameter(Mandatory=$true)]
        [string]$File,
        [int]$Lines = 10
    )

    if (-not (Test-Path $File)) {
        Write-Error "File not found: $File"
        return
    }

    Get-Content $File -Tail $Lines
}

# Function to simulate head command
function Get-Head {
    param(
        [Parameter(Mandatory=$true)]
        [string]$File,
        [int]$Lines = 10
    )

    if (-not (Test-Path $File)) {
        Write-Error "File not found: $File"
        return
    }

    Get-Content $File -First $Lines
}

# Function to simulate find command
function Get-Files {
    param(
        [string]$Path = ".",
        [string]$Filter = "*",
        [switch]$Recurse
    )

    if ($Recurse) {
        Get-ChildItem -Path $Path -Filter $Filter -Recurse
    } else {
        Get-ChildItem -Path $Path -Filter $Filter
    }
}

# Create aliases for common Unix commands
Set-Alias tail Get-Tail
Set-Alias head Get-Head
Set-Alias find Get-Files

Write-Host "✅ PowerShell functions created:" -ForegroundColor Cyan
Write-Host "   - tail <file> [-Lines n]  -> equivalent to Unix 'tail -n n file'" -ForegroundColor Gray
Write-Host "   - head <file> [-Lines n]  -> equivalent to Unix 'head -n n file'" -ForegroundColor Gray
Write-Host "   - find <path> <filter> [-Recurse] -> equivalent to Unix 'find path -name filter'" -ForegroundColor Gray

Write-Host ""
Write-Host "📝 Examples:" -ForegroundColor Yellow
Write-Host "   tail package.json" -ForegroundColor White
Write-Host "   head -Lines 5 package.json" -ForegroundColor White
Write-Host "   find . *.js" -ForegroundColor White
Write-Host "   find . *.ts -Recurse" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Current working directory: $(Get-Location)" -ForegroundColor Green

# Test the functions
Write-Host ""
Write-Host "🧪 Testing functions..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    Write-Host "Testing tail function on package.json:"
    Get-Tail -File "package.json" -Lines 3
    Write-Host ""
    Write-Host "Testing head function on package.json:"
    Get-Head -File "package.json" -Lines 3
} else {
    Write-Host "⚠️  package.json not found in current directory"
}

Write-Host ""
Write-Host "✨ All functions loaded successfully!" -ForegroundColor Green
