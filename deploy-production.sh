#!/bin/bash
# Production Deployment Script for Studio Roster
# Run this script to deploy to production with all connections

set -euo pipefail

echo "🚀 Studio Roster - Production Deployment"
echo "========================================"

# Environment Variables - Update these with your actual values
export GCP_PROJECT_ID="gen-lang-client-0704991831"
export DATABASE_URL="postgres://d39ff80c447dd119c0734d1a975c6a82a0035bb651679b284ca967053cf4748e:sk_x5ixVg3byJuf64tCMX3OU@db.prisma.io:5432/postgres?sslmode=require"
export JWT_SECRET="w8KJ3qF7mN2pR6tY9vC4xH8jL1bD5gE0sI3kM7wO8uP9aQ2zF4yH6jT8vB5nG"
export GCP_LOCATION="us-central1"
export STORAGE_BUCKET="studio-roster-assets-prod"

echo "Environment setup complete:"
echo "  Project: $GCP_PROJECT_ID"
echo "  Region: $GCP_LOCATION"
echo ""

# Authenticate with GCP
echo "Step 1: Authenticating with GCP..."
gcloud auth login
gcloud config set project $GCP_PROJECT_ID

# Build Frontend
echo "Step 2: Building frontend..."
npm install --legacy-peer-deps
npm run build:client

# Get commit hash for tagging
IMAGE_TAG=$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)
IMAGE_URI="gcr.io/${GCP_PROJECT_ID}/studio-roster:${IMAGE_TAG}"

echo "Step 3: Building Docker image (${IMAGE_URI})..."
docker build -t "$IMAGE_URI" .

echo "Step 4: Pushing image to GCR..."
docker push "$IMAGE_URI"

echo "Step 5: Deploying backend to Cloud Run..."
gcloud run deploy studio-roster \
  --image "$IMAGE_URI" \
  --platform managed \
  --region $GCP_LOCATION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
  --set-env-vars "GCP_PROJECT_ID=${GCP_PROJECT_ID}" \
  --set-env-vars "GCP_LOCATION=${GCP_LOCATION}" \
  --set-env-vars "STORAGE_BUCKET=${STORAGE_BUCKET}" \
  --set-env-vars "PORT=8080"

echo "Step 6: Deploying frontend to Firebase..."
firebase deploy --project $GCP_PROJECT_ID --only hosting

# Get service URLs
echo "Step 7: Getting deployment URLs..."
SERVICE_URL=$(gcloud run services describe studio-roster --region $GCP_LOCATION --format 'value(status.url)')

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Frontend: https://studio-roster.com"
echo "Backend API: $SERVICE_URL"
echo ""
echo "Next steps:"
echo "  1. Verify frontend loads: https://studio-roster.com"
echo "  2. Test API health: curl $SERVICE_URL/v1/health"
echo "  3. Test direct entry (no login required)"
echo "  4. Check logs: gcloud run services logs read studio-roster --region $GCP_LOCATION"
echo ""
echo "Production features enabled:"
echo "  ✅ Direct entry (no authentication)"
echo "  ✅ AI features (Vertex AI)"
echo "  ✅ Moodboard integration (Unsplash)"
echo "  ✅ Database connectivity"
echo "  ✅ Cloud storage"
echo ""
