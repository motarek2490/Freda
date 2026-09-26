import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const MEMORY_CACHE = new Map<string, string>();

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
 * Resolves any audio track URL or reference into a playable URL (HTTPS or direct asset path).
 * Works across all mobile devices, tablets, and browsers.
 */
export async function resolveAudioTrackUrl(urlOrRef?: string): Promise<string> {
  if (!urlOrRef) return '';

  // Intercept expired / blocked Pixabay hotlinks and redirect to permanent local track
  if (urlOrRef.includes('cdn.pixabay.com') || urlOrRef.includes('pixabay.com/download')) {
    return '/music/royal-wedding-waltz.mp3';
  }

  // 1. Check in-memory cache first
  if (MEMORY_CACHE.has(urlOrRef)) {
    return MEMORY_CACHE.get(urlOrRef)!;
  }

  // Direct local or root-relative path (e.g. /music/...)
  if (urlOrRef.startsWith('/')) {
    return urlOrRef;
  }

  // Direct remote HTTPS audio link
  if (urlOrRef.startsWith('http://') || urlOrRef.startsWith('https://') || urlOrRef.startsWith('blob:')) {
    return urlOrRef;
  }

  // Direct base64 data URL
  if (urlOrRef.startsWith('data:audio/')) {
    const blobUrl = base64ToBlobUrl(urlOrRef);
    MEMORY_CACHE.set(urlOrRef, blobUrl);
    return blobUrl;
  }

  // Firestore-stored Cloud Audio File reference
  if (urlOrRef.startsWith('firestore-audio://')) {
    const docId = urlOrRef.replace('firestore-audio://', '');
    try {
      const audioDoc = await getDoc(doc(db, 'cloud_audio_files', docId));
      if (audioDoc.exists() && audioDoc.data()?.dataUrl) {
        const rawDataUrl = audioDoc.data().dataUrl;
        const blobUrl = base64ToBlobUrl(rawDataUrl);
        MEMORY_CACHE.set(urlOrRef, blobUrl);
        return blobUrl;
      }
    } catch (err) {
      console.warn('Could not fetch cloud audio document from Firestore:', err);
    }
  }

  // Check Cloud Firestore music_library catalog if it's a catalog track ID
  try {
    const musicDoc = await getDoc(doc(db, 'music_library', urlOrRef));
    if (musicDoc.exists() && musicDoc.data()?.url) {
      const innerUrl = musicDoc.data().url;
      const resolved = await resolveAudioTrackUrl(innerUrl);
      MEMORY_CACHE.set(urlOrRef, resolved);
      return resolved;
    }
  } catch (err) {
    console.warn('Could not fetch audio track from music_library:', err);
  }

  return urlOrRef;
}
