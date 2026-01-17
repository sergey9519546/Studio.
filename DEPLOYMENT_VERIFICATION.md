# 🎯 Studio Roster - Deployment Verification Guide

## ✅ Deployment Verification Checklist

### 1. Frontend Verification
```bash
# Test frontend connectivity
curl -I https://studio-roster.com
# Expected: HTTP/2 200

# Test frontend functionality
open https://studio-roster.com
```

**Manual Checks:**
- [ ] Application loads without errors
- [ ] Direct entry button works (click "Enter" → dashboard loads)
- [ ] All UI components render correctly
- [ ] No console errors in browser developer tools

### 2. API Health Check
```bash
# Test API health endpoint
curl https://[your-service-url]/v1/health
# Expected: {"status":"ok","timestamp":"2025-12-10T02:16:00.000Z"}

# Test API connectivity from frontend
curl -H "Origin: https://studio-roster.com" https://[your-service-url]/v1/health
```

### 3. Database Connectivity
```bash
# Test database connection
npx prisma generate
npx prisma db push

# Test database query
npx prisma studio
```

### 4. Cloud Storage
```bash
# Test file upload functionality
curl -X POST -F "file=@test-file.txt" https://[your-service-url]/v1/upload
```

### 5. AI Features
```bash
# Test AI endpoint
curl -X POST https://[your-service-url]/v1/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test prompt"}'
```

### 6. Authentication
```bash
# Test JWT generation
curl -X POST https://[your-service-url]/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test protected route
curl -H "Authorization: Bearer [JWT_TOKEN]" https://[your-service-url]/v1/protected
```

## 📊 Monitoring and Logging

### Cloud Run Logs
```bash
# View recent logs
gcloud run services logs read studio-roster --region us-central1 --limit 50

# Stream logs in real-time
gcloud run services logs read studio-roster --region us-central1 --tail
```

### Service Status
```bash
# Check service status
gcloud run services describe studio-roster --region us-central1

# Check service metrics
gcloud run services describe studio-roster --region us-central1 --format json
```

### Error Detection
```bash
# Check for errors in logs
gcloud run services logs read studio-roster --region us-central1 --filter "severity=ERROR"

# Check for 5xx responses
gcloud run services logs read studio-roster --region us-central1 --filter "httpRequest.status>=500"
```

## 🛡️ Security Verification

### 1. HTTPS Enforcement
```bash
# Test HTTPS redirect
curl -I http://studio-roster.com
# Expected: HTTP/2 301 → HTTPS

# Test HSTS header
curl -I https://studio-roster.com
# Expected: Strict-Transport-Security header present
```

### 2. CORS Configuration
```bash
# Test CORS headers
curl -I https://[your-service-url]/v1/health -H "Origin: https://studio-roster.com"
# Expected: Access-Control-Allow-Origin header present
```

### 3. Rate Limiting
```bash
# Test rate limiting (100 requests per 60 seconds)
for i in {1..101}; do curl https://[your-service-url]/v1/health; done
# Expected: Last few requests should return 429 Too Many Requests
```

## 🔧 Performance Testing

### 1. Response Time
```bash
# Test API response time
time curl https://[your-service-url]/v1/health
# Expected: < 500ms

# Test frontend load time
time curl -o /dev/null -s -w "%{time_total}\n" https://studio-roster.com
# Expected: < 2s
```

### 2. Load Testing
```bash
# Simple load test (10 concurrent requests)
for i in {1..10}; do curl https://[your-service-url]/v1/health & done; wait
# Expected: All requests complete successfully
```

## 📋 Verification Checklist

- [ ] ✅ Frontend loads at https://studio-roster.com
- [ ] ✅ API health check passes
- [ ] ✅ Database connectivity verified
- [ ] ✅ Cloud storage upload works
- [ ] ✅ AI features functional
- [ ] ✅ Authentication system working
- [ ] ✅ HTTPS enforced
- [ ] ✅ CORS properly configured
- [ ] ✅ Rate limiting active
- [ ] ✅ Response times acceptable
- [ ] ✅ No errors in logs
- [ ] ✅ All key features tested

## 🎉 Success Criteria

**Deployment is successful when:**
1. ✅ Frontend loads without errors at https://studio-roster.com
2. ✅ API health check returns status "ok"
3. ✅ All key features are functional (AI, moodboard, database, storage)
4. ✅ No critical errors in Cloud Run logs
5. ✅ Security headers are properly configured
6. ✅ Performance meets expectations (< 2s load time)

## 🆘 Troubleshooting

**Common Issues and Solutions:**

1. **502 Bad Gateway**
   ```bash
   # Increase timeout
   gcloud run services update studio-roster --timeout 600
   ```

2. **Database connection issues**
   ```bash
   # Verify DATABASE_URL
   echo $DATABASE_URL

   # Test connection
   npx prisma db push
   ```

3. **Missing dependencies**
   ```bash
   npm install
   npm install typescript
   ```

4. **Authentication failures**
   ```bash
   # Check JWT_SECRET
   echo $JWT_SECRET

   # Test token generation
   curl -X POST https://[your-service-url]/v1/auth/login
   ```

## 📝 Verification Notes

1. **Monitoring**: Set up alerts for:
   - 5xx errors
   - High latency (> 1s)
   - Memory usage > 80%
   - High request rates

2. **Performance**: Optimize if:
   - Frontend load time > 2s
   - API response time > 500ms
   - Memory usage consistently > 70%

3. **Security**: Verify:
   - No sensitive data in logs
   - All endpoints require authentication (except public routes)
   - Rate limiting is effective

**Deployment verification complete!** 🎉
