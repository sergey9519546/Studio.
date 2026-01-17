# Unix-like Command Helpers for PowerShell
# Source this file in your PowerShell profile or run directly

# HEAD command - Get first N lines of a file
function head {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path,
        [int]$Lines = 10
    )

    try {
        if (-not (Test-Path $Path)) {
            Write-Error "File not found: $Path"
            return
        }
        Get-Content $Path -TotalCount $Lines
    }
    catch {
        Write-Error "Error reading file: $_"
    }
}

# TAIL command - Get last N lines of a file
function tail {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path,
        [int]$Lines = 10
    )

    try {
        if (-not (Test-Path $Path)) {
            Write-Error "File not found: $Path"
            return
        }
        Get-Content $Path -Tail $Lines
    }
    catch {
        Write-Error "Error reading file: $_"
    }
}

# LS command - List files and directories
function ls {
    param(
        [string]$Path = ".",
        [switch]$All,
        [switch]$Long,
        [switch]$Recursive
    )

    try {
        $params = @{
            Path = $Path
        }

        if ($All) { $params["Force"] = $true }
        if ($Recursive) { $params["Recurse"] = $true }

        if ($Long) {
            Get-ChildItem @params | Format-Table -AutoSize
        } else {
            Get-ChildItem @params
        }
    }
    catch {
        Write-Error "Error listing directory: $_"
    }
}

# GREP command - Search for patterns in files
function grep {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Pattern,
        [string]$Path = ".",
        [switch]$CaseSensitive,
        [switch]$Recursive,
        [string]$Include = "*"
    )

    try {
        $params = @{
            Pattern = $Pattern
            Path = $Path
        }

        if ($CaseSensitive) { $params["CaseSensitive"] = $true }
        if ($Recursive) { $params["Recurse"] = $true }
        if ($Include -ne "*") { $params["Include"] = $Include }

        Select-String @params
    }
    catch {
        Write-Error "Error searching files: $_"
    }
}

# FIND command - Find files and directories
function find {
    param(
        [string]$Path = ".",
        [string]$Name = "*",
        [string]$Type = "Any", # File, Directory, Any
        [switch]$Recursive
    )

    try {
        $params = @{
            Path = $Path
            Filter = $Name
        }

        if ($Recursive) { $params["Recurse"] = $true }

        $items = Get-ChildItem @params

        if ($Type -ne "Any") {
            $items = $items | Where-Object {
                if ($Type -eq "File") { $_.PSIsContainer -eq $false }
                elseif ($Type -eq "Directory") { $_.PSIsContainer -eq $true }
            }
        }

        $items
    }
    catch {
        Write-Error "Error finding files: $_"
    }
}

# CAT command - Display file contents
function cat {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path
    )

    try {
        if (-not (Test-Path $Path)) {
            Write-Error "File not found: $Path"
            return
        }
        Get-Content $Path
    }
    catch {
        Write-Error "Error reading file: $_"
    }
}

# WC command - Count lines, words, characters
function wc {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Path,
        [switch]$Lines,
        [switch]$Words,
        [switch]$Characters
    )

    try {
        if (-not (Test-Path $Path)) {
            Write-Error "File not found: $Path"
            return
        }

        $content = Get-Content $Path
        $lineCount = $content.Count
        $wordCount = ($content | ForEach-Object { ($_ -split '\s+').Count } | Measure-Object -Sum).Sum
        $charCount = ($content | ForEach-Object { $_.Length } | Measure-Object -Sum).Sum

        if ($Lines -or (-not $Words -and -not $Characters)) {
            Write-Output "$lineCount $Path"
        }
        if ($Words -or (-not $Lines -and -not $Characters)) {
            Write-Output "$wordCount $Path"
        }
        if ($Characters -or (-not $Lines -and -not $Words)) {
            Write-Output "$charCount $Path"
        }
        if (-not $Lines -and -not $Words -and -not $Characters) {
            Write-Output "$lineCount $wordCount $charCount $Path"
        }
    }
    catch {
        Write-Error "Error counting file contents: $_"
    }
}

# CD command - Change directory (enhanced)
function cd {
    param(
        [string]$Path
    )

    if (-not $Path) {
        Set-Location $env:USERPROFILE
    } else {
        try {
            Set-Location $Path
        }
        catch {
            Write-Error "Cannot change to directory: $_"
        }
    }
}

# PWD command - Print working directory
function pwd {
    Get-Location
}

# Clear command with Unix-like alias
function clear {
    Clear-Host
}

# Export functions for use in other scripts
Export-ModuleMember -Function head, tail, ls, grep, find, cat, wc, cd, pwd
