// Import the functions you need from the SDKs you need
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";


// Your web app's Firebase configuration
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
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

const useEmulators =
  import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATORS === "true";

if (useEmulators) {
  connectAuthEmulator(auth, "http://localhost:9099", {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectStorageEmulator(storage, "localhost", 9199);
}

const aiLocation = import.meta.env.VITE_FIREBASE_AI_LOCATION || "us-central1";
const aiModel = import.meta.env.VITE_FIREBASE_AI_MODEL || "gemini-2.5-flash";

// Initialize the Vertex AI Gemini API backend service
export const ai = getAI(app, { backend: new VertexAIBackend(aiLocation) });

// Create a `GenerativeModel` instance with a model that supports your use case
export const model = getGenerativeModel(ai, { model: aiModel });
