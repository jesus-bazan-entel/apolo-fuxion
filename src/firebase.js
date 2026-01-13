import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

// Firebase Config - Set these in Vercel Environment Variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;
};

let app = null;
let db = null;
let auth = null;
let storage = null;
let googleProvider = null;

try {
    if (isFirebaseConfigured()) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        googleProvider = new GoogleAuthProvider();
    }
} catch (error) {
    console.warn('Firebase initialization error:', error.message);
}

export { db, auth, storage };

// Email/Password Auth
export async function loginWithEmail(email, password) {
    if (!auth) throw new Error('Firebase no está configurado');
    return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
    if (!auth) throw new Error('Firebase no está configurado');
    return createUserWithEmailAndPassword(auth, email, password);
}

// Google Auth
export async function loginWithGoogle() {
    if (!auth || !googleProvider) throw new Error('Firebase no está configurado');
    return signInWithPopup(auth, googleProvider);
}

// Logout
export async function logout() {
    if (!auth) return;
    return signOut(auth);
}

// Auth State Observer
export function onAuthChange(callback) {
    if (!auth) {
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
}

// Upload PDF to Firebase Storage and get URL
export async function uploadPDFToStorage(pdfBlob, clientName) {
    if (!storage) throw new Error('Firebase Storage no está configurado');

    const timestamp = Date.now();
    const safeName = (clientName || 'cliente').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileName = `pdfs/${timestamp}-${safeName}.pdf`;

    const storageRef = ref(storage, fileName);

    // Upload the blob
    await uploadBytes(storageRef, pdfBlob, {
        contentType: 'application/pdf'
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
}
