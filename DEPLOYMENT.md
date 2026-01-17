# Studio Roster - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites

- Docker installed
- Google Cloud SDK (`gcloud`) installed and authenticated
- PostgreSQL database (or Cloud SQL)
- GCP service account with Vertex AI permissions

### Environment Variables Required

Create a `.env.production` file with:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/studio_roster"

# Google Cloud Platform
GCP_PROJECT_ID="your-gcp-project-id"
GCP_LOCATION="us-central1"
STORAGE_BUCKET="your-gcp-project-id.appspot.com" # Firebase Storage default bucket (optional if GCP_PROJECT_ID set)
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
# Or provide inline JSON if injecting via Secret Manager / CI:
# GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"your-gcp-project-id","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com"}'
# (Alias also supported: GCP_CREDENTIALS)

# Authentication
JWT_SECRET="generate-with: openssl rand -base64 32"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-password-here"

# Application
NODE_ENV="production"
PORT="3001"
```

---

## 📦 Deployment Steps

### Option 1: Google Cloud Run (Recommended)

1. **Set environment variables:**

   ```bash
   export GCP_PROJECT_ID="your-project-id"
   export DATABASE_URL="your-database-url"
   export JWT_SECRET="your-jwt-secret"
    export STORAGE_BUCKET="${GCP_PROJECT_ID}.appspot.com" # Firebase Storage bucket (falls back to default if unset)
    # Use either a mounted key file or inline JSON (Secret Manager)
    export GOOGLE_APPLICATION_CREDENTIALS="/app/service-account-key.json"
    # export GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"your-project-id","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"service-account@your-project.iam.gserviceaccount.com"}'
   ```

   - `STORAGE_BUCKET` must point to an existing GCS bucket with write access.
   - For Firebase Storage, the default bucket is `${GCP_PROJECT_ID}.appspot.com`; ensure the service account has `roles/storage.admin` or `roles/storage.objectAdmin`.
   - Prefer storing credentials in Secret Manager and expose them as `GOOGLE_APPLICATION_CREDENTIALS_JSON` or mount the key file to `/app/service-account-key.json`.

2. **Run deployment script:**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Or deploy manually:**

   ```bash
   # Build and push
   docker build -t gcr.io/$GCP_PROJECT_ID/studio-roster .
   docker push gcr.io/$GCP_PROJECT_ID/studio-roster

   # Deploy
   gcloud run deploy studio-roster \
     --image gcr.io/$GCP_PROJECT_ID/studio-roster \
     --platform managed \
     --region us-central1 \
     --memory 2Gi \
     --cpu 2 \
     --allow-unauthenticated
   ```

### Option 2: Docker Compose (Development/Staging)

```bash
docker-compose up -d
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Generate strong JWT secret (`openssl rand -base64 32`)
- [ ] Set secure `ADMIN_PASSWORD` in environment
- [ ] Enable HTTPS only (Cloud Run does this automatically)
- [ ] Review CORS settings in `main.ts`
- [ ] Ensure database uses SSL connections
- [ ] Store service account key securely (Secret Manager)
- [ ] Enable Cloud Run authentication if needed
- [ ] Set up VPC connector for database access (if using Cloud SQL)
- [ ] Configure custom domain with SSL
- [ ] Enable Cloud Armor for DDoS protection (optional)

---

## 🔍 Health Checks

The application includes a health endpoint:

```bash
curl https://your-app.run.app/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-01T10:00:00.000Z",
  "uptime": 12345
}
```

---

## 📊 Monitoring

### View Logs

```bash
# Cloud Run logs
gcloud run services logs read studio-roster --region us-central1

# Follow logs
gcloud run services logs tail studio-roster --region us-central1
```

### Metrics

- CPU usage
- Memory usage
- Request latency
- Error rate

Access via Google Cloud Console → Cloud Run → studio-roster → Metrics

---

## 🐛 Troubleshooting

### Issue: Container fails to start

**Check logs:**

```bash
gcloud run services logs read studio-roster --limit 50
```

**Common causes:**

- Missing environment variables
- Database connection failure
- Prisma migration issues

**Solution:**

```bash
# Verify all env vars are set
gcloud run services describe studio-roster --format export

# Update environment variables
gcloud run services update studio-roster \
  --set-env-vars "DATABASE_URL=new-value"
```

### Issue: 502 Bad Gateway

**Cause:** Application taking too long to start

**Solution:** Increase startup timeout:

```bash
gcloud run services update studio-roster --timeout 300
```

### Issue: Out of Memory

**Solution:** Increase memory allocation:

```bash
gcloud run services update studio-roster --memory 4Gi
```

---

## 🔄 Rolling Back

If issues occur, roll back to previous revision:

```bash
# List revisions
gcloud run revisions list --service studio-roster

# Roll back
gcloud run services update-traffic studio-roster \
  --to-revisions REVISION_NAME=100
```

---

## 📈 Scaling Configuration

Auto-scaling is configured in `deploy.sh`:

- **Min instances:** 0 (scale to zero)
- **Max instances:** 10
- **Concurrency:** 80 requests per instance

Adjust based on load:

```bash
gcloud run services update studio-roster \
  --min-instances 1 \
  --max-instances 50 \
  --concurrency 100
```

---

## 💰 Cost Optimization

- Use scale-to-zero for dev/staging
- Set min-instances=1 for production (avoid cold starts)
- Monitor request patterns
- Use Cloud CDN for static assets
- Implement caching for API responses

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Vertex AI Setup](https://cloud.google.com/vertex-ai/docs)
- [Cloud SQL Guide](https://cloud.google.com/sql/docs)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)

---

## 🆘 Support

For issues or questions:

1. Check logs first
2. Review environment variables
3. Test database connectivity
4. Verify Vertex AI permissions
5. Check service account key validity

**Emergency rollback:**

```bash
./rollback.sh PREVIOUS_REVISION_ID
```
