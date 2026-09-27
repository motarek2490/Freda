/**
 * Cloudflare R2 & WebP Mobile-Friendly Image Compression & Upload Utility for FRIDA
 * Automatically compresses large phone camera photos (PNG/JPG up to 25MB)
 * to crystal-clear WebP / JPEG images and uploads directly to Cloudflare R2
 * (`images/invitations/` or `images/covers/`) for edge CDN delivery.
 */

import { uploadAssetToR2, R2AssetFolder } from './r2Storage';

export interface ImageUploadResult {
  url: string;
  key?: string;
  source: 'r2' | 'firebase' | 'local_compressed';
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
  return new Promise((resolve, reject) => {
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
 * 2. Uploads directly to Cloudflare R2 bucket
 * 3. Falls back gracefully to Firebase Storage or compressed lightweight data URL
 */
export async function processAndUploadImage(
  file: File,
  tag: string = 'invitation_photo',
  folder: R2AssetFolder = 'images/invitations'
): Promise<ImageUploadResult> {
  // 1. Compress image to phone-optimized WebP
  const compressedBlob = await compressImageFile(file, 1920, 0.84);

  // 2. Upload to Cloudflare R2
  try {
    const r2Result = await uploadAssetToR2(compressedBlob, folder, `${tag}.webp`);
    if (r2Result && r2Result.url) {
      return {
        url: r2Result.url,
        key: r2Result.key,
        source: r2Result.storage,
        sizeBytes: r2Result.sizeBytes,
      };
    }
  } catch (err) {
    console.warn('R2 and Cloud storage upload warning, falling back to local compressed data URL:', err);
  }

  // 3. Fallback: lightweight compressed data URL
  const dataUrl = await blobToDataURL(compressedBlob);
  return {
    url: dataUrl,
    source: 'local_compressed',
    sizeBytes: compressedBlob.size,
  };
}
