import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const MEMORY_CACHE = new Map<string, string>();

/**
 * Resolves any audio track URL or reference into a playable URL (HTTPS or direct asset path).
 * Direct remote or local paths are returned immediately.
 */
export async function resolveAudioTrackUrl(urlOrRef?: string): Promise<string> {
  if (!urlOrRef) return '';

  // Intercept expired / blocked Pixabay hotlinks and redirect to permanent local track
  if (urlOrRef.includes('cdn.pixabay.com') || urlOrRef.includes('pixabay.com/download')) {
    return '/music/royal-wedding-waltz.mp3';
  }

  // Direct local or root-relative path (e.g. /music/...)
  if (urlOrRef.startsWith('/')) {
    return urlOrRef;
  }

  // Direct remote HTTPS audio link
  if (urlOrRef.startsWith('http://') || urlOrRef.startsWith('https://') || urlOrRef.startsWith('blob:')) {
    return urlOrRef;
  }

  // Direct data URL
  if (urlOrRef.startsWith('data:audio/')) {
    return urlOrRef;
  }

  // 1. Check in-memory cache
  if (MEMORY_CACHE.has(urlOrRef)) {
    return MEMORY_CACHE.get(urlOrRef)!;
  }

  // 2. Fetch from Cloud Firestore music_library catalog if it's a catalog track ID
  try {
    const musicDoc = await getDoc(doc(db, 'music_library', urlOrRef));
    if (musicDoc.exists() && musicDoc.data()?.url) {
      const resolved = musicDoc.data().url;
      MEMORY_CACHE.set(urlOrRef, resolved);
      return resolved;
    }
  } catch (err) {
    console.warn('Could not fetch audio track from music_library:', err);
  }

  return urlOrRef;
}
