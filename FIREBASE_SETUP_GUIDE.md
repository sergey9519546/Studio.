# Firebase Setup Guide

## Enhanced Firebase Configuration

This guide explains how to set up and configure Firebase for your Studio Roster application using the enhanced initialization system.

## Quick Start

### 1. Environment Configuration

Copy the `.env.example` file to your environment-specific files:

```bash
# For development
cp .env.example .env.development

# For production  
cp .env.example .env.production
```

### 2. Configure Firebase Variables

Add your Firebase configuration to the appropriate `.env` file:

```bash
# Required Firebase Web App Configuration
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456789012"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# Firebase AI Configuration
VITE_FIREBASE_AI_MODEL="gemini-2.5-flash"
VITE_FIREBASE_AI_LOCATION="us-central1"

# Development Emulators (optional)
VITE_FIREBASE_EMULATORS=false
```

## Detailed Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable required services:
   - **Firestore Database**
   - **Authentication** (if needed)
   - **Cloud Functions**
   - **Cloud Storage**
   - **Hosting** (for deployment)

### Step 2: Get Web App Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web
4. Register your app with a nickname
5. Copy the configuration object

The configuration will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 3: Environment-Specific Configuration

#### Development Environment (.env.development)

```bash
# Use development Firebase project
VITE_FIREBASE_API_KEY="dev-api-key"
VITE_FIREBASE_AUTH_DOMAIN="dev-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="dev-project-id"
# ... other fields

# Enable emulators for local development
VITE_FIREBASE_EMULATORS=true
```

#### Production Environment (.env.production)

```bash
# Use production Firebase project
VITE_FIREBASE_API_KEY="prod-api-key"
VITE_FIREBASE_AUTH_DOMAIN="prod-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="prod-project-id"
# ... other fields

# Disable emulators in production
VITE_FIREBASE_EMULATORS=false
```

## Enhanced Firebase Usage

### Basic Service Access

```typescript
import { 
  app,           // Firebase app instance
  db,            // Firestore database
  storage,       // Cloud Storage
  functions,     // Cloud Functions
  ai,            // Firebase AI
  model,         // Generative AI model
  analytics,     // Analytics (null in dev)
  environment,   // Environment utilities
  getFirebaseService  // Service access helper
} from './firebase';

// Example: Access Firestore
import { collection, addDoc } from 'firebase/firestore';

// Add a document
const docRef = await addDoc(collection(db, 'users'), {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Environment Detection

```typescript
import { environment } from './firebase';

// Check current environment
if (environment.isDevelopment) {
  console.log('Running in development mode');
}

if (environment.isProduction) {
  console.log('Running in production mode');
}

// Check emulator usage
if (environment.usingEmulators()) {
  console.log('Connected to Firebase emulators');
}
```

### Advanced Service Access

```typescript
import { getFirebaseService } from './firebase';

// Type-safe service access
const firestore = getFirebaseService.firestore();
const storage = getFirebaseService.storage();
const functions = getFirebaseService.functions();

// Get service configuration
const config = getFirebaseService.config();
console.log('AI Model:', config.aiModel);
console.log('AI Location:', config.aiLocation);
```

## Firebase AI (Gemini) Setup

### 1. Enable Vertex AI

1. In Firebase Console, go to **Build** → **Extensions**
2. Search for "Vertex AI"
3. Click "Install" and follow setup

### 2. Configure AI Model

```bash
# Set AI model and location
VITE_FIREBASE_AI_MODEL="gemini-2.5-flash"
VITE_FIREBASE_AI_LOCATION="us-central1"
```

### 3. Use AI Services

```typescript
import { model } from './firebase';

// Generate content
const result = await model.generateContent('Explain quantum computing');
console.log(result.response.text());

// Generate streaming content
const stream = await model.generateContentStream('Tell me a story');
for await (const chunk of stream.stream) {
  console.log(chunk.text());
}
```

## Firebase Emulators (Development)

### Setup Emulators

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Initialize emulators in your project:

```bash
firebase init emulators
```

3. Start emulators:

```bash
firebase emulators:start
```

### Connect Your App

```bash
# In your .env.development file
VITE_FIREBASE_EMULATORS=true
```

The app will automatically connect to:

- Firestore: `localhost:8080`
- Functions: `localhost:5001`
- Storage: `localhost:9199`
- Auth: `localhost:9099`

## Security Best Practices

### 1. Environment Variables

- **Never commit** `.env` files to version control
- Use `.env.example` for template
- Use different projects for dev/staging/prod
- Rotate API keys regularly

### 2. Firebase Security Rules

#### Firestore Rules (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects are readable by authenticated users
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules (storage.rules)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Authentication

Enable authentication providers in Firebase Console:

- Email/Password
- Google Sign-In
- Other providers as needed

## Troubleshooting

### Common Issues

#### 1. Configuration Errors

**Error**: `Firebase configuration validation failed`

**Solution**: Check your environment variables:

```bash
# Verify all required variables are set
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project
# ... etc
```

#### 2. Emulator Connection Issues

**Error**: `Failed to connect to Firebase emulators`

**Solution**:

1. Ensure emulators are running: `firebase emulators:start`
2. Check `VITE_FIREBASE_EMULATORS=true` in development
3. Verify emulator ports match configuration

#### 3. AI Service Issues

**Error**: `Firebase AI initialization failed`

**Solution**:

1. Ensure Vertex AI extension is installed
2. Check AI model and location configuration
3. Verify project has billing enabled

### Debug Mode

Enable debug logging:

```typescript
import { getFirebaseStatus } from './firebase';

// Check Firebase initialization status
const status = getFirebaseStatus();
console.log('Firebase Status:', status);

// Check if Firebase is initialized
import { isFirebaseInitialized } from './firebase';
console.log('Initialized:', isFirebaseInitialized());
```

## Deployment

### Production Checklist

- [ ] All environment variables configured
- [ ] Firebase security rules deployed
- [ ] Authentication providers configured
- [ ] Database indexes created
- [ ] Storage rules configured
- [ ] Functions deployed (if using)
- [ ] Analytics configured (if using)
- [ ] Domain added to authorized domains
- [ ] SSL certificate configured
- [ ] Environment-specific configs set

### Deploy Commands

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only storage

# Deploy functions
firebase deploy --only functions

# Deploy everything
firebase deploy
```

## API Reference

### Configuration Types

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

interface FirebaseServiceConfig {
  aiModel: string;
  aiLocation: string;
  useEmulators: boolean;
}
```

### Main Exports

```typescript
// Core Firebase services
export const app: FirebaseApp;
export const db: Firestore;
export const storage: FirebaseStorage;
export const functions: Functions;
export const ai: ReturnType<typeof getAI>;
export const model: ReturnType<typeof getGenerativeModel>;
export const analytics: ReturnType<typeof getAnalytics> | null;

// Utilities
export const environment: EnvironmentUtils;
export const getFirebaseService: ServiceAccessHelper;
export const getFirebaseStatus(): FirebaseStatus;
export const isFirebaseInitialized(): boolean;
```

## Support

For issues and questions:

1. Check Firebase Console for project status
2. Review browser console for errors
3. Verify environment variables
4. Check emulator logs if using
5. Review security rules and permissions

---

*This guide covers the enhanced Firebase setup for Studio Roster. For additional Firebase features, refer to the [official Firebase documentation](https://firebase.google.com/docs).*
