# Deploy to Google Cloud Run

$PROJECT_ID = "gen-lang-client-0704991831"
$REGION = "us-west1"
$SERVICE_NAME = "studio-roster-api"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Starting Deployment to Cloud Run..." -ForegroundColor Green

# 1. Build Docker Image
Write-Host "Building Docker Image..." -ForegroundColor Cyan
docker build --build-arg API_KEY=AIzaSyC9o_kpmfdSivtVi-wVSWCI_XYqKItHkYI -t $IMAGE_NAME .
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
  --set-env-vars "NODE_ENV=production" `
  --set-env-vars "DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19oQkU0RFZCTzdzMFgzb2FwNEJRdXYiLCJhcGlfa2V5IjoiMDFLQkEyRTg0QURQWFFBQ1JHSlhZNE00NVIiLCJ0ZW5hbnRfaWQiOiJkMzlmZjgwYzQ0N2RkMTE5YzA3MzRkMWE5NzVjNmE4MmEwMDM1YmI2NTE2NzliMjg0Y2E5NjcwNTNjZjQ3NDhlIiwiaW50ZXJuYWxfc2VjcmV0IjoiNWJhNmMwNWMtMDQ2Ni00MTYxLTg0NDgtYmMxYTM0OTk0MGE2In0.d-q8aPR47cBHrhOGu89QqqQuUH2L7GIV6u_OVhw-eo8" `
  --set-env-vars "JWT_SECRET=super-secret-key-change-in-production" `
  --set-env-vars "API_KEY=AIzaSyC9o_kpmfdSivtVi-wVSWCI_XYqKItHkYI" `
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID" `
  --set-env-vars "FRONTEND_URL=https://studio-roster-api-893670545674.us-west1.run.app" `
  --set-env-vars "STORAGE_BUCKET=ai-studio-bucket-893670545674-us-west1"

if ($LASTEXITCODE -ne 0) { Write-Error "Deployment failed"; exit 1 }

Write-Host "Deployment Successful!" -ForegroundColor Green
