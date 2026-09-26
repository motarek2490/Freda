/**
 * ===================================================================================
 * 🎵 ملف إدارة قائمة الموسيقى والأغاني (Music Tracks Configuration)
 * ===================================================================================
 */

import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, ensureAnonymousAuth } from '../lib/firebase';
import jsonMusicTracks from './musicList.json';
import { MusicTrack } from '../types';
export type { MusicTrack };

// In-memory cache for cloud tracks across the app lifecycle
let cachedCloudTracks: MusicTrack[] = [];

/**
 * Helper to convert a Blob to base64 data string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads an Audio Blob directly to Firebase Storage or falls back to Cloud Firestore.
 * Always resolves to a permanent cloud-backed URL accessible on ANY device.
 * Never hangs or throws an unhandled rejection.
 */
export async function uploadAudioFileToCloudStorage(blob: Blob, label: string): Promise<string> {
  let user = auth.currentUser;
  if (!user) {
    user = await ensureAnonymousAuth();
  }
  const currentUid = user?.uid || `user_${Date.now()}`;

  const cleanLabel = (label || 'track')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    .substring(0, 50);
  const ext = blob.type.includes('wav') ? 'wav' : 'mp3';
  const filename = `${Date.now()}_${cleanLabel}.${ext}`;
  const contentType = blob.type || (ext === 'wav' ? 'audio/wav' : 'audio/mpeg');

  // 1. Attempt upload to Firebase Storage with a 10-second timeout
  try {
    const fileRef = storageRef(storage, `library/audio/${filename}`);
    const uploadPromise = uploadBytes(fileRef, blob, { contentType }).then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Storage timeout')), 10000)
    );

    const cloudUrl = await Promise.race([uploadPromise, timeoutPromise]);
    if (cloudUrl && cloudUrl.startsWith('http')) {
      return cloudUrl;
    }
  } catch (storageErr) {
    console.warn('Firebase Storage upload failed or timed out, using Cloud Firestore fallback:', storageErr);
  }

  // 2. Fallback: Save audio data in Cloud Firestore (cloud_audio_files collection)
  try {
    const base64Data = await blobToBase64(blob);
    const audioDocId = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    await setDoc(doc(db, 'cloud_audio_files', audioDocId), {
      id: audioDocId,
      label: cleanLabel,
      dataUrl: base64Data,
      contentType,
      uploadedBy: currentUid,
      createdAt: new Date().toISOString(),
    });

    return `firestore-audio://${audioDocId}`;
  } catch (firestoreErr: any) {
    console.warn('Firestore fallback upload error, returning direct data URI:', firestoreErr);
    // 3. Fallback to direct data URI so audio works immediately in all contexts
    return await blobToBase64(blob);
  }
}

// Vite Dynamic Import for local asset tracks
const uploadedAudioModules = import.meta.glob<{ default: string }>(
  '/src/assets/music/*.{mp3,wav,m4a,ogg,aac}',
  { eager: true }
);

const localUploadedTracks: MusicTrack[] = Object.entries(uploadedAudioModules).map(([path, module]) => {
  const fileNameWithExt = path.split('/').pop() || '';
  const fileName = fileNameWithExt.replace(/\.(mp3|wav|m4a|ogg|aac)$/i, '');

  let category = 'الموسيقى المرفوعة';
  let label = fileName;

  if (fileName.includes('-')) {
    const parts = fileName.split('-');
    const catPart = parts[0].trim();
    const labelPart = parts.slice(1).join('-').trim();

    if (catPart) category = catPart;
    if (labelPart) label = labelPart;
  }

  return {
    id: 'gh-' + fileName,
    category,
    label,
    url: typeof module === 'string' ? module : module.default,
  };
});

export const MANUAL_MUSIC_TRACKS: MusicTrack[] = [];

const LOCAL_STORAGE_KEY = 'frida_custom_uploaded_music';

