// Firebase Admin SDK Configuration
// This is for server-side operations with elevated privileges
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// Option 1: Using service account JSON file (recommended for production)
// Download serviceAccountKey.json from Firebase Console > Project Settings > Service Accounts
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else if (process.env.FIREBASE_PROJECT_ID) {
  // Option 2: Using environment variables
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
} else {
  // Option 3: Using default credentials (for local development with Firebase CLI)
  // Run: firebase login:ci
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } catch (error) {
    console.warn('Firebase Admin not initialized. Some server features may not work.');
    console.warn('Set up Firebase Admin SDK credentials in .env file');
  }
}

export const db = admin.firestore();
export default admin;



