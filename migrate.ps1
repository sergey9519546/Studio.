# Run Prisma Migrations on Cloud Run
# This script runs a one-off job to apply migrations

$PROJECT_ID = $env:GCP_PROJECT_ID
if (-not $PROJECT_ID) { $PROJECT_ID = "gen-lang-client-0704991831" }

$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-west1" }
$SERVICE_NAME = "studio-roster-api"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"
if (-not $env:DATABASE_URL) { Write-Error "DATABASE_URL environment variable not set"; exit 1 }

Write-Host "Running Database Migrations..." -ForegroundColor Cyan

# Run migration as a job
gcloud run jobs create migrate-db `
    --image $IMAGE_NAME `
    --region $REGION `
    --set-env-vars "DATABASE_URL=$($env:DATABASE_URL),RAG_WARMUP=false" `
    --command "/app/node_modules/.bin/prisma" `
    --args "migrate,deploy" `
    --execute-now `
    --wait

if ($LASTEXITCODE -ne 0) { 
    Write-Warning "Job creation failed (might already exist). Trying to update and execute..."
    gcloud run jobs update migrate-db `
        --image $IMAGE_NAME `
        --region $REGION `
        --set-env-vars "DATABASE_URL=$($env:DATABASE_URL),RAG_WARMUP=false" `
        --command "/app/node_modules/.bin/prisma" `
        --args "migrate,deploy"
    
    gcloud run jobs execute migrate-db --region $REGION --wait
}

Write-Host "Migration Job Completed!" -ForegroundColor Green
