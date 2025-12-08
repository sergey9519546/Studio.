# 🚀 Studio Roster - Production Deployment Instructions

## Overview
Deploy your production-ready Studio Roster application with all connections configured.

## Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated
- Docker installed
- Firebase CLI installed
- Bash shell (Git Bash on Windows recommended)

## Quick Deployment

### Option 1: Automated Script (Recommended)
```bash
# Make executable and run
chmod +x deploy-production.sh
./deploy-production.sh
```

### Manual Docker Build
If you prefer manual control:
```bash
# Build optimized multi-stage Docker image
docker build --target runner -t studio-roster:latest .

# Build frontend separately (included in Docker build)
npm run build:client
```

### Option 2: Manual Deployment
Follow the steps in `deploy-production.sh` manually.

## Environment Configuration

### Environment Variables (Pre-configured in script)
```bash
GCP_PROJECT_ID="gen-lang-client-0704991831"          # Your GCP project
DATABASE_URL="postgres://..."                       # Prisma Cloud DB
JWT_SECRET="generated-strong-secret"                # Security token
GCP_LOCATION="us-central1"                           # Cloud region
STORAGE_BUCKET="studio-roster-assets-prod"           # File storage
```

### Service Account Key
You'll need a GCP service account key for Vertex AI access.

**To create and download:**
1. Go to [GCP Console](https://console.cloud.google.com/)
2. IAM & Admin → Service Accounts
3. Create service account: `studio-ai-service@[project-id].iam.gserviceaccount.com`
4. Grant role: `Vertex AI User` (roles/aiplatform.user)
5. Create JSON key and save as `service-account-key.json` in project root

## Post-Deployment Verification

### URLs to Check
- **Frontend**: https://studio-roster.com
- **API Health**: `curl https://[service-url]/v1/health`

### Features to Test
- [ ] Direct entry (click "Enter" → dashboard loads immediately)
- [ ] Moodboard functionality (Unsplash integration)
- [ ] AI features (Vertex AI/Palm API)
- [ ] Database connectivity
- [ ] File uploads to Cloud Storage

### Monitoring Commands
```bash
# View logs
gcloud run services logs read studio-roster --region us-central1

# Check service status
gcloud run services describe studio-roster --region us-central1

# View metrics in GCP Console
# Cloud Run → studio-roster → Metrics tab
```

## Security Features Enabled
- JWT authentication (bypassed for direct entry)
- HTTPS only (SSL/TLS)
- CORS limited to production domains
- Content Security Policy (CSP)
- Helmet security headers

## Production Architecture
```
Frontend (React + Vite)
    ↓ serves from
Firebase Hosting
    ↓ proxies API calls to
Backend (NestJS + Prisma)
    ↓ runs on
Google Cloud Run
    ↓ connects to
PostgreSQL (Prisma Cloud)
    ↓ uses AI from
Vertex AI + Gemini
    ↓ stores files in
Cloud Storage
    ↓ integrates with
Unsplash API
```

## Troubleshooting

### Common Issues

**Container fails to start**
```bash
# Check logs
gcloud run services logs read studio-roster --region us-central1

# Common causes:
# - Missing service account key
# - Database connection timeout
# - Invalid environment variables
```

**502 Bad Gateway**
```bash
# Increase timeout
gcloud run services update studio-roster --timeout 600
```

**Database connection issues**
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure SSL mode=require for Prisma Cloud

## Rollback Plan
If issues occur:
```bash
# List previous revisions
gcloud run revisions list --service studio-roster

# Rollback to previous
gcloud run services update-traffic studio-roster \
  --to-revisions [PREVIOUS_REVISION]=100
```

## Cost Optimization
- Scale-to-zero enabled (no costs when idle)
- 2GB RAM, 2 CPU cores (optimized for performance)
- Monitor usage in GCP Billing dashboard

---

**Deployment Date**: [Date]
**Environment**: Production
**Frontend URL**: https://studio-roster.com
**API URL**: [Cloud Run service URL]
**Admin Access**: Direct entry (no authentication required)
