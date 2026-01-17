# How to Run the WSL Fix Script

## Method 1: Right-Click Method (Easiest)
1. Find the file `fix-wsl.bat` in this directory
2. Right-click on `fix-wsl.bat`
3. Select **"Run as administrator"**
4. Click **"Yes"** when Windows asks for permission

## Method 2: PowerShell Method
1. Open PowerShell (Start menu → type "PowerShell")
2. Right-click PowerShell → **"Run as administrator"**
3. Navigate to this directory:
   ```powershell
   cd "C:\Users\serge\OneDrive\Documents\Sergey-Avetisyan-main"
   ```
4. Run the script:
   ```powershell
   .\fix-wsl.bat
   ```

## Method 3: Command Prompt Method
1. Open Command Prompt (Start menu → type "cmd")
2. Right-click Command Prompt → **"Run as administrator"**
3. Navigate to this directory:
   ```cmd
   cd "C:\Users\serge\OneDrive\Documents\Sergey-Avetisyan-main"
   ```
4. Run the script:
   ```cmd
   fix-wsl.bat
   ```

## What Happens Next:
- The script will enable WSL, Virtual Machine Platform, and Containers
- You'll see green checkmarks for successful operations
- **IMPORTANT:** The script will prompt you to restart your computer
- After restart, test with: `wsl --status`

## If You Get Permission Errors:
- Make sure you're logged in as an Administrator
- Windows UAC (User Account Control) might be blocking - click "Yes" to allow
- If script still fails, use the manual commands in `WSL_FIX_COMMANDS.md`
