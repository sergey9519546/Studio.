declare module './firebase' {
  import { FirebaseApp } from 'firebase/app';
  import { Analytics } from 'firebase/analytics';
  import { Firestore } from 'firebase/firestore';
  import { FirebaseStorage } from 'firebase/storage';
  import { Auth } from 'firebase/auth';
  import { Functions } from 'firebase/functions';
  import { FirebaseAI, GenerativeModel } from 'firebase/ai';

  export const app: FirebaseApp;
  export const analytics: Analytics;
  export const db: Firestore;
  export const storage: FirebaseStorage;
  export const auth: Auth;
  export const functions: Functions;
  export const ai: FirebaseAI;
  export const model: GenerativeModel;
}