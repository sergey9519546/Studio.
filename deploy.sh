#!/bin/bash
# deploy.sh - Production deployment script for Google Cloud Run
set -euo pipefail

echo "Studio Roster - Cloud Run Deployment"
echo "===================================="

PROJECT_ID="${GCP_PROJECT_ID:?GCP_PROJECT_ID environment variable not set}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="studio-roster"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
IMAGE_URI="${IMAGE_NAME}:${IMAGE_TAG}"
STORAGE_BUCKET="${STORAGE_BUCKET:-${PROJECT_ID}.appspot.com}"

echo "Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service: $SERVICE_NAME"
echo "  Image Tag: $IMAGE_TAG"
echo "  Storage Bucket: $STORAGE_BUCKET (Firebase default if unset)"
echo ""

echo "Step 1: Building Docker image..."
docker build -t "$IMAGE_URI" .

echo "Step 2: Pushing image to GCR..."
docker push "$IMAGE_URI"

echo "Step 3: Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URI" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
  --set-env-vars "GCP_PROJECT_ID=${GCP_PROJECT_ID}" \
  --set-env-vars "GCP_LOCATION=${GCP_LOCATION:-us-central1}" \
  --set-env-vars "STORAGE_BUCKET=${STORAGE_BUCKET}" \
  --set-env-vars "GOOGLE_APPLICATION_CREDENTIALS=/app/service-account-key.json"

echo "Deployment complete!"
echo ""

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)')
echo "Service URL: $SERVICE_URL"
echo "Next steps:"
echo "  1. Visit $SERVICE_URL to verify deployment"
echo "  2. Test authentication system"
echo "  3. Monitor logs: gcloud run services logs read $SERVICE_NAME --region $REGION"
echo "  4. Set up custom domain (optional)"
