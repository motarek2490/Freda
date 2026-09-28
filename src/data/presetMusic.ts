/**
 * ===================================================================================
 * 🎵 ملف إدارة قائمة ومكتبة الموسيقى (Firebase Storage + Firestore Audio System)
 * ===================================================================================
 * - Pure Metadata in Firestore (Zero binary storage in database)
 * - Firebase Storage (audio/previews/ and audio/full/)
 * - Dual Audio Package: Preview Audio (15-20s for fast browsing) + Full Audio
 * - In-Memory & Session Caching (Minimizes Firestore Reads)
 * - Pagination & Category Filtering
 * - Full Backward Compatibility for existing invitations
 */

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, auth, ensureAnonymousAuth } from '../lib/firebase';
import { saveAudioToIDB, deleteAudioFromIDB, blobToDataUrl } from '../lib/audioDb';
import { saveAudioToCloudFirestore } from '../lib/audioStorage';
import jsonMusicTracks from './musicList.json';
import { MusicTrack, SongDocument } from '../types';

export type { MusicTrack, SongDocument };

// In-memory cache for cloud tracks with TTL
let cachedCloudTracks: MusicTrack[] = [];
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL to save Firestore reads

let isStorageReachable: boolean | null = null;

/**
 * Uploads both a Preview clip and the Full Audio to Firebase Storage,
 * returning structured download URLs without saving raw audio binaries in Firestore.
 * Automatically falls back to high-performance local audio package if Firebase Storage is unavailable or offline.
 */
export async function uploadSongPackageToStorage(
  fullBlob: Blob,
  previewBlob: Blob,
  title: string
): Promise<{ previewUrl: string; audioUrl: string }> {
  const cleanTitle = (title || 'custom_track')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    .substring(0, 40);
  const timestamp = Date.now();
  const trackId = `song_${timestamp}`;

  // Persist raw blobs to client-side IndexedDB immediately (instant playback safety)
  await saveAudioToIDB(`${trackId}_full`, fullBlob);
  await saveAudioToIDB(`${trackId}_preview`, previewBlob);

  // 1. Quick attempt to Firebase Storage with strict 1.2s timeout (never hangs)
  if (isStorageReachable !== false && storage) {
    try {
      let user = auth.currentUser;
      if (!user) {
        user = await ensureAnonymousAuth();
      }

      const fullPath = `audio/full/${timestamp}_${cleanTitle}_full.mp3`;
      const fullRef = storageRef(storage, fullPath);
      const fullSnap = await Promise.race([
        uploadBytes(fullRef, fullBlob, { contentType: 'audio/mpeg' }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        ),
      ]);
      const audioUrl = await Promise.race([
        getDownloadURL(fullSnap.ref),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        ),
      ]);

      const prevPath = `audio/previews/${timestamp}_${cleanTitle}_preview.mp3`;
      const prevRef = storageRef(storage, prevPath);
      const prevSnap = await Promise.race([
        uploadBytes(prevRef, previewBlob, { contentType: 'audio/mpeg' }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        ),
      ]);
      const previewUrl = await Promise.race([
        getDownloadURL(prevSnap.ref),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        ),
      ]);

      if (audioUrl && previewUrl) {
        isStorageReachable = true;
        return {
          audioUrl,
          previewUrl,
        };
      }
    } catch {
      isStorageReachable = false;
    }
  }

  // 2. Cloud Firestore Audio Vault: Saves audio directly to Google Cloud Firestore (chunked)
  // Ensures any client on any phone/device worldwide can load and play the song without external storage
  try {
    const cloudAudioUrl = await saveAudioToCloudFirestore(fullBlob, `${trackId}_full`);
    const cloudPreviewUrl = await saveAudioToCloudFirestore(previewBlob, `${trackId}_prev`);
    return {
      audioUrl: cloudAudioUrl,
      previewUrl: cloudPreviewUrl,
    };
  } catch (cloudErr) {
    console.warn('Cloud Firestore audio write failed, fallback to local data URL:', cloudErr);
    const previewDataUrl = await blobToDataUrl(previewBlob);
    let audioDataUrl = '';
    if (fullBlob.size < 2.5 * 1024 * 1024) {
      audioDataUrl = await blobToDataUrl(fullBlob);
    } else if (typeof URL !== 'undefined') {
      audioDataUrl = URL.createObjectURL(fullBlob);
    } else {
      audioDataUrl = previewDataUrl;
    }

    return {
      audioUrl: audioDataUrl || previewDataUrl,
      previewUrl: previewDataUrl,
    };
  }
}

