/**
 * Script: set-admin-claim.ts
 * Assigns custom claim { admin: true } to a specific Firebase Auth user by email or UID.
 * 
 * Usage:
 *   npx tsx scripts/set-admin-claim.ts --email=admin@example.com
 *   or
 *   npx tsx scripts/set-admin-claim.ts --uid=USER_UID_HERE
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const FIREBASE_DB_ID = '(default)';

if (getApps().length === 0) {
  initializeApp();
}

const auth = getAuth();
const db = getFirestore(getApps()[0], FIREBASE_DB_ID);

async function setAdminClaim() {
  const args = process.argv.slice(2);
  let email = '';
  let uid = '';

  for (const arg of args) {
    if (arg.startsWith('--email=')) {
      email = arg.split('=')[1].trim();
    } else if (arg.startsWith('--uid=')) {
      uid = arg.split('=')[1].trim();
    }
  }

  if (!email && !uid) {
    console.error('❌ Error: Please specify either --email=... or --uid=...');
    process.exit(1);
  }

  let userRecord;
  if (email) {
    console.log(`🔍 Looking up user by email: ${email}`);
    userRecord = await auth.getUserByEmail(email);
  } else {
    console.log(`🔍 Looking up user by UID: ${uid}`);
    userRecord = await auth.getUser(uid);
  }

  console.log(`👤 Found user: ${userRecord.email} (UID: ${userRecord.uid})`);

  // Set custom claims
  await auth.setCustomUserClaims(userRecord.uid, {
    admin: true,
  });

  // Also record in /admins/{uid} collection for double redundancy in firestore.rules
  await db.collection('admins').doc(userRecord.uid).set({
    uid: userRecord.uid,
    email: userRecord.email || '',
    grantedAt: new Date().toISOString(),
    role: 'super_admin',
  });

  console.log(`✅ Successfully assigned { admin: true } custom claim and /admins entry for UID: ${userRecord.uid}`);
  console.log(`ℹ️ Note: The user may need to re-authenticate or refresh their token (getIdTokenResult(true)) for the new claim to take effect.`);
}

setAdminClaim().catch((err) => {
  console.error('❌ Failed to assign admin claim:', err);
  process.exit(1);
});
