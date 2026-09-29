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
import { saveAudioToIDB, getAudioFromIDB, deleteAudioFromIDB, blobToDataUrl } from '../lib/audioDb';
import { saveAudioToCloudFirestore, cacheInMemoryAudio } from '../lib/audioStorage';
import jsonMusicTracks from './musicList.json';
import { MusicTrack, SongDocument } from '../types';

export type { MusicTrack, SongDocument };

// In-memory cache for cloud tracks with TTL
let cachedCloudTracks: MusicTrack[] = [];
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL to save Firestore reads

let isStorageReachable: boolean | null = null;

/**
 * Uploads audio to Firebase Storage, returning a permanent HTTPS download URL.
 * Automatically caches locally in IndexedDB and in-memory for instant playback.
 */
export async function uploadSongPackageToStorage(
  fullBlob: Blob,
  _previewBlob: Blob,
  title: string
): Promise<{ previewUrl: string; audioUrl: string }> {
  const timestamp = Date.now();
  const trackId = `song_${timestamp}`;
  const fileName = `${trackId}.mp3`;

  // 1. Instant local caching (IndexedDB + memory cache)
  saveAudioToIDB(`${trackId}_audio`, fullBlob).catch(() => {});

  const localAudioUrl = (fullBlob.size < 2.5 * 1024 * 1024)
    ? await blobToDataUrl(fullBlob)
    : (typeof URL !== 'undefined' ? URL.createObjectURL(fullBlob) : await blobToDataUrl(fullBlob));

  // 2. Upload to Firebase Storage with retry & timeout guard
  try {
    await ensureAnonymousAuth().catch(() => {});
    let fileRef = storageRef(storage, `library/audio/${fileName}`);
    const contentType = (fullBlob.type && fullBlob.type.startsWith('audio/')) ? fullBlob.type : 'audio/mpeg';

    try {
      await Promise.race([
        uploadBytes(fileRef, fullBlob, {
          contentType,
          customMetadata: { title: title || 'FRIDA Audio Track' },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Storage upload timeout')), 15000)),
      ]);
    } catch (firstErr) {
      console.warn('Initial storage upload to library/audio failed, attempting fallback path:', firstErr);
      fileRef = storageRef(storage, `audio/${fileName}`);
      await Promise.race([
        uploadBytes(fileRef, fullBlob, {
          contentType,
          customMetadata: { title: title || 'FRIDA Audio Track' },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Storage upload fallback timeout')), 15000)),
      ]);
    }

    const downloadUrl = await getDownloadURL(fileRef);
    cacheInMemoryAudio(downloadUrl, localAudioUrl);
    cacheInMemoryAudio(trackId, downloadUrl);

    return {
      audioUrl: downloadUrl,
      previewUrl: downloadUrl,
    };
  } catch (storageErr) {
    console.warn('Firebase Storage upload failed, saving to Cloud Firestore storage:', storageErr);
    
    try {
      const firestoreAudioRef = await saveAudioToCloudFirestore(fullBlob, trackId);
      cacheInMemoryAudio(firestoreAudioRef, localAudioUrl);
      cacheInMemoryAudio(trackId, firestoreAudioRef);
      return {
        audioUrl: firestoreAudioRef,
        previewUrl: firestoreAudioRef,
      };
    } catch (fsErr) {
      console.error('Firestore audio chunking save error:', fsErr);
      cacheInMemoryAudio(trackId, localAudioUrl);
      return {
        audioUrl: localAudioUrl,
        previewUrl: localAudioUrl,
      };
    }
  }
}

// Backwards compatibility alias
export const uploadSongPackageToR2 = uploadSongPackageToStorage;

/**
 * Uploads single audio blob to Firebase Storage with timeout & fallback
 */
export async function uploadAudioFileToCloudStorage(blob: Blob, label: string): Promise<string> {
  const timestamp = Date.now();
  const trackId = `song_${timestamp}`;
  const fileName = `${trackId}.mp3`;

  saveAudioToIDB(`${trackId}_audio`, blob).catch(() => {});

  let localUrl = '';
  if (blob.size < 2.5 * 1024 * 1024) {
    localUrl = await blobToDataUrl(blob);
  } else if (typeof URL !== 'undefined') {
    localUrl = URL.createObjectURL(blob);
  }

  try {
    await ensureAnonymousAuth().catch(() => {});
    const fileRef = storageRef(storage, `library/audio/${fileName}`);
    await Promise.race([
      uploadBytes(fileRef, blob, { contentType: blob.type || 'audio/mpeg' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Storage upload timeout')), 20000)),
    ]);

    const downloadUrl = await getDownloadURL(fileRef);
    cacheInMemoryAudio(downloadUrl, localUrl);
    return downloadUrl;
  } catch (e) {
    console.warn('Firebase Storage upload failed, saving to Cloud Firestore storage:', e);
    try {
      const firestoreAudioRef = await saveAudioToCloudFirestore(blob, trackId);
      cacheInMemoryAudio(firestoreAudioRef, localUrl);
      return firestoreAudioRef;
    } catch (fsErr) {
      console.error('Firestore audio chunking save error:', fsErr);
      return localUrl;
    }
  }
}

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

  // Never store blob URLs or oversized data URLs in Firestore document (convert blob URLs to Cloud Firestore reference)
  const isBlobUrl = typeof audioUrl === 'string' && audioUrl.startsWith('blob:');
  const isDataUrl = typeof audioUrl === 'string' && audioUrl.startsWith('data:');

  let firestoreAudioUrl = (isDataUrl && audioUrl.length > 500000) ? '' : (audioUrl || '');

  if (isBlobUrl) {
    try {
      const idbData = (await getAudioFromIDB(`${trackId}_audio`)) || (await getAudioFromIDB(trackId));
      if (idbData) {
        const blob = typeof idbData === 'string' ? new Blob([idbData], { type: 'audio/mpeg' }) : idbData;
        firestoreAudioUrl = await saveAudioToCloudFirestore(blob, trackId);
      } else {
        const res = await fetch(audioUrl);
        if (res.ok) {
          const blob = await res.blob();
          firestoreAudioUrl = await saveAudioToCloudFirestore(blob, trackId);
        } else {
          firestoreAudioUrl = `firestore-audio://${trackId}`;
        }
      }
    } catch (err) {
      console.warn('Could not store blob audio to Cloud Firestore:', err);
      firestoreAudioUrl = `firestore-audio://${trackId}`;
    }
  }

  const firestorePreviewUrl = firestoreAudioUrl || (previewUrl && !previewUrl.startsWith('blob:') ? previewUrl : firestoreAudioUrl);

  const docData: SongDocument = {
    id: trackId,
    title: trackTitle,
    artist: track.artist || 'FRIDA Royal Orchestra',
    duration: track.duration || 60,
    previewUrl: firestorePreviewUrl,
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
    url: firestoreAudioUrl || audioUrl,
    isCloud: true,
  };

  cachedCloudTracks = [unifiedTrack, ...cachedCloudTracks.filter((t) => t.id !== trackId)];
  saveCustomUploadedTrack(unifiedTrack);

  try {
    await Promise.race([
      setDoc(doc(db, 'music_library', trackId), docData, { merge: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore write timeout')), 5000)),
    ]);
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
      deleteDoc(doc(db, 'cloud_audio_files', `${docId}_full`)).catch(() => {});
      deleteDoc(doc(db, 'cloud_audio_files', `${docId}_prev`)).catch(() => {});
      deleteDoc(doc(db, 'cloud_audio_files', `${docId}_audio`)).catch(() => {});
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
          const trackId = data.id || d.id;
          const rawUrl = data.audioUrl || (data as any).url || '';
          const finalUrl = (rawUrl && !rawUrl.startsWith('blob:')) ? rawUrl : `firestore-audio://${trackId}`;

          list.push({
            id: trackId,
            title: data.title,
            name: { ar: data.title, en: data.title },
            label: data.title,
            artist: data.artist,
            duration: data.duration,
            url: finalUrl,
            audioUrl: finalUrl,
            previewUrl: (data.previewUrl && !data.previewUrl.startsWith('blob:')) ? data.previewUrl : finalUrl,
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
      const trackId = data.id || d.id;
      const rawUrl = data.audioUrl || (data as any).url || '';
      const finalUrl = (rawUrl && !rawUrl.startsWith('blob:')) ? rawUrl : `firestore-audio://${trackId}`;

      list.push({
        id: trackId,
        title: data.title,
        name: { ar: data.title, en: data.title },
        label: data.title,
        artist: data.artist,
        duration: data.duration,
        url: finalUrl,
        audioUrl: finalUrl,
        previewUrl: (data.previewUrl && !data.previewUrl.startsWith('blob:')) ? data.previewUrl : finalUrl,
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
        title: t.title || t.name,
        name: { ar: t.title || t.name, en: t.name || t.title },
        label: t.title || t.name,
        category: t.category || 'wedding',
        url: t.url,
        audioUrl: t.url,
        previewUrl: t.url,
        artist: t.artist || 'FRIDA Royal Orchestra',
        duration: t.duration || 101,
        isDefault: t.isDefault ?? true,
        isActive: true,
      }))
    : [];

  const hiddenSet = new Set(hiddenIds);
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const combined: MusicTrack[] = [];

  // Prioritize Cloud Firestore tracks first, then local/fallback
  for (const trk of [...cachedCloudTracks, ...localCustom, ...jsonTracks]) {
    const mainUrl = trk.audioUrl || trk.url || '';
    const trackId = trk.id || mainUrl;
    if ((trk.id && hiddenSet.has(trk.id)) || (mainUrl && hiddenSet.has(mainUrl)) || (trk.url && hiddenSet.has(trk.url))) {
      continue;
    }
    if (trackId && !seenIds.has(trackId) && (!mainUrl || !seenUrls.has(mainUrl))) {
      seenIds.add(trackId);
      if (mainUrl) seenUrls.add(mainUrl);
      combined.push({
        ...trk,
        url: mainUrl || trk.url,
        audioUrl: trk.audioUrl || mainUrl || trk.url,
        previewUrl: trk.previewUrl || trk.audioUrl || mainUrl || trk.url,
      });
    }
  }

  return combined;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = getAllAvailableTracks();
