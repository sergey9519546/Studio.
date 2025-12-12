# WSL Error 0x80070422 Fix Script
# Run this script as Administrator in PowerShell

Write-Host "WSL Error 0x80070422 Fix Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Running as Administrator - Good!" -ForegroundColor Green

# Step 1: Enable Windows Subsystem for Linux
Write-Host "`n1. Enabling Windows Subsystem for Linux..." -ForegroundColor Yellow
try {
    dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    Write-Host "✓ WSL enabled successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to enable WSL" -ForegroundColor Red
}

# Step 2: Enable Virtual Machine Platform
Write-Host "`n2. Enabling Virtual Machine Platform..." -ForegroundColor Yellow
try {
    dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
    Write-Host "✓ Virtual Machine Platform enabled successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to enable Virtual Machine Platform" -ForegroundColor Red
}

# Step 3: Enable Hyper-V (optional but recommended)
Write-Host "`n3. Enabling Hyper-V..." -ForegroundColor Yellow
try {
    dism /online /enable-feature /featurename:Microsoft-Hyper-V /all /norestart
    Write-Host "✓ Hyper-V enabled successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠ Failed to enable Hyper-V (may not be available on all systems)" -ForegroundColor Yellow
}

# Step 4: Enable Containers (for Docker support)
Write-Host "`n4. Enabling Windows Containers..." -ForegroundColor Yellow
try {
    dism /online /enable-feature /featurename:Containers /all /norestart
    Write-Host "✓ Containers enabled successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠ Failed to enable Containers (may not be available on all systems)" -ForegroundColor Yellow
}

# Step 5: Set WSL version to 2
Write-Host "`n5. Setting WSL version to 2..." -ForegroundColor Yellow
try {
    wsl --set-default-version 2
    Write-Host "✓ WSL version set to 2" -ForegroundColor Green
} catch {
    Write-Host "⚠ Could not set WSL version (may need after reboot)" -ForegroundColor Yellow
}

Write-Host "`n================================" -ForegroundColor Green
Write-Host "FIX COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "IMPORTANT: You MUST restart your computer now!" -ForegroundColor Red
Write-Host "`nAfter restart, test with:" -ForegroundColor Cyan
Write-Host "  wsl --status" -ForegroundColor White
Write-Host "  wsl --list --verbose" -ForegroundColor White

Write-Host "`nIf you still get errors after restart:" -ForegroundColor Yellow
Write-Host "1. Run: wsl --update" -ForegroundColor White
Write-Host "2. Check Windows Updates" -ForegroundColor White
Write-Host "3. Reinstall Docker Desktop" -ForegroundColor White

Read-Host "`nPress Enter to exit"
