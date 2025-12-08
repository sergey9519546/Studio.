// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";


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

// Initialize the Vertex AI Gemini API backend service
export const ai = getAI(app, { backend: new VertexAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });