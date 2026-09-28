import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

// GEMINI_API_KEY is stored as a managed Cloud Functions secret (set once via
// `firebase functions:secrets:set GEMINI_API_KEY`) and is only ever readable
// from inside these server-side functions — it is never sent to the browser.
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

// DO-NOT-RENAME Infrastructure Constants
export const FIREBASE_DB_ID = 'ai-studio-vowly-eb6a19f5-9126-4bbb-b06c-270aac6778bf';
export const FUNCTIONS_REGION = 'europe-west1';

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp();
}

const adminApp = getApp();
const db = getFirestore(adminApp, FIREBASE_DB_ID);
const auth = getAuth(adminApp);

// =============================================================================
// Cryptographic Helpers (scrypt with salt + timingSafeEqual)
// =============================================================================

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 32;

function hashWithScrypt(plaintext: string, salt: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(plaintext, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P }, (err, derivedKey) => {
      if (err) return reject(err);
      const saltB64 = salt.toString('base64');
      const hashB64 = derivedKey.toString('base64');
      resolve(`scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${saltB64}$${hashB64}`);
    });
  });
}

async function verifyPassword(plaintext: string, storedHash: string): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  if (!storedHash || !plaintext) return { valid: false, needsUpgrade: false };

  // 1. Scrypt format: scrypt$N$r$p$saltB64$hashB64
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 6) return { valid: false, needsUpgrade: false };
    const [, nStr, rStr, pStr, saltB64, expectedHashB64] = parts;
    const n = parseInt(nStr, 10);
    const r = parseInt(rStr, 10);
    const p = parseInt(pStr, 10);
    const salt = Buffer.from(saltB64, 'base64');
    const expectedKey = Buffer.from(expectedHashB64, 'base64');

    return new Promise((resolve) => {
      crypto.scrypt(plaintext, salt, expectedKey.length, { N: n, r, p }, (err, derivedKey) => {
        if (err) return resolve({ valid: false, needsUpgrade: false });
        try {
          const match = crypto.timingSafeEqual(derivedKey, expectedKey);
          resolve({ valid: match, needsUpgrade: false });
        } catch {
          resolve({ valid: false, needsUpgrade: false });
        }
      });
    });
  }

  // 2. Legacy unsalted SHA-256 fallback (hex 64 chars) -> upgrade to scrypt on success
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    const computed = crypto.createHash('sha256').update(plaintext).digest();
    const expected = Buffer.from(storedHash, 'hex');
    try {
      const match = crypto.timingSafeEqual(computed, expected);
      return { valid: match, needsUpgrade: match };
    } catch {
      return { valid: false, needsUpgrade: false };
    }
  }

  // 3. Plaintext legacy fallback match (for seamless migration) -> upgrade to scrypt
  if (plaintext === storedHash) {
    return { valid: true, needsUpgrade: true };
  }

  return { valid: false, needsUpgrade: false };
}

/**
 * Generate unambiguous 12-character server-side access code (no 0/O/1/I/l)
 */
function generateSecureAccessCode(): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 12; i++) {
    const idx = crypto.randomInt(0, alphabet.length);
    code += alphabet[idx];
  }
  return code;
}

// =============================================================================
// Callable: setHostCredentials
// Generates a new code, hashes it with scrypt, stores in invitation_private, revokes old sessions.
// =============================================================================

export const setHostCredentials = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const invitationId = (request.data?.invitationId || '').toString().trim();
    if (!invitationId) {
      throw new HttpsError('invalid-argument', 'invitationId is required.');
    }

    // Verify ownership or admin claim
    const invDoc = await db.collection('invitations').doc(invitationId).get();
    if (!invDoc.exists) {
      throw new HttpsError('not-found', 'Invitation not found.');
    }

    const invData = invDoc.data()!;
    const isOwner = invData.ownerUid === uid;
    const isAdmin = Boolean(request.auth?.token?.admin);

    if (!isOwner && !isAdmin) {
      throw new HttpsError('permission-denied', 'Only the owner or admin can reset credentials.');
    }

    // Generate secure 12-char code
    const newPlainCode = generateSecureAccessCode();
    const salt = crypto.randomBytes(16);
    const scryptHash = await hashWithScrypt(newPlainCode, salt);

    // Save in private vault
    await db.collection('invitation_private').doc(invitationId).set(
      {
        id: invitationId,
        invitationId,
        ownerUid: invData.ownerUid,
        hostAccessCodeHash: scryptHash,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Revoke previous host session tokens for deterministic host uid
    try {
      await auth.revokeRefreshTokens(`host_${invitationId}`);
    } catch {
      // User might not exist yet; safe to ignore
    }

    // Return the plaintext code ONCE
    return {
      success: true,
      accessCode: newPlainCode,
    };
  }
);

// =============================================================================
// Callable: hostLogin
// Rate-limited, secure authentication for Host / Organizer Portal
// =============================================================================

export const hostLogin = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    const rawIdentifier = (request.data?.identifier || '').toString().trim();
    const password = (request.data?.password || '').toString().trim();

    if (!rawIdentifier || !password || rawIdentifier.length > 100 || password.length > 100) {
      throw new HttpsError('invalid-argument', 'Invalid identifier or password format.');
    }

    const clientIp = request.rawRequest.ip || 'unknown_ip';

    // 1. Resolve identifier: Check /slugs/{slug} first, then direct /invitations/{id}
    let targetInvId: string | null = null;
    const slugDoc = await db.collection('slugs').doc(rawIdentifier.toLowerCase()).get();
    if (slugDoc.exists) {
      targetInvId = slugDoc.data()?.invitationId || null;
    } else {
      const directDoc = await db.collection('invitations').doc(rawIdentifier).get();
      if (directDoc.exists) {
        targetInvId = directDoc.id;
      }
    }

    if (!targetInvId) {
      throw new HttpsError('unauthenticated', 'Invalid invitation identifier or host access code.');
    }

    // 2. Persistent Rate Limiting in /rate_limits collection
    const rateLimitKey = crypto.createHash('sha256').update(`${clientIp}_${targetInvId}`).digest('hex');
    const rateLimitRef = db.collection('rate_limits').doc(rateLimitKey);
    const globalRateRef = db.collection('rate_limits').doc(`inv_${targetInvId}`);
    const now = Date.now();

    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(rateLimitRef);
      const globalSnap = await transaction.get(globalRateRef);

      const data = snap.exists ? snap.data()! : { failures: 0, lockedUntil: 0 };
      const gData = globalSnap.exists ? globalSnap.data()! : { hourlyFailures: 0, resetAt: now + 3600000 };

      if (data.lockedUntil && data.lockedUntil > now) {
        const waitSec = Math.ceil((data.lockedUntil - now) / 1000);
        throw new HttpsError('resource-exhausted', `Too many failed attempts. Try again in ${waitSec}s.`);
      }

      if (gData.resetAt < now) {
        gData.hourlyFailures = 0;
        gData.resetAt = now + 3600000;
      }

      if (gData.hourlyFailures >= 30) {
        throw new HttpsError('resource-exhausted', 'Invitation is temporarily locked due to excessive failed attempts.');
      }
    });

    // 3. Fetch invitation status to verify not expired
    const invDoc = await db.collection('invitations').doc(targetInvId).get();
    if (!invDoc.exists) {
      throw new HttpsError('unauthenticated', 'Invalid invitation identifier or host access code.');
    }

    const invData = invDoc.data()!;
    if (invData.status === 'expired' || (invData.expiresAt && new Date(invData.expiresAt).getTime() < now)) {
      throw new HttpsError('permission-denied', 'This invitation has expired.');
    }

    // 4. Check invitation_private vault
    const privDoc = await db.collection('invitation_private').doc(targetInvId).get();
    if (!privDoc.exists) {
      await recordFailedRateLimit(rateLimitRef, globalRateRef);
      throw new HttpsError('unauthenticated', 'Invalid invitation identifier or host access code.');
    }

    const privData = privDoc.data()!;
    const storedHash = privData.hostAccessCodeHash || privData.hostPasswordHash || '';

    const { valid, needsUpgrade } = await verifyPassword(password, storedHash);
    if (!valid) {
      await recordFailedRateLimit(rateLimitRef, globalRateRef);
      throw new HttpsError('unauthenticated', 'Invalid invitation identifier or host access code.');
    }

    // Upgrade hash if legacy
    if (needsUpgrade) {
      const salt = crypto.randomBytes(16);
      const newScrypt = await hashWithScrypt(password, salt);
      await db.collection('invitation_private').doc(targetInvId).update({
        hostAccessCodeHash: newScrypt,
        hostPasswordHash: FieldValue.delete(),
      });
    }

    // Clear rate limits on successful auth
    await rateLimitRef.delete().catch(() => {});

    // 5. Issue deterministic custom Firebase Auth token with { hostOf: invitationId }
    const deterministicUid = `host_${targetInvId}`;
    const customToken = await auth.createCustomToken(deterministicUid, {
      hostOf: targetInvId,
      role: 'host',
    });

    return {
      success: true,
      customToken,
      invitationId: targetInvId,
    };
  }
);