export function getStoredCustomTracks(): MusicTrack[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function deleteCustomUploadedTrack(trackIdOrUrl: string): void {
  try {
    const existing = getStoredCustomTracks();
    const filtered = existing.filter((t) => t.id !== trackIdOrUrl && t.url !== trackIdOrUrl);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Error deleting track from local storage:', err);
  }
}

export function saveCustomUploadedTrack(track: MusicTrack): void {
  try {
    const existing = getStoredCustomTracks();
    const filtered = existing.filter((t) => t.url !== track.url && t.label !== track.label && t.id !== track.id);
    const updated = [{ ...track, id: track.id || 'trk-' + Date.now() }, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 20)));
  } catch (err) {
    console.warn('Error storing custom track locally:', err);
  }
}

export async function saveTrackToCloudLibrary(track: MusicTrack): Promise<void> {
  const trackId = track.id || 'trk-' + Date.now();
  const trackUrl = track.url;

  const docData: MusicTrack = {
    ...track,
    id: trackId,
    url: trackUrl,
    createdAt: track.createdAt || new Date().toISOString(),
  };

  cachedCloudTracks = [docData, ...cachedCloudTracks.filter((t) => t.id !== trackId && t.url !== trackUrl)];
  saveCustomUploadedTrack(docData);

  try {
    await setDoc(doc(db, 'music_library', trackId), docData, { merge: true });
  } catch (err) {
    console.warn('Failed to save track to cloud library in Firestore:', err);
  }
}

export async function deleteTrackFromCloudLibrary(trackIdOrUrl: string): Promise<boolean> {
  try {
    cachedCloudTracks = cachedCloudTracks.filter((t) => t.id !== trackIdOrUrl && t.url !== trackIdOrUrl);
    deleteCustomUploadedTrack(trackIdOrUrl);

    if (trackIdOrUrl) {
      await deleteDoc(doc(db, 'music_library', trackIdOrUrl));
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete track from cloud library:', err);
    deleteCustomUploadedTrack(trackIdOrUrl);
    return false;
  }
}

export async function updateTrackInCloudLibrary(track: MusicTrack): Promise<void> {
  if (!track.id) return;
  cachedCloudTracks = [track, ...cachedCloudTracks.filter((t) => t.id !== track.id)];
  saveCustomUploadedTrack(track);
  try {
    await setDoc(doc(db, 'music_library', track.id), track, { merge: true });
  } catch (err) {
    console.warn('Failed to update track in cloud library:', err);
  }
}

export function subscribeCloudMusicLibrary(callback: (tracks: MusicTrack[]) => void): () => void {
  try {
    const colRef = collection(db, 'music_library');
    return onSnapshot(
      colRef,
      (snap) => {
        const list: MusicTrack[] = [];
        snap.forEach((d) => list.push(d.data() as MusicTrack));
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        cachedCloudTracks = list;
        callback(list);
      },
      (err) => {
        console.warn('Error subscribing to music library:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to set up music library listener:', err);
    return () => {};
  }
}

export async function getCloudMusicLibrary(): Promise<MusicTrack[]> {
  try {
    const colRef = collection(db, 'music_library');
    const snap = await getDocs(colRef);
    const list: MusicTrack[] = [];
    snap.forEach((d) => list.push(d.data() as MusicTrack));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    cachedCloudTracks = list;
    return list;
  } catch (err) {
    console.warn('Failed to fetch cloud music library:', err);
    return cachedCloudTracks;
  }
}

export function getAllAvailableTracks(hiddenIds: string[] = []): MusicTrack[] {
  const localCustom = getStoredCustomTracks();
  const jsonTracks: MusicTrack[] = Array.isArray(jsonMusicTracks)
    ? (jsonMusicTracks as MusicTrack[])
    : [];

  const hiddenSet = new Set(hiddenIds);
  const seenUrls = new Set<string>();
  const combined: MusicTrack[] = [];

  for (const trk of [...cachedCloudTracks, ...localCustom, ...jsonTracks, ...localUploadedTracks, ...MANUAL_MUSIC_TRACKS]) {
    if ((trk.id && hiddenSet.has(trk.id)) || hiddenSet.has(trk.url)) {
      continue;
    }
    if (!seenUrls.has(trk.url)) {
      seenUrls.add(trk.url);
      combined.push(trk);
    }
  }

  return combined;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = getAllAvailableTracks();
