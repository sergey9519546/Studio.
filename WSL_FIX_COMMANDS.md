# WSL Error 0x80070422 - Complete Fix Guide

## Quick Fix (Recommended)

### Option 1: Run as Administrator
1. Right-click PowerShell → "Run as Administrator"
2. Copy and paste the commands below one by one:

```powershell
# Enable WSL
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Enable Hyper-V (if needed)
dism /online /enable-feature /featurename:Microsoft-Hyper-V /all /norestart

# Enable Containers (if needed)
dism /online /enable-feature /featurename:Containers /all /norestart

# Restart required
Write-Host "REBOOT YOUR COMPUTER NOW!"
```

### Option 2: Use the Fix Script
1. Run PowerShell as Administrator
2. Navigate to this directory: `cd "C:\Users\serge\OneDrive\Documents\Sergey-Avetisyan-main"`
3. Run: `.\fix-wsl.ps1`

## Manual Windows Features Method

### Via Control Panel:
1. Open "Turn Windows features on or off"
2. Check these boxes:
   - ✅ Windows Subsystem for Linux
   - ✅ Virtual Machine Platform
   - ✅ Windows Hypervisor Platform
   - ✅ Containers (optional, for Docker)
3. Click OK and restart

### Via Settings App:
1. Windows Settings → Apps → Optional features
2. Add a feature → Search for "Windows Subsystem for Linux"
3. Install and restart

## Verify Fix

After restart, test with:
```powershell
wsl --status
wsl --list --verbose
```

## If Issues Persist

### 1. Update WSL Kernel
```powershell
wsl --update
```

### 2. Reset WSL
```powershell
wsl --shutdown
wsl --unregister Ubuntu
wsl --install
```

### 3. Check Windows Update
- Ensure Windows is fully updated
- Install latest WSL updates from Microsoft Store

## Common Causes
- Disabled Windows features
- Corrupted WSL installation
- Missing Windows updates
- Hyper-V conflicts
- Virtualization disabled in BIOS
