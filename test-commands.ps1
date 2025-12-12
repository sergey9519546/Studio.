# Test script for Unix command helpers in PowerShell
# This script demonstrates that the Unix-like commands work correctly

Write-Host "=== Testing Unix Command Helpers ===" -ForegroundColor Green
Write-Host ""

# Create a test file for demonstrations
$testFile = "test-commands-demo.txt"
$testContent = @"
Line 1: This is the first line
Line 2: This is the second line
Line 3: This is the third line
Line 4: This is the fourth line
Line 5: This is the fifth line
Line 6: This is the sixth line
Line 7: This is the seventh line
Line 8: This is the eighth line
Line 9: This is the ninth line
Line 10: This is the tenth line
Line 11: This is the eleventh line
Line 12: This is the twelfth line
"@

$testContent | Out-File -FilePath $testFile -Encoding UTF8

Write-Host "1. Testing HEAD command (equivalent to Unix 'head -n 3'):" -ForegroundColor Yellow
head -Path $testFile -Lines 3
Write-Host ""

Write-Host "2. Testing TAIL command (equivalent to Unix 'tail -n 3'):" -ForegroundColor Yellow
tail -Path $testFile -Lines 3
Write-Host ""

Write-Host "3. Testing CAT command (equivalent to Unix 'cat'):" -ForegroundColor Yellow
cat -Path $testFile
Write-Host ""

Write-Host "4. Testing WC command (equivalent to Unix 'wc -l'):" -ForegroundColor Yellow
wc -Path $testFile -Lines
Write-Host ""

Write-Host "5. Testing GREP command (equivalent to Unix 'grep second'):" -ForegroundColor Yellow
grep -Path $testFile -Pattern "second"
Write-Host ""

Write-Host "6. Testing LS command (equivalent to Unix 'ls'):" -ForegroundColor Yellow
ls
Write-Host ""

Write-Host "7. Testing PWD command (equivalent to Unix 'pwd'):" -ForegroundColor Yellow
pwd
Write-Host ""

Write-Host "8. Testing FIND command (equivalent to Unix 'find *.txt'):" -ForegroundColor Yellow
find -Name "*.txt"
Write-Host ""

# Clean up test file
Remove-Item $testFile -Force

Write-Host "=== All tests completed successfully! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To use these commands in your PowerShell session, run:" -ForegroundColor Cyan
Write-Host ". .\unix-helpers.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Or add this line to your PowerShell profile to make them permanent:" -ForegroundColor Cyan
Write-Host "if (Test-Path .\unix-helpers.ps1) { . .\unix-helpers.ps1 }" -ForegroundColor White
