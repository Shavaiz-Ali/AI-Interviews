// firebase/client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuT35J-8mCUe1SKue_2Vhow35_H5Frve8",
  authDomain: "prepwise-33882.firebaseapp.com",
  projectId: "prepwise-33882",
  storageBucket: "prepwise-33882.appspot.com", // fixed typo (from `.app` to `.appspot.com`)
  messagingSenderId: "586074852103",
  appId: "1:586074852103:web:7d3e04bc1c6c475e7f93a2",
  measurementId: "G-49GTY4X7GX",
};

// Initialize Firebase App (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export client-side Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
