// Firebase Configuration
// Get these values from Firebase Console > Project Settings > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Load from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
const missingConfig = [];
if (!firebaseConfig.apiKey) missingConfig.push('VITE_FIREBASE_API_KEY');
if (!firebaseConfig.projectId) missingConfig.push('VITE_FIREBASE_PROJECT_ID');
if (!firebaseConfig.authDomain) missingConfig.push('VITE_FIREBASE_AUTH_DOMAIN');

if (missingConfig.length > 0) {
  console.error('❌ Firebase configuration is missing:', missingConfig.join(', '));
  console.error('Please check your .env file.');
  console.error('See README_FIREBASE_SETUP.md for setup instructions.');
} else {
  console.log('✅ Firebase config loaded:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing'
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with better error handling
export const db = getFirestore(app);

// Test Firestore connection immediately (only in browser)
if (typeof window !== 'undefined' && !missingConfig.length) {
  // Use setTimeout to avoid blocking initialization
  setTimeout(() => {
    import('firebase/firestore').then(({ collection, getDocs }) => {
      const testRef = collection(db, 'products');
      const timeout = setTimeout(() => {
        console.error('❌ Firestore connection test timed out after 5 seconds');
        console.error('This usually means:');
        console.error('1. Firestore security rules are blocking access');
        console.error('2. Network/firewall is blocking Firebase');
        console.error('3. Firebase project is not properly configured');
        console.error('\n💡 Run testFirestore() in console for detailed diagnostics');
      }, 5000);
      
      getDocs(testRef)
        .then(() => {
          clearTimeout(timeout);
          console.log('✅ Firestore connection test successful');
        })
        .catch((error) => {
          clearTimeout(timeout);
          console.error('❌ Firestore connection test failed:', error.code || 'unknown', error.message);
          if (error.code === 'permission-denied') {
            console.error('🔒 PERMISSION DENIED: Check Firestore security rules!');
            console.error('Rules should be: allow read, write: if true;');
          }
          console.error('\n💡 Run testFirestore() in console for detailed diagnostics');
        });
    }).catch((err) => {
      console.error('Failed to load Firestore module:', err);
    });
  }, 1000); // Wait 1 second before testing
}

export default app;

