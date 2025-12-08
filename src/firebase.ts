// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase products that are being used
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Updated for Firebase SDK v12.6.0+
const firebaseConfig = {
  apiKey: "AIzaSyAONjMz5IWshDt_spZEpGI_gnNDD7izGsA",
  authDomain: "gen-lang-client-0704991831.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0704991831-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0704991831",
  storageBucket: "gen-lang-client-0704991831.firebasestorage.app",
  messagingSenderId: "893670545674",
  appId: "1:893670545674:web:9fee83296955160e8842f3",
  measurementId: "G-4L6HZCPSSX"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
let analytics: Promise<import("firebase/analytics").Analytics | null>;
analytics = isSupported().then(() => getAnalytics(app)).catch(() => null);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { 
  app, 
  analytics, 
  db, 
  auth, 
  storage, 
  functions,
  isSupported
};
