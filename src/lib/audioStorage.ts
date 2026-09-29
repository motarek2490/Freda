import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, ensureAnonymousAuth } from './firebase';
import { getAudioFromIDB } from './audioDb';

const MEMORY_CACHE = new Map<string, string>();

/**
 * Returns Worker origin for audio API calls in development / preview or relative path in production
 */
export function getAudioApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // In local dev or cloud preview iframe environments, point directly to the deployed Worker
    if (host === 'localhost' || host === '127.0.0.1' || host.includes('run.app')) {
      return 'https://farid.invitationes.workers.dev';
    }
  }
  return '';
}

export interface R2AudioUploadOptions {
  fileName?: string;
  type?: 'library' | 'users';
  userId?: string;
  trackId?: string;
  onProgress?: (percent: number, loadedBytes: number, totalBytes: number) => void;
}

export interface R2AudioUploadResult {
  key: string;
  url: string;
  publicUrl: string;
  size: number;
}

/**
 * Uploads an audio blob to Cloudflare R2 bucket via the Worker /api/audio/upload route.
 * Verifies Firebase Auth ID token and admin/owner claim.
 * Supports real-time upload progress tracking via onProgress callback.
 */
export async function uploadAudioToR2(
  blob: Blob,
  options: R2AudioUploadOptions = {}
): Promise<R2AudioUploadResult> {
  await ensureAnonymousAuth().catch(() => {});
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required for audio upload');
  }

  const token = await currentUser.getIdToken();
  const formData = new FormData();
  const fileName = options.fileName || `${options.trackId || 'audio'}.mp3`;
  formData.append('file', blob, fileName);
  formData.append('type', options.type || 'library');
  if (options.userId) {
    formData.append('userId', options.userId);
  }
  if (options.trackId) {
    formData.append('trackId', options.trackId);
  } else if (options.fileName) {
    formData.append('customId', options.fileName);
  }

  const baseUrl = getAudioApiBaseUrl();
  const endpoint = `${baseUrl}/api/audio/upload`;

  // Use XMLHttpRequest when available in browser for real byte-by-byte progress tracking
  const result = await new Promise<any>((resolve, reject) => {
    if (typeof XMLHttpRequest !== 'undefined') {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (options.onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
            options.onProgress?.(percent, event.loaded, event.total);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            options.onProgress?.(100, blob.size, blob.size);
            resolve(json);
          } catch (e) {
            reject(new Error('Invalid JSON response from audio upload server'));
          }
        } else {
          let errMsg = `Upload failed with status ${xhr.status}`;
          try {
            const errJson = JSON.parse(xhr.responseText);
            if (errJson.error) errMsg = errJson.error;
          } catch {}
          reject(new Error(errMsg));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during audio upload'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Audio upload timed out'));
      };

      xhr.send(formData);
    } else {
      // Fallback for non-DOM environments
      fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then(async (res) => {
          if (!res.ok) {
            let errMsg = `Upload failed with status ${res.status}`;
            try {
              const errJson = await res.json();
              if (errJson.error) errMsg = errJson.error;
            } catch {}
            throw new Error(errMsg);
          }
          return res.json();
        })
        .then((json) => {
          options.onProgress?.(100, blob.size, blob.size);
          resolve(json);
        })
        .catch(reject);
    }
  });

  const relativeUrl = result.url || `/${result.key}`;
  const publicUrl = result.publicUrl || `https://farid.invitationes.workers.dev/${result.key}`;

  // Cache in-memory
  cacheInMemoryAudio(relativeUrl, relativeUrl);
  cacheInMemoryAudio(publicUrl, publicUrl);
  if (options.trackId) {
    cacheInMemoryAudio(options.trackId, publicUrl);
  }

  return {
    key: result.key,
    url: relativeUrl,
    publicUrl,
    size: result.size || blob.size,
  };
}

/**
 * Deletes an audio object from Cloudflare R2 bucket via Worker DELETE /api/audio/{key}.
 * Non-blocking safe: returns true/false without throwing.
 */
