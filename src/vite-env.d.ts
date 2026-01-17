/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_ACCESS_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  readonly VITE_FIREBASE_AI_MODEL: string;
  readonly VITE_FIREBASE_AI_LOCATION: string;
  readonly VITE_FIREBASE_EMULATORS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
