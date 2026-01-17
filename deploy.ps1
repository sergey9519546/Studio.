# Deploy to Google Cloud Run


# Load secrets from .env file if it exists
if (Test-Path .env) {
    Write-Host "Loading environment variables from .env..." -ForegroundColor Gray
    foreach ($line in Get-Content .env) {
        if ($line -match '^\s*[^#]' -and $line -match '=') {
            try {
                $parts = $line -split '=', 2
                $key = $parts[0].Trim()
                $value = $parts[1].Trim().Trim('"').Trim("'")
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
                # Write-Host "Loaded $key" # Uncomment for debug
            } catch {
                Write-Warning "Failed to parse line: $line"
            }
        }
    }
}


$PROJECT_ID = $env:GCP_PROJECT_ID
if (-not $PROJECT_ID) { Write-Error "GCP_PROJECT_ID environment variable not set"; exit 1 }

$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-west1" }
$SERVICE_NAME = "studio-roster-api"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"
$gitTag = try { git rev-parse --short HEAD 2>$null } catch { $null }
$IMAGE_TAG = if ($env:IMAGE_TAG) { $env:IMAGE_TAG } elseif ($gitTag) { $gitTag } else { Get-Date -Format "yyyyMMddHHmmss" }
$IMAGE_URI = "$IMAGE_NAME`:$IMAGE_TAG"
$ragWarmup = if ($env:RAG_WARMUP) { $env:RAG_WARMUP } else { "false" }
$minInstances = if ($env:MIN_INSTANCES) { $env:MIN_INSTANCES } else { "1" }

Write-Host "Starting Deployment to Cloud Run..." -ForegroundColor Green

if (-not $env:API_KEY) { Write-Error "API_KEY environment variable not set"; exit 1 }
if (-not $env:DATABASE_URL) { Write-Error "DATABASE_URL environment variable not set"; exit 1 }
if (-not $env:JWT_SECRET) { Write-Error "JWT_SECRET environment variable not set"; exit 1 }
if (-not $env:STORAGE_BUCKET) {
    $env:STORAGE_BUCKET = "$PROJECT_ID.appspot.com" # Firebase Storage default
}

# 1. Build Docker Image
Write-Host "Building Docker Image ($IMAGE_URI)..." -ForegroundColor Cyan
docker build --build-arg API_KEY=$env:API_KEY -t $IMAGE_URI .
if ($LASTEXITCODE -ne 0) { Write-Error "Docker build failed"; exit 1 }


# 2. Run Prisma Migrations
Write-Host "Running Prisma Migrations..." -ForegroundColor Cyan
docker run --rm -e "DATABASE_URL=$env:DATABASE_URL" $IMAGE_URI npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { Write-Error "Prisma migration failed"; exit 1 }

# 3. Push to GCR

Write-Host "Pushing to Container Registry..." -ForegroundColor Cyan
docker push $IMAGE_URI
if ($LASTEXITCODE -ne 0) { Write-Error "Docker push failed"; exit 1 }

# 4. Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_URI `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 2 `
  --min-instances $minInstances `
  --set-env-vars "NODE_ENV=production,DATABASE_URL=$($env:DATABASE_URL),JWT_SECRET=$($env:JWT_SECRET),API_KEY=$($env:API_KEY),GCP_PROJECT_ID=$PROJECT_ID,FRONTEND_URL=$($env:FRONTEND_URL),STORAGE_BUCKET=$($env:STORAGE_BUCKET),RAG_WARMUP=$ragWarmup,ALLOWED_ORIGINS=$($env:ALLOWED_ORIGINS)"

if ($LASTEXITCODE -ne 0) { Write-Error "Deployment failed"; exit 1 }

Write-Host "Deployment Successful!" -ForegroundColor Green
