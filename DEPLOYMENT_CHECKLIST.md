# 🚀 Studio Roster - Production Deployment Checklist

## ✅ Pre-Deployment Security Checklist

### Critical Security Items
- [ ] **JWT_SECRET** - Generate with `openssl rand -base64 32`
- [ ] **ADMIN_PASSWORD** - Set strong password (min 16 chars)
- [ ] **Database credentials** - Production PostgreSQL connection
- [ ] **GCP Service Account** - Download and secure key file
- [ ] **.env file** - NEVER commit to repository
- [ ] **service-account-key.json** - NEVER commit to repository
- [ ] **Remove all hardcoded secrets** - Verify no secrets in code

### Environment Variables Required
```bash
# Copy .env.example to .env and fill in:
DATABASE_URL="postgresql://user:password@host:5432/studio_roster"
GCP_PROJECT_ID="your-project-id"
GCP_LOCATION="us-central1"
STORAGE_BUCKET="your-bucket-name"
JWT_SECRET="<generate-with-openssl-rand-base64-32>"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="<strong-password>"
API_KEY="<your-gemini-api-key>"
```

### Google Cloud Platform Setup
- [ ] Enable Vertex AI API
- [ ] Create service account with `roles/aiplatform.user`
- [ ] Download service account JSON key
- [ ] Create Cloud Storage bucket
- [ ] Set up Cloud SQL (PostgreSQL) or use external DB
- [ ] Configure VPC if needed

---

## 📦 Build & Test Checklist

### Local Testing
- [ ] Run `npm install --legacy-peer-deps`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run build:api` - Should complete without errors
- [ ] Run `npm run dev` - Application starts successfully
- [ ] Test login with admin credentials
- [ ] Create a test project
- [ ] Test RAG system (if configured)
- [ ] Verify all API endpoints return 200 or expected codes

### Docker Build Test
- [ ] Run `docker build -t studio-roster .`
- [ ] Build completes without errors
- [ ] Image size is reasonable (< 1GB)
- [ ] Test container locally: `docker run -p 3001:3001 --env-file .env studio-roster`

---

## 🚢 Cloud Run Deployment Checklist

### Pre-Deployment
- [ ] Set up production database (Cloud SQL or external)
- [ ] Run database migrations
- [ ] Upload service account key to Secret Manager (recommended)
- [ ] Test database connectivity from Cloud Run
- [ ] Set up Cloud Storage bucket permissions

### Deployment Steps
1. **Authenticate with GCP**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Build and Push Docker Image**
   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/studio-roster .
   docker push gcr.io/YOUR_PROJECT_ID/studio-roster
   ```

3. **Deploy to Cloud Run**
   ```bash
   # Use deploy.sh script OR:
   gcloud run deploy studio-roster \
     --image gcr.io/YOUR_PROJECT_ID/studio-roster \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 2Gi \
     --cpu 2 \
     --set-env-vars="NODE_ENV=production,DATABASE_URL=...,JWT_SECRET=...,GCP_PROJECT_ID=...,GCP_LOCATION=us-central1,STORAGE_BUCKET=..."
   ```

4. **Verify Deployment**
   - [ ] Service is running
   - [ ] Health check endpoint responds
   - [ ] Can login successfully
   - [ ] API endpoints are accessible
   - [ ] Static files are served correctly

---

## 🔒 Post-Deployment Security

### Immediate Actions
- [ ] Test authentication flow
- [ ] Verify JWT tokens expire correctly
- [ ] Test rate limiting (100 req/60sec)
- [ ] Check CORS configuration
- [ ] Test error handling
- [ ] Verify no sensitive data in logs

### Access Control
- [ ] Set up Cloud Run authentication (if needed)
- [ ] Configure IAM roles properly
- [ ] Restrict service account permissions
- [ ] Set up VPC connectors (if using Cloud SQL)
- [ ] Configure Cloud Armor (optional DDoS protection)

### Monitoring Setup
- [ ] Enable Cloud Logging
- [ ] Set up error alerting
- [ ] Monitor memory and CPU usage
- [ ] Set up uptime checks
- [ ] Configure log retention policies

---

## 📊 Production Validation

### Functional Testing
- [ ] User registration works
- [ ] Login/logout works
- [ ] Projects CRUD operations
- [ ] Freelancers CRUD operations
- [ ] Assignments CRUD operations
- [ ] File uploads to Cloud Storage
- [ ] Moodboard functionality
- [ ] Script writer functionality
- [ ] RAG system (if enabled)
- [ ] AI features work correctly

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Handles concurrent users

### Security Testing
- [ ] No exposed secrets in client code
- [ ] HTTPS only
- [ ] Secure headers set
- [ ] XSS protection enabled
- [ ] CSRF protection (if needed)
- [ ] SQL injection protected (Prisma handles this)
- [ ] Authentication bypass attempts fail

---

## 🔧 Troubleshooting Common Issues

### Issue: Container won't start
**Check:**
- Environment variables are set correctly
- Database is accessible
- Prisma migrations ran successfully
- Logs for detailed error messages

### Issue: 502 Bad Gateway
**Solution:**
- Increase startup timeout
- Check application binds to correct port (3001)
- Verify health endpoint works

### Issue: Database connection timeout
**Solution:**
- Use Cloud SQL Proxy if using Cloud SQL
- Check VPC connector configuration
- Verify DATABASE_URL is correct
- Test connection string locally first

### Issue: Vertex AI Permission Denied
**Solution:**
- Verify service account has `roles/aiplatform.user`
- Check GOOGLE_APPLICATION_CREDENTIALS path
- Ensure Vertex AI API is enabled

---

## 📝 Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor application health
- [ ] Review unusual activity

### Weekly
- [ ] Review security alerts
- [ ] Check for dependency updates
- [ ] Monitor costs
- [ ] Review performance metrics

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Database backup verification
- [ ] Security audit
- [ ] Update documentation

---

## 🆘 Rollback Plan

If deployment fails or critical issues arise:

```bash
# List revisions
gcloud run revisions list --service studio-roster

# Rollback to previous
gcloud run services update-traffic studio-roster \
  --to-revisions PREVIOUS_REVISION=100

# Or redeploy last known good image
gcloud run deploy studio-roster \
  --image gcr.io/YOUR_PROJECT_ID/studio-roster:PREVIOUS_TAG
```

---

## ✅ Sign-Off Checklist

Before considering deployment complete:

- [ ] All security items addressed
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Application tested in production
- [ ] Monitoring and alerts configured
- [ ] Team has admin access
- [ ] Documentation updated
- [ ] Rollback plan tested
- [ ] Backup strategy in place
- [ ] Support contacts documented

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Production URL:** _____________

**Incidents:** _____________
