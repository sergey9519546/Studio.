# Deploy to Google Cloud Run

$PROJECT_ID = $env:GCP_PROJECT_ID
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-west1" }
$SERVICE_NAME = "studio-roster-api"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Starting Deployment to Cloud Run..." -ForegroundColor Green

if (-not $PROJECT_ID) { $PROJECT_ID = "gen-lang-client-0704991831" }
if (-not $env:API_KEY) { $env:API_KEY = "dummy-key-for-build" } # Build arg only
if (-not $env:DATABASE_URL) { Write-Error "DATABASE_URL environment variable not set"; exit 1 }
if (-not $env:JWT_SECRET) { Write-Error "JWT_SECRET environment variable not set"; exit 1 }
if (-not $env:STORAGE_BUCKET) { $env:STORAGE_BUCKET = "$PROJECT_ID-assets" }

# 1. Build Docker Image
Write-Host "Building Docker Image..." -ForegroundColor Cyan
docker build --no-cache --build-arg API_KEY=$env:API_KEY -t $IMAGE_NAME .
if ($LASTEXITCODE -ne 0) { Write-Error "Docker build failed"; exit 1 }

# 2. Push to GCR
Write-Host "Pushing to Container Registry..." -ForegroundColor Cyan
docker push $IMAGE_NAME
if ($LASTEXITCODE -ne 0) { Write-Error "Docker push failed"; exit 1 }

# 3. Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_NAME `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 1Gi `
  --set-env-vars "PORT=8080" `
  --set-env-vars "NODE_ENV=production" `
  --set-env-vars "DATABASE_URL=$($env:DATABASE_URL)" `
  --set-env-vars "JWT_SECRET=$($env:JWT_SECRET)" `
  --set-env-vars "API_KEY=$($env:API_KEY)" `
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID" `
  --set-env-vars "FRONTEND_URL=$($env:FRONTEND_URL)" `
  --set-env-vars "STORAGE_BUCKET=$($env:STORAGE_BUCKET)" `
  --set-env-vars "RAG_WARMUP=false"

if ($LASTEXITCODE -ne 0) { Write-Error "Deployment failed"; exit 1 }

Write-Host "Deployment Successful!" -ForegroundColor Green
