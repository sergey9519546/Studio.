declare module './firebase' {
  import { FirebaseAI, GenerativeModel } from 'firebase/ai';
  import { Analytics } from 'firebase/analytics';
  import { FirebaseApp } from 'firebase/app';
  import { Firestore } from 'firebase/firestore';
  import { Functions } from 'firebase/functions';
  import { FirebaseStorage } from 'firebase/storage';

  export const app: FirebaseApp;
  export const analytics: Analytics;
  export const db: Firestore;
  export const storage: FirebaseStorage;
  export const functions: Functions;
  export const ai: FirebaseAI;
  export const model: GenerativeModel;
}