export async function deleteAudioFromR2(urlOrKey: string): Promise<boolean> {
  if (!urlOrKey) return false;

  // Extract pure R2 key from URL or path
  let key = urlOrKey;
  if (key.includes('/audio/')) {
    key = key.substring(key.indexOf('/audio/') + 1); // e.g. "audio/library/song_123.mp3"
  } else if (key.startsWith('/')) {
    key = key.substring(1);
  }

  if (!key.startsWith('audio/')) {
    key = `audio/${key}`;
  }

  try {
    await ensureAnonymousAuth().catch(() => {});
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const token = await currentUser.getIdToken();
    const baseUrl = getAudioApiBaseUrl();
    const endpoint = `${baseUrl}/api/audio/${encodeURIComponent(key)}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.warn('Could not delete audio from R2:', err);
    return false;
  }
}

/**
 * Converts a Base64 data URL to a native Blob URL for ultra-fast audio decoding
 */
function base64ToBlobUrl(dataUrl: string): string {
  try {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'audio/mpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Could not convert base64 to blob url, using direct dataUrl:', err);
    return dataUrl;
  }
}

/**
 * Converts a Blob to a base64 Data URL
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads an audio blob to Cloud Firestore (with automatic sub-megabyte chunking).
 * Ensures audio is 100% accessible to every user on any device worldwide without requiring Cloud Storage bucket.
 */
export async function saveAudioToCloudFirestore(blob: Blob, baseId: string): Promise<string> {
  const dataUrl = await blobToBase64(blob);
  const CHUNK_SIZE = 350000; // 350KB text chunks (optimal for fast, reliable Firestore writes)

  if (dataUrl.length <= CHUNK_SIZE) {
    await setDoc(doc(db, 'cloud_audio_files', baseId), {
      dataUrl,
      isChunked: false,
      totalChunks: 1,
      sizeBytes: blob.size,
      mimeType: blob.type || 'audio/mpeg',
      createdAt: new Date().toISOString(),
    });
  } else {
    const totalChunks = Math.ceil(dataUrl.length / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const chunkStr = dataUrl.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await setDoc(doc(db, 'cloud_audio_files', `${baseId}_chk_${i}`), {
        chunkIndex: i,
        data: chunkStr,
        totalChunks,
        createdAt: new Date().toISOString(),
      });
    }

    await setDoc(doc(db, 'cloud_audio_files', baseId), {
      isChunked: true,
      totalChunks,
      sizeBytes: blob.size,
      mimeType: blob.type || 'audio/mpeg',
      createdAt: new Date().toISOString(),
    });
  }

  return `firestore-audio://${baseId}`;
}

export function cacheInMemoryAudio(ref: string, url: string): void {
  MEMORY_CACHE.set(ref, url);
}

/**
 * Resolves any audio track URL or reference into a playable URL (HTTPS or direct asset path).
 * Works across all mobile devices, tablets, and browsers.
 */
export async function resolveAudioTrackUrl(urlOrRef?: string): Promise<string> {
  if (!urlOrRef) return '';

  // Intercept expired / blocked Pixabay hotlinks
  if (urlOrRef.includes('cdn.pixabay.com') || urlOrRef.includes('pixabay.com/download')) {
    return '';
  }

  // 1. Check in-memory cache first
  if (MEMORY_CACHE.has(urlOrRef)) {
    return MEMORY_CACHE.get(urlOrRef)!;
  }

  // 0. Cloudflare R2 Audio paths (/audio/... or audio/...)
  if (urlOrRef.startsWith('/audio/')) {
    const baseUrl = getAudioApiBaseUrl();
    const resolved = baseUrl ? `${baseUrl}${urlOrRef}` : urlOrRef;
    MEMORY_CACHE.set(urlOrRef, resolved);
    return resolved;
  }
  if (urlOrRef.startsWith('audio/')) {
    const baseUrl = getAudioApiBaseUrl();
    const resolved = baseUrl ? `${baseUrl}/${urlOrRef}` : `/${urlOrRef}`;
    MEMORY_CACHE.set(urlOrRef, resolved);
    return resolved;
  }

  // Direct local or root-relative path (e.g. /music/...)
  if (urlOrRef.startsWith('/')) {
    return urlOrRef;
  }

  // Handle blob URLs safely (blob URLs created on another device will fail, so handle gracefully)
  if (urlOrRef.startsWith('blob:')) {
    try {
      const res = await fetch(urlOrRef);
      if (res.ok) return urlOrRef;
    } catch {
      console.warn('Local blob URL not found on this device session:', urlOrRef);
      return '';
    }
  }

  // Direct remote HTTPS audio link
  if (urlOrRef.startsWith('http://') || urlOrRef.startsWith('https://')) {
    // If it's a Firebase Storage link, pre-cache or return
    if (urlOrRef.includes('firebasestorage.googleapis.com')) {
      try {
        const res = await fetch(urlOrRef);
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          MEMORY_CACHE.set(urlOrRef, blobUrl);
          return blobUrl;
        }
      } catch (err) {
        console.warn('Direct fetch for Firebase Storage link warning, using raw URL:', err);
      }
    }
    return urlOrRef;
  }

  // Direct base64 data URL
  if (urlOrRef.startsWith('data:audio/')) {
    const blobUrl = base64ToBlobUrl(urlOrRef);
    MEMORY_CACHE.set(urlOrRef, blobUrl);
    return blobUrl;
  }

  // Firestore-stored Cloud Audio File reference or track ID
  const isFirestoreAudioRef = urlOrRef.startsWith('firestore-audio://');
  const docId = isFirestoreAudioRef ? urlOrRef.replace('firestore-audio://', '') : urlOrRef;

  // Check local IndexedDB fast path first (instant playback for the uploader)
  try {
    const localCached = await getAudioFromIDB(docId) || await getAudioFromIDB(`${docId}_audio`);
    if (localCached) {
      let blobUrl = '';
      if (typeof localCached === 'string') {
        blobUrl = base64ToBlobUrl(localCached);
      } else {
        blobUrl = URL.createObjectURL(localCached);
      }
      MEMORY_CACHE.set(urlOrRef, blobUrl);
      return blobUrl;
    }
  } catch {}

  // Fetch Cloud Audio document from Firestore collection `cloud_audio_files`
  try {
    const audioDoc = await getDoc(doc(db, 'cloud_audio_files', docId));
    if (audioDoc.exists()) {
      const data = audioDoc.data();
      if (data?.dataUrl) {
        const blobUrl = base64ToBlobUrl(data.dataUrl);
        MEMORY_CACHE.set(urlOrRef, blobUrl);
        return blobUrl;
      }

      if (data?.isChunked && data?.totalChunks) {
        const chunkPromises: Promise<string>[] = [];
        for (let i = 0; i < data.totalChunks; i++) {
          chunkPromises.push(
            getDoc(doc(db, 'cloud_audio_files', `${docId}_chk_${i}`)).then(
              (snap) => snap.data()?.data || ''
            )
          );
        }
        const chunkStrings = await Promise.all(chunkPromises);
        const fullDataUrl = chunkStrings.join('');
        const blobUrl = base64ToBlobUrl(fullDataUrl);
        MEMORY_CACHE.set(urlOrRef, blobUrl);
        return blobUrl;
      }
    }
  } catch (err) {
    console.warn('Could not fetch cloud audio document from Firestore:', err);
  }

  // Check Cloud Firestore music_library catalog if it's a catalog track ID
  try {
    const musicDoc = await getDoc(doc(db, 'music_library', docId));
    if (musicDoc.exists()) {
      const mData = musicDoc.data();
      const innerUrl = mData?.audioUrl || mData?.url;
      if (innerUrl && innerUrl !== urlOrRef) {
        const resolved = await resolveAudioTrackUrl(innerUrl);
        if (resolved) {
          MEMORY_CACHE.set(urlOrRef, resolved);
          return resolved;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch audio track from music_library:', err);
  }

  return isFirestoreAudioRef ? '' : urlOrRef;
}
