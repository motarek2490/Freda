import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import firebaseConfig from '../../firebase-applet-config.json';
import { FUNCTIONS_REGION, FIREBASE_DB_ID } from '../config/brand';

// Initialize Firebase App safely (singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

// Initialize Cloud Functions with regional deployment
export const functions = getFunctions(app, FUNCTIONS_REGION);

// Initialize Cloud Firestore with resilient fallback
let firestoreDb: Firestore;
const activeDbId = firebaseConfig.firestoreDatabaseId || FIREBASE_DB_ID;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      ignoreUndefinedProperties: true,
    },
    activeDbId
  );
} catch {
  try {
    firestoreDb = getFirestore(app, activeDbId);
  } catch {
    firestoreDb = getFirestore(app);
  }
}

export const db = firestoreDb;

// Initialize Firebase App Check (reCAPTCHA Enterprise)
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (typeof window !== 'undefined' && recaptchaSiteKey) {
  try {
    if (import.meta.env.DEV) {
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    console.warn('App Check initialization error or skipped:', e);
  }
}

/**
 * Ensures a customer has a stable Firebase Auth UID (using Anonymous Auth if not logged in).
 * This allows security rules to associate invitations and orders with the customer's auth.uid.
 */
export async function ensureAnonymousAuth(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsubscribe();
          resolve(cred.user);
        } catch (err) {
          console.warn('Anonymous sign-in error:', err);
          unsubscribe();
          resolve(null);
        }
      }
    });
  });
}
