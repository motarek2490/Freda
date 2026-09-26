/**
 * Production-Hardened Migration Script
 * 
 * Usage:
 *   npx tsx scripts/migrate-invitations-private.ts --admin-uid=REAL_ADMIN_UID [--dry-run]
 */

import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const FIREBASE_DB_ID = 'ai-studio-vowly-eb6a19f5-9126-4bbb-b06c-270aac6778bf';

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore(getApp(), FIREBASE_DB_ID);

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

function generateSecureAccessCode(): string {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 12; i++) {
    const idx = crypto.randomInt(0, alphabet.length);
    code += alphabet[idx];
  }
  return code;
}

export async function runMigration() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  let fallbackAdminUid = '';

  for (const arg of args) {
    if (arg.startsWith('--admin-uid=')) {
      fallbackAdminUid = arg.split('=')[1].trim();
    }
  }

  if (!fallbackAdminUid && !isDryRun) {
    console.warn('⚠️ Warning: No --admin-uid provided. Any orphaned invitations will require manual ownerUid assignment.');
  }

  console.log(`=== FRIDA Secure Migration Tool [${isDryRun ? 'DRY RUN' : 'LIVE EXECUTION'}] ===`);

  const outputDir = path.resolve(process.cwd(), 'migration-output');
  if (!fs.existsSync(outputDir) && !isDryRun) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvRows: string[] = ['invitationId,slug,newCode'];
  let processedInvitations = 0;
  let deletedAliases = 0;
  let createdSlugs = 0;
  let backfilledWishes = 0;
  let backfilledReviews = 0;
  let sanitizedOrders = 0;

  // 1. Process Invitations & Slugs
  const invSnap = await db.collection('invitations').get();
  console.log(`📦 Found ${invSnap.size} total invitation documents.`);

  for (const docSnap of invSnap.docs) {
    try {
      const data = docSnap.data();
      const docId = docSnap.id;

      // Detect legacy alias doc (docId is slug or has canonicalId)
      const isAlias = data.canonicalId && data.canonicalId !== docId;
      if (isAlias) {
        console.log(`🗑️ Deleting legacy alias document: ${docId} -> canonical: ${data.canonicalId}`);
        if (!isDryRun) {
          await docSnap.ref.delete();
        }
        deletedAliases++;
        continue;
      }

      const slug = data.slug || docId;
      const ownerUid = data.ownerUid || fallbackAdminUid;

      // Check for sensitive fields to strip and regenerate
      const hasSecrets = Boolean(
        data.hostPassword || data.hostAccessCode || data.hostUsername || data.customerPhone || data.credentials
      );

      const newCode = generateSecureAccessCode();
      const salt = crypto.randomBytes(16);
      const scryptHash = await hashWithScrypt(newCode, salt);

      if (!isDryRun) {
        // A. Store in invitation_private
        await db.collection('invitation_private').doc(docId).set(
          {
            id: docId,
            invitationId: docId,
            ownerUid: ownerUid || 'pending_assignment',
            hostAccessCodeHash: scryptHash,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        // B. Strip sensitive fields from public doc
        const updatePayload: Record<string, any> = {
          hostPassword: FieldValue.delete(),
          hostAccessCode: FieldValue.delete(),
          hostUsername: FieldValue.delete(),
          customerPhone: FieldValue.delete(),
          credentials: FieldValue.delete(),
          hostCredentials: FieldValue.delete(),
        };

        if (!data.ownerUid && ownerUid) {
          updatePayload.ownerUid = ownerUid;
        }

        await docSnap.ref.update(updatePayload);

        // C. Create/sync /slugs/{slug} document
        if (slug && ownerUid) {
          await db.collection('slugs').doc(slug.toLowerCase()).set({
            invitationId: docId,
            ownerUid: ownerUid,
            createdAt: data.createdAt || new Date().toISOString(),
          });
          createdSlugs++;
        }
      }

      csvRows.push(`"${docId}","${slug}","${newCode}"`);
      processedInvitations++;
    } catch (docErr) {
      console.error(`❌ Error migrating invitation ${docSnap.id}:`, docErr);
    }
  }

  // 2. Backfill approved: true on all existing wishes
  const wishesSnap = await db.collection('wishes').get();
  for (const wDoc of wishesSnap.docs) {
    try {
      const data = wDoc.data();
      if (data.approved === undefined) {
        if (!isDryRun) {
          await wDoc.ref.update({ approved: true });
        }
        backfilledWishes++;
      }
    } catch (err) {
      console.warn(`Error backfilling wish ${wDoc.id}:`, err);
    }
  }

  // 3. Backfill approved: true on all existing reviews
  const reviewsSnap = await db.collection('reviews').get();
  for (const rDoc of reviewsSnap.docs) {
    try {
      const data = rDoc.data();
      if (data.approved === undefined) {
        if (!isDryRun) {
          await rDoc.ref.update({ approved: true });
        }
        backfilledReviews++;
      }
    } catch (err) {
      console.warn(`Error backfilling review ${rDoc.id}:`, err);
    }
  }

  // 4. Sanitize orders: remove any plaintext hostCredentials or passwords
  const ordersSnap = await db.collection('orders').get();
  for (const oDoc of ordersSnap.docs) {
    try {
      const data = oDoc.data();
      if (data.hostCredentials || data.credentials || data.invitationSnapshot?.hostPassword) {
        if (!isDryRun) {
          const update: Record<string, any> = {
            hostCredentials: FieldValue.delete(),
            credentials: FieldValue.delete(),
          };
          if (data.invitationSnapshot) {
            const cleanSnap = { ...data.invitationSnapshot };
            delete cleanSnap.hostPassword;
            delete cleanSnap.hostAccessCode;
            delete cleanSnap.hostUsername;
            delete cleanSnap.customerPhone;
            update.invitationSnapshot = cleanSnap;
          }
          await oDoc.ref.update(update);
        }
        sanitizedOrders++;
      }
    } catch (err) {
      console.warn(`Error sanitizing order ${oDoc.id}:`, err);
    }
  }

  // 5. Write new credentials CSV
  if (!isDryRun) {
    const csvPath = path.join(outputDir, 'new-credentials.csv');
    fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
    console.log(`\n🔒 New credentials exported to: ${csvPath}`);
    console.log('⚠️ WARNING: Deliver these new access codes to respective hosts through secure channels.');
  }

  console.log('\n=== MIGRATION SUMMARY ===');
  console.log(`✅ Invitations Processed: ${processedInvitations}`);
  console.log(`✅ Legacy Aliases Cleaned: ${deletedAliases}`);
  console.log(`✅ Slugs Mapped: ${createdSlugs}`);
  console.log(`✅ Wishes Backfilled: ${backfilledWishes}`);
  console.log(`✅ Reviews Backfilled: ${backfilledReviews}`);
  console.log(`✅ Orders Sanitized: ${sanitizedOrders}`);
  console.log('=========================\n');
}

if (process.argv[1]?.includes('migrate-invitations-private')) {
  runMigration().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
