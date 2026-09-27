/**
 * Firebase Storage & WebP Mobile-Friendly Image Compression & Upload Utility for FRIDA
 * Automatically compresses large phone camera photos (PNG/JPG up to 25MB)
 * to crystal-clear WebP / JPEG images and uploads directly to Firebase Storage.
 */

import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth, ensureAnonymousAuth } from './firebase';

export type StorageFolder =
  | 'images/invitations'
  | 'images/covers'
  | 'images/gallery'
  | 'images/templates'
  | 'images/backgrounds'
  | 'uploads';

// Backwards-compatible alias
export type R2AssetFolder = StorageFolder;

export interface ImageUploadResult {
  url: string;
  key?: string;
  source: 'firebase' | 'local_compressed';
  sizeBytes: number;
}

/**
 * Compresses an image file client-side using HTML Canvas & WebP/JPEG encoding.
 * Keeps aspect ratio with max dimension and optimal quality.
 */
export async function compressImageFile(
  file: File,
  maxDimension: number = 1920,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve) => {
    const processImage = (img: HTMLImageElement | ImageBitmap) => {
      const { width, height } = img;
      let targetWidth = width;
      let targetHeight = height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          targetWidth = maxDimension;
          targetHeight = Math.round((height * maxDimension) / width);
        } else {
          targetHeight = maxDimension;
          targetWidth = Math.round((width * maxDimension) / height);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Prefer WebP if supported by canvas
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback to JPEG
            canvas.toBlob(
              (jpgBlob) => resolve(jpgBlob || file),
              'image/jpeg',
              quality
            );
          }
        },
        'image/webp',
        quality
      );
    };

    if (typeof createImageBitmap !== 'undefined') {
      createImageBitmap(file)
        .then((bitmap) => {
          processImage(bitmap);
        })
        .catch(() => {
          fallbackFileReader();
        });
    } else {
      fallbackFileReader();
    }

    function fallbackFileReader() {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImage(img);
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    }
  });
}

/**
 * Converts a Blob to a base64 Data URL (safe small compressed fallback)
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(blob);
  });
}

/**
 * High-level function to process and upload an image from mobile/desktop:
 * 1. Compresses client-side in under ~150ms to WebP
 * 2. Uploads directly to Firebase Storage (`users/{uid}/...`)
 * 3. Falls back gracefully to lightweight data URL if offline
 */
export async function processAndUploadImage(
  file: File,
  tag: string = 'invitation_photo',
  folder: StorageFolder = 'images/invitations'
): Promise<ImageUploadResult> {
  // 1. Compress image to phone-optimized WebP
  const compressedBlob = await compressImageFile(file, 1920, 0.84);

  // 2. Upload to Firebase Storage
  try {
    let user = auth.currentUser;
    if (!user) {
      user = await ensureAnonymousAuth();
    }
    const uid = user?.uid || 'anonymous';
    const cleanTag = tag.replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_');
    const path = `users/${uid}/${folder}/${Date.now()}_${cleanTag}.webp`;

    const sRef = storageRef(storage, path);
    const snap = await Promise.race([
      uploadBytes(sRef, compressedBlob, {
        contentType: 'image/webp',
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase Storage image upload timeout')), 3000)
      ),
    ]);
    const downloadUrl = await getDownloadURL(snap.ref);

    if (downloadUrl) {
      return {
        url: downloadUrl,
        key: path,
        source: 'firebase',
        sizeBytes: compressedBlob.size,
      };
    }
  } catch (err) {
    console.warn('Firebase storage upload failed, falling back to local compressed data URL:', err);
  }

  // 3. Fallback: lightweight compressed data URL
  const dataUrl = await blobToDataURL(compressedBlob);
  return {
    url: dataUrl,
    source: 'local_compressed',
    sizeBytes: compressedBlob.size,
  };
}
