/**
 * Script: migrate-broken-audio-refs.ts
 *
 * Scans Firestore collections (invitations, music_library, custom_templates, orders, audio_tracks)
 * for legacy/broken audio references (frida-audio:// or audio-cloud://).
 *
 * Lists every affected document, field path, and reference so they can be manually
 * re-uploaded to Firebase Cloud Storage.
 *
 * Usage:
 *   npx tsx scripts/migrate-broken-audio-refs.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load applet firebase configuration
let firebaseConfig: any;
try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error('Could not load firebase-applet-config.json:', e);
  process.exit(1);
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const databaseId = firebaseConfig.firestoreDatabaseId || undefined;

let db: Firestore;
try {
  db = databaseId ? initializeFirestore(app, {}, databaseId) : getFirestore(app);
} catch {
  db = getFirestore(app);
}

export interface BrokenAudioRef {
  collection: string;
  docId: string;
  fieldPath: string;
  referenceUrl: string;
  docTitle?: string;
  ownerUid?: string;
  createdAt?: string;
}

function scanObjectForBrokenAudio(
  obj: any,
  currentPath = ''
): Array<{ fieldPath: string; url: string }> {
  const findings: Array<{ fieldPath: string; url: string }> = [];
  if (!obj || typeof obj !== 'object') return findings;

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;
    if (typeof value === 'string') {
      if (value.startsWith('frida-audio://') || value.startsWith('audio-cloud://')) {
        findings.push({ fieldPath: fullPath, url: value });
      }
    } else if (value && typeof value === 'object') {
      findings.push(...scanObjectForBrokenAudio(value, fullPath));
    }
  }

  return findings;
}

export async function listBrokenAudioReferences(): Promise<BrokenAudioRef[]> {
  console.log('🔍 Starting scan for broken audio references (frida-audio:// & audio-cloud://)...');
  console.log(`Database: ${databaseId || 'default'}`);

  const collectionsToScan = [
    'invitations',
    'music_library',
    'custom_templates',
    'orders',
    'audio_tracks',
  ];

  const brokenRefs: BrokenAudioRef[] = [];

  for (const colName of collectionsToScan) {
    try {
      console.log(`\n📂 Scanning collection: /${colName}...`);
      const snapshot = await getDocs(collection(db, colName));
      console.log(`   Found ${snapshot.docs.length} documents in /${colName}`);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const matches = scanObjectForBrokenAudio(data);

        for (const match of matches) {
          brokenRefs.push({
            collection: colName,
            docId: docSnap.id,
            fieldPath: match.fieldPath,
            referenceUrl: match.url,
            docTitle: data.title || data.label || data.eventDetails?.eventTitle,
            ownerUid: data.ownerUid,
            createdAt: data.createdAt,
          });
        }
      }
    } catch (err: any) {
      console.warn(`   ⚠️ Could not read collection /${colName}: ${err.message || err}`);
    }
  }

  return brokenRefs;
}

export async function run() {
  const brokenRefs = await listBrokenAudioReferences();

  console.log('\n=============================================================');
  console.log('               تقرير مراجع الصوت القديمة المكتشفة             ');
  console.log('=============================================================');

  if (brokenRefs.length === 0) {
    console.log('✅ لم يتم العثور على أي روابط صوت قديمة (frida-audio:// أو audio-cloud://).');
    console.log('   جميع المستندات تستخدم روابط نظيفة أو متوافقة.');
  } else {
    console.log(`⚠️ تم العثور على (${brokenRefs.length}) مرجع صوتي يحتاج لإعادة رفع يدوي:\n`);

    brokenRefs.forEach((item, index) => {
      console.log(`[${index + 1}] المجموعة: ${item.collection} | المعرّف: ${item.docId}`);
      console.log(`    الحقل: ${item.fieldPath}`);
      console.log(`    الرابط القديم: ${item.referenceUrl}`);
      if (item.docTitle) console.log(`    العنوان/الوصف: ${item.docTitle}`);
      if (item.ownerUid) console.log(`    مالك المستند (ownerUid): ${item.ownerUid}`);
      if (item.createdAt) console.log(`    تاريخ الإنشاء: ${item.createdAt}`);
      console.log('    ---------------------------------------------------------');
    });

    const exportPath = path.resolve(process.cwd(), 'scripts/broken-audio-refs.json');
    fs.writeFileSync(exportPath, JSON.stringify(brokenRefs, null, 2), 'utf8');
    console.log(`\n💾 تم حفظ القائمة كاملة بتنسيق JSON في: ${exportPath}`);
  }

  console.log('=============================================================\n');
}

if (process.argv[1]?.includes('migrate-broken-audio-refs')) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration scan error:', err);
      process.exit(1);
    });
}
