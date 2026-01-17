# Manual WSL Fix Commands - Run as Administrator

## Step 1: Open Command Prompt as Administrator
1. Press `Win + X` → Select "Windows PowerShell (Admin)" or "Command Prompt (Admin)"
2. Click "Yes" when UAC asks for permission

## Step 2: Navigate to This Directory
```cmd
cd "C:\Users\serge\OneDrive\Documents\Sergey-Avetisyan-main"
```

## Step 3: Execute These Commands (One by One):

### Enable Windows Subsystem for Linux
```cmd
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

### Enable Virtual Machine Platform
```cmd
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### Enable Windows Containers
```cmd
dism /online /enable-feature /featurename:Containers /all /norestart
```

### Enable Hyper-V (Optional)
```cmd
dism /online /enable-feature /featurename:Microsoft-Hyper-V /all /norestart
```

### Set WSL2 as Default
```cmd
wsl --set-default-version 2
```

## Step 4: Restart Your Computer
```cmd
shutdown /r /t 10
```

## Step 5: Test After Restart
Open PowerShell (normal, not admin) and run:
```powershell
wsl --status
wsl --list --verbose
```

## Expected Output After Fix:
```
Windows Subsystem for Linux is available from these features:
- Microsoft-Windows-Subsystem-Linux: Enabled
- Virtual Machine Platform: Enabled
- Windows Subsystem for Linux is installed.
```

## If Any Command Fails:
- Check if you have administrator privileges
- Make sure Windows is fully updated
- Try the alternative GUI method in WSL_FIX_COMMANDS.md
