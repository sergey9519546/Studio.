# Firebase Setup & Configuration Guide

## Overview
This document outlines the complete Firebase setup for the Studio Roster project. Firebase has been fully configured with all essential services for a modern web application.

## Package Information
- **Firebase SDK Version**: v12.6.0 (latest)
- **Project ID**: gen-lang-client-0704991831
- **Configuration Status**: ✅ Complete and Updated

## Firebase Services Configured

### 1. Firebase App & Analytics
- **Initialization**: Modern singleton pattern with `getApps()`
- **Analytics**: Support for both web and server-side analytics
- **Configuration**: Environment-specific setup ready

### 2. Firestore Database
- **Security Rules**: ✅ Implemented with role-based access
- **Indexes**: ✅ Optimized for common queries
- **Collections**: Projects, Assignments, Users, Public data

### 3. Authentication
- **Service**: Ready for user management
- **Providers**: Email/Password ready to implement
- **Roles**: Admin, Editor, Contributor, User roles supported

### 4. Cloud Storage
- **Security Rules**: ✅ Role-based file access
- **Structure**: Public, User, Project, Assignment file organization
- **Access Control**: Fine-grained permissions
- **Bucket Config**: API uses `STORAGE_BUCKET` (defaults to `<project-id>.appspot.com`); frontend uses Firebase config `storageBucket` (also accepts `<project-id>.firebasestorage.app`)
- **Emulator Support**: API auto-detects `firebase.json` to set `FIREBASE_STORAGE_EMULATOR_HOST`; frontend can opt-in via `VITE_FIREBASE_EMULATORS=true`

### 5. Cloud Functions
- **Runtime**: Node.js 20
- **Status**: Configuration ready for deployment

### 6. Data Connect
- **Status**: Emulator configured
- **Purpose**: PostgreSQL integration for advanced data queries

### 7. Hosting
- **Public Directory**: `build/client`
- **Configuration**: SPA routing with proper rewrites
- **Caching**: Optimized for static assets

## File Structure

```
├── firebase.json              # Main configuration
├── firestore.rules           # Database security rules
├── storage.rules             # Storage security rules
├── firestore.indexes.json    # Database indexes
├── .firebaserc              # Project aliases
├── src/
│   ├── firebase.ts          # SDK initialization
│   └── firebase.d.ts        # TypeScript definitions
└── functions/               # Cloud Functions (if needed)
```

## Usage Examples

### Initialize Firebase Services
```typescript
import {
  app,
  db,
  auth,
  storage,
  functions,
  analytics
} from './firebase';

// Use in your components
const firestore = db;
const firebaseAuth = auth;
const firebaseStorage = storage;
const cloudFunctions = functions;
```

### Security Rules Summary
- **Public Data**: Readable by all, writable by admin/editor
- **User Data**: Only accessible by the user themselves
- **Projects**: Public read, member write access
- **Assignments**: Creator and assignee access only

### Recommended Next Steps
1. **Authentication Setup**: Implement login/signup flows
2. **Data Operations**: Create service layer for Firestore operations
3. **File Uploads**: Implement Storage service for user files
4. **Cloud Functions**: Add business logic functions as needed
5. **Deploy**: Use `firebase deploy` to push changes to production

## Development Commands

### Local Development
```bash
# Start all emulators
firebase emulators:start

# Start specific services
firebase emulators:start --only firestore,auth,storage

# Access Emulator UI
# http://localhost:4000
```

### Frontend Emulator Toggle
```bash
# Connect frontend SDKs to local emulators
VITE_FIREBASE_EMULATORS=true npm run dev
```

### Firebase AI Defaults (Frontend)
- **Model**: `VITE_FIREBASE_AI_MODEL` (default `gemini-2.5-flash`)
- **Location**: `VITE_FIREBASE_AI_LOCATION` (default `us-central1`)

### Production Deployment
```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting,firestore,storage
firebase deploy --only functions

# Deploy security rules
firebase deploy --only firestore:rules,storage
```

## Security Considerations
- All security rules follow principle of least privilege
- Role-based access control implemented
- User data isolation enforced
- Public data properly separated

## Performance Optimizations
- Firestore indexes for efficient queries
- Storage rules optimized for common access patterns
- Hosting with proper caching headers
- Emulator configuration for local development

## Monitoring & Analytics
- Analytics support with proper consent handling
- Performance monitoring ready
- Error tracking can be integrated

---

*Last Updated: December 8, 2025*
*Firebase SDK v12.6.0+ compatible*