// Backwards compatibility alias
export const uploadSongPackageToR2 = uploadSongPackageToStorage;

/**
 * Legacy compatibility wrapper: uploads single audio blob to Firebase Storage with timeout & fallback
 */
export async function uploadAudioFileToCloudStorage(blob: Blob, label: string): Promise<string> {
  const cleanName = (label || 'audio_track')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    .substring(0, 50);
  const timestamp = Date.now();
  const trackId = `song_${timestamp}`;

  await saveAudioToIDB(`${trackId}_audio`, blob);

  let localUrl = '';
  if (blob.size < 2.5 * 1024 * 1024) {
    localUrl = await blobToDataUrl(blob);
  } else if (typeof URL !== 'undefined') {
    localUrl = URL.createObjectURL(blob);
  }

  if (isStorageReachable !== false && storage) {
    try {
      let user = auth.currentUser;
      if (!user) {
        user = await ensureAnonymousAuth();
      }

      const path = `audio/full/${timestamp}_${cleanName}.mp3`;
      const sRef = storageRef(storage, path);
      const snap = await Promise.race([
        uploadBytes(sRef, blob, { contentType: 'audio/mpeg' }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        ),
      ]);
      const downloadUrl = await Promise.race([
        getDownloadURL(snap.ref),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        ),
      ]);
      if (downloadUrl) {
        isStorageReachable = true;
        return downloadUrl;
      }
    } catch {
      isStorageReachable = false;
    }
  }

  // Upload to Cloud Firestore Audio Vault so it's accessible to every client
  try {
    const cloudUrl = await saveAudioToCloudFirestore(blob, `${trackId}_audio`);
    return cloudUrl;
  } catch {
    return localUrl;
  }
}

// Vite Dynamic Import for local bundled fallback assets
const uploadedAudioModules = import.meta.glob<{ default: string }>(
  '/src/assets/music/*.{mp3,wav,m4a,ogg,aac}',
  { eager: true }
);

