# Windows Command Equivalents Guide

## Common Unix Commands and Their Windows PowerShell Equivalents

### File Viewing Commands

| Unix Command | PowerShell Equivalent | Example |
|--------------|----------------------|---------|
| `head -n 10 file.txt` | `Get-Content file.txt -TotalCount 10` | `Get-Content file.txt -First 10` |
| `tail -n 10 file.txt` | `Get-Content file.txt -Tail 10` | `Get-Content file.txt -Last 10` |
| `cat file.txt` | `Get-Content file.txt` | `Get-Content file.txt` |
| `less file.txt` | `Get-Content file.txt \| Out-Host` | `Get-Content file.txt | more` |
| `wc -l file.txt` | `(Get-Content file.txt).Count` | `(Get-Content file.txt).Length` |

### Directory Operations

| Unix Command | PowerShell Equivalent | Example |
|--------------|----------------------|---------|
| `ls -la` | `Get-ChildItem -Force` | `Get-ChildItem -Path . -Recurse` |
| `pwd` | `Get-Location` | `Get-Location` |
| `cd dirname` | `Set-Location dirname` | `Set-Location C:\Users` |
| `mkdir dirname` | `New-Item -ItemType Directory -Name dirname` | `New-Item -ItemType Directory -Path .\newdir` |

### File Operations

| Unix Command | PowerShell Equivalent | Example |
|--------------|----------------------|---------|
| `cp source dest` | `Copy-Item source dest` | `Copy-Item file1.txt file2.txt` |
| `mv source dest` | `Move-Item source dest` | `Move-Item oldname.txt newname.txt` |
| `rm file` | `Remove-Item file` | `Remove-Item -Path file.txt` |
| `rm -rf dir` | `Remove-Item -Recurse -Force dir` | `Remove-Item -Path .\directory -Recurse -Force` |
| `grep pattern file` | `Select-String pattern file` | `Select-String -Path file.txt -Pattern "searchterm"` |

### Text Processing

| Unix Command | PowerShell Equivalent | Example |
|--------------|----------------------|---------|
| `sort file` | `Get-Content file \| Sort-Object` | `Get-Content file.txt \| Sort-Object` |
| `uniq file` | `Get-Content file \| Get-Unique` | `Get-Content file.txt \| Get-Unique` |
| `find . -name "*.txt"` | `Get-ChildItem -Recurse -Filter "*.txt"` | `Get-ChildItem -Path . -Filter "*.txt" -Recurse` |

## Quick Solutions for 'head' Command

### Option 1: Use Get-Content with -First parameter
```powershell
# Get first 10 lines
Get-Content file.txt -First 10

# Get first 20 lines
Get-Content file.txt -First 20
```

### Option 2: Use Get-Content with -TotalCount parameter
```powershell
# Get first 10 lines
Get-Content file.txt -TotalCount 10

# Get first 5 lines
Get-Content file.txt -TotalCount 5
```

### Option 3: Pipeline with Select-Object
```powershell
# Get first 10 lines
Get-Content file.txt | Select-Object -First 10
```

## Helper Functions

Add these functions to your PowerShell profile for Unix-like commands:

```powershell
function head {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string]$Path,
        [int]$Lines = 10
    )
    Get-Content $Path -TotalCount $Lines
}

function tail {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string]$Path,
        [int]$Lines = 10
    )
    Get-Content $Path -Tail $Lines
}

function grep {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string]$Pattern,
        [string]$Path
    )
    Select-String -Path $Path -Pattern $Pattern
}

function ls {
    param(
        [string]$Path = "."
    )
    Get-ChildItem -Path $Path
}
```

## Troubleshooting

### If commands still don't work:
1. Check PowerShell version: `$PSVersionTable.PSVersion`
2. Ensure you're in the correct directory: `Get-Location`
3. Verify file exists: `Test-Path file.txt`
4. Use full paths if needed: `Get-Content "C:\full\path\to\file.txt"`

### Common Issues:
- **File not found**: Use absolute paths or check current directory
- **Permission denied**: Run PowerShell as Administrator
- **Encoding issues**: Add `-Encoding UTF8` parameter to Get-Content
