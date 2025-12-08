// Firebase TypeScript Declarations for v12.6.0+
// This file provides type definitions for Firebase modules

declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Object;
  }
  
  export function initializeApp(config: Object, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
}

declare module 'firebase/analytics' {
  export function getAnalytics(app?: Object): Promise<any>;
  export function isSupported(): Promise<boolean>;
}

declare module 'firebase/firestore' {
  export function getFirestore(app?: Object): any;
  export function doc(db: any, path: string, ...pathSegments: string[]): any;
  export function collection(db: any, path: string, ...pathSegments: string[]): any;
  export function addDoc(collection: any, data: any): Promise<any>;
  export function getDocs(query: any): Promise<any>;
  export function getDoc(docRef: any): Promise<any>;
  export function updateDoc(docRef: any, data: any): Promise<any>;
  export function deleteDoc(docRef: any): Promise<any>;
  export function onSnapshot(query: any, callback: (querySnapshot: any) => void): () => void;
}

declare module 'firebase/auth' {
  export function getAuth(app?: Object): any;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<any>;
  export function onAuthStateChanged(auth: any, callback: (user: any) => void): () => void;
  export function getCurrentUser(auth: any): any;
}

declare module 'firebase/storage' {
  export function getStorage(app?: Object): any;
  export function ref(storage: any, path: string): any;
  export function uploadBytes(res: any, data: any, metadata?: any): Promise<any>;
  export function getDownloadURL(res: any): Promise<string>;
  export function deleteObject(res: any): Promise<any>;
}

declare module 'firebase/functions' {
  export function getFunctions(app?: Object, region?: string): any;
  export function httpsCallable(functions: any, name: string): (data?: any) => Promise<any>;
}

declare module 'firebase/data-connect';
