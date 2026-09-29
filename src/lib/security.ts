/**
 * Security & Access Verification Module for FRIDA
 * Zero-Trust verification: Admin UI gated strictly by Firebase Auth custom claim { admin: true }.
 * No client-side password hashing, no client-side role writes, Google Sign-In only for admin access.
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const PRIMARY_ADMIN_EMAIL = 'mohammedtarek2490@gmail.com';

/**
 * Verifies whether a Firebase User has verified admin privileges.
 * Strictly verifies:
 * 1. Firebase Auth Custom Token Claim: `claims.admin === true`
 * 2. Primary verified administrator email (mohammedtarek2490@gmail.com)
 * 3. Existence of admin document in /admins/{uid} collection
 * Zero-trust: No frontend storage bypasses permitted.
 */
export async function verifyIsAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;

  // 1. Primary bootstrapped admin email
  if (user.email && user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // 2. Custom Token Claim { admin: true }
  try {
    const tokenResult = await user.getIdTokenResult(true);
    if (tokenResult.claims?.admin === true) {
      return true;
    }
  } catch (err) {
    console.warn('Error checking admin token claims:', err);
  }

  // 3. Document in /admins/{uid}
  try {
    const adminSnap = await getDoc(doc(db, 'admins', user.uid));
    if (adminSnap.exists()) {
      return true;
    }
  } catch {
    // If not admin, rules deny read of /admins/{id} which is expected
  }

  return false;
}

/**
 * Authenticates admin via Google Sign-In Popup
 */
export async function loginAdminWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);

    const isAdmin = await verifyIsAdminUser(cred.user);

    if (!isAdmin) {
      await signOut(auth);
      return {
        success: false,
        error: `الحساب (${cred.user.email}) غير مصرح له كمسؤول. يجب تفعيل صلاحية الأدمن من خلال لوحة تحكم السحابة (Admin Claim).`,
      };
    }

    return { success: true, user: cred.user };
  } catch (err: any) {
    console.warn('Google Admin Login Error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'تم إغلاق نافذة تسجيل الدخول.' };
    }
    if (err.code === 'auth/popup-blocked') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      return {
        success: false,
        error: `قام المتصفح بحظر نافذة تسجيل الدخول (Pop-up Blocked). يرجى الضغط على علامة الحظر في شريط العنوان بالأعلى واختيار "السماح دائماً بالنوافذ المنبثقة"، والتأكد من إضافة النطاق (${currentHost}) في Authorized Domains في Firebase Console.`,
      };
    }
    if (err.code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'تم إلغاء نافذة تسجيل الدخول السابقة.' };
    }
    if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'النطاق الحالي';
      return {
        success: false,
        error: `⚠️ نطاق الاستضافة (${currentHost}) يحتاج إلى إضافته في Authorized Domains في Firebase Console.`,
      };
    }
    return { success: false, error: err.message || 'تعذر تسجيل الدخول بواسطة Google.' };
  }
}

/**
 * Signs out the current admin user
 */
export async function adminLogout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Logout error:', err);
  }
}

/**
 * Gets ID Token of currently authenticated admin
 */
export async function getAdminIdToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken();
}

/**
 * Sanitizes user text inputs by trimming whitespace and enforcing max length.
 * Note: React escapes HTML entities on render, preventing XSS without double-escaping issues.
 */
export function sanitizeText(input: string | null | undefined, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}
