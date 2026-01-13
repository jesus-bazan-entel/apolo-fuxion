import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// TODO: Replace with your Firebase config from Firebase Console
// Go to: Firebase Console > Project Settings > General > Your apps > Web
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== "YOUR_API_KEY" &&
        !firebaseConfig.apiKey.includes("YOUR_");
};

let app = null;
let db = null;
let auth = null;

try {
    if (isFirebaseConfigured()) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    }
} catch (error) {
    console.warn('Firebase not configured:', error.message);
}

export { db, auth };

export async function signInAnon() {
    if (!auth) return null;
    try {
        const result = await signInAnonymously(auth);
        return result.user;
    } catch (error) {
        console.error('Anonymous sign in failed:', error);
        return null;
    }
}