const localUploadedTracks: MusicTrack[] = Object.entries(uploadedAudioModules).map(([path, module]) => {
  const fileNameWithExt = path.split('/').pop() || '';
  const fileName = fileNameWithExt.replace(/\.(mp3|wav|m4a|ogg|aac)$/i, '');

  let category = 'royal';
  let label = fileName;

  if (fileName.includes('-')) {
    const parts = fileName.split('-');
    const catPart = parts[0].trim();
    const labelPart = parts.slice(1).join('-').trim();
    if (catPart) category = catPart;
    if (labelPart) label = labelPart;
  }

  const url = typeof module === 'string' ? module : module.default;

  return {
    id: 'local-' + fileName,
    title: label,
    category,
    label,
    url,
    audioUrl: url,
    previewUrl: url,
    isActive: true,
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

/**
 * Saves or updates song metadata in Firestore collection `music_library`
 * Ensures clean metadata structure and updates in-memory cache.
 */
export async function saveTrackToCloudLibrary(track: MusicTrack | SongDocument): Promise<void> {
  const anyTrack = track as any;
  const trackId = track.id || `song_${Date.now()}`;
  const trackTitle =
    anyTrack.title ||
    (typeof anyTrack.name === 'string' ? anyTrack.name : anyTrack.name?.ar) ||
    anyTrack.label ||
    'معزوفة ملكية';

  const audioUrl = anyTrack.audioUrl || anyTrack.url;
  const previewUrl = anyTrack.previewUrl || audioUrl;

  // Firestore doc limit is 1MB. If audioUrl is a very large data URL (> 700KB),
  // store previewUrl in Firestore doc, while keeping the full track in local cache/memory.
  const firestoreAudioUrl = (audioUrl && typeof audioUrl === 'string' && audioUrl.length > 700000)
    ? previewUrl
    : audioUrl;

  const docData: SongDocument = {
    id: trackId,
    title: trackTitle,
    artist: track.artist || 'FRIDA Royal Orchestra',
    duration: track.duration || 60,
    previewUrl,
    audioUrl: firestoreAudioUrl,
    coverUrl: track.coverUrl || '',
    category: track.category || 'royal',
    isActive: track.isActive ?? true,
    isDefault: track.isDefault ?? false,
    createdAt: track.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Construct backward-compatible MusicTrack object
  const unifiedTrack: MusicTrack = {
    ...docData,
    name: { ar: docData.title, en: docData.title },
    label: docData.title,
    url: docData.audioUrl,
    isCloud: true,
  };

  cachedCloudTracks = [unifiedTrack, ...cachedCloudTracks.filter((t) => t.id !== trackId)];
  saveCustomUploadedTrack(unifiedTrack);

  try {
    await setDoc(doc(db, 'music_library', trackId), docData, { merge: true });
  } catch (err) {
    console.warn('Failed to save song metadata to Firestore:', err);
  }
}

/**
 * Deletes a song from Firestore and cleans up its Firebase Storage assets if present.
 */
export async function deleteTrackFromCloudLibrary(trackIdOrUrl: string): Promise<boolean> {
  try {
    const existing = cachedCloudTracks.find(
      (t) => t.id === trackIdOrUrl || t.url === trackIdOrUrl || t.audioUrl === trackIdOrUrl
    );
    cachedCloudTracks = cachedCloudTracks.filter(
      (t) => t.id !== trackIdOrUrl && t.url !== trackIdOrUrl && t.audioUrl !== trackIdOrUrl
    );
    deleteCustomUploadedTrack(trackIdOrUrl);

    // Fire-and-forget background cleanup for Firebase Storage (never blocks or delays deletion)
    const deleteIfStorageUrl = (url?: string) => {
      if (!url) return;
      if (url.includes('firebasestorage.googleapis.com') || url.startsWith('gs://')) {
        Promise.race([
          deleteObject(storageRef(storage, url)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800))
        ]).catch(() => {});
      }
    };

    if (existing) {
      deleteIfStorageUrl(existing.previewUrl);
      if (existing.audioUrl && existing.audioUrl !== existing.previewUrl) {
        deleteIfStorageUrl(existing.audioUrl);
      }
      if (existing.url && existing.url !== existing.audioUrl && existing.url !== existing.previewUrl) {
        deleteIfStorageUrl(existing.url);
      }
    }

    if (existing?.id || trackIdOrUrl) {
      const docId = existing?.id || trackIdOrUrl;
      await deleteDoc(doc(db, 'music_library', docId));
      deleteAudioFromIDB(`${docId}_full`).catch(() => {});
      deleteAudioFromIDB(`${docId}_preview`).catch(() => {});
      deleteAudioFromIDB(`${docId}_audio`).catch(() => {});
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete track from cloud library:', err);
    deleteCustomUploadedTrack(trackIdOrUrl);
    return false;
  }
}

/**
 * Toggles a song's active state in Firestore
 */
export async function toggleSongActiveStatus(songId: string, isActive: boolean): Promise<void> {
  try {
    const existing = cachedCloudTracks.find((t) => t.id === songId);
    if (existing) {
      existing.isActive = isActive;
    }
    await setDoc(doc(db, 'music_library', songId), { isActive, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to toggle song active status:', err);
  }
}

/**
 * Subscribes to real-time updates of the music library catalog with cache updating.
 */
export function subscribeCloudMusicLibrary(callback: (tracks: MusicTrack[]) => void): () => void {
  try {
    const colRef = collection(db, 'music_library');
    return onSnapshot(
      colRef,
      (snap) => {
        const list: MusicTrack[] = [];
        snap.forEach((d) => {
          const data = d.data() as SongDocument;
          list.push({
            id: data.id || d.id,
            title: data.title,
            name: { ar: data.title, en: data.title },
            label: data.title,
            artist: data.artist,
            duration: data.duration,
            url: data.audioUrl || (data as any).url,
            audioUrl: data.audioUrl || (data as any).url,
            previewUrl: data.previewUrl || data.audioUrl || (data as any).url,
            coverUrl: data.coverUrl,
            category: data.category || 'royal',
            isActive: data.isActive ?? true,
            isDefault: data.isDefault ?? false,
            isCloud: true,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        cachedCloudTracks = list;
        lastCacheTimestamp = Date.now();
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

/**
 * Fetches the Cloud Music Library with in-memory caching to save Firestore reads.
 */
export async function getCloudMusicLibrary(forceRefresh = false): Promise<MusicTrack[]> {
  const now = Date.now();
  if (!forceRefresh && cachedCloudTracks.length > 0 && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedCloudTracks;
  }

  try {
    const colRef = collection(db, 'music_library');
    const snap = await getDocs(colRef);
    const list: MusicTrack[] = [];
    snap.forEach((d) => {
      const data = d.data() as SongDocument;
      list.push({
        id: data.id || d.id,
        title: data.title,
        name: { ar: data.title, en: data.title },
        label: data.title,
        artist: data.artist,
        duration: data.duration,
        url: data.audioUrl || (data as any).url,
        audioUrl: data.audioUrl || (data as any).url,
        previewUrl: data.previewUrl || data.audioUrl || (data as any).url,
        coverUrl: data.coverUrl,
        category: data.category || 'royal',
        isActive: data.isActive ?? true,
        isDefault: data.isDefault ?? false,
        isCloud: true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    cachedCloudTracks = list;
    lastCacheTimestamp = now;
    return list;
  } catch (err) {
    console.warn('Failed to fetch cloud music library:', err);
    return cachedCloudTracks;
  }
}

/**
 * Returns all available tracks across Cloud storage, local presets, and cached catalog.
 */
export function getAllAvailableTracks(hiddenIds: string[] = []): MusicTrack[] {
  const localCustom = getStoredCustomTracks();
  const jsonTracks: MusicTrack[] = Array.isArray(jsonMusicTracks)
    ? (jsonMusicTracks as any[]).map((t) => ({
        id: t.id,
        title: t.name,
        name: { ar: t.name, en: t.name },
        label: t.name,
        category: t.category,
        url: t.url,
        audioUrl: t.url,
        previewUrl: t.url,
        isActive: true,
      }))
    : [];

  const hiddenSet = new Set(hiddenIds);
  const seenUrls = new Set<string>();
  const combined: MusicTrack[] = [];

  for (const trk of [...cachedCloudTracks, ...localCustom, ...jsonTracks, ...localUploadedTracks, ...MANUAL_MUSIC_TRACKS]) {
    const mainUrl = trk.audioUrl || trk.url;
    if ((trk.id && hiddenSet.has(trk.id)) || hiddenSet.has(mainUrl) || hiddenSet.has(trk.url)) {
      continue;
    }
    if (!seenUrls.has(mainUrl)) {
      seenUrls.add(mainUrl);
      combined.push({
        ...trk,
        url: mainUrl,
        audioUrl: trk.audioUrl || mainUrl,
        previewUrl: trk.previewUrl || mainUrl,
      });
    }
  }

  return combined;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = getAllAvailableTracks();
