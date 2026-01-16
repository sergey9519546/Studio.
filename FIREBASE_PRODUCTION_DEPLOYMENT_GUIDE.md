# Firebase Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Studio Roster application to Firebase Production environment.

## Prerequisites
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase project created (`gen-lang-client-0704991831`)
- [ ] Production environment variables configured
- [ ] Build artifacts generated successfully
- [ ] Service account key file for production

## Step 1: Environment Setup

### 1.1 Verify Firebase Project Configuration
```bash
# Check current project
firebase projects:list
firebase use gen-lang-client-0704991831
firebase projects:get
```

### 1.2 Configure Production Environment
```bash
# Copy production environment file
cp .env.production .env

# Verify environment variables
cat .env
```

### 1.3 Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools@latest
firebase login
```

## Step 2: Pre-Deployment Validation

### 2.1 Validate Build Process
```bash
# Clean previous builds
rm -rf build/

# Run production build
npm run build

# Verify build artifacts
ls -la build/client/
ls -la build/apps/api/
```

### 2.2 Validate Firebase Configuration
```bash
# Check Firebase config
cat .firebaserc
cat firebase.json

# Validate hosting configuration
firebase hosting:config --json
```

### 2.3 Test Security Rules (Dry Run)
```bash
# Test Firestore rules
firebase deploy --only firestore:rules --dry-run

# Test Storage rules
firebase deploy --only storage --dry-run
```

## Step 3: Firebase Services Setup

### 3.1 Enable Required Firebase Services
In the Firebase Console, ensure these services are enabled:
- ✅ Firebase Hosting
- ✅ Cloud Firestore
- ✅ Cloud Storage
- ✅ Authentication
- ✅ Cloud Functions (if needed)

### 3.2 Configure Authentication Providers
In Firebase Console → Authentication → Sign-in method:
- [ ] Email/Password (enabled)
- [ ] Google (optional)
- [ ] Other providers as needed

### 3.3 Set up Custom Domain (Optional)
1. Firebase Console → Hosting → Add custom domain
2. Configure DNS records
3. Wait for SSL certificate generation

## Step 4: Production Build & Deploy

### 4.1 Final Build
```bash
# Ensure production environment
export NODE_ENV=production

# Clean and rebuild
npm run clean-build

# Verify bundle size
npm run build:analyze
```

### 4.2 Deploy to Firebase
```bash
# Deploy all services (recommended)
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage

# Deploy with custom configuration
firebase deploy --project gen-lang-client-0704991831
```

### 4.3 Deploy to Preview Channel (Recommended First)
```bash
# Create preview channel for testing
firebase hosting:channel:deploy preview

# Test the preview URL
# If everything works, deploy to live
firebase deploy --only hosting
```

## Step 5: Post-Deployment Validation

### 5.1 Verify Deployment
```bash
# Check deployment status
firebase hosting:sites:list

# Get live URL
firebase hosting:sites:get gen-lang-client-0704991831-35466
```

### 5.2 Test Critical Functionality
- [ ] Website loads correctly
- [ ] Authentication flows work
- [ ] Firestore read/write operations
- [ ] File upload/download
- [ ] API endpoints respond
- [ ] Environment variables are loaded

### 5.3 Performance Testing
```bash
# Run Lighthouse audit
lighthouse https://your-domain.web.app

# Test Core Web Vitals
# - Largest Contentful Paint (LCP) < 2.5s
# - First Input Delay (FID) < 100ms
# - Cumulative Layout Shift (CLS) < 0.1
```

## Step 6: Monitoring & Maintenance

### 6.1 Set up Monitoring
```bash
# Enable Firebase Analytics
# Set up error reporting
# Configure performance monitoring
```

### 6.2 Monitoring Dashboard
- Firebase Console → Analytics
- Firebase Console → Performance
- Firebase Console → Crashlytics

### 6.3 Log Monitoring
```bash
# View hosting logs
firebase hosting:log

# View function logs (if using functions)
firebase functions:log
```

## Step 7: Rollback Procedure

### 7.1 Quick Rollback
```bash
# Rollback to previous version
firebase hosting:rollback

# Or redeploy specific version
firebase deploy --version <version-id>
```

### 7.2 Full Recovery
1. Identify last working version
2. Redeploy from source
3. Verify functionality
4. Update monitoring

## Production Checklist

### Security
- [ ] All environment variables are production values
- [ ] Service account has minimum required permissions
- [ ] Firestore rules tested and validated
- [ ] Storage rules tested and validated
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Security headers configured

### Performance
- [ ] Bundle size optimized (<1MB)
- [ ] Images optimized and compressed
- [ ] Caching headers configured
- [ ] CDN enabled
- [ ] Lazy loading implemented

### Monitoring
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Analytics configured
- [ ] Uptime monitoring set up
- [ ] Alert thresholds configured

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Deployment Failures**
```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Login again
firebase logout
firebase login
```

**Environment Variable Issues**
```bash
# Verify environment variables
echo $NODE_ENV
cat .env

# Check build process
npm run build:client
```

**Permission Issues**
```bash
# Check project permissions
firebase projects:get
firebase projects:list

# Re-authenticate
firebase logout
firebase login
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | ✅ | `production` |
| `DATABASE_URL` | PostgreSQL connection | ✅ | `postgresql://...` |
| `JWT_SECRET` | JWT signing secret | ✅ | `64-char-random-string` |
| `GCP_PROJECT_ID` | GCP project ID | ✅ | `gen-lang-client-0704991831` |
| `STORAGE_BUCKET` | Storage bucket name | ✅ | `studio-roster-storage-prod` |
| `VITE_API_URL` | API endpoint URL | ✅ | `https://your-domain.web.app/api/v1` |
| `FRONTEND_URL` | Frontend URL | ✅ | `https://your-domain.web.app` |
| `GEMINI_API_KEY` | Gemini API key | ✅ | `AIza...` |

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Firestore Security Rules](https://firebase.google.com/docs/rules)

---

**Last Updated:** December 11, 2025
**Version:** 1.0
**Author:** Cline AI Assistant
