# 🔒 Security Best Practices for Studio Roster

## Environment Security

### 1. Secret Management
**NEVER commit these files to version control:**
- `.env` files
- `service-account-key.json`
- Any file with credentials or API keys
- Private keys (`.pem`, `.key` files)

**Use .gitignore:** Ensure `.gitignore` includes:
```
.env*
service-account-key.json
*.pem
*.key
```

### 2. Strong Secrets
Generate strong secrets:
```bash
# JWT Secret (32 bytes)
openssl rand -base64 32

# Admin Password (use password generator)
# Minimum 16 characters, mix of upper/lower/numbers/symbols
```

### 3. Environment Variables
**Required for production:**
- `DATABASE_URL` - Use strong credentials, SSL mode
- `JWT_SECRET` - Rotate periodically (every 90 days)
- `ADMIN_PASSWORD` - Strong, unique password
- `GCP_PROJECT_ID` - Your GCP project
- `STORAGE_BUCKET` - Dedicated production bucket

---

## Application Security

### 1. Authentication
- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT tokens with 60-minute expiration
- ✅ Auth guards on all protected routes
- ⚠️ Consider: Refresh tokens for longer sessions
- ⚠️ Consider: 2FA for admin accounts

### 2. API Security
- ✅ Rate limiting: 100 requests/60 seconds
- ✅ Input validation with class-validator
- ✅ CORS configuration
- ⚠️ Consider: API key authentication for external access
- ⚠️ Consider: Request signing for sensitive operations

### 3. Database Security
- ✅ Prisma ORM prevents SQL injection
- ✅ Parameterized queries
- ⚠️ Use SSL connections in production (`?sslmode=require`)
- ⚠️ Principle of least privilege for DB user
- ⚠️ Regular backupsAutomated backups

### 4. Cloud Storage Security
- ✅ Signed URLs for download
- ⚠️ Set object ACLs properly
- ⚠️ Enable versioning
- ⚠️ Set up lifecycle policies

---

## Infrastructure Security

### 1. Cloud Run
- ✅ Non-root user in Docker container
- ✅ Health checks configured
- ✅ Minimal base image
- ⚠️ Enable authentication if not public
- ⚠️ Use VPC connector for private resources
- ⚠️ Set up Cloud Armor for DDoS protection

### 2. Service Account
**Principle of Least Privilege:**
```bash
# Only grant necessary permissions
roles/aiplatform.user            # For Vertex AI
roles/storage.objectAdmin         # For Cloud Storage (if needed)
roles/cloudsql.client            # For Cloud SQL (if needed)

# DO NOT use roles/owner or roles/editor
```

### 3. Secret Manager (Recommended)
Instead of environment variables, use Secret Manager:
```bash
# Create secret
gcloud secrets create jwt-secret --data-file=-
echo "your-secret-value" | gcloud secrets create jwt-secret --data-file=-

# Grant access to service account
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:YOUR_SA@PROJECT.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update code to read from Secret Manager
```

---

## Monitoring & Incident Response

### 1. Logging
- ✅ Structured logging enabled
- ⚠️ Set log retention policies
- ⚠️ Monitor for suspicious patterns:
  - Failed login attempts
  - Unusual traffic patterns
  - Error rate spikes

### 2. Alerting
Set up alerts for:
- High error rates (> 5%)
- Memory/CPU usage (> 80%)
- Unusual API calls
- Failed authentication attempts

### 3. Incident Response Plan
1. **Detect**: Monitor dashboards and alerts
2. **Respond**: Rollback if needed
3. **Investigate**: Check logs, identify root cause
4. **Fix**: Deploy patch
5. **Review**: Post-mortem and prevention

---

## Compliance & Privacy

### 1. Data Protection
- User data encrypted at rest (Cloud SQL default)
- User data encrypted in transit (HTTPS)
- ⚠️ Implement data retention policies
- ⚠️ Handle data deletion requests (GDPR)

### 2. Audit Trail
- ⚠️ Log all sensitive operations
- ⚠️ Track who accessed what data
- ⚠️ Retain logs per compliance requirements

---

## Regular Security Tasks

### Weekly
- [ ] Review error logs for security issues
- [ ] Check failed authentication attempts
- [ ] Monitor unusual traffic patterns

### Monthly
- [ ] Update dependencies (`npm audit fix`)
- [ ] Review IAM permissions
- [ ] Check for security advisories
- [ ] Test backup restoration

### Quarterly
- [ ] Rotate JWT_SECRET
- [ ] Rotate database credentials
- [ ] Security audit
- [ ] Penetration testing (if applicable)
- [ ] Review and update security policies

---

## Security Checklist for Public Deployment

Before making the repository public or deploying:

- [ ] All secrets removed from code
- [ ] `.env.example` has placeholders only
- [ ] `.gitignore` includes all sensitive files
- [ ] No hardcoded credentials
- [ ] No API keys in client code
- [ ] No commented-out secrets
- [ ] Service account key not in repository
- [ ] Database credentials not in code
- [ ] All TODO comments for security addressed
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Dependency vulnerabilities addressed

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GCP Security Best Practices](https://cloud.google.com/security/best-practices)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
