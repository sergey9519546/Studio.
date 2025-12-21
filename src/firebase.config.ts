/**
 * Firebase Configuration Types and Validation
 * Provides type-safe Firebase configuration with environment variable support
 */

// Firebase Configuration Interface
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Environment-based Firebase Configuration
export interface FirebaseEnvConfig {
  // Required Firebase configuration
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_MEASUREMENT_ID?: string;
  VITE_FIREBASE_DATABASE_URL?: string;
  
  // Firebase AI Configuration
  VITE_FIREBASE_AI_MODEL?: string;
  VITE_FIREBASE_AI_LOCATION?: string;
  
  // Development/Emulator Configuration
  VITE_FIREBASE_EMULATORS?: string;
  
  // Firebase Measurement ID for Analytics
}

// Firebase Service Configuration
export interface FirebaseServiceConfig {
  aiModel: string;
  aiLocation: string;
  useEmulators: boolean;
  emulatorConfig?: {
    firestore: { host: string; port: number };
    functions: { host: string; port: number };
    storage: { host: string; port: number };
    auth: { host: string; port: number };
  };
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates Firebase configuration object
 */
export function validateFirebaseConfig(config: Partial<FirebaseConfig>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields validation
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Specific field validation
  if (config.apiKey && !config.apiKey.startsWith('AIza')) {
    warnings.push('API key format looks unusual - ensure it\'s correct');
  }
  
  if (config.authDomain && !config.authDomain.includes('.firebaseapp.com')) {
    warnings.push('Auth domain should typically be in format: project-id.firebaseapp.com');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Creates Firebase config from environment variables with fallbacks
 */
export function createFirebaseConfig(): FirebaseConfig {
  const env = import.meta.env as FirebaseEnvConfig;
  const projectId = env.VITE_FIREBASE_PROJECT_ID?.trim();
  const authDomain =
    env.VITE_FIREBASE_AUTH_DOMAIN?.trim() ||
    (projectId ? `${projectId}.firebaseapp.com` : undefined);
  const storageBucket =
    env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ||
    (projectId ? `${projectId}.firebasestorage.app` : undefined);

  const config: Partial<FirebaseConfig> = {
    apiKey: env.VITE_FIREBASE_API_KEY?.trim(),
    authDomain,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL?.trim(),
    projectId,
    storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: env.VITE_FIREBASE_APP_ID?.trim(),
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID?.trim()
  };
  
  // Validate the configuration
  const validation = validateFirebaseConfig(config);
  
  if (!validation.isValid) {
    throw new Error(`Firebase configuration validation failed: ${validation.errors.join(', ')}`);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Firebase configuration warnings:', validation.warnings);
  }
  
  return config as FirebaseConfig;
}

/**
 * Creates Firebase service configuration
 */
export function createServiceConfig(): FirebaseServiceConfig {
  return {
    aiModel: import.meta.env.VITE_FIREBASE_AI_MODEL || 'gemini-2.5-flash',
    aiLocation: import.meta.env.VITE_FIREBASE_AI_LOCATION || 'us-central1',
    useEmulators: import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATORS === 'true',
    emulatorConfig: {
      firestore: { host: 'localhost', port: 8080 },
      functions: { host: 'localhost', port: 5001 },
      storage: { host: 'localhost', port: 9199 },
      auth: { host: 'localhost', port: 9099 }
    }
  };
}

/**
 * Environment detection utility
 */
export const environment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.VITEST,
  
  // Firebase specific environment checks
  usingEmulators: () => createServiceConfig().useEmulators,
  isLocalDevelopment: () => import.meta.env.DEV && !createServiceConfig().useEmulators,
  isEmulatorMode: () => import.meta.env.VITE_FIREBASE_EMULATORS === 'true'
};
