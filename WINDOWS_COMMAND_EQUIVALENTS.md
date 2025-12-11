# Windows Command Equivalents Guide

## Problem
Unix/Linux commands like `tail`, `head`, `grep`, etc. are not recognized on Windows systems. This guide provides Windows PowerShell equivalents for common Unix commands used in development workflows.

## Common Unix to Windows Command Equivalents

### File Operations
| Unix Command | Windows PowerShell Equivalent | Example |
|--------------|------------------------------|---------|
| `tail -n 20 file.txt` | `Get-Content file.txt -Tail 20` | `Get-Content "package.json" -Tail 10` |
| `head -n 20 file.txt` | `Get-Content file.txt -First 20` | `Get-Content "package.json" -First 5` |
| `grep "pattern" file.txt` | `Select-String "pattern" file.txt` | `Select-String "build" package.json` |
| `find . -name "*.js"` | `Get-ChildItem -Recurse -Filter "*.js"` | `Get-ChildItem -Recurse -Filter "*.ts"` |
| `ls -la` | `Get-ChildItem -Force` | `Get-ChildItem -Path . -Force` |
| `cat file.txt` | `Get-Content file.txt` | `Get-Content "README.md"` |
| `wc -l file.txt` | `(Get-Content file.txt).Count` | `(Get-Content "package.json").Count` |
| `chmod +x script.sh` | Not applicable (Windows uses different permission system) | Use PowerShell execution policies |

### Text Processing
| Unix Command | Windows PowerShell Equivalent | Example |
|--------------|------------------------------|---------|
| `sed 's/old/new/g' file.txt` | `(Get-Content file.txt) -replace 'old', 'new'` | `(Get-Content "file.txt") -replace 'dev', 'production'` |
| `awk '{print $1}' file.txt` | `Get-Content file.txt \| ForEach-Object { ($_ -split ' ')[0] }` | Complex text processing |
| `sort file.txt` | `Get-Content file.txt \| Sort-Object` | `Get-Content "list.txt" \| Sort-Object` |
| `uniq file.txt` | `Get-Content file.txt \| Sort-Object | Get-Unique` | `Get-Content "data.txt" \| Sort-Object \| Get-Unique` |

### Process and System Operations
| Unix Command | Windows PowerShell Equivalent | Example |
|--------------|------------------------------|---------|
| `ps aux` | `Get-Process` | `Get-Process \| Where-Object {$_.ProcessName -like "*node*"}` |
| `kill PID` | `Stop-Process -Id PID` | `Stop-Process -Id 1234` |
| `which command` | `Get-Command command` | `Get-Command node` |
| `df -h` | `Get-PSDrive` | `Get-PSDrive -PSProvider FileSystem` |
| `free -h` | Not directly available | Use WMI objects |

### Network Operations
| Unix Command | Windows PowerShell Equivalent | Example |
|--------------|------------------------------|---------|
| `curl http://url` | `Invoke-RestMethod http://url` | `Invoke-RestMethod "https://api.github.com"` |
| `wget http://url` | `Invoke-WebRequest http://url` | `Invoke-WebRequest "https://example.com" -OutFile "page.html"` |
| `ping host` | `Test-Connection host` | `Test-Connection "google.com"` |

### Git Operations (Cross-platform)
| Unix Command | Windows PowerShell Equivalent |
|--------------|------------------------------|
| `git rev-parse --short HEAD` | Same command works |
| `git status` | Same command works |
| `git log --oneline` | Same command works |

## Package Manager Equivalents
| Package Manager | Windows Equivalent |
|-----------------|-------------------|
| `apt-get install package` | `choco install package` (Chocolatey) or `winget install package` |
| `brew install package` | `choco install package` (Chocolatey) |
| `npm install` | Same command works |
| `yarn install` | Same command works |

## Development Workflow Examples

### Reading Log Files
```powershell
# Instead of: tail -f app.log
Get-Content "app.log" -Wait -Tail 10

# Instead of: tail -n 50 app.log | grep ERROR
Get-Content "app.log" -Tail 50 | Select-String "ERROR"
```

### Finding Files
```powershell
# Instead of: find . -name "*.ts" -type f
Get-ChildItem -Recurse -Filter "*.ts" -File

# Instead of: find . -name "*.js" -exec rm {} \;
Get-ChildItem -Recurse -Filter "*.js" -File | Remove-Item
```

### Processing Text Files
```powershell
# Instead of: grep -r "TODO" --include="*.ts" .
Get-ChildItem -Recurse -Filter "*.ts" -File | Select-String "TODO"

# Instead of: cat file.txt | sort | uniq
Get-Content "file.txt" | Sort-Object | Get-Unique
```

## Environment Variables
| Unix | Windows PowerShell |
|------|-------------------|
| `$HOME` | `$env:USERPROFILE` |
| `$PATH` | `$env:PATH` |
| `$NODE_ENV` | `$env:NODE_ENV` |
| `export VAR=value` | `$env:VAR = "value"` |

## PowerShell Tips for Developers

### Setting Up Development Environment
```powershell
# Add current directory to PATH temporarily
$env:PATH += ";$(Get-Location)"

# Set environment variables for the session
$env:NODE_ENV = "development"
$env:DATABASE_URL = "postgresql://user:pass@localhost:5432/db"

# Create aliases for common commands
Set-Alias ll Get-ChildItem
Set-Alias grep Select-String
```

### One-liners for Common Tasks
```powershell
# Count lines in all TypeScript files
Get-ChildItem -Recurse -Filter "*.ts" | ForEach-Object { (Get-Content $_.FullName).Count }

# Find and replace text in multiple files
Get-ChildItem -Recurse -Filter "*.js" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'oldText', 'newText' | Set-Content $_.FullName
}

# Check if a port is in use
Get-NetTCPConnection | Where-Object {$_.LocalPort -eq "3000"}
```

## Troubleshooting

### Common Issues and Solutions

1. **"command not found" errors**
   - Use `Get-Command command` to check if the command exists
   - Install missing tools using Chocolatey or winget
   - Use PowerShell equivalents listed above

2. **Execution Policy restrictions**
   ```powershell
   # Check current execution policy
   Get-ExecutionPolicy
   
   # Set temporary policy for current session
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```

3. **Path separator differences**
   - Windows uses `\` while Unix uses `/`
   - PowerShell cmdlets handle both automatically
   - Use `Join-Path` for cross-platform path construction

## Recommended Tools for Windows Development

1. **Windows Terminal** - Modern terminal with tabs and better UX
2. **Chocolatey** - Package manager for Windows
3. **Windows Subsystem for Linux (WSL2)** - Run Linux commands natively
4. **Git for Windows** - Includes Unix tools in Git Bash
5. **PowerShell Core** - Cross-platform PowerShell

## Project-Specific Notes

For the Studio Roster project:
- Use `deploy.ps1` instead of `deploy.sh` on Windows
- Package.json scripts work the same on both platforms
- Docker commands work the same
- Git commands work the same
- For Node.js development, most npm scripts are cross-platform compatible
