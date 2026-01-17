# WSL Error 0x80070422 - Advanced Troubleshooting Guide

## Quick Summary
Error 0x80070422 means "The service cannot be started, either because it is disabled or because it has no enabled devices associated with it."

## Immediate Actions Required

### 1. **Run the Fix Script (RECOMMENDED)**
```powershell
# Run as Administrator
.\fix-wsl.ps1
```

### 2. **Manual Commands (If script fails)**
```powershell
# Run as Administrator
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Containers /all /norestart

# Restart your computer
Restart-Computer
```

## Advanced Troubleshooting

### Check Current Status
```powershell
# Check Windows features
dism /online /get-features | findstr /i "subsystem linux virtual"

# Check WSL status
wsl --status

# Check Windows version
winver
```

### Alternative Methods

#### Method 1: Via Windows Settings
1. Settings → Apps → Optional features
2. Add a feature → Search "Windows Subsystem for Linux"
3. Install

#### Method 2: Via Programs and Features
1. Control Panel → Programs → Turn Windows features on or off
2. Check "Windows Subsystem for Linux"
3. Check "Virtual Machine Platform"
4. Restart

#### Method 3: Manual Registry Fix (Advanced Users)
```powershell
# Run as Administrator
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Optional Components\WSL" /v InstallState /t REG_DWORD /d 1 /f
```

### If Basic Fixes Don't Work

#### 1. Update WSL Kernel
```powershell
wsl --update
wsl --shutdown
```

#### 2. Reset WSL Completely
```powershell
# WARNING: This removes all distributions
wsl --shutdown
wsl --unregister Ubuntu
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data

# Reinstall
wsl --install
```

#### 3. Check Hyper-V Status
```powershell
# Check if Hyper-V is enabled
bcdedit /enum | findstr hypervisorlaunchtype

# Enable if disabled
bcdedit /set hypervisorlaunchtype auto
```

#### 4. Check Virtualization in BIOS
1. Restart computer and enter BIOS/UEFI (usually F2, F12, Del)
2. Look for "Virtualization Technology" or "VT-x"
3. Enable it
4. Save and restart

### Docker-Specific Solutions

#### 1. Reset Docker Desktop
```powershell
# Stop Docker Desktop
Stop-Process -Name "Docker Desktop" -Force

# Reset Docker
%APPDATA%\Docker\reset-docker-desktop.bat
```

#### 2. Docker Alternative - Docker Engine
```powershell
# Install Docker Engine without Desktop
winget install Docker.DockerEngine
```

### Windows Update Dependencies

#### Required Updates
- KB5039211 (Latest Cumulative Update)
- WSL2 Linux kernel update package
- Windows Subsystem for Linux optional feature

#### Check Updates
```powershell
# Force Windows Update
Get-WUInstall -AutoReboot -Install
```

### Common Error Patterns and Solutions

| Error Pattern | Solution |
|---------------|----------|
| `Service cannot be started` | Enable Windows features via DISM |
| `No enabled devices` | Check virtualization in BIOS |
| `Access denied` | Run as Administrator |
| `Feature not found` | Update Windows first |
| `WSL not installed` | Run `wsl --install` |

### Recovery Steps (If Everything Breaks)

#### 1. Fresh WSL Installation
```powershell
# Complete reset
wsl --shutdown
dism /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart
dism /online /disable-feature /featurename:VirtualMachinePlatform /norestart

# Re-enable
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart and reinstall
wsl --install
```

#### 2. System File Repair
```powershell
# Run SFC and DISM
sfc /scannow
DISM /Online /Cleanup-Image /RestoreHealth

# Restart
Restart-Computer
```

## Verification Commands

After applying any fix:
```powershell
# Test basic functionality
wsl --status
wsl --list --verbose
wsl --set-default-version 2
wsl --install -d Ubuntu

# Test Docker (if applicable)
docker --version
docker run hello-world
```

## Expected Timeline
- **Basic fix**: 5-10 minutes + restart
- **Complete reset**: 30-60 minutes
- **Fresh installation**: 1-2 hours

## Prevention
- Keep Windows updated
- Don't disable virtualization
- Regular system maintenance
- Backup WSL distributions
