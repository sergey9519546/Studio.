@echo off
echo WSL Error 0x80070422 Fix Script
echo ================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo Running as Administrator - Good!
echo.

echo 1. Enabling Windows Subsystem for Linux...
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
if %errorlevel% equ 0 (
    echo   ✓ WSL enabled successfully
) else (
    echo   ✗ Failed to enable WSL
)

echo.
echo 2. Enabling Virtual Machine Platform...
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
if %errorlevel% equ 0 (
    echo   ✓ Virtual Machine Platform enabled successfully
) else (
    echo   ✗ Failed to enable Virtual Machine Platform
)

echo.
echo 3. Enabling Windows Containers...
dism /online /enable-feature /featurename:Containers /all /norestart
if %errorlevel% equ 0 (
    echo   ✓ Containers enabled successfully
) else (
    echo   ⚠ Failed to enable Containers (may not be available on all systems)
)

echo.
echo 4. Setting WSL version to 2...
wsl --set-default-version 2
if %errorlevel% equ 0 (
    echo   ✓ WSL version set to 2
) else (
    echo   ⚠ Could not set WSL version (may need after reboot)
)

echo.
echo ================================
echo FIX COMPLETE!
echo ================================
echo IMPORTANT: You MUST restart your computer now!
echo.
echo After restart, test with:
echo   wsl --status
echo   wsl --list --verbose
echo.
echo If you still get errors after restart:
echo 1. Run: wsl --update
echo 2. Check Windows Updates
echo 3. Reinstall Docker Desktop
echo.
pause
