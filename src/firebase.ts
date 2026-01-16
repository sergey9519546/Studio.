/**
 * Enhanced Firebase Initialization
 * Secure, environment-based Firebase configuration with comprehensive error handling
 */

// Import the functions you need from the SDKs you need
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, Functions, getFunctions } from "firebase/functions";
import { connectStorageEmulator, FirebaseStorage, getStorage } from "firebase/storage";

// Import our custom configuration
import {
  createFirebaseConfig,
  createServiceConfig,
  environment,
  FirebaseServiceConfig,
  validateFirebaseConfig
} from "./firebase.config";

// ============== CONFIGURATION VALIDATION ==============

/**
 * Validates required environment variables for Firebase
 */
function validateEnvironmentVariables(): void {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

  if (missing.length > 0) {
    const message =
      `Missing Firebase environment variables: ${missing.join(', ')}. ` +
      'Firebase initialization requires these values to be set.';
    if (environment.isProduction) {
      console.warn(message);
    } else if (environment.isDevelopment) {
      console.warn(`${message} This is expected only if you have not configured your .env file yet.`);
    }
  }
}

// ============== FIREBASE APP INITIALIZATION ==============

/**
 * Initialize Firebase App with error handling
 */
function initializeFirebaseApp(): FirebaseApp {
  try {
    // Validate environment variables first
    validateEnvironmentVariables();

    // Create Firebase configuration
    const firebaseConfig = createFirebaseConfig();

    // Additional validation for development
    if (environment.isDevelopment) {
      const validation = validateFirebaseConfig(firebaseConfig);
      if (!validation.isValid) {
        console.error('Firebase configuration validation failed:', validation.errors);
        throw new Error(`Firebase configuration invalid: ${validation.errors.join(', ')}`);
      }

      if (validation.warnings.length > 0) {
        console.warn('Firebase configuration warnings:', validation.warnings);
      }
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    console.log(`✅ Firebase App initialized successfully for ${environment.isProduction ? 'production' : 'development'}`);

    return app;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase App:', error);
    throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============== FIREBASE SERVICES INITIALIZATION ==============

/**
 * Initialize Firebase services with environment-specific configuration
 */
class FirebaseServices {
  public readonly app: FirebaseApp;
  public readonly db: Firestore;
  public readonly storage: FirebaseStorage;
  public readonly functions: Functions;
  public readonly ai: ReturnType<typeof getAI>;
  public readonly model: ReturnType<typeof getGenerativeModel>;
  public analytics: ReturnType<typeof getAnalytics> | null;
  public readonly serviceConfig: FirebaseServiceConfig;

  constructor() {
    try {
      // Initialize main app
      this.app = initializeFirebaseApp();

      // Get service configuration
      this.serviceConfig = createServiceConfig();

      // Initialize core services
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);
      this.functions = getFunctions(this.app);

      // Initialize AI services
      const aiLocation = this.serviceConfig.aiLocation;
      this.ai = getAI(this.app, { backend: new VertexAIBackend(aiLocation) });
      this.model = getGenerativeModel(this.ai, { model: this.serviceConfig.aiModel });

      // Initialize Analytics (only in supported environments)
      this.analytics = null;
      void this.initializeAnalytics();

      // Connect to emulators in development if enabled
      this.initializeEmulators();

      console.log('🎯 All Firebase services initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Firebase services:', error);
      throw new Error(`Firebase services initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Initialize Firebase Analytics
   */
  private async initializeAnalytics(): Promise<void> {
    try {
      if (environment.isDevelopment || !environment.isProduction) {
        console.log('Analytics disabled in development mode');
        return;
      }

      const analyticsSupported = await isSupported();
      if (analyticsSupported) {
        this.analytics = getAnalytics(this.app);
        console.log('📊 Firebase Analytics initialized');
      } else {
        console.log('📊 Firebase Analytics not supported in this environment');
      }
    } catch (error) {
      console.warn('📊 Firebase Analytics initialization failed:', error);
      // Analytics failure should not break the app
    }
  }

  /**
   * Connect to Firebase emulators for development
   */
  private initializeEmulators(): void {
    if (!this.serviceConfig.useEmulators || !environment.isDevelopment) {
      return;
    }

    try {
      const config = this.serviceConfig.emulatorConfig!;

      // Connect to Firestore emulator
      connectFirestoreEmulator(this.db, config.firestore.host, config.firestore.port);
      console.log(`🔗 Connected to Firestore emulator: ${config.firestore.host}:${config.firestore.port}`);

      // Connect to Functions emulator
      connectFunctionsEmulator(this.functions, config.functions.host, config.functions.port);
      console.log(`🔗 Connected to Functions emulator: ${config.functions.host}:${config.functions.port}`);

      // Connect to Storage emulator
      connectStorageEmulator(this.storage, config.storage.host, config.storage.port);
      console.log(`🔗 Connected to Storage emulator: ${config.storage.host}:${config.storage.port}`);

    } catch (error) {
      console.error('❌ Failed to connect to Firebase emulators:', error);
      // Emulator connection failure should not break the app
    }
  }
}

// ============== SINGLETON INSTANCE ==============

/**
 * Singleton Firebase services instance
 */
let firebaseServicesInstance: FirebaseServices | null = null;

/**
 * Get or create Firebase services instance
 */
export function getFirebaseServices(): FirebaseServices {
  if (!firebaseServicesInstance) {
    firebaseServicesInstance = new FirebaseServices();
  }
  return firebaseServicesInstance;
}

// ============== EXPORTS ==============

// Main Firebase app instance
export const app = getFirebaseServices().app;

// Individual Firebase services (for backward compatibility)
export const db = getFirebaseServices().db;
export const storage = getFirebaseServices().storage;
export const functions = getFirebaseServices().functions;
export const ai = getFirebaseServices().ai;
export const model = getFirebaseServices().model;
export const analytics = getFirebaseServices().analytics;

// Service configuration (for advanced usage)
export const serviceConfig = getFirebaseServices().serviceConfig;

// Environment utilities
export { environment };

// Utility functions for service access
export const getFirebaseService = {
  app: () => getFirebaseServices().app,
  firestore: () => getFirebaseServices().db,
  storage: () => getFirebaseServices().storage,
  functions: () => getFirebaseServices().functions,
  ai: () => getFirebaseServices().ai,
  model: () => getFirebaseServices().model,
  analytics: () => getFirebaseServices().analytics,
  config: () => getFirebaseServices().serviceConfig
};

// Type-safe service access
export type FirebaseServiceInstances = ReturnType<typeof getFirebaseServices>;

// ============== ERROR HANDLING ==============

/**
 * Error boundary for Firebase initialization
 */
export class FirebaseInitializationError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'FirebaseInitializationError';
  }
}

/**
 * Check if Firebase is properly initialized
 */
export function isFirebaseInitialized(): boolean {
  try {
    getFirebaseServices();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Firebase initialization status
 */
export function getFirebaseStatus() {
  const services = getFirebaseServices();
  return {
    initialized: true,
    environment: environment.isDevelopment ? 'development' : 'production',
    usingEmulators: services.serviceConfig.useEmulators,
    services: {
      app: !!services.app,
      firestore: !!services.db,
      storage: !!services.storage,
      functions: !!services.functions,
      ai: !!services.ai,
      model: !!services.model,
      analytics: !!services.analytics
    },
    config: services.serviceConfig
  };
}
