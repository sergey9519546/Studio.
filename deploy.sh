#!/bin/bash
# deploy.sh - Production deployment script for Google Cloud Run

# Exit on error
set -e

echo "🚀 Studio Roster - Cloud Run Deployment"
echo "======================================="

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="studio-roster"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Check required environment variables
if [ -z "$GCP_PROJECT_ID" ]; then
    echo "❌ Error: GCP_PROJECT_ID environment variable not set"
    exit 1
fi

echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service: $SERVICE_NAME"
echo ""

# Step 1: Build Docker image
echo "🔨 Step 1: Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Step 2: Push to Google Container Registry
echo "📤 Step 2: Pushing image to GCR..."
docker push $IMAGE_NAME:latest

# Step 3: Deploy to Cloud Run
echo "☁️  Step 3: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
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

echo "✅ Deployment complete!"
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "📊 Next steps:"
echo "  1. Visit $SERVICE_URL to verify deployment"
echo "  2. Test authentication system"
echo "  3. Monitor logs: gcloud run services logs read $SERVICE_NAME --region $REGION"
echo "  4. Set up custom domain (optional)"