async function recordFailedRateLimit(rateLimitRef: any, globalRateRef: any) {
  const now = Date.now();
  await db.runTransaction(async (t) => {
    const snap = await t.get(rateLimitRef);
    const gSnap = await t.get(globalRateRef);

    const failures = (snap.exists ? snap.data()?.failures || 0 : 0) + 1;
    let lockedUntil = 0;
    if (failures >= 5) {
      const multiplier = Math.min(failures - 4, 6);
      lockedUntil = now + (15 * 60 * 1000) * multiplier; // 15m, 30m, etc.
    }

    t.set(rateLimitRef, { failures, lockedUntil, updatedAt: now }, { merge: true });

    const hourly = (gSnap.exists ? gSnap.data()?.hourlyFailures || 0 : 0) + 1;
    const resetAt = gSnap.exists && gSnap.data()?.resetAt > now ? gSnap.data().resetAt : now + 3600000;
    t.set(globalRateRef, { hourlyFailures: hourly, resetAt, updatedAt: now }, { merge: true });
  });
}

// =============================================================================
// Callable: approveOrder
// Admin-only order approval that sets status = 'published', planTier, and expiresAt
// =============================================================================

export const approveOrder = onCall(
  { region: FUNCTIONS_REGION },
  async (request) => {
    const uid = request.auth?.uid;
    const token = request.auth?.token;
    let isAdmin = Boolean(token?.admin);
    if (!isAdmin && token?.email === 'mohammedtarek2490@gmail.com' && token?.email_verified === true) {
      isAdmin = true;
    }
    if (!isAdmin && uid) {
      const adminDoc = await db.collection('admins').doc(uid).get();
      if (adminDoc.exists) {
        isAdmin = true;
      }
    }

    if (!uid || !isAdmin) {
      throw new HttpsError('permission-denied', 'Only authorized administrators can approve orders.');
    }

    const orderId = (request.data?.orderId || '').toString().trim();
    if (!orderId) {
      throw new HttpsError('invalid-argument', 'orderId is required.');
    }

    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      throw new HttpsError('not-found', 'Order not found.');
    }

    const orderData = orderDoc.data()!;
    const invitationId = orderData.invitationId;
    const planTier = orderData.planTier || 'royal_vip';

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const batch = db.batch();
    batch.update(orderDoc.ref, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: uid,
    });

    if (invitationId) {
      const invRef = db.collection('invitations').doc(invitationId);
      batch.update(invRef, {
        status: 'published',
        planTier,
        expiresAt,
        isExpired: false,
        publishedAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    return {
      success: true,
      orderId,
      invitationId,
      expiresAt,
    };
  }
);

// =============================================================================
// Scheduled Function: expireInvitations
// Daily cleanup of expired invitations past expiresAt date with token revocation
// =============================================================================

export const expireInvitations = onSchedule(
  {
    schedule: 'every 24 hours',
    region: FUNCTIONS_REGION,
  },
  async () => {
    const nowIso = new Date().toISOString();
    console.log(`[expireInvitations] Checking for published invitations expired before ${nowIso}...`);

    let totalExpired = 0;
    let lastDoc: any = null;

    while (true) {
      let query = db
        .collection('invitations')
        .where('status', '==', 'published')
        .where('expiresAt', '<', nowIso)
        .limit(400);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snap = await query.get();
      if (snap.empty) break;

      const batch = db.batch();
      for (const doc of snap.docs) {
        batch.update(doc.ref, {
          status: 'expired',
          isExpired: true,
          expiredAt: nowIso,
        });

        // Revoke active host sessions
        auth.revokeRefreshTokens(`host_${doc.id}`).catch(() => {});
        totalExpired++;
      }

      await batch.commit();
      if (snap.size < 400) break;
      lastDoc = snap.docs[snap.docs.length - 1];
    }

    console.log(`[expireInvitations] Finished daily expiration check. Total invitations marked expired: ${totalExpired}`);
  }
);

// =============================================================================
// AI Creative Director (Gemini) — server-side only.
// The client (src/lib/fridaAI.ts) calls these via httpsCallable; the API key
// never leaves this function's execution environment.
// =============================================================================

export const suggestAIDesignConfig = onCall(
  { region: FUNCTIONS_REGION, secrets: [GEMINI_API_KEY], cors: true },
  async (request) => {
    const userPrompt = String(request.data?.userPrompt || '').slice(0, 2000);
    if (!userPrompt.trim()) {
      throw new HttpsError('invalid-argument', 'userPrompt is required.');
    }

    const apiKey = GEMINI_API_KEY.value();
    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'AI is not configured.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `أنت المخرج الفني ومصمم التجارب الرقمية لمنصة FRIDA للدعوات الملكية.
المستخدم كتب الوصف التالي لزفافه أو مناسبته:
"${userPrompt}"

حلل طلب المستخدم واقترح الإعدادات الفنية والتصميمية المناسبة. ارجع النتيجة كـ JSON حقيقي يحتوي على الحقول التالية:
- themeStyle: واحد من ("luxury", "classic", "minimal", "boho", "romantic", "playful", "floral")
- openingExperience: واحد من ("royal_door", "envelope_seal", "palace_entrance", "garden_reveal", "moonlight_reveal")
- recommendedTemplateId: "frida-royal-001" أو "frida-couture-2026" أو "frida-engagement-baroque"
- colors: كائن به (bg, cardBg, text, accent) بصيغة Hex
- typography: اسم خط مثل "font-playfair" أو "font-serif" أو "font-cairo"
- wordingTone: اسم النبرة بالعربية
- suggestedPoeticMessage: نص ترحيبي أو بيتي شعر راقٍ يعبر عن الفرحة باللغة العربية`,
      config: { responseMimeType: 'application/json' },
    });

    if (!response.text) {
      throw new HttpsError('internal', 'Empty AI response.');
    }
    return JSON.parse(response.text);
  }
);

export const generateAIWording = onCall(
  { region: FUNCTIONS_REGION, secrets: [GEMINI_API_KEY], cors: true },
  async (request) => {
    const coupleNames = String(request.data?.coupleNames || '').slice(0, 200);
    const tone = String(request.data?.tone || 'ملكياً راقياً وشاعرياً').slice(0, 100);
    const additionalDetails = String(request.data?.additionalDetails || '').slice(0, 500);
    const language = request.data?.language === 'en' ? 'en' : 'ar';

    if (!coupleNames.trim()) {
      throw new HttpsError('invalid-argument', 'coupleNames is required.');
    }

    const apiKey = GEMINI_API_KEY.value();
    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'AI is not configured.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt =
      language === 'ar'
        ? `اكتب صيغة دعوة زفاف فاخرة بأسلوب منصة فريدا الدعوات الرقمية.
اسم العروسين: ${coupleNames}
النبرة والأسلوب: ${tone}
المشهد: ${additionalDetails || 'حفل زفاف راقٍ بأجواء من الدفء والمحبة'}
المطلوب: فقرة ترحيبية واحدة دافئة وراقية من 2 إلى 3 أسطر تعبر عن فرحة الأهالي والعروسين.`
        : `Write a luxury wedding invitation message for ${coupleNames} in an elegant, poetic, and heartwarming tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    if (!response.text) {
      throw new HttpsError('internal', 'Empty AI response.');
    }
    return { text: response.text.trim() };
  }
);
