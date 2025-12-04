# setup-local.ps1 - Local development setup script for Windows

Write-Host "🔧 Studio Roster - Local Development Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    # Generate JWT secret (Windows compatible)
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    $JWT_SECRET = [System.Convert]::ToBase64String($bytes)
    
    Write-Host "🔑 Generated JWT_SECRET" -ForegroundColor Green
    
    # Update .env file
    $envContent = Get-Content .env
    $envContent = $envContent -replace 'JWT_SECRET=.*', "JWT_SECRET=`"$JWT_SECRET`""
    $envContent | Set-Content .env
    
    Write-Host "✅ .env file created with generated secrets" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Important: Update the following in .env:" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL (PostgreSQL connection string)"
    Write-Host "  - GCP_PROJECT_ID (your Google Cloud project)"
    Write-Host "  - STORAGE_BUCKET (your GCS bucket name)"
    Write-Host "  - ADMIN_PASSWORD (change from default)"
    Write-Host ""
}
else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Generate Prisma client
Write-Host "🔨 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Apply database migrations
Write-Host "📊 Applying database migrations..." -ForegroundColor Blue
npx prisma migrate dev

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review and update .env file with PostgreSQL connection"
Write-Host "  2. Start development server: npm run dev"
Write-Host "  3. Visit http://localhost:5173"
Write-Host "  4. Default admin login: admin@studio.com (check ADMIN_PASSWORD in .env)"
Write-Host ""
