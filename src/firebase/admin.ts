// firebase/admin.ts
import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Initializes the Firebase Admin SDK if it hasn't been initialized yet.
 * It uses environment variables to configure credentials.
 * Returns an object containing the server-side Auth and Firestore services.
 */
const initFirebaseAdmin = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

// Export server-side Auth and Firestore
export const { auth, db } = initFirebaseAdmin();
