/**
 * Cloudflare R2 & Hybrid Cloud Asset Storage Client for FRIDA
 * 
 * Manages structured object uploads to Cloudflare R2 bucket (`frida-assets`):
 * - audio/previews/    (15-30s compressed preview clips)
 * - audio/full/        (Full length wedding & event audio tracks)
 * - images/templates/  (Template cards, thumbnails, preview images)
 * - images/covers/     (Custom invitation cover banners)
 * - images/backgrounds/ (Thematic backgrounds & luxury textures)
 * - images/invitations/ (Customer gallery photos & groom/bride portraits)
 * - uploads/           (General uploads)
 * 
 * Provides fallback to Firebase Storage if R2 is unavailable in local dev.
 */

import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage, auth, ensureAnonymousAuth } from './firebase';

export type R2AssetFolder =
  | 'audio/previews'
  | 'audio/full'
  | 'images/templates'
  | 'images/covers'
  | 'images/backgrounds'
  | 'images/invitations'
  | 'uploads';

export interface R2UploadResult {
  url: string;
  key: string;
  storage: 'r2' | 'firebase';
  sizeBytes: number;
}

/**
 * Uploads a Blob or File to Cloudflare R2 via Worker API endpoint (/api/r2/upload)
 * with structured bucket paths and automatic fallback.
 */
export async function uploadAssetToR2(
  blob: Blob | File,
  folder: R2AssetFolder,
  fileName: string
): Promise<R2UploadResult> {
  const cleanName = fileName
    .replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_')
    .replace(/_+/g, '_');
  const targetKey = `${folder}/${Date.now()}_${cleanName}`;
  const contentType = blob.type || 'application/octet-stream';

  // 1. Try Cloudflare Worker R2 upload endpoint (/api/r2/upload)
  try {
    const formData = new FormData();
    formData.append('file', blob, cleanName);
    formData.append('path', targetKey);

    const res = await fetch('/api/r2/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return {
          url: data.url,
          key: data.key || targetKey,
          storage: 'r2',
          sizeBytes: data.size || blob.size,
        };
      }
    }
  } catch (r2Err) {
    console.warn('Worker R2 upload endpoint unavailable or offline, using fallback:', r2Err);
  }

  // 2. Fallback: Upload to Firebase Storage
  let user = auth.currentUser;
  if (!user) {
    user = await ensureAnonymousAuth();
  }
  const uid = user?.uid || 'anonymous';
  const fbPath = `users/${uid}/${targetKey}`;

  try {
    const sRef = storageRef(storage, fbPath);
    const snap = await uploadBytes(sRef, blob, { contentType });
    const cdnUrl = await getDownloadURL(snap.ref);

    return {
      url: cdnUrl,
      key: targetKey,
      storage: 'firebase',
      sizeBytes: blob.size,
    };
  } catch (fbErr) {
    console.error('All cloud storage uploads failed:', fbErr);
    // Last-resort fallback: object url or throw
    throw new Error(`Failed to upload asset to cloud storage: ${fbErr}`);
  }
}

/**
 * Deletes an asset from Cloudflare R2 (and optional Firebase storage)
 */
export async function deleteAssetFromR2(assetKeyOrUrl: string): Promise<boolean> {
  if (!assetKeyOrUrl) return false;

  // If it's an R2 URL or key
  const cleanKey = assetKeyOrUrl.replace(/^\/r2\//, '').replace(/^https?:\/\/[^\/]+\/r2\//, '');

  try {
    const res = await fetch('/api/r2/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: cleanKey }),
    });
    return res.ok;
  } catch (err) {
    console.warn('R2 delete error:', err);
    return false;
  }
}
