/**
 * Script: migrate-supabase-media.ts
 * Scans Firestore collections for any remaining Supabase URLs,
 * downloads the media files, uploads them to Firebase Storage, and updates Firestore.
 * 
 * Usage:
 *   npx tsx scripts/migrate-supabase-media.ts [--dry-run]
 */

import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const FIREBASE_DB_ID = 'ai-studio-vowly-eb6a19f5-9126-4bbb-b06c-270aac6778bf';

if (getApps().length === 0) {
  initializeApp();
}

const app = getApp();
const db = getFirestore(app, FIREBASE_DB_ID);
const storageBucket = getStorage(app).bucket();

async function downloadAndUpload(url: string, destinationPath: string, contentType: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const file = storageBucket.file(destinationPath);
  await file.save(buffer, {
    metadata: { contentType },
    public: true,
  });

  return file.publicUrl();
}

async function runMediaMigration() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`=== FRIDA Supabase -> Firebase Storage Migration [${isDryRun ? 'DRY RUN' : 'LIVE'}] ===`);

  // 1. Music Library
  const musicSnap = await db.collection('music_library').get();
  for (const doc of musicSnap.docs) {
    const data = doc.data();
    if (data.url && data.url.includes('supabase.co')) {
      console.log(`Migrating music track: ${doc.id} -> ${data.url}`);
      if (!isDryRun) {
        try {
          const dest = `library/audio/${doc.id}_${Date.now()}.mp3`;
          const newUrl = await downloadAndUpload(data.url, dest, 'audio/mpeg');
          await doc.ref.update({ url: newUrl });
          console.log(`✅ Updated track ${doc.id} with new URL: ${newUrl}`);
        } catch (err) {
          console.error(`❌ Failed to migrate music track ${doc.id}:`, err);
        }
      }
    }
  }

  // 2. Invitations (images / custom music)
  const invSnap = await db.collection('invitations').get();
  for (const doc of invSnap.docs) {
    const data = doc.data();
    let needsUpdate = false;
    const updatePayload: Record<string, any> = {};

    if (data.musicTrackUrl && data.musicTrackUrl.includes('supabase.co')) {
      console.log(`Migrating invitation music: ${doc.id} -> ${data.musicTrackUrl}`);
      if (!isDryRun) {
        try {
          const dest = `users/${data.ownerUid || 'migrated'}/audio/${doc.id}_${Date.now()}.mp3`;
          const newUrl = await downloadAndUpload(data.musicTrackUrl, dest, 'audio/mpeg');
          updatePayload.musicTrackUrl = newUrl;
          needsUpdate = true;
        } catch (err) {
          console.error(`Failed to migrate music for invitation ${doc.id}:`, err);
        }
      }
    }

    if (Array.isArray(data.galleryImages)) {
      const newGallery: string[] = [];
      let galleryChanged = false;
      for (let i = 0; i < data.galleryImages.length; i++) {
        const imgUrl = data.galleryImages[i];
        if (typeof imgUrl === 'string' && imgUrl.includes('supabase.co')) {
          if (!isDryRun) {
            try {
              const dest = `users/${data.ownerUid || 'migrated'}/images/${doc.id}_gal_${i}_${Date.now()}.jpg`;
              const newUrl = await downloadAndUpload(imgUrl, dest, 'image/jpeg');
              newGallery.push(newUrl);
              galleryChanged = true;
            } catch {
              newGallery.push(imgUrl);
            }
          } else {
            newGallery.push(imgUrl);
          }
        } else {
          newGallery.push(imgUrl);
        }
      }
      if (galleryChanged) {
        updatePayload.galleryImages = newGallery;
        needsUpdate = true;
      }
    }

    if (needsUpdate && !isDryRun) {
      await doc.ref.update(updatePayload);
      console.log(`✅ Updated invitation ${doc.id} media URLs`);
    }
  }

  console.log('=== Media Migration Completed ===');
}

runMediaMigration().catch((err) => {
  console.error('Media migration error:', err);
  process.exit(1);
});
